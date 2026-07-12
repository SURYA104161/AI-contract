import MainLayout from "../../components/layout/MainLayout";
import { useState } from "react";
import AnalysisHeader from "../../components/analysis/AnalysisHeader";
import OverviewCards from "../../components/analysis/OverviewCards";
import AiSummary from "../../components/analysis/AiSummary";
import OverallRisk from "../../components/analysis/OverallRisk";
import TotalClauses from "../../components/analysis/TotalClauses";
import RiskyClauses from "../../components/analysis/RiskyClauses";
import SafeClauses from "../../components/analysis/SafeClauses";
import QuestionsSection from "../../components/analysis/QuestionsSection";
import InsightsPanel from "../../components/analysis/InsightsPanel";
import WaitingAnalysis from "../../components/analysis/WaitingAnalysis";

const Analysis = () => {
  const [activeSection, setActiveSection] = useState("summary");
  const [status] = useState("waiting");
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">Contract Analysis</h1>

        <p className="text-slate-400 mt-2">
          AI-generated legal insights for your uploaded document.
        </p>

        <div className="mt-8">
          {status === "waiting" ? (
            <WaitingAnalysis />
          ) : (
            <>
              <AnalysisHeader />

              <OverviewCards onSelect={setActiveSection} />

              <div className="grid grid-cols-2 gap-6 mt-6">
                {activeSection === "summary" && <AiSummary />}

                {activeSection === "risk" && <OverallRisk />}

                {activeSection === "clauses" && <TotalClauses />}

                {activeSection === "risky" && <RiskyClauses />}

                {activeSection === "safe" && <SafeClauses />}

                {activeSection === "questions" && <QuestionsSection />}

                <InsightsPanel
                  activeSection={activeSection}
                  onSelect={setActiveSection}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Analysis;
