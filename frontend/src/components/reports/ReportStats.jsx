const stats = [
  {
    title: "Risk Score",
    value: "18%",
    color: "text-red-400",
  },
  {
    title: "Clauses",
    value: "24",
    color: "text-blue-400",
  },
  {
    title: "Risky",
    value: "5",
    color: "text-yellow-400",
  },
  {
    title: "Safe",
    value: "19",
    color: "text-green-400",
  },
];

const ReportStats = () => {
  return (
    <div className="grid grid-cols-4 gap-5">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <p className="text-slate-400">{item.title}</p>

          <h2 className={`text-4xl font-bold mt-3 ${item.color}`}>
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default ReportStats;
