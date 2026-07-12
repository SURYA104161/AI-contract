import jwt
import json
import time
import base64
import urllib.request
from typing import Optional

from cryptography.hazmat.primitives.asymmetric.ec import (
    EllipticCurvePublicNumbers,
    SECP256R1,
)
from cryptography.hazmat.primitives.serialization import (
    Encoding,
    PublicFormat,
)
from fastapi import Request, HTTPException

from config import SUPABASE_JWT_SECRET, SUPABASE_URL
from services.logger import get_logger

logger = get_logger("auth")

# ── JWKS cache ──────────────────────────────────────────────────────────
_JWKS_CACHE: Optional[dict] = None          # {kid: cryptography public key}
_JWKS_CACHE_TS: float = 0.0
_JWKS_TTL: float = 86400.0                  # 24 hours

SUPABASE_PROJECT_REF = SUPABASE_URL.replace("https://", "").replace(
    "https://", ""
).split(".")[0] if SUPABASE_URL else ""

JWKS_URL = (
    f"https://{SUPABASE_PROJECT_REF}.supabase.co/auth/v1/.well-known/jwks.json"
    if SUPABASE_PROJECT_REF
    else ""
)


def _jwk_to_ec_public_key(jwk: dict):
    """Convert a JWK EC key to a cryptography EC public key."""
    x = int.from_bytes(base64.urlsafe_b64decode(jwk["x"] + "=="), "big")
    y = int.from_bytes(base64.urlsafe_b64decode(jwk["y"] + "=="), "big")
    curve = SECP256R1()
    return EllipticCurvePublicNumbers(x, y, curve).public_key()


def _fetch_jwks() -> dict:
    """Fetch JWKS from Supabase and return {kid: public_key}."""
    global _JWKS_CACHE, _JWKS_CACHE_TS

    if not JWKS_URL:
        logger.warning("No JWKS URL — SUPABASE_URL not configured")
        return {}

    if _JWKS_CACHE and (time.time() - _JWKS_CACHE_TS) < _JWKS_TTL:
        return _JWKS_CACHE

    try:
        logger.info(f"Fetching JWKS from {JWKS_URL}")
        req = urllib.request.Request(JWKS_URL)
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read())

        keys = {}
        for jwk in data.get("keys", []):
            kid = jwk.get("kid")
            if kid and jwk.get("kty") == "EC":
                keys[kid] = _jwk_to_ec_public_key(jwk)
                logger.info(f"Loaded EC key kid={kid} alg={jwk.get('alg')}")

        _JWKS_CACHE = keys
        _JWKS_CACHE_TS = time.time()
        logger.info(f"JWKS loaded: {len(keys)} key(s)")
        return keys

    except Exception as e:
        logger.error(f"Failed to fetch JWKS: {type(e).__name__}: {e}")
        return _JWKS_CACHE or {}


def _get_jwks_keys() -> dict:
    """Get cached JWKS keys, fetching if expired."""
    return _fetch_jwks()


# ── Startup verification ────────────────────────────────────────────────
try:
    _anon_header = jwt.get_unverified_header(
        jwt.encode({"sub": "test"}, "dummy", algorithm="HS256")
    )
    # Verify HS256 secret works with anon key
    _anon_token = jwt.encode(
        {"sub": "anon-test", "role": "anon", "exp": 9999999999},
        SUPABASE_JWT_SECRET,
        algorithm="HS256",
    )
    _payload = jwt.decode(_anon_token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
    logger.info("HS256 JWT secret verified OK")
except Exception as e:
    logger.warning(f"HS256 secret check: {type(e).__name__}: {e}")

# Pre-fetch JWKS at startup
_jwks = _fetch_jwks()
if _jwks:
    logger.info(f"JWKS pre-fetch OK: {list(_jwks.keys())}")
else:
    logger.warning("JWKS pre-fetch returned empty — ES256 auth may fail")


# ── Auth dependency ─────────────────────────────────────────────────────
async def get_current_user(request: Request) -> str:
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        logger.error(f"No Authorization header. Available headers: {list(request.headers.keys())}")
        raise HTTPException(status_code=401, detail="Missing authorization header")

    if not auth_header.startswith("Bearer "):
        logger.error(f"Auth header missing Bearer prefix: {repr(auth_header[:50])}")
        raise HTTPException(status_code=401, detail="Invalid authorization header format")

    token = auth_header.split(" ", 1)[1].strip()

    if not token:
        logger.error("Bearer token is empty after stripping")
        raise HTTPException(status_code=401, detail="Empty token")

    if not SUPABASE_JWT_SECRET:
        logger.critical("SUPABASE_JWT_SECRET is empty or not configured!")
        raise HTTPException(status_code=500, detail="Server configuration error")

    # ── Diagnostic: inspect raw token ──
    token_preview = token[:80] + ("..." if len(token) > 80 else "")
    try:
        header_info = jwt.get_unverified_header(token)
    except Exception as e:
        header_info = {"error": str(e)}

    alg = header_info.get("alg", "UNKNOWN")
    logger.info(
        f"Token: len={len(token)}, alg={alg}, preview={token_preview}"
    )

    # ── Try algorithms in order of likelihood ──
    payload = None
    errors = []

    # 1. ES256 with JWKS public key
    if alg in ("ES256", "UNKNOWN"):
        jwks = _get_jwks_keys()
        if jwks:
            for kid, pub_key in jwks.items():
                try:
                    payload = jwt.decode(
                        token,
                        pub_key,
                        algorithms=["ES256"],
                        options={"require": ["exp", "sub"], "verify_aud": False},
                    )
                    logger.info(f"ES256 verified OK with kid={kid}")
                    break
                except jwt.ExpiredSignatureError:
                    raise HTTPException(status_code=401, detail="Token has expired")
                except jwt.InvalidAlgorithmError:
                    pass  # wrong key, try next
                except jwt.InvalidSignatureError:
                    errors.append(f"ES256 kid={kid}: invalid signature")
                except jwt.MissingRequiredClaimError as e:
                    errors.append(f"ES256 kid={kid}: {e}")
                except jwt.InvalidTokenError as e:
                    errors.append(f"ES256 kid={kid}: {type(e).__name__}: {e}")

    # 2. HS256 with JWT secret (legacy / anon key)
    if payload is None and alg in ("HS256", "UNKNOWN"):
        try:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"require": ["exp", "sub"], "verify_aud": False},
            )
            logger.info("HS256 verified OK")
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.InvalidTokenError as e:
            errors.append(f"HS256: {type(e).__name__}: {e}")

    # ── All attempts failed ──
    if payload is None:
        error_summary = " | ".join(errors) if errors else "No matching key found"
        logger.error(
            f"Auth FAILED: alg={alg} | errors={error_summary} | preview={token_preview}"
        )
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token (alg={alg}): {error_summary}",
        )

    user_id = payload.get("sub")
    if not user_id:
        logger.error(f"Token has no 'sub' claim. Claims: {list(payload.keys())}")
        raise HTTPException(status_code=401, detail="Token missing user ID")

    logger.info(f"Auth OK: user_id={user_id}")
    return user_id
