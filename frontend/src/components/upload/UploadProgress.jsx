const UploadProgress = ({ progress, status }) => {
  return (
    <div className="mt-6 bg-slate-900 border border-slate-700 rounded-xl p-5">
      <div className="flex justify-between mb-3">
        <span className="font-medium">{status}</span>
        <span className="text-blue-400">{progress}%</span>
      </div>

      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default UploadProgress;
