import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusVariant = {
  approved: 'default',
  pending: 'secondary',
  suspended: 'destructive',
};

function statusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function MentorsTable({ mentors, onStatusChange }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-muted-foreground border-b border-border">
          <th className="py-3 font-medium">Mentor Name</th>
          <th className="py-3 font-medium">Expertise</th>
          <th className="py-3 font-medium">Active Cohorts</th>
          <th className="py-3 font-medium">Status</th>
          <th className="py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {mentors.map((mentor) => (
          <tr key={mentor.id} className="border-b border-border">
            <td className="py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 dark:bg-zinc-700 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  {initials(mentor.name)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{mentor.name}</p>
                  <p className="text-muted-foreground text-xs">{mentor.email}</p>
                </div>
              </div>
            </td>
            <td className="py-3">
              <div className="flex gap-1 flex-wrap">
                {mentor.expertise.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </td>
            <td className="py-3 text-muted-foreground">{mentor.activeCohorts}</td>
            <td className="py-3">
              <Badge variant={statusVariant[mentor.status] || 'secondary'}>{statusLabel(mentor.status)}</Badge>
            </td>
            <td className="py-3">
              <div className="flex gap-2">
                {mentor.status !== 'approved' && (
                  <Button size="sm" variant="secondary" onClick={() => onStatusChange?.(mentor.id, 'approved')}>
                    Approve
                  </Button>
                )}
                {mentor.status !== 'suspended' && (
                  <Button size="sm" variant="destructive" onClick={() => onStatusChange?.(mentor.id, 'suspended')}>
                    Suspend
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
