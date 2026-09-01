function TrendBadge({ text, tone }) {
  const styles = {
    positive: 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400',
    neutral: 'bg-muted text-muted-foreground',
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[tone]}`}>{text}</span>;
}

export default function StatCard({ icon, iconBg, label, value, trend, trendTone = 'neutral' }) {
  return (
    <div className="border border-border rounded-lg bg-card px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${iconBg}`}>
          {icon}
        </span>
        {trend && <TrendBadge text={trend} tone={trendTone} />}
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
