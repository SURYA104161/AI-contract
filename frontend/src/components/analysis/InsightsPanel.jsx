import {
  FiAlertCircle,
  FiCheckCircle,
  FiFileText,
  FiHelpCircle,
} from "react-icons/fi";

const insights = [
  {
    key: "risk",
    title: "Overall Risk",
    value: "Low",
    color: "text-green-400",
    icon: <FiAlertCircle />,
  },
  {
    key: "clauses",
    title: "Total Clauses",
    value: "24",
    color: "text-blue-400",
    icon: <FiFileText />,
  },
  {
    key: "risky",
    title: "Risky Clauses",
    value: "3",
    color: "text-red-400",
    icon: <FiAlertCircle />,
  },
  {
    key: "safe",
    title: "Safe Clauses",
    value: "21",
    color: "text-green-400",
    icon: <FiCheckCircle />,
  },
  {
    key: "questions",
    title: "Questions",
    value: "8",
    color: "text-yellow-400",
    icon: <FiHelpCircle />,
  },
];

const InsightsPanel = ({ activeSection, onSelect }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">
      <h2 className="text-2xl font-bold mb-6">
        📊 Contract Insights
      </h2>

      <div className="space-y-4">
        {insights.map((item, index) => (
          <div
            key={item.key || index}
            onClick={() => typeof onSelect === "function" && onSelect(item.key)}
            className={`cursor-pointer flex items-center justify-between rounded-xl p-4 transition-all duration-300 ${
              activeSection === item.key ? "bg-blue-600 text-white" : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xl ${item.color}`}>
                {item.icon}
              </span>

              <span>{item.title}</span>
            </div>

            <span className={`font-bold ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
