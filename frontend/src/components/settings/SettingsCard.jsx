const SettingsCard = ({ title, children }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {children}
    </div>
  );
};

export default SettingsCard;
