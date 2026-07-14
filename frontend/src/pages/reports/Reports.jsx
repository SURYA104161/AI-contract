import MainLayout from "../../components/layout/MainLayout";

import ReportHeader from "../../components/reports/ReportHeader";
import ReportStats from "../../components/reports/ReportStats";
import SummaryCard from "../../components/reports/SummaryCard";
import RiskChart from "../../components/reports/RiskChart";
import RiskyClauses from "../../components/reports/RiskyClauses";
import QuestionsCard from "../../components/reports/QuestionsCard";
import DownloadReport from "../../components/reports/DownloadReport";

const Reports = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        <h1 className="text-4xl font-bold">
          AI Contract Report
        </h1>

        <ReportHeader />

        <ReportStats />

        <SummaryCard />

        <RiskChart />

        <RiskyClauses />

        <QuestionsCard />

        <DownloadReport />

      </div>
    </MainLayout>
  );
};

export default Reports;
