import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';

const tabs = [
  {
    id: 'pairing-algorithm',
    label: 'Pairing Algorithm',
    icon: '📐',
    description: 'Configure how weekly pairings are generated.',
  },
  {
    id: 'user-permissions',
    label: 'User Permissions',
    icon: '🔒',
    description: 'Manage what each role can see and do.',
  },
  {
    id: 'notification-templates',
    label: 'Notification Templates',
    icon: '✉️',
    description: 'Customize automated emails and in-app alerts.',
  },
  {
    id: 'platform-branding',
    label: 'Platform Branding',
    icon: '🎨',
    description: 'Update logo, colors, and platform name.',
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(tabs[2].id);
  const current = tabs.find((t) => t.id === activeTab);

  return (
    <AdminLayout
      pageTitle="Platform Settings"
      pageDescription="Configure pairing algorithms, manage permissions, and customize platform communications."
    >
      <div className="flex gap-6">
        <nav className="w-56 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{current.label}</h2>
          <p className="text-gray-500 text-sm">{current.description}</p>
         
        </div>
      </div>
    </AdminLayout>
  );
}
