const RegisterForm = () => {
  return (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300">Name</label>
        <input type="text" className="mt-2 w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-white" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">Email</label>
        <input type="email" className="mt-2 w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-white" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">Password</label>
        <input type="password" className="mt-2 w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-white" />
      </div>

      <button className="w-full rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-500">Create account</button>
    </form>
  );
};

export default RegisterForm;
