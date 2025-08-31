import { Users } from "lucide-react";

export default function Card() {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
      {/* Icon */}
      <div className="bg-red-100 p-4 rounded-full">
        <Users className="text-red-500 w-8 h-8" />
      </div>

      {/* Text */}
      <div>
        <p className="text-gray-500 text-sm">Visitors</p>
        <h2 className="text-2xl font-bold">65,650</h2>
      </div>
    </div>
  );
}
