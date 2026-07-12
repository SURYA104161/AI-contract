import MainLayout from "../../components/layout/MainLayout";
import HistoryList from "../../components/history/HistoryList";

const History = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">History</h1>

        <p className="text-slate-400 mt-2 mb-8">
          View all your previously analyzed contracts.
        </p>

        <HistoryList />
      </div>
    </MainLayout>
  );
};

export default History;
