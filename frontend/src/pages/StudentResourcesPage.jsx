import { useEffect, useState } from 'react';
import StudentLayout from '../layouts/StudentLayout';
import { useSelector } from 'react-redux';
import { listMyResources } from '../services/resourceService';
import { Card, CardContent } from '@/components/ui/card';

function initials(name = '') {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'S'
  );
}

export default function StudentResourcesPage() {
  const user = useSelector((s) => s.auth.user);
  const [resources, setResources] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    listMyResources()
      .then((list) => {
        if (!cancelled) {
          setResources(list);
          setStatus('succeeded');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.error || err.message || 'Failed to load');
          setStatus('failed');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StudentLayout
      eyebrow="Study materials"
      title="Resources"
      avatarInitials={initials(user?.name)}
    >
      <p className="mb-6 text-sm text-muted-foreground">
        Links and materials shared by your mentors for your cohort(s).
      </p>

      {status === 'loading' && (
        <p className="text-sm text-muted-foreground">Loading resources…</p>
      )}
      {status === 'failed' && <p className="text-sm text-red-600">{error}</p>}

      {status === 'succeeded' && resources.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <h2 className="mb-1 font-bold">No resources yet</h2>
            <p className="text-sm text-muted-foreground">
              When a mentor publishes study materials for your cohort, they will
              show up here.
            </p>
          </CardContent>
        </Card>
      )}

      {status === 'succeeded' && resources.length > 0 && (
        <ul className="space-y-3">
          {resources.map((r) => (
            <li key={r.id}>
              <Card>
                <CardContent className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-semibold text-primary hover:underline"
                    >
                      {r.title}
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {r.cohort_name || 'Cohort'} · {r.resource_type}
                      {r.week_label ? ` · ${r.week_label}` : ''}
                      {r.created_by ? ` · ${r.created_by}` : ''}
                    </p>
                    {r.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Open →
                  </a>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </StudentLayout>
  );
}
