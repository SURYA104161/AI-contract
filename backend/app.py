from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes.upload import router as upload_router
from routes.analyze import router as analyze_router
from routes.report import router as report_router
from routes.contracts import router as contracts_router
from routes.chat import router as chat_router
from services.auth import get_current_user
from services.logger import get_logger
import uvicorn

logger = get_logger("app")

FRONTEND_ORIGIN = "http://localhost:3000"

app = FastAPI(title="AI Contract Explainer", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(analyze_router)
app.include_router(report_router)
app.include_router(contracts_router)
app.include_router(chat_router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "AI Contract Explainer API is running"}


@app.get("/api/auth/test")
async def auth_test(user_id: str = Depends(get_current_user)):
    return {"status": "ok", "user_id": user_id, "message": "Authentication successful"}


@app.get("/api/auth/jwks")
async def auth_jwks():
    """Return cached JWKS info for debugging."""
    from services.auth import _get_jwks_keys, JWKS_URL
    keys = _get_jwks_keys()
    return {
        "jwks_url": JWKS_URL,
        "key_count": len(keys),
        "kids": list(keys.keys()),
    }


@app.get("/api/auth/inspect")
async def auth_inspect(request: Request):
    """Open diagnostic — inspects the raw token WITHOUT validating signature."""
    import jwt as pyjwt
    from config import SUPABASE_JWT_SECRET
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return {"error": "No Bearer token", "header_value": repr(auth_header[:100])}
    token = auth_header.split(" ", 1)[1].strip()
    try:
        header = pyjwt.get_unverified_header(token)
    except Exception as e:
        header = {"error": str(e)}
    payload = {"error": "decode skipped"}
    try:
        payload = pyjwt.decode(token, options={"verify_signature": False}, algorithms=["HS256", "ES256"])
    except Exception as e:
        payload = {"error": f"{type(e).__name__}: {e}"}
    return {
        "token_length": len(token),
        "token_preview": token[:80] + ("..." if len(token) > 80 else ""),
        "parts": len(token.split(".")),
        "header": header,
        "payload_preview": payload,
    }


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
