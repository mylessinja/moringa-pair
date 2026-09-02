import { useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { getAuditLogs } from '../../../services/adminService';

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    getAuditLogs(100)
      .then((data) => {
        setLogs(data || []);
        setStatus('succeeded');
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Could not load audit logs.');
        setStatus('failed');
      });
  }, []);

  const filtered = logs.filter((log) => {
    const query = search.toLowerCase();
    if (!query) return true;
    const actor = (log.actor_name || log.actor || '').toLowerCase();
    const action = (log.action || '').toLowerCase();
    const detail = (log.detail || log.description || '').toLowerCase();
    return actor.includes(query) || action.includes(query) || detail.includes(query);
  });

  return (
    <AdminLayout pageTitle="Audit Logs" pageDescription="Track administrative actions and system events.">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by actor, action, or detail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 px-4 py-2 rounded-md border border-border text-sm"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <Card className="px-4">
        <CardContent className="p-0">
          {status === 'loading' && (
            <div className="text-center py-10 text-muted-foreground text-sm">Loading…</div>
          )}
          {status !== 'loading' && filtered.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-3 font-medium">Actor</th>
                  <th className="py-3 font-medium">Action</th>
                  <th className="py-3 font-medium">Detail</th>
                  <th className="py-3 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} className="border-b border-border">
                    <td className="py-3">{log.actor_name || log.actor || '—'}</td>
                    <td className="py-3">{log.action}</td>
                    <td className="py-3 text-muted-foreground">{log.detail || log.description || '—'}</td>
                    <td className="py-3 text-muted-foreground whitespace-nowrap">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            status !== 'loading' && (
              <div className="text-center py-10 text-muted-foreground text-sm">No audit logs found.</div>
            )
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
