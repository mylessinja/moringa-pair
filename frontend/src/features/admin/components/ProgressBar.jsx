export default function ProgressBar({ value }) {
  return (
    <div className="flex items-center gap-2 w-32">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-600 w-8">{value}%</span>
    </div>
  );
}
