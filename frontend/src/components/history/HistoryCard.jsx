import { FiFileText, FiEye, FiMessageSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const HistoryCard = ({ item }) => {
  const navigate = useNavigate();
  const riskColor = item.risk >= 60 ? "text-red-400" : item.risk >= 30 ? "text-yellow-400" : "text-green-400";
  const riskBg = item.risk >= 60 ? "bg-red-600/20 text-red-400" : item.risk >= 30 ? "bg-yellow-600/20 text-yellow-400" : "bg-green-600/20 text-green-400";

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown date";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center">
            <FiFileText size={30} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p className="text-slate-400 mt-2">{formattedDate}</p>
            <div className="mt-3 flex gap-3">
              <span className={`px-3 py-1 rounded-lg ${riskBg}`}>
                Risk {item.risk ?? 0}%
              </span>
              <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg">
                {item.status === "completed" ? "Completed" : item.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-end">
          <button
            onClick={() =>
              navigate("/analysis", {
                state: { contractId: item.contract_id, filename: item.name },
              })
            }
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <FiEye />
            View
          </button>
          <button
            onClick={() =>
              navigate("/chat", {
                state: { contractId: item.contract_id },
              })
            }
            className="bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <FiMessageSquare />
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
