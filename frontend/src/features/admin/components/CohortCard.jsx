export default function CohortCard({ cohort }) {
  const progressPercent = Math.round((cohort.weekOfSyllabus / cohort.totalWeeks) * 100);

  return (
    <div className="border border-border rounded-lg bg-card p-5">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cohort.trackColor}`}>
          {cohort.track}
        </span>
        <span className="text-muted-foreground">⋮</span>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-3">{cohort.name}</h3>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div>
          <p className="text-lg font-bold text-primary">{cohort.students}</p>
          <p className="text-xs text-muted-foreground">Students</p>
        </div>
        <div>
          <p className="text-lg font-bold text-green-600">{cohort.avgMastery}%</p>
          <p className="text-xs text-muted-foreground">Avg Mastery</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{cohort.mentors}</p>
          <p className="text-xs text-muted-foreground">Mentors</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span>Syllabus Progress</span>
        <span>
          Week {cohort.weekOfSyllabus} of {cohort.totalWeeks}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
        <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Lead Mentor:</span>
        <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-zinc-700 dark:bg-zinc-700 inline-block" />
        <span className="font-medium text-foreground">{cohort.leadMentor}</span>
      </div>
    </div>
  );
}
