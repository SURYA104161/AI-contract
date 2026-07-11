const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#161F33] rounded-2xl shadow-2xl p-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
