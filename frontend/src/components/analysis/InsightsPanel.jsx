import {
  FiAlertCircle,
  FiCheckCircle,
  FiFileText,
  FiHelpCircle,
} from "react-icons/fi";

const InsightsPanel = ({ activeSection, onSelect, analysis }) => {
  const clauses = analysis?.clauses ?? [];
  const riskyCount = clauses.filter((c) => c.risk_level === "High" || c.risk_level === "Medium").length;
  const safeCount = clauses.filter((c) => c.risk_level === "Low").length;
  const questionCount = analysis?.questions?.length ?? 0;
  const riskScore = analysis?.risk_score ?? 0;
  const riskLabel = riskScore >= 60 ? "High" : riskScore >= 30 ? "Medium" : "Low";

  const insights = [
    {
      key: "risk",
      title: "Overall Risk",
      value: riskLabel,
      color: riskScore >= 60 ? "text-red-400" : riskScore >= 30 ? "text-yellow-400" : "text-green-400",
      icon: <FiAlertCircle />,
    },
    {
      key: "clauses",
      title: "Total Clauses",
      value: String(clauses.length),
      color: "text-blue-400",
      icon: <FiFileText />,
    },
    {
      key: "risky",
      title: "Risky Clauses",
      value: String(riskyCount),
      color: "text-red-400",
      icon: <FiAlertCircle />,
    },
    {
      key: "safe",
      title: "Safe Clauses",
      value: String(safeCount),
      color: "text-green-400",
      icon: <FiCheckCircle />,
    },
    {
      key: "questions",
      title: "Questions",
      value: String(questionCount),
      color: "text-yellow-400",
      icon: <FiHelpCircle />,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">
      <h2 className="text-2xl font-bold mb-6">Contract Insights</h2>

      <div className="space-y-4">
        {insights.map((item) => (
          <div
            key={item.key}
            onClick={() => typeof onSelect === "function" && onSelect(item.key)}
            className={`cursor-pointer flex items-center justify-between rounded-xl p-4 transition-all duration-300 ${
              activeSection === item.key
                ? "bg-blue-600 text-white"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xl ${item.color}`}>{item.icon}</span>
              <span>{item.title}</span>
            </div>
            <span className={`font-bold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
