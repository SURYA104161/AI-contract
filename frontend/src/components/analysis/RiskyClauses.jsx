import { FiAlertTriangle } from "react-icons/fi";

const RiskyClauses = ({ analysis }) => {
  const clauses = analysis?.clauses ?? [];
  const riskyClauses = clauses.filter(
    (c) => c.risk_level === "High" || c.risk_level === "Medium"
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <FiAlertTriangle className="text-red-400 text-2xl" />
        <h2 className="text-2xl font-bold">Risky Clauses ({riskyClauses.length})</h2>
      </div>

      {riskyClauses.length === 0 ? (
        <p className="text-slate-400">No risky clauses detected.</p>
      ) : (
        <div className="space-y-4">
          {riskyClauses.map((clause, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{clause.title}</span>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    clause.risk_level === "High"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {clause.risk_level} Risk
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-2">{clause.simple_explanation}</p>
              <p className="text-red-300 text-sm">Reason: {clause.risk_reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiskyClauses;
