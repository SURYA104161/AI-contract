const AiSummary = ({ analysis }) => {
  const summary = analysis?.summary || "No summary available.";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">AI Summary</h2>
      <p className="text-slate-300 leading-8">{summary}</p>
    </div>
  );
};

export default AiSummary;
