const contracts = [
  {
    name: "Employment Agreement.pdf",
    risk: "Low",
  },
  {
    name: "Rental Agreement.pdf",
    risk: "Medium",
  },
  {
    name: "Loan Agreement.pdf",
    risk: "High",
  },
];

const RecentContracts = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-5">Recent Contracts</h2>

      <div className="space-y-4">
        {contracts.map((contract, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-slate-800 pb-3"
          >
            <span>{contract.name}</span>

            <span className="text-sm text-blue-400">{contract.risk}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentContracts;
