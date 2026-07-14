const ToggleSwitch = ({ label, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-slate-300">{label}</span>

      <button
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 rounded-full transition ${
          enabled ? "bg-blue-600" : "bg-slate-700"
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white transition transform ${
            enabled ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
