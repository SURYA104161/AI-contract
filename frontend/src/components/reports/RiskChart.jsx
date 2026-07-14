import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Safe", value: 19 },
  { name: "Risky", value: 5 },
];

const COLORS = ["#22c55e", "#ef4444"];

export default function RiskChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        Risk Breakdown
      </h2>

      <div className="flex justify-center">
        <PieChart width={500} height={350}>
          <Pie
            data={data}
            cx={250}
            cy={160}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
