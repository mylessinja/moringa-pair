import { useState } from 'react';
import { useSelector } from 'react-redux';
import MentorLayout from '../../../layouts/MentorLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockMentors } from '../../admin/data/mockMentors';

const mentorRecord = mockMentors.find((mentor) => mentor.name === 'Albert Byrone');

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || mentorRecord.name,
    email: user?.email || mentorRecord.email,
    expertise: mentorRecord.expertise.join(', '),
    activeCohorts: mentorRecord.activeCohorts,
    bio: 'I like to pair with students on real code before reviewing theory — helps concepts stick faster.',
  });

  const update = (event) => {
    setSaved(false);
    setProfile({ ...profile, [event.target.name]: event.target.value });
  };

  const initials = profile.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  return (
    <MentorLayout eyebrow="Your space" title="Profile">
      <Card className="max-w-2xl">
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <span className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold">{initials}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.activeCohorts} · Mentor</p>
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
                <Label htmlFor="expertise">Areas of expertise</Label>
                <Input id="expertise" name="expertise" value={profile.expertise} onChange={update} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="activeCohorts">Active cohorts</Label>
                <Input id="activeCohorts" name="activeCohorts" value={profile.activeCohorts} onChange={update} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Mentoring style</Label>
              <Textarea id="bio" name="bio" value={profile.bio} onChange={update} className="min-h-[100px]" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500">{saved ? 'Profile details saved.' : 'Students see this on their pairing page.'}</span>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </MentorLayout>
  );
};

export default Profile;
