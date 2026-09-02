import { useState } from 'react';
import StudentLayout from '../layouts/StudentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ariel Mwangi',
    email: 'ariel@example.com',
    cohort: 'Moringa Cohort 15',
    preference: 'Talk through ideas',
    goal: 'Frontend architecture',
  });

  const update = (event) => {
    setSaved(false);
    setProfile({ ...profile, [event.target.name]: event.target.value });
  };

  const initials = profile.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <StudentLayout eyebrow="Your space" title="Profile" avatarInitials={initials}>
      <Card className="max-w-2xl">
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <span className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold">
              {initials}
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.cohort} · Student</p>
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSaved(true);
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" value={profile.name} onChange={update} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" name="email" type="email" value={profile.email} onChange={update} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cohort">Cohort</Label>
                <Input id="cohort" name="cohort" value={profile.cohort} onChange={update} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="preference">How I learn best</Label>
                <select
                  id="preference"
                  name="preference"
                  value={profile.preference}
                  onChange={update}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
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
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option>Frontend architecture</option>
                <option>Testing and debugging</option>
                <option>Communication</option>
                <option>Problem solving</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {saved ? 'Profile details saved.' : 'These details help your TM make thoughtful pairings.'}
              </span>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </StudentLayout>
  );
};

export default Profile;
