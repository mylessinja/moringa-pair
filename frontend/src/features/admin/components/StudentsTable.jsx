import ProgressBar from './ProgressBar';

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function StudentsTable({ students }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-muted-foreground border-b border-border">
          <th className="py-3 font-medium">Student Name</th>
          <th className="py-3 font-medium">Cohort</th>
          <th className="py-3 font-medium">Mastery Progress</th>
          <th className="py-3 font-medium">Last Active</th>
          <th className="py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id} className="border-b border-border">
            <td className="py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 dark:bg-zinc-700 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  {initials(student.name)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                  <p className="text-muted-foreground text-xs">{student.email}</p>
                </div>
              </div>
            </td>
            <td className="py-3 text-muted-foreground">{student.cohort}</td>
            <td className="py-3">
              <ProgressBar value={student.mastery} />
            </td>
            <td className="py-3 text-muted-foreground">{student.lastActive}</td>
            <td className="py-3 text-muted-foreground">•••</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
