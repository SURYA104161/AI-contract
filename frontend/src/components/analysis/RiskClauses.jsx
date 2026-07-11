import { FiAlertTriangle } from "react-icons/fi";

const clauses = [
  {
    title: "Non-Compete Clause",
    risk: "High Risk",
    color: "bg-red-500/20 text-red-400",
  },
  {
    title: "Termination Penalty",
    risk: "Medium Risk",
    color: "bg-yellow-500/20 text-yellow-400",
  },
  {
    title: "Unlimited Liability",
    risk: "High Risk",
    color: "bg-red-500/20 text-red-400",
  },
];

const RiskClauses = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-6">
        <FiAlertTriangle className="text-red-400 text-2xl" />
        <h2 className="text-2xl font-bold">Risky Clauses</h2>
      </div>

      <div className="space-y-4">

        {clauses.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-4 flex justify-between items-center"
          >
            <span>{item.title}</span>

            <span className={`px-3 py-1 rounded-full text-sm ${item.color}`}>
              {item.risk}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
};

export default RiskClauses;
