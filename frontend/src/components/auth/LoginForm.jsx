import { supabase } from "../../supabase/supabaseClient";

const LoginForm = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });

    if (error) console.error(error.message);
  };

  return (
    <>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300">Email</label>
          <input type="email" className="mt-2 w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-white" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">Password</label>
          <input type="password" className="mt-2 w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-white" />
        </div>

        <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500">Sign in</button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-slate-700"></div>
        <span className="px-3 text-slate-400">OR</span>
        <div className="flex-1 border-t border-slate-700"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full rounded-2xl border border-slate-700 py-3 text-white hover:bg-slate-800 transition"
      >
        Continue with Google
      </button>
    </>
  );
};

export default LoginForm;
