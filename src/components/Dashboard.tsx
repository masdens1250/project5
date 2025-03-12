import React, { useState } from 'react';
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
  Line,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { Bell, Mail, Users, GraduationCap, BookOpen, UserCheck, Brain, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const barData = [
  { name: 'يناير', value: 40, previousValue: 35 },
  { name: 'فبراير', value: 30, previousValue: 28 },
  { name: 'مارس', value: 45, previousValue: 40 },
  { name: 'أبريل', value: 35, previousValue: 38 },
];

const pieData = [
  { name: 'ممتاز', value: 35, color: '#0088FE' },
  { name: 'جيد جدا', value: 25, color: '#00C49F' },
  { name: 'جيد', value: 20, color: '#FFBB28' },
  { name: 'مقبول', value: 20, color: '#FF8042' },
];

const psychTestsData = [
  { month: 'يناير', completed: 25, total: 30 },
  { month: 'فبراير', completed: 30, total: 35 },
  { month: 'مارس', completed: 45, total: 50 },
  { month: 'أبريل', completed: 40, total: 45 },
];

const stats = [
  {
    title: 'إجمالي الثلاميذ',
    value: '856',
    change: '+12%',
    icon: Users,
    color: 'blue',
    path: '/students'
  },
  {
    title: 'عدد الأفواج',
    value: '24',
    change: '+3%',
    icon: BookOpen,
    color: 'green',
    path: '/groups'
  },
  {
    title: 'الاختبارات النفسية',
    value: '140',
    change: '+8%',
    icon: Brain,
    color: 'purple',
    path: '/psych-tests'
  },
  {
    title: 'نسبة الحضور',
    value: '92%',
    change: '+2%',
    icon: UserCheck,
    color: 'rose',
    path: '/students'
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'test',
    title: 'اختبار الذكاء العاطفي',
    student: 'أحمد محمد',
    time: 'منذ ساعة',
    status: 'completed'
  },
  {
    id: 2,
    type: 'meeting',
    title: 'جلسة توجيه فردية',
    student: 'فاطمة علي',
    time: 'منذ ساعتين',
    status: 'scheduled'
  },
  {
    id: 3,
    type: 'report',
    title: 'تقرير متابعة شهري',
    student: 'يوسف أحمد',
    time: 'منذ 3 ساعات',
    status: 'pending'
  }
];

const getColorClasses = (color: string) => {
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: 'bg-blue-100',
      hover: 'hover:bg-blue-100',
      border: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: 'bg-green-100',
      hover: 'hover:bg-green-100',
      border: 'border-green-200',
      gradient: 'from-green-500 to-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: 'bg-purple-100',
      hover: 'hover:bg-purple-100',
      border: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-600'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      icon: 'bg-rose-100',
      hover: 'hover:bg-rose-100',
      border: 'border-rose-200',
      gradient: 'from-rose-500 to-rose-600'
    }
  };
  return colors[color as keyof typeof colors];
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'test':
      return Brain;
    case 'meeting':
      return Calendar;
    case 'report':
      return TrendingUp;
    default:
      return AlertCircle;
  }
};

const getActivityStatus = (status: string) => {
  switch (status) {
    case 'completed':
      return { bg: 'bg-green-100', text: 'text-green-800', label: 'مكتمل' };
    case 'scheduled':
      return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'مجدول' };
    case 'pending':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'قيد الانتظار' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
  }
};

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'موعد جديد', read: false },
    { id: 2, title: 'تقرير جاهز للمراجعة', read: false },
    { id: 3, title: 'اكتمال الاختبار', read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleStatClick = (path: string) => {
    navigate(path);
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center h-16 mb-8"
      >
        <h1 className="text-3xl font-bold">لوحة القيادة</h1>
        <div className="flex items-center gap-6">
          <div className="relative">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>
            <AnimatePresence>
              {showNotifications && notifications.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
                >
                  {notifications.map(notif => (
                    <motion.button
                      key={notif.id}
                      whileHover={{ backgroundColor: '#F3F4F6' }}
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`w-full px-4 py-2 text-right ${
                        !notif.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className="font-medium">{notif.title}</p>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Mail className="w-6 h-6" />
          </motion.button>
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => navigate('/settings')}
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col gap-8 min-h-0 overflow-y-auto"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const colorClasses = getColorClasses(stat.color);
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`${colorClasses.bg} p-6 rounded-xl transition-all duration-200 hover:shadow-lg cursor-pointer border ${colorClasses.border}`}
                onClick={() => handleStatClick(stat.path)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${colorClasses.icon} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${colorClasses.text}`} />
                  </div>
                  <div className="text-right">
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`text-3xl font-bold ${colorClasses.text}`}
                    >
                      {stat.value}
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      className={`mr-2 text-sm ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </motion.span>
                  </div>
                </div>
                <h3 className="text-gray-600 font-medium">{stat.title}</h3>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-6">النشاطات الأخيرة</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.type);
                const status = getActivityStatus(activity.status);
                return (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <ActivityIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.student}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Charts */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              variants={chartVariants}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-6">توزيع مستويات الأداء</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {pieData.map((entry, index) => (
                        <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.3}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              variants={chartVariants}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-6">تقدم الاختبارات النفسية</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={psychTestsData}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorCompleted)"
                      name="الاختبارات المكتملة"
                      animationDuration={1500}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#82ca9d"
                      fillOpacity={0.3}
                      fill="url(#colorTotal)"
                      name="إجمالي الاختبارات"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}