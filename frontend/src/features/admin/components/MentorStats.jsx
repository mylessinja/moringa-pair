export default function MentorStats({ total, active, pending }) {
  return (
    <div className="flex items-center divide-x divide-gray-200 border border-border rounded-md px-6 py-3">
      <div className="pr-6 text-center">
        <p className="text-xl font-bold text-foreground">{total}</p>
        <p className="text-xs text-muted-foreground">TOTAL</p>
      </div>
      <div className="px-6 text-center">
        <p className="text-xl font-bold text-green-600 dark:text-green-400">{active}</p>
        <p className="text-xs text-muted-foreground">ACTIVE</p>
      </div>
      <div className="pl-6 text-center">
        <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{pending}</p>
        <p className="text-xs text-muted-foreground">PENDING</p>
      </div>
    </div>
  );
}
