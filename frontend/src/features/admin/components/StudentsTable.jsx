import ProgressBar from './ProgressBar';

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function StudentsTable({ students }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 border-b border-gray-200">
          <th className="py-3 font-medium">Student Name</th>
          <th className="py-3 font-medium">Cohort</th>
          <th className="py-3 font-medium">Mastery Progress</th>
          <th className="py-3 font-medium">Last Active</th>
          <th className="py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id} className="border-b border-gray-100">
            <td className="py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                  {initials(student.name)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-gray-500 text-xs">{student.email}</p>
                </div>
              </div>
            </td>
            <td className="py-3 text-gray-600">{student.cohort}</td>
            <td className="py-3">
              <ProgressBar value={student.mastery} />
            </td>
            <td className="py-3 text-gray-600">{student.lastActive}</td>
            <td className="py-3 text-gray-400">•••</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
