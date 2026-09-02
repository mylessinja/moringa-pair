export default function PairingHistoryTable({ history }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-muted-foreground border-b border-border">
          <th className="py-3 font-medium">Week</th>
          <th className="py-3 font-medium">Published</th>
          <th className="py-3 font-medium">Pairs</th>
        </tr>
      </thead>
      <tbody>
        {history.map((entry) => (
          <tr key={entry.id} className="border-b border-border align-top">
            <td className="py-3 font-medium text-foreground whitespace-nowrap">{entry.week}</td>
            <td className="py-3 text-muted-foreground whitespace-nowrap">{entry.publishedAt}</td>
            <td className="py-3">
              <div className="flex flex-wrap gap-2">
                {entry.pairs.map((pair) => (
                  <span
                    key={pair.id}
                    className="text-xs bg-muted text-foreground px-2 py-1 rounded-full"
                  >
                    {pair.members.join(' · ')}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
