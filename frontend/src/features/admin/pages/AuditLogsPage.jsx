import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { mockAuditLogs } from '../data/mockAuditLogs';

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');

  // TODO: replace mockAuditLogs with a real GET /audit-logs fetch
  // once the backend exists.
  const logs = mockAuditLogs.filter((log) => {
    const query = search.toLowerCase();
    if (!query) return true;
    return (
      log.actor.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.detail.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout pageTitle="Audit Logs" pageDescription="Track administrative actions and system events.">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by actor, action, or detail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 px-4 py-2 rounded-md border border-gray-200 text-sm"
        />
      </div>

      <Card className="px-4">
        <CardContent className="p-0">
          {logs.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-3 font-medium">Actor</th>
                  <th className="py-3 font-medium">Action</th>
                  <th className="py-3 font-medium">Detail</th>
                  <th className="py-3 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900 font-medium whitespace-nowrap">{log.actor}</td>
                    <td className="py-3 text-gray-700 whitespace-nowrap">{log.action}</td>
                    <td className="py-3 text-gray-500">{log.detail}</td>
                    <td className="py-3 text-gray-400 whitespace-nowrap">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">No matching activity.</div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
