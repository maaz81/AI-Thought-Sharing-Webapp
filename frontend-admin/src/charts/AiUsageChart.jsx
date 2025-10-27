import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "AI-generated", value: 45 },
  { name: "User-written", value: 35 },
  { name: "Hybrid", value: 20 },
];

const COLORS = ["#3b82f6", "#22c55e", "#facc15"];

export default function AiUsageChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md">
      <h3 className="mb-4 font-semibold">AI Usage Statistics</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
