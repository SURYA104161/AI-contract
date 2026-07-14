import { FaGoogle } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";

const GoogleButton = () => {
  const { signInWithGoogle } = useAuthContext();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800 py-4 text-lg font-medium hover:bg-slate-700 transition"
    >
      <FaGoogle className="text-red-500 text-xl" />
      Continue with Google
    </button>
  );
};

export default GoogleButton;
