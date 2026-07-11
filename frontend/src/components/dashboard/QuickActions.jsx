import { FiUpload, FiMessageSquare, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Upload Contract",
    icon: <FiUpload />,
    path: "/upload",
  },
  {
    title: "AI Chat",
    icon: <FiMessageSquare />,
    path: "/chat",
  },
  {
    title: "Generate Report",
    icon: <FiFileText />,
    path: "/reports",
  },
];

const QuickActions = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-5">Quick Actions</h2>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="w-full flex items-center gap-3 p-4 rounded-lg bg-slate-800 hover:bg-blue-600 transition"
          >
            <span className="text-xl">{action.icon}</span>
            {action.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
