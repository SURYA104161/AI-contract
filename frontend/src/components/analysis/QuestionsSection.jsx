const QuestionsSection = ({ analysis }) => {
  const questions = analysis?.questions ?? [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Questions To Ask Before Signing</h2>
      {questions.length === 0 ? (
        <p className="text-slate-400">No questions generated.</p>
      ) : (
        <div className="space-y-4 text-slate-300">
          {questions.map((q, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4">
              <span className="text-blue-400 font-semibold mr-2">{i + 1}.</span>
              {q.question}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsSection;
