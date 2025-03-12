import React, { useState } from 'react';
import { User, Bell, Lock, Globe, X, Brain, Users, FileText, Users2, Video, Calendar, Mail } from 'lucide-react';

const INITIAL_NIVEAUX = ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة'];
const INITIAL_GROUPES = ['الفوج 1', 'الفوج 2', 'الفوج 3', 'الفوج 4'];
const INITIAL_TESTS = [
  'اختبار الذكاء العاطفي',
  'اختبار الميول المهنية',
  'اختبار القدرات العقلية',
  'اختبار الشخصية',
  'اختبار المهارات الاجتماعية'
];

export function Settings() {
  const [newLevel, setNewLevel] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [newTest, setNewTest] = useState('');
  const [niveaux, setNiveaux] = useState(INITIAL_NIVEAUX);
  const [groupes, setGroupes] = useState(INITIAL_GROUPES);
  const [tests, setTests] = useState(INITIAL_TESTS);
  const [activeTab, setActiveTab] = useState('profile');

  const handleAddLevel = () => {
    if (newLevel && !niveaux.includes(newLevel)) {
      setNiveaux([...niveaux, newLevel]);
      setNewLevel('');
    }
  };

  const handleAddGroup = () => {
    if (newGroup && !groupes.includes(newGroup)) {
      setGroupes([...groupes, newGroup]);
      setNewGroup('');
    }
  };

  const handleAddTest = () => {
    if (newTest && !tests.includes(newTest)) {
      setTests([...tests, newTest]);
      setNewTest('');
    }
  };

  const handleRemoveLevel = (level: string) => {
    setNiveaux(niveaux.filter(n => n !== level));
  };

  const handleRemoveGroup = (group: string) => {
    setGroupes(groupes.filter(g => g !== group));
  };

  const handleRemoveTest = (test: string) => {
    setTests(tests.filter(t => t !== test));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <div className="flex gap-2">
          {[
            { id: 'profile', icon: User, label: 'الملف الشخصي' },
            { id: 'notifications', icon: Bell, label: 'الإشعارات' },
            { id: 'security', icon: Lock, label: 'الأمان' },
            { id: 'system', icon: Globe, label: 'النظام' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">الملف الشخصي</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الصورة الشخصية</label>
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Profile"
                      className="w-16 h-16 rounded-full"
                    />
                    <button className="text-blue-600 hover:text-blue-700">تغيير الصورة</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    defaultValue="محمد أحمد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-lg"
                    defaultValue="mohamed@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-lg"
                    defaultValue="+213 123456789"
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700">
                  حفظ التغييرات
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Users2 className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">معلومات المؤسسة</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المؤسسة</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    defaultValue="ثانوية الأمل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  <textarea
                    className="w-full p-2 border rounded-lg h-24"
                    defaultValue="شارع الاستقلال، الجزائر العاصمة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-lg"
                    defaultValue="+213 123456789"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">إعدادات الإشعارات</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">إشعارات البريد الإلكتروني</h3>
                  <div className="space-y-4">
                    {[
                      'إشعارات الاجتماعات الجديدة',
                      'تقارير أسبوعية',
                      'تحديثات النظام',
                      'تذكيرات المواعيد'
                    ].map((notification, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{notification}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">إشعارات التطبيق</h3>
                  <div className="space-y-4">
                    {[
                      'إشعارات الرسائل الجديدة',
                      'طلبات الاجتماعات',
                      'تحديثات الأفواج',
                      'نتائج الاختبارات'
                    ].map((notification, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{notification}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">تفضيلات التقويم</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عرض التقويم الافتراضي</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>أسبوعي</option>
                    <option>شهري</option>
                    <option>يومي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تذكيرات المواعيد</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>15 دقيقة قبل الموعد</option>
                    <option>30 دقيقة قبل الموعد</option>
                    <option>ساعة قبل الموعد</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span>عرض المواعيد المنتهية</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">الأمان</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">تغيير كلمة المرور</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الحالية</label>
                      <input
                        type="password"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      تحديث كلمة المرور
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">المصادقة الثنائية</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">المصادقة الثنائية غير مفعلة</p>
                      <p className="text-sm text-gray-600">قم بتفعيل المصادقة الثنائية لتعزيز أمان حسابك</p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      تفعيل
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">الأجهزة المتصلة</h2>
              </div>
              <div className="space-y-4">
                {[
                  { device: 'iPhone 13', location: 'الجزائر العاصمة', lastActive: 'نشط الآن' },
                  { device: 'MacBook Pro', location: 'الجزائر العاصمة', lastActive: 'آخر نشاط منذ ساعة' },
                  { device: 'iPad Air', location: 'وهران', lastActive: 'آخر نشاط منذ 3 أيام' }
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-gray-600">{session.location} • {session.lastActive}</p>
                    </div>
                    <button className="text-red-600 hover:text-red-700">
                      تسجيل الخروج
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">إعدادات النظام</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اللغة</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>العربية</option>
                    <option>English</option>
                    <option>Français</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة الزمنية</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>(GMT+01:00) توقيت الجزائر</option>
                    <option>(GMT+00:00) توقيت غرينتش</option>
                    <option>(GMT+02:00) توقيت القاهرة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تنسيق التاريخ</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY/MM/DD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Video className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">إعدادات مؤتمر الفيديو</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">جودة الفيديو الافتراضية</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>عالية (720p)</option>
                    <option>متوسطة (480p)</option>
                    <option>منخفضة (360p)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الميكروفون الافتراضي</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>الميكروفون المدمج</option>
                    <option>ميكروفون خارجي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الكاميرا الافتراضية</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>الكاميرا المدمجة</option>
                    <option>كاميرا خارجية</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Gestion des niveaux et groupes */}
        <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold mb-6">إدارة المستويات والأفواج</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">المستويات</h3>
              <div className="flex flex-wrap gap-2">
                {niveaux.map((niveau, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                    <span>{niveau}</span>
                    <button 
                      onClick={() => handleRemoveLevel(niveau)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  placeholder="إضافة مستوى جديد"
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <button 
                  onClick={handleAddLevel}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  إضافة
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">الأفواج</h3>
              <div className="flex flex-wrap gap-2">
                {groupes.map((groupe, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                    <span>{groupe}</span>
                    <button 
                      onClick={() => handleRemoveGroup(groupe)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  placeholder="إضافة فوج جديد"
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <button 
                  onClick={handleAddGroup}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gestion des tests psychologiques */}
        <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">إدارة الاختبارات النفسية</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tests.map((test, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                  <span>{test}</span>
                  <button 
                    onClick={() => handleRemoveTest(test)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTest}
                onChange={(e) => setNewTest(e.target.value)}
                placeholder="إضافة نوع اختبار جديد"
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button 
                onClick={handleAddTest}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}