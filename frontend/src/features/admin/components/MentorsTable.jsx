import { Badge } from '@/components/ui/badge';
import { MoreVertical } from 'lucide-react';
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

export default function MentorsTable({ mentors }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 border-b border-gray-200">
          <th className="py-3 font-medium">Mentor Name</th>
          <th className="py-3 font-medium">Expertise</th>
          <th className="py-3 font-medium">Active Cohorts</th>
          <th className="py-3 font-medium">Status</th>
          <th className="py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {mentors.map((mentor) => (
          <tr key={mentor.id} className="border-b border-gray-100">
            <td className="py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                  {initials(mentor.name)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{mentor.name}</p>
                  <p className="text-gray-500 text-xs">{mentor.email}</p>
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
            <td className="py-3 text-gray-600">{mentor.activeCohorts}</td>
            <td className="py-3">
              <Badge variant={statusVariant[mentor.status] || 'secondary'}>{statusLabel(mentor.status)}</Badge>
            </td>
           
          </tr>
        ))}
      </tbody>
    </table>
  );
}
