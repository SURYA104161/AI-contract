import MainLayout from "../../components/layout/MainLayout";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analyzeDocument } from "../../services/api";
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
import LanguageSelector from "../../components/LanguageSelector";

const Analysis = () => {
  const [activeSection, setActiveSection] = useState("summary");
  const [status, setStatus] = useState("waiting");
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");
  const location = useLocation();
  const contractId = location.state?.contractId;
  const filename = location.state?.filename;

  useEffect(() => {
    if (location.state?.language) {
      setLanguage(location.state.language);
    }
  }, [location.state?.language]);

  useEffect(() => {
    if (!contractId) {
      setError("No contract specified. Please upload a contract first.");
      return;
    }

    let cancelled = false;

    const runAnalysis = async () => {
      try {
        setStatus("analyzing");
        const data = await analyzeDocument(contractId, language);
        if (!cancelled) {
          setAnalysisData(data);
          setStatus("completed");
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(err.response?.data?.detail || "Analysis failed. Please try again.");
          setStatus("failed");
        }
      }
    };

    runAnalysis();

    return () => { cancelled = true; };
  }, [contractId, language]);

  const retryAnalysis = async () => {
    if (!contractId) return;
    setError(null);
    setStatus("analyzing");
    try {
      const data = await analyzeDocument(contractId, language);
      setAnalysisData(data);
      setStatus("completed");
    } catch (err) {
      setError(err.response?.data?.detail || "Analysis failed. Please try again.");
      setStatus("failed");
    }
  };

  const reAnalyze = () => {
    setAnalysisData(null);
    setError(null);
    setStatus("waiting");
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">Contract Analysis</h1>

        <p className="text-slate-400 mt-2">
          AI-generated legal insights for your uploaded document.
        </p>

        <div className="mt-6">
          <LanguageSelector value={language} onChange={setLanguage} compact />
        </div>

        <div className="mt-8">
          {!contractId && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
              <p className="text-slate-400 text-lg">No contract selected. Please upload a contract first.</p>
            </div>
          )}

          {contractId && (status === "waiting" || status === "analyzing") && (
            <WaitingAnalysis status={status} />
          )}

          {status === "failed" && (
            <div className="bg-slate-900 border border-red-800 rounded-2xl p-10 text-center">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={retryAnalysis}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
              >
                Retry Analysis
              </button>
            </div>
          )}

          {status === "completed" && analysisData && (
            <>
              <div className="flex items-center justify-between">
                <AnalysisHeader contract={analysisData} filename={filename} />
                <button
                  onClick={reAnalyze}
                  className="ml-4 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm border border-slate-700"
                >
                  Re-analyze
                </button>
              </div>

              <OverviewCards
                onSelect={setActiveSection}
                analysis={analysisData}
              />

              <div className="grid grid-cols-2 gap-6 mt-6">
                {activeSection === "summary" && <AiSummary analysis={analysisData} />}

                {activeSection === "risk" && <OverallRisk analysis={analysisData} />}

                {activeSection === "clauses" && <TotalClauses analysis={analysisData} />}

                {activeSection === "risky" && <RiskyClauses analysis={analysisData} />}

                {activeSection === "safe" && <SafeClauses analysis={analysisData} />}

                {activeSection === "questions" && <QuestionsSection analysis={analysisData} />}

                <InsightsPanel
                  activeSection={activeSection}
                  onSelect={setActiveSection}
                  analysis={analysisData}
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
