const OverallRisk = ({ analysis }) => {
  const riskScore = analysis?.risk_score ?? 0;
  const riskFactors = analysis?.risk_factors ?? [];

  const getRiskLabel = (score) => {
    if (score >= 60) return { label: "High", color: "text-red-400" };
    if (score >= 30) return { label: "Medium", color: "text-yellow-400" };
    return { label: "Low", color: "text-green-400" };
  };

  const { label, color } = getRiskLabel(riskScore);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Overall Risk</h2>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-5xl font-bold">{riskScore}%</span>
        <span className={`text-2xl font-semibold ${color}`}>{label} Risk</span>
      </div>

      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full rounded-full ${
            riskScore >= 60 ? "bg-red-500" : riskScore >= 30 ? "bg-yellow-500" : "bg-green-500"
          }`}
          style={{ width: `${riskScore}%` }}
        />
      </div>

      {riskFactors.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-3">Risk Factors</h3>
          <ul className="space-y-2">
            {riskFactors.map((factor, i) => (
              <li key={i} className="text-slate-300 flex items-start gap-2">
                <span className="text-red-400 mt-1">-</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-slate-400">No significant risk factors identified.</p>
      )}
    </div>
  );
};

export default OverallRisk;
