const EmptyHistory = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
      <div className="text-6xl mb-4">📂</div>

      <h2 className="text-2xl font-bold text-white">
        No History Yet
      </h2>

      <p className="text-slate-400 mt-3">
        Your analyzed contracts will appear here.
      </p>
    </div>
  );
};

export default EmptyHistory;
