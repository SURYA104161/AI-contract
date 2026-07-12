import HistoryCard from "./HistoryCard";
import EmptyHistory from "./EmptyHistory";

const data = [
  {
    id: 1,
    name: "Employment_Agreement.pdf",
    date: "12 Jul 2026 • 10:30 AM",
    risk: 18,
  },
  {
    id: 2,
    name: "Rental_Agreement.pdf",
    date: "11 Jul 2026 • 07:10 PM",
    risk: 42,
  },
];

const HistoryList = () => {
  if (data.length === 0) {
    return <EmptyHistory />;
  }

  return (
    <div>
      {data.map((item) => (
        <HistoryCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
};

export default HistoryList;
