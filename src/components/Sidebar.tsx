import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Group as UserGroup, Brain, Video, Settings, FileText } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'لوحة القيادة', path: '/' },
  { icon: Users, label: 'إدارة الثلاميذ', path: '/students' },
  { icon: UserGroup, label: 'إدارة الأفواج', path: '/groups' },
  { icon: Brain, label: 'الاختبارات النفسية', path: '/psych-tests' },
  { icon: FileText, label: 'إدارة التقارير', path: '/reports' },
  { icon: Video, label: 'مؤتمر الفيديو', path: '/video-conference' },
  { icon: Settings, label: 'الإعدادات', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-[#1a2234] text-white p-6 flex flex-col">
      <div className="mb-8 cursor-pointer" onClick={() => navigate('/')}>
        <h1 className="text-2xl font-bold tracking-wide">مستشار(ة) التوجيه</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center space-x-4 space-x-reverse px-4 py-3 rounded-lg transition-colors text-menu font-medium ${
                  location.pathname === item.path 
                    ? 'bg-white/20 font-semibold' 
                    : 'hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}