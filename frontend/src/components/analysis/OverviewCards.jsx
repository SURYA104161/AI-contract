import {
  FiAlertTriangle,
  FiFileText,
  FiHelpCircle,
  FiCheckCircle,
} from "react-icons/fi";

const OverviewCards = ({ onSelect, analysis }) => {
  const riskScore = analysis?.risk_score ?? 0;
  const clauseCount = analysis?.clauses?.length ?? 0;
  const questionCount = analysis?.questions?.length ?? 0;

  const cards = [
    {
      key: "risk",
      title: "Risk Score",
      value: `${riskScore}%`,
      color: riskScore >= 60 ? "text-red-400" : riskScore >= 30 ? "text-yellow-400" : "text-green-400",
      icon: <FiAlertTriangle />,
    },
    {
      key: "clauses",
      title: "Clauses",
      value: String(clauseCount),
      color: "text-blue-400",
      icon: <FiFileText />,
    },
    {
      key: "questions",
      title: "Questions",
      value: String(questionCount),
      color: "text-yellow-400",
      icon: <FiHelpCircle />,
    },
    {
      key: "status",
      title: "AI Status",
      value: "Completed",
      color: "text-green-400",
      icon: <FiCheckCircle />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
      {cards.map((card) => (
        <div
          key={card.key}
          onClick={() => typeof onSelect === "function" && onSelect(card.key)}
          className="cursor-pointer bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl transform transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className={`${card.color} text-2xl`}>{card.icon}</span>
            <span className="text-slate-400 text-sm">{card.title}</span>
          </div>
          <h2 className={`mt-6 text-3xl font-bold ${card.color}`}>{card.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
