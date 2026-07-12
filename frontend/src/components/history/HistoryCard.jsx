import {
  FiFileText,
  FiEye,
  FiMessageSquare,
} from "react-icons/fi";

const HistoryCard = ({ item }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center">
            <FiFileText size={30} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {item.name}
            </h2>

            <p className="text-slate-400 mt-2">
              {item.date}
            </p>

            <div className="mt-3 flex gap-3">
              <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-lg">
                Risk {item.risk}%
              </span>

              <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg">
                Completed
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-end">
          <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl flex items-center gap-2">
            <FiEye />
            View
          </button>

          <button className="bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl flex items-center gap-2">
            <FiMessageSquare />
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
