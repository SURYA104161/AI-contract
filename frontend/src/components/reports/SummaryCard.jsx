const SummaryCard = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">
        AI Summary
      </h2>

      <p className="text-slate-300 leading-8">
        This employment agreement contains standard employment
        clauses with a low overall legal risk. However, the
        non-compete clause and termination notice period should
        be reviewed carefully before signing.
      </p>
    </div>
  );
};

export default SummaryCard;
