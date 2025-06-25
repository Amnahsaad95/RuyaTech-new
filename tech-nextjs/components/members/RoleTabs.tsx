import { UserRole } from '@/types/user';
import { AcademicCapIcon, BriefcaseIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface RoleTabsProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function RoleTabs({ activeRole, onRoleChange }: RoleTabsProps) {
  const tabs = [
    {
      role: 'professional',
      icon: <BriefcaseIcon className="h-5 w-5" />,
      label: 'Professionals',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      role: 'student',
      icon: <AcademicCapIcon className="h-5 w-5" />,
      label: 'Students',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      role: 'company',
      icon: <BuildingOfficeIcon className="h-5 w-5" />,
      label: 'Companies',
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.role}
          onClick={() => onRoleChange(tab.role as UserRole)}
          className={`role-tab ${tab.color} py-2 px-4 rounded-lg flex flex-col items-center transition-all ${
            activeRole === tab.role ? 'ring-2 ring-offset-2 ring-current scale-[1.02]' : ''
          }`}
        >
          {tab.icon}
          <span className="text-sm mt-1">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
