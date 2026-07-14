import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";

const VerifyEmail = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto">
          <FiMail size={36} className="text-white" />
        </div>

        <h1 className="text-3xl font-bold text-white mt-6">
          Verify Your Email
        </h1>

        <p className="text-slate-400 mt-4">
          We've sent a verification link to your email address.
          Please verify your account before signing in.
        </p>

        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl text-white font-semibold"
        >
          Open Gmail
        </a>

        <div className="mt-6">
          <Link to="/" className="text-blue-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
