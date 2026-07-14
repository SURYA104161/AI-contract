const clauses = [
  "Non-compete clause may restrict future employment.",
  "Termination requires a 30-day notice period.",
  "Employer may modify benefits with prior notice.",
];

const RiskyClauses = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-5">
        Risky Clauses
      </h2>

      <div className="space-y-4">
        {clauses.map((clause, index) => (
          <div
            key={index}
            className="rounded-xl bg-red-500/10 border border-red-500/20 p-4"
          >
            <p className="text-red-300">
              ⚠ {clause}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskyClauses;
