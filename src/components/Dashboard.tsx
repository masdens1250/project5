import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line, Legend
} from 'recharts';
import { Bell, Mail, Users, GraduationCap, BookOpen, UserCheck, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const barData = [
  { name: 'يناير', value: 40 },
  { name: 'فبراير', value: 30 },
  { name: 'مارس', value: 45 },
  { name: 'أبريل', value: 35 },
];

const pieData = [
  { name: 'ممتاز', value: 35 },
  { name: 'جيد جدا', value: 25 },
  { name: 'جيد', value: 20 },
  { name: 'مقبول', value: 20 },
];

const psychTestsData = [
  { month: 'يناير', count: 25 },
  { month: 'فبراير', count: 30 },
  { month: 'مارس', count: 45 },
  { month: 'أبريل', count: 40 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const stats = [
  {
    title: 'إجمالي الثلاميذ',
    value: '856',
    icon: Users,
    color: 'blue',
    path: '/students'
  },
  {
    title: 'عدد الأفواج',
    value: '24',
    icon: BookOpen,
    color: 'green',
    path: '/groups'
  },
  {
    title: 'الاختبارات النفسية',
    value: '140',
    icon: Brain,
    color: 'purple',
    path: '/psych-tests'
  },
  {
    title: 'نسبة الحضور',
    value: '92%',
    icon: UserCheck,
    color: 'rose',
    path: '/students'
  },
];

const getColorClasses = (color: string) => {
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: 'bg-blue-100',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: 'bg-green-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: 'bg-purple-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      icon: 'bg-rose-100',
    },
  };
  return colors[color as keyof typeof colors];
};

export function Dashboard() {
  const navigate = useNavigate();

  const handleStatClick = (path: string) => {
    navigate(path);
  };

  const handleNotificationsClick = () => {
    // Implement notifications functionality
    console.log('Notifications clicked');
  };

  const handleMessagesClick = () => {
    // Implement messages functionality
    console.log('Messages clicked');
  };

  const handleProfileClick = () => {
    navigate('/settings');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة القيادة</h1>
        <div className="flex items-center space-x-4 space-x-reverse">
          <button 
            onClick={handleNotificationsClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="w-6 h-6" />
          </button>
          <button 
            onClick={handleMessagesClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Mail className="w-6 h-6" />
          </button>
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={handleProfileClick}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const colorClasses = getColorClasses(stat.color);
          return (
            <div 
              key={index} 
              className={`${colorClasses.bg} p-6 rounded-xl transition-all duration-200 hover:shadow-lg cursor-pointer`}
              onClick={() => handleStatClick(stat.path)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${colorClasses.icon} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${colorClasses.text}`} />
                </div>
                <span className={`text-3xl font-bold ${colorClasses.text}`}>{stat.value}</span>
              </div>
              <h3 className="text-gray-600 font-medium">{stat.title}</h3>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-1">
          <h3 className="text-lg font-semibold mb-6">توزيع الثلاميذ حسب المستوى</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">متابعة الاختبارات النفسية</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={psychTestsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="عدد الاختبارات"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}