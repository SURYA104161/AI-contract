const GoogleButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-700"
    >
      Continue with Google
    </button>
  );
};

export default GoogleButton;
