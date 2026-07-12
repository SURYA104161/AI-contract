const AccountStats = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
      <h3 className="text-xl font-semibold mb-6">Account Statistics</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Contracts Analyzed</p>
          <p className="text-2xl font-bold mt-2">24</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Risk Alerts</p>
          <p className="text-2xl font-bold mt-2">7</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Saved Reports</p>
          <p className="text-2xl font-bold mt-2">12</p>
        </div>
      </div>
    </div>
  );
};

export default AccountStats;
