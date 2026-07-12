import MainLayout from "../../components/layout/MainLayout";
import { useState, useEffect } from "react";
import { getHistory } from "../../services/api";
import HistoryCard from "../../components/history/HistoryCard";
import EmptyHistory from "../../components/history/EmptyHistory";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch((err) => console.error("Failed to load history:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">History</h1>

        <p className="text-slate-400 mt-2 mb-8">
          View all your previously analyzed contracts.
        </p>

        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading history...</div>
        ) : history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div>
            {history.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default History;
