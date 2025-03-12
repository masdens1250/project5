import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Group as UserGroup, Brain, Video, Settings, FileText, Target, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'لوحة القيادة', path: '/' },
  { icon: Users, label: 'إدارة الثلاميذ', path: '/students' },
  { icon: UserGroup, label: 'إدارة الأفواج', path: '/groups' },
  { icon: Brain, label: 'الاختبارات النفسية', path: '/psych-tests' },
  { icon: Target, label: 'الأهداف', path: '/recommendations' },
  { icon: FileText, label: 'إدارة التقارير', path: '/reports' },
  { icon: Video, label: 'مؤتمر الفيديو', path: '/video-conference' },
  { icon: Settings, label: 'الإعدادات', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/');
  };

  return (
    <aside 
      className={`bg-[#1a2234] text-white transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        {!isCollapsed && (
          <h1 className="text-xl font-bold tracking-wide cursor-pointer" onClick={() => navigate('/')}>
            مستشار(ة) التوجيه
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative group ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  {isCollapsed && (
                    <div className="absolute right-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-6 h-6" />
          {!isCollapsed && <span className="font-medium">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}