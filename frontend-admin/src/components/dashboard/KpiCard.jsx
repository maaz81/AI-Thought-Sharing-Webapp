export default function KpiCard({ icon, title, value, trend }) {
  const trendColor = trend.includes("+")
    ? "text-green-500"
    : trend === "Needs review"
    ? "text-yellow-500"
    : "text-gray-400";

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow">
      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
        {icon}
      </div>
      <div>
        <h4 className="text-gray-500 text-sm">{title}</h4>
        <p className="text-2xl font-semibold">{value}</p>
        <p className={`text-sm ${trendColor}`}>{trend}</p>
      </div>
    </div>
  );
}
