import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import StudentLayout from '../layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getMe } from '../services/studentService';

function initialsFromName(name = '') {
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

const Profile = () => {
  const authUser = useSelector((s) => s.auth.user);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    cohort: '',
    role: 'student',
    preference: 'Talk through ideas',
    goal: 'Frontend architecture',
  });

  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((data) => {
        if (cancelled) return;
        const u = data.user || authUser;
        const cohortName = data.cohorts?.[0]?.name || '—';
        setProfile((prev) => ({
          ...prev,
          name: u?.name || '',
          email: u?.email || '',
          role: u?.role || 'student',
          cohort: cohortName,
        }));
      })
      .catch(() => {
        if (authUser) {
          setProfile((prev) => ({
            ...prev,
            name: authUser.name || '',
            email: authUser.email || '',
            role: authUser.role || 'student',
          }));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  const update = (e) => {
    setSaved(false);
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const initials = initialsFromName(profile.name);

  return (
    <StudentLayout eyebrow="Your space" title="Profile" avatarInitials={initials}>
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading profile…</p>
          ) : (
            <>
              <div className="mb-6 flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {initials}
                </span>
                <div>
                  <h2 className="text-lg font-bold">{profile.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {profile.cohort !== '—' ? `${profile.cohort} · ` : ''}
                    Student
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSaved(true);
                }}
                className="space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" name="name" value={profile.name} onChange={update} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={profile.email}
                      readOnly
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cohort">Cohort</Label>
                    <Input id="cohort" name="cohort" value={profile.cohort} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="preference">How I learn best</Label>
                    <select
                      id="preference"
                      name="preference"
                      value={profile.preference}
                      onChange={update}
                      className="flex h-9 w-full rounded-md border border-input px-3 text-sm"
                    >
                      <option>Talk through ideas</option>
                      <option>Read documentation</option>
                      <option>Build a small project</option>
                      <option>Watch a walkthrough</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="goal">What I want to strengthen</Label>
                  <select
                    id="goal"
                    name="goal"
                    value={profile.goal}
                    onChange={update}
                    className="flex h-9 w-full rounded-md border border-input px-3 text-sm"
                  >
                    <option>Frontend architecture</option>
                    <option>Testing and debugging</option>
                    <option>Communication</option>
                    <option>Problem solving</option>
                  </select>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    {saved
                      ? 'Preferences noted locally (server save later).'
                      : 'Account identity comes from login; cohort from membership.'}
                  </span>
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </StudentLayout>
  );
};

export default Profile;
