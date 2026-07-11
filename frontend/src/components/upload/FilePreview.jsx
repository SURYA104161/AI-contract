import { FiFileText, FiX } from "react-icons/fi";

const formatFileSize = (bytes) => {
  if (!bytes) return "";

  if (bytes < 1024) return bytes + " Bytes";

  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";

  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

const FilePreview = ({ file, onRemove }) => {
  return (
    <div className="mt-6 bg-slate-900 border border-slate-700 rounded-xl p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <FiFileText className="text-blue-500" size={35} />

        <div>
          <h3 className="font-semibold">{file.name}</h3>
          <p className="text-slate-400 text-sm">{formatFileSize(file.size)}</p>
        </div>
      </div>

      <button onClick={onRemove} className="text-red-400 hover:text-red-500">
        <FiX size={22} />
      </button>
    </div>
  );
};

export default FilePreview;
