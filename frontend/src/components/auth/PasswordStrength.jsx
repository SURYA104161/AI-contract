const PasswordStrength = ({ password }) => {
  let strength = "Weak";
  let color = "bg-red-500";
  let width = "w-1/3";

  if (password.length >= 8) {
    strength = "Medium";
    color = "bg-yellow-500";
    width = "w-2/3";
  }

  if (
    password.length >= 10 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  ) {
    strength = "Strong";
    color = "bg-green-500";
    width = "w-full";
  }

  return (
    <div className="mt-2">
      <div className="h-2 rounded-full bg-slate-700">
        <div className={`${color} ${width} h-2 rounded-full`}></div>
      </div>

      <p className="mt-1 text-xs text-slate-400">{strength} Password</p>
    </div>
  );
};

export default PasswordStrength;
