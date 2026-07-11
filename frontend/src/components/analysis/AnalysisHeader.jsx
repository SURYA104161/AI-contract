import { FiFileText, FiCheckCircle } from "react-icons/fi";

const AnalysisHeader = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        {/* Left */}

        <div className="flex items-center gap-4">

          <div className="bg-blue-600 p-4 rounded-xl">
            <FiFileText className="text-white text-3xl" />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">
              Employment_Agreement.pdf
            </h2>

            <p className="text-slate-400 mt-1">
              Uploaded Today • PDF • 2.4 MB
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full">

          <FiCheckCircle />

          <span>AI Analysis Completed</span>

        </div>

      </div>

    </div>
  );
};

export default AnalysisHeader;
