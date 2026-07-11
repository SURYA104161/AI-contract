const StatCard = ({ title, value, color }) => {
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500 transition-all duration-300">
      <h3 className="text-slate-400 text-sm">{title}</h3>

      <h1 className={`text-3xl font-bold mt-3 ${color}`}>
        {value}
      </h1>
    </div>
  );
};

export default StatCard;
