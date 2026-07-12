const SuggestedQuestions = ({ onAsk }) => {
  const questions = [
    "What does this contract require from me?",
    "Are there any risky clauses?",
    "What is the termination notice period?",
    "Is there any automatic renewal?",
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-5">
      <h2 className="text-xl font-semibold text-white mb-4">Suggested Questions</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {questions.map((question) => (
          <button
            key={question}
            onClick={() => onAsk(question)}
            className="text-left rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 hover:border-blue-500 hover:text-white"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
