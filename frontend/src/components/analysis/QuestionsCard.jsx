import { FiHelpCircle } from "react-icons/fi";

const questions = [
  "Can the non-compete period be reduced?",
  "Is overtime compensated separately?",
  "Can the notice period be negotiated?",
  "Who owns the intellectual property created during employment?",
];

const QuestionsCard = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

      <div className="flex items-center gap-3 mb-6">
        <FiHelpCircle className="text-yellow-400 text-2xl" />
        <h2 className="text-2xl font-bold">
          Questions To Ask Before Signing
        </h2>
      </div>

      <div className="space-y-4">

        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition"
          >
            <div className="flex gap-3">

              <span className="text-yellow-400 font-bold">
                Q{index + 1}.
              </span>

              <span>{question}</span>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
};

export default QuestionsCard;
