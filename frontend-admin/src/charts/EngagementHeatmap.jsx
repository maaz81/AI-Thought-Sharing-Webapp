// charts/EngagementHeatmap.jsx
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { day: "Mon", Morning: 30, Afternoon: 50, Evening: 70 },
  { day: "Tue", Morning: 40, Afternoon: 55, Evening: 60 },
  { day: "Wed", Morning: 45, Afternoon: 60, Evening: 80 },
  { day: "Thu", Morning: 35, Afternoon: 50, Evening: 75 },
  { day: "Fri", Morning: 55, Afternoon: 65, Evening: 90 },
  { day: "Sat", Morning: 60, Afternoon: 70, Evening: 95 },
  { day: "Sun", Morning: 50, Afternoon: 55, Evening: 85 },
];

export default function EngagementHeatmap() {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md">
      <h3 className="mb-4 font-semibold">Engagement Heatmap</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Morning" stackId="a" fill="#60a5fa" />
          <Bar dataKey="Afternoon" stackId="a" fill="#facc15" />
          <Bar dataKey="Evening" stackId="a" fill="#fb923c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
