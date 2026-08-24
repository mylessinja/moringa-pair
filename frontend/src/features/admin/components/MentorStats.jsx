export default function MentorStats({ total, active, pending }) {
  return (
    <div className="flex items-center divide-x divide-gray-200 border border-gray-200 rounded-md px-6 py-3">
      <div className="pr-6 text-center">
        <p className="text-xl font-bold text-gray-900">{total}</p>
        <p className="text-xs text-gray-500">TOTAL</p>
      </div>
      <div className="px-6 text-center">
        <p className="text-xl font-bold text-green-600">{active}</p>
        <p className="text-xs text-gray-500">ACTIVE</p>
      </div>
      <div className="pl-6 text-center">
        <p className="text-xl font-bold text-amber-600">{pending}</p>
        <p className="text-xs text-gray-500">PENDING</p>
      </div>
    </div>
  );
}
