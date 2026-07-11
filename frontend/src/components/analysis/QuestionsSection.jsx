const QuestionsSection = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Questions To Ask Before Signing</h2>
      <div className="space-y-4 text-slate-300">
        <div className="bg-slate-800 rounded-xl p-4">Can the non-compete period be reduced?</div>
        <div className="bg-slate-800 rounded-xl p-4">Is overtime compensated separately?</div>
        <div className="bg-slate-800 rounded-xl p-4">Can the notice period be negotiated?</div>
        <div className="bg-slate-800 rounded-xl p-4">Who owns the intellectual property created during employment?</div>
      </div>
    </div>
  );
};

export default QuestionsSection;
