const TotalClauses = ({ analysis }) => {
  const clauses = analysis?.clauses ?? [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Total Clauses ({clauses.length})</h2>
      <div className="space-y-4">
        {clauses.map((clause, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">{clause.title}</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  clause.risk_level === "High"
                    ? "bg-red-500/20 text-red-400"
                    : clause.risk_level === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {clause.risk_level} Risk
              </span>
            </div>
            <p className="text-slate-400 text-sm">{clause.simple_explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalClauses;
