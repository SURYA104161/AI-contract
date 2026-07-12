import { FiClock, FiRefreshCw } from "react-icons/fi";

const WaitingAnalysis = ({ status }) => {
  const isAnalyzing = status === "analyzing";

  return (
    <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
      <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto">
        <FiClock className="text-yellow-400 text-4xl" />
      </div>

      <h2 className="text-3xl font-bold mt-6">
        {isAnalyzing ? "Analyzing Contract..." : "Waiting for AI Analysis"}
      </h2>

      <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
        {isAnalyzing
          ? "The AI is analyzing your contract. This usually takes between 30 and 60 seconds."
          : "Your contract has been uploaded successfully. The AI is preparing to analyze your document."}
      </p>

      <div className="mt-10">
        <div className="w-full max-w-xl mx-auto h-3 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse w-2/3"></div>
        </div>
        <p className="mt-4 text-blue-400">
          {isAnalyzing ? "Running AI analysis..." : "Preparing analysis..."}
        </p>
      </div>
    </div>
  );
};

export default WaitingAnalysis;
