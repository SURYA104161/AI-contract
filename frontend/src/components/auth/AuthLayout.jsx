const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
