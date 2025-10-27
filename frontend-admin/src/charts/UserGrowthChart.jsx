import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { week: "W1", users: 200 },
  { week: "W2", users: 400 },
  { week: "W3", users: 600 },
  { week: "W4", users: 800 },
];

export default function UserGrowthChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md">
      <h3 className="mb-4 font-semibold">User Growth</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
