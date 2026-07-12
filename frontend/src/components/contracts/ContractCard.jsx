import { FiFileText, FiEye, FiTrash2, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const statusColors = {
  uploaded: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
};

const ContractCard = ({ contract, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-blue-500 transition">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center">
            <FiFileText size={28} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">{contract.original_file_name}</h2>

            <p className="text-slate-400 text-sm mt-1">
              {(contract.file_size / 1024).toFixed(2)} KB
            </p>

            <p className="text-slate-500 text-sm">
              {new Date(contract.uploaded_at).toLocaleString()}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm capitalize ${
            statusColors[contract.status]
          }`}
        >
          {contract.status}
        </span>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => navigate("/analysis")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          <FiEye />
          View
        </button>

        <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg">
          <FiDownload />
          Download
        </button>

        <button
          onClick={() => onDelete(contract)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          <FiTrash2 />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ContractCard;
