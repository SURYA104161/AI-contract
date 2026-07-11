const PasswordInput = ({ value, onChange }) => {
  return (
    <input
      type="password"
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-white"
      placeholder="Enter your password"
    />
  );
};

export default PasswordInput;
