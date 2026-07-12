import { FiCheckCircle } from "react-icons/fi";

const SafeClauses = ({ analysis }) => {
  const clauses = analysis?.clauses ?? [];
  const safeClauses = clauses.filter((c) => c.risk_level === "Low");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <FiCheckCircle className="text-green-400 text-2xl" />
        <h2 className="text-2xl font-bold">Safe Clauses ({safeClauses.length})</h2>
      </div>

      {safeClauses.length === 0 ? (
        <p className="text-slate-400">No low-risk clauses detected.</p>
      ) : (
        <div className="space-y-4">
          {safeClauses.map((clause, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 flex items-start gap-3">
              <FiCheckCircle className="text-green-400 mt-1" />
              <div>
                <span className="font-semibold">{clause.title}</span>
                <p className="text-slate-400 text-sm mt-1">{clause.simple_explanation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafeClauses;
