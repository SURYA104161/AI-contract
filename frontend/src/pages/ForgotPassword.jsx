import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { supabase } from "../supabase/supabaseClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/",
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Reset your password</h1>
        <p className="text-slate-400 mb-6">Enter your email to receive reset instructions.</p>

        {sent ? (
          <div className="text-center">
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              Check your email for a password reset link.
            </div>
            <Link to="/" className="text-blue-400 hover:text-blue-500">
              Back to login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send reset email"}
              </button>
            </form>

            <p className="mt-6 text-center text-slate-400">
              <Link to="/" className="text-blue-400 hover:text-blue-500">
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
