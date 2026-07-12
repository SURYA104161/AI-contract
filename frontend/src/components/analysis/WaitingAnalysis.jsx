import { FiClock, FiRefreshCw } from "react-icons/fi";

const WaitingAnalysis = () => {
  return (
    <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
      <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto">
        <FiClock className="text-yellow-400 text-4xl" />
      </div>

      <h2 className="text-3xl font-bold mt-6">Waiting for AI Analysis</h2>

      <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
        Your contract has been uploaded successfully. The AI is preparing to analyze your document. This usually takes between 30 and 60 seconds.
      </p>

      <div className="mt-10">
        <div className="w-full max-w-xl mx-auto h-3 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse w-2/3"></div>
        </div>

        <p className="mt-4 text-blue-400">Preparing analysis...</p>
      </div>

      <button className="mt-10 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition">
        <FiRefreshCw />
        Refresh Status
      </button>
    </div>
  );
};

export default WaitingAnalysis;
