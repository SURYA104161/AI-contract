import RiskClauses from "./RiskClauses";
import SafeClauses from "./SafeClauses";

const ClauseSection = () => {
  return (
    <div className="space-y-6">
      <RiskClauses />
      <SafeClauses />
    </div>
  );
};

export default ClauseSection;
