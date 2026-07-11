import { FiCpu } from "react-icons/fi";

const SummaryCard = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6 hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl transform transition-all duration-300">

      <div className="flex items-center gap-3 mb-4">

        <div className="bg-blue-600 p-3 rounded-xl">
          <FiCpu className="text-white text-xl" />
        </div>

        <h2 className="text-2xl font-bold">
          AI Summary
        </h2>

      </div>

      <p className="text-slate-300 leading-8 max-w-5xl">

        This employment agreement appears to be generally safe and follows
        common industry standards. However, the AI detected a few clauses
        that deserve attention, including a non-compete agreement,
        termination conditions, and liability limitations. Before signing,
        you should carefully review these sections or consult a legal expert.

      </p>

    </div>
  );
};

export default SummaryCard;
