import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const SESSION_TYPES = ['1:1 session', 'Code review', 'Pairing check-in'];

export default function FeedbackPanel({ student, onClose, onSubmit }) {
  const [type, setType] = useState(SESSION_TYPES[0]);
  const [note, setNote] = useState('');

  if (!student) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!note.trim()) return;
    onSubmit({ type, note: note.trim() });
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} aria-hidden />
      <aside className="relative z-10 h-full w-full max-w-md bg-card shadow-xl flex flex-col">
        <div className="flex items-start justify-between px-6 py-5 border-b border-border">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1">Leave feedback</p>
            <h2 className="text-lg font-bold text-foreground">{student.name}</h2>
            <p className="text-sm text-muted-foreground">{student.cohort} · {student.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="px-6 py-4 border-b border-border grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Mastery</p>
            <p className="font-semibold text-foreground">{student.mastery}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Focus area</p>
            <p className="font-semibold text-foreground">{student.focusArea}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Session type</Label>
            <div className="flex flex-wrap gap-2">
              {SESSION_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    type === t ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5 flex-1 flex flex-col">
            <Label htmlFor="note">Notes</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you cover? Any follow-ups for next time?"
              className="flex-1 min-h-[160px]"
            />
          </div>
          <Button type="submit" className="w-full" disabled={!note.trim()}>
            Save feedback
          </Button>
        </form>
      </aside>
    </div>
  );
}
