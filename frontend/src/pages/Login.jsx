import { Link } from "react-router-dom";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });

    if (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#161F33] rounded-2xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-white">
          AI Contract
        </h1>

        <p className="text-center text-slate-400 mt-3 mb-8">
          Understand every contract with AI
        </p>

        <div className="space-y-5">

          <div>
            <label className="text-slate-300 text-sm">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 p-3 rounded-xl bg-[#222C40] text-white outline-none border border-slate-700 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm">
              Password
            </label>

            <div className="relative mt-2">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-3 rounded-xl bg-[#222C40] text-white outline-none border border-slate-700 focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>
          </div>

          <div className="flex justify-between items-center text-sm">

            <label className="flex items-center gap-2 text-slate-300">
              <input type="checkbox" />
              Remember Me
            </label>

            <Link
              to="/forgot-password"
              className="text-blue-400 hover:text-blue-500"
            >
              Forgot Password?
            </Link>

          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold text-white transition">
            Login
          </button>

          <div className="flex items-center gap-3">

            <div className="flex-1 h-px bg-slate-700"></div>

            <span className="text-slate-400 text-sm">
              OR
            </span>

            <div className="flex-1 h-px bg-slate-700"></div>

          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full border border-slate-700 py-3 rounded-xl flex justify-center items-center gap-3 hover:bg-slate-800 transition text-white"
          >
            <FaGoogle className="text-red-500" />
            Continue with Google
          </button>

          <p className="text-center text-slate-400">

            Don't have an account?

            <Link
              to="/signup"
              className="text-blue-400 ml-2"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}
