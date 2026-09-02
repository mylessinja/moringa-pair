import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, ShieldCheck, Bell, Palette } from 'lucide-react';

const tabs = [
  { id: 'pairing-algorithm', label: 'Pairing Algorithm', icon: Wand2, description: 'Configure how weekly pairings are generated.' },
  { id: 'user-permissions', label: 'User Permissions', icon: ShieldCheck, description: 'Manage what each role can see and do.' },
  { id: 'notification-templates', label: 'Notification Templates', icon: Bell, description: 'Customize automated emails and in-app alerts.' },
  { id: 'platform-branding', label: 'Platform Branding', icon: Palette, description: 'Update logo, colors, and platform name.' },
];

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-200 dark:bg-zinc-700'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function SaveBar({ saved, onSave }) {
  return (
    <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
      <span className="text-xs text-muted-foreground">{saved ? 'Changes saved.' : 'Changes apply platform-wide once saved.'}</span>
      <Button onClick={onSave}>Save changes</Button>
    </div>
  );
}

function PairingAlgorithmTab() {
  const [frequency, setFrequency] = useState('Weekly');
  const [criteria, setCriteria] = useState({ skillLevel: true, learningGoals: true, cohort: true, availability: false });
  const [autoPublish, setAutoPublish] = useState(true);
  const [allowSwapRequests, setAllowSwapRequests] = useState(true);
  const [saved, setSaved] = useState(false);

  const toggleCriterion = (key) => setCriteria((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <div className="mb-5">
        <Label className="mb-2 block">Pairing frequency</Label>
        <div className="flex gap-2">
          {['Weekly', 'Biweekly'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setFrequency(option);
                setSaved(false);
              }}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                frequency === option ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <Label className="mb-1 block">Match on</Label>
        <p className="text-xs text-muted-foreground mb-2">Choose which signals the algorithm weighs when forming pairs.</p>
      </div>
      <Toggle checked={criteria.skillLevel} onChange={() => { toggleCriterion('skillLevel'); setSaved(false); }} label="Skill level" hint="Balance pairs by assessment mastery score." />
      <Toggle checked={criteria.learningGoals} onChange={() => { toggleCriterion('learningGoals'); setSaved(false); }} label="Learning goals" hint="Match students working on similar focus areas." />
      <Toggle checked={criteria.cohort} onChange={() => { toggleCriterion('cohort'); setSaved(false); }} label="Same cohort" hint="Only pair students within the same cohort." />
      <Toggle checked={criteria.availability} onChange={() => { toggleCriterion('availability'); setSaved(false); }} label="Availability overlap" hint="Requires students to share logged availability windows." />

      <div className="mt-2">
        <Toggle checked={autoPublish} onChange={(v) => { setAutoPublish(v); setSaved(false); }} label="Auto-publish new pairings" hint="Publish immediately instead of holding for admin review." />
        <Toggle checked={allowSwapRequests} onChange={(v) => { setAllowSwapRequests(v); setSaved(false); }} label="Allow swap requests" hint="Let students request a different partner before pairings lock." />
      </div>

      <SaveBar saved={saved} onSave={() => setSaved(true)} />
    </div>
  );
}

const ROLES = ['Admin', 'Mentor', 'Student'];
const PERMISSIONS = [
  { key: 'viewAllStudents', label: 'View all students' },
  { key: 'editStudentProfiles', label: 'Edit student profiles' },
  { key: 'managePairings', label: 'Manage pairings' },
  { key: 'sendNotifications', label: 'Send notifications' },
  { key: 'accessAnalytics', label: 'Access analytics' },
];

const DEFAULT_PERMISSIONS = {
  Admin: { viewAllStudents: true, editStudentProfiles: true, managePairings: true, sendNotifications: true, accessAnalytics: true },
  Mentor: { viewAllStudents: false, editStudentProfiles: false, managePairings: false, sendNotifications: true, accessAnalytics: false },
  Student: { viewAllStudents: false, editStudentProfiles: false, managePairings: false, sendNotifications: false, accessAnalytics: false },
};

function UserPermissionsTab() {
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [saved, setSaved] = useState(false);

  const toggle = (role, key) => {
    setPermissions((prev) => ({ ...prev, [role]: { ...prev[role], [key]: !prev[role][key] } }));
    setSaved(false);
  };

  return (
    <div>
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="py-2 px-1 font-medium">Permission</th>
              {ROLES.map((role) => (
                <th key={role} className="py-2 px-1 font-medium text-center">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map((perm) => (
              <tr key={perm.key} className="border-b border-border last:border-0">
                <td className="py-3 px-1 text-foreground">{perm.label}</td>
                {ROLES.map((role) => (
                  <td key={role} className="py-3 px-1 text-center">
                    <input
                      type="checkbox"
                      checked={permissions[role][perm.key]}
                      onChange={() => toggle(role, perm.key)}
                      disabled={role === 'Admin'}
                      aria-label={`${perm.label} for ${role}`}
                      className="w-4 h-4 accent-primary disabled:opacity-40"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-3">Admin permissions are fixed and cannot be restricted.</p>
      <SaveBar saved={saved} onSave={() => setSaved(true)} />
    </div>
  );
}

const TEMPLATES = [
  { id: 'weekly-pairing', label: 'Weekly Pairing Published', subject: 'Your pairing for this week is ready', body: "Hi {{student_name}}, you've been paired with {{partner_name}} for this week's session. Focus area: {{focus_area}}." },
  { id: 'mentor-application', label: 'New Mentor Application', subject: 'A new mentor application needs review', body: '{{mentor_name}} has applied to mentor {{cohort}}. Review their profile in the Mentors tab.' },
  { id: 'assessment-reminder', label: 'Assessment Reminder', subject: 'Complete your weekly assessment', body: "Hi {{student_name}}, you haven't completed this week's assessment yet. It takes about 10 minutes." },
  { id: 'swap-approved', label: 'Pairing Swap Approved', subject: 'Your swap request was approved', body: "Hi {{student_name}}, your request for a new partner was approved. You're now paired with {{partner_name}}." },
];

function NotificationTemplatesTab() {
  const [activeTemplateId, setActiveTemplateId] = useState(TEMPLATES[0].id);
  const [drafts, setDrafts] = useState(() => Object.fromEntries(TEMPLATES.map((t) => [t.id, { subject: t.subject, body: t.body }])));
  const [saved, setSaved] = useState(false);

  const activeDraft = drafts[activeTemplateId];

  const updateDraft = (field, value) => {
    setDrafts((prev) => ({ ...prev, [activeTemplateId]: { ...prev[activeTemplateId], [field]: value } }));
    setSaved(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-1">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => {
              setActiveTemplateId(template.id);
              setSaved(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTemplateId === template.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {template.label}
          </button>
        ))}
      </div>

      <div className="md:col-span-2 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="template-subject">Subject line</Label>
          <Input id="template-subject" value={activeDraft.subject} onChange={(e) => updateDraft('subject', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="template-body">Message body</Label>
          <Textarea id="template-body" value={activeDraft.body} onChange={(e) => updateDraft('body', e.target.value)} className="min-h-[140px]" />
          <p className="text-xs text-muted-foreground">Use placeholders like {'{{student_name}}'} — they're filled in automatically when sent.</p>
        </div>
        <SaveBar saved={saved} onSave={() => setSaved(true)} />
      </div>
    </div>
  );
}

const BRAND_COLORS = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Rose', value: '#e11d48' },
];

function PlatformBrandingTab() {
  const [platformName, setPlatformName] = useState('MoringaPair');
  const [tagline, setTagline] = useState('Weekly pairing for hands-on learning.');
  const [color, setColor] = useState(BRAND_COLORS[0].value);
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="space-y-1.5">
          <Label htmlFor="platform-name">Platform name</Label>
          <Input id="platform-name" value={platformName} onChange={(e) => { setPlatformName(e.target.value); setSaved(false); }} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="platform-tagline">Tagline</Label>
          <Input id="platform-tagline" value={tagline} onChange={(e) => { setTagline(e.target.value); setSaved(false); }} />
        </div>
      </div>

      <div className="mb-2">
        <Label className="mb-2 block">Primary color</Label>
        <div className="flex items-center gap-3">
          {BRAND_COLORS.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              onClick={() => { setColor(swatch.value); setSaved(false); }}
              aria-label={swatch.name}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${color === swatch.value ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: swatch.value }}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-border p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>
          {platformName.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{platformName}</p>
          <p className="text-xs text-muted-foreground">{tagline}</p>
        </div>
      </div>

      <SaveBar saved={saved} onSave={() => setSaved(true)} />
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === activeTab);

  return (
    <AdminLayout
      pageTitle="Platform Settings"
      pageDescription="Configure pairing algorithms, manage permissions, and customize platform communications."
    >
      <div className="flex gap-6">
        <nav className="w-56 space-y-1 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left flex items-center gap-2.5 -3 py-2 rounded-md text-sm font-medium ${
                activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">{current.label}</h2>
          <p className="text-muted-foreground text-sm mb-5">{current.description}</p>

          {activeTab === 'pairing-algorithm' && <PairingAlgorithmTab />}
          {activeTab === 'user-permissions' && <UserPermissionsTab />}
          {activeTab === 'notification-templates' && <NotificationTemplatesTab />}
          {activeTab === 'platform-branding' && <PlatformBrandingTab />}
        </div>
      </div>
    </AdminLayout>
  );
}
