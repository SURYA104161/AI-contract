const questions = [
  "Can the notice period be reduced?",
  "Is the non-compete clause negotiable?",
  "Can employee benefits change during employment?",
];

const QuestionsCard = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-5">
        Questions to Ask
      </h2>

      <ul className="space-y-4">
        {questions.map((question, index) => (
          <li
            key={index}
            className="rounded-xl bg-slate-800 p-4"
          >
            ❓ {question}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionsCard;
