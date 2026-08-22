function TrendBadge({ text, tone }) {
  const styles = {
    positive: 'bg-green-100 text-green-700',
    neutral: 'bg-gray-100 text-gray-600',
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[tone]}`}>{text}</span>;
}

export default function StatCard({ icon, iconBg, label, value, trend, trendTone = 'neutral' }) {
  return (
    <div className="border border-gray-200 rounded-lg bg-white px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${iconBg}`}>
          {icon}
        </span>
        {trend && <TrendBadge text={trend} tone={trendTone} />}
      </div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
