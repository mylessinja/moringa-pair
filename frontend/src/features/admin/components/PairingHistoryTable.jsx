export default function PairingHistoryTable({ history }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 border-b border-gray-200">
          <th className="py-3 font-medium">Week</th>
          <th className="py-3 font-medium">Published</th>
          <th className="py-3 font-medium">Pairs</th>
        </tr>
      </thead>
      <tbody>
        {history.map((entry) => (
          <tr key={entry.id} className="border-b border-gray-100 align-top">
            <td className="py-3 font-medium text-gray-900 whitespace-nowrap">{entry.week}</td>
            <td className="py-3 text-gray-500 whitespace-nowrap">{entry.publishedAt}</td>
            <td className="py-3">
              <div className="flex flex-wrap gap-2">
                {entry.pairs.map((pair) => (
                  <span
                    key={pair.id}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
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
