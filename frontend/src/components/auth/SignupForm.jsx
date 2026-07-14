import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import Divider from "./Divider";
import GoogleButton from "./GoogleButton";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!acceptedTerms) {
      setError("Please accept the Terms & Privacy Policy to continue.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signUp({ email: formData.email, password: formData.password });
      navigate("/verify-email");
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
      <h1 className="text-4xl font-bold text-white">Create Your Account</h1>
      <p className="mt-3 text-slate-400">
        Start analyzing contracts securely with AI-powered insights.
      </p>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      <GoogleButton />
      <Divider />

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="input"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="input pr-12"
            minLength={6}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-slate-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="input pr-12"
            minLength={6}
            required
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-4 text-slate-400"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {formData.confirmPassword && (
          <p
            className={`text-sm mt-2 ${
              formData.password === formData.confirmPassword
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {formData.password === formData.confirmPassword
              ? "✔ Passwords Match"
              : "✖ Passwords do not match"}
          </p>
        )}

        <label className="mt-5 flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
          />

          <span className="text-sm text-slate-300">
            I agree to the Terms & Privacy Policy
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || !acceptedTerms}
          className={`mt-6 w-full rounded-xl py-4 font-semibold text-lg transition ${
            acceptedTerms
              ? "bg-green-600 hover:bg-green-700"
              : "cursor-not-allowed bg-slate-700"
          }`}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-800 p-3">🔒 Secure Login</div>
        <div className="rounded-lg bg-slate-800 p-3">🤖 AI Powered</div>
        <div className="rounded-lg bg-slate-800 p-3">📄 Contract Analysis</div>
        <div className="rounded-lg bg-slate-800 p-3">⚡ Instant Reports</div>
      </div>

      <p className="mt-6 text-center text-slate-400">
        Already have an account?
        <span className="ml-2 cursor-pointer text-blue-500 hover:underline">
          <Link to="/">Sign In</Link>
        </span>
      </p>
      </div>
    </div>
  );
};

export default SignupForm;
