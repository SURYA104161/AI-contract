const RecentContracts = ({ contracts = [] }) => {
  if (contracts.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-5">Recent Contracts</h2>
        <p className="text-slate-400">No contracts yet. Upload your first contract!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-5">Recent Contracts</h2>

      <div className="space-y-4">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="flex items-center justify-between border-b border-slate-800 pb-3"
          >
            <span>{contract.name}</span>
            <span
              className={`text-sm ${
                contract.risk_label === "High"
                  ? "text-red-400"
                  : contract.risk_label === "Medium"
                  ? "text-yellow-400"
                  : contract.risk_label === "Low"
                  ? "text-green-400"
                  : "text-slate-400"
              }`}
            >
              {contract.risk_label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentContracts;
