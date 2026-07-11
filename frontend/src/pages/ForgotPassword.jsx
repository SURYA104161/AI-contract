import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {
  return (
    <AuthLayout>
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Reset your password</h1>
        <p className="text-slate-400 mb-6">Enter your email to receive reset instructions.</p>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input type="email" className="mt-2 w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-white" />
          </div>
          <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500">Send reset email</button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
