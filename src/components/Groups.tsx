import React, { useState } from 'react';
import { Plus, Users, Calendar, BookOpen, UserCheck, Brain, X, ChevronRight, RefreshCw, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const groups = [
  {
    id: 1,
    name: 'الفوج 1',
    supervisor: 'محمد أحمد',
    schedule: 'الأحد - الخميس',
    students: 25,
    color: 'blue',
    details: {
      meetingTime: '09:00 - 11:00',
      location: 'القاعة A1',
      completedTests: 15,
      pendingTests: 10
    }
  },
  {
    id: 2,
    name: 'الفوج 2',
    supervisor: 'أحمد محمود',
    schedule: 'السبت - الأربعاء',
    students: 22,
    color: 'purple',
    details: {
      meetingTime: '11:00 - 13:00',
      location: 'القاعة A2',
      completedTests: 12,
      pendingTests: 10
    }
  },
  {
    id: 3,
    name: 'الفوج 3',
    supervisor: 'سارة خالد',
    schedule: 'الأحد - الخميس',
    students: 20,
    color: 'green',
    details: {
      meetingTime: '13:00 - 15:00',
      location: 'القاعة B1',
      completedTests: 18,
      pendingTests: 2
    }
  },
  {
    id: 4,
    name: 'الفوج 4',
    supervisor: 'فاطمة علي',
    schedule: 'السبت - الأربعاء',
    students: 23,
    color: 'rose',
    details: {
      meetingTime: '09:00 - 11:00',
      location: 'القاعة B2',
      completedTests: 20,
      pendingTests: 3
    }
  },
  {
    id: 5,
    name: 'الفوج 5',
    supervisor: 'عمر حسن',
    schedule: 'الأحد - الخميس',
    students: 21,
    color: 'orange',
    details: {
      meetingTime: '11:00 - 13:00',
      location: 'القاعة A3',
      completedTests: 16,
      pendingTests: 5
    }
  }
];

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const getColorClasses = (color: string) => {
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-100',
      button: 'hover:bg-blue-50',
      icon: 'bg-blue-100'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      hover: 'hover:bg-purple-100',
      button: 'hover:bg-purple-50',
      icon: 'bg-purple-100'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      hover: 'hover:bg-green-100',
      button: 'hover:bg-green-50',
      icon: 'bg-green-100'
    },
    rose: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-600',
      hover: 'hover:bg-rose-100',
      button: 'hover:bg-rose-50',
      icon: 'bg-rose-100'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      hover: 'hover:bg-orange-100',
      button: 'hover:bg-orange-50',
      icon: 'bg-orange-100'
    }
  };
  return colors[color as keyof typeof colors];
};

export function Groups() {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<(typeof groups)[0] | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const handleViewDetails = (group: (typeof groups)[0]) => {
    setSelectedGroup(group);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (group: (typeof groups)[0]) => {
    setSelectedGroup(group);
    setIsEditModalOpen(true);
  };

  const handleViewSchedule = (group: (typeof groups)[0]) => {
    setSelectedGroup(group);
    setIsScheduleModalOpen(true);
  };

  const handleViewPsychTests = (groupId: number) => {
    navigate('/psych-tests', { state: { groupId } });
  };

  const handleFetchGroups = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('تم جلب قائمة الأفواج بنجاح');
    } catch (error) {
      console.error('Error fetching groups:', error);
      alert('حدث خطأ أثناء جلب قائمة الأفواج');
    }
  };

  const handleDownloadGroups = () => {
    // Create CSV content
    const headers = ['اسم الفوج', 'المشرف', 'الجدول', 'عدد الثلاميذ'];
    const csvContent = [
      headers.join(','),
      ...groups.map(group => 
        [
          group.name,
          group.supervisor,
          group.schedule,
          group.students
        ].join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'قائمة_الأفواج.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الأفواج</h1>
        <div className="flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>إضافة فوج جديد</span>
          </button>
          <button
            onClick={handleFetchGroups}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>جلب قائمة الأفواج</span>
          </button>
          <button
            onClick={handleDownloadGroups}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>تحميل قائمة الأفواج</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const colorClasses = getColorClasses(group.color);
          return (
            <div 
              key={group.id} 
              className={`${colorClasses.bg} border ${colorClasses.border} p-6 rounded-lg transition-all duration-200 ${colorClasses.hover}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${colorClasses.text}`}>{group.name}</h3>
                <div className={`flex items-center ${colorClasses.text}`}>
                  <div className={`${colorClasses.icon} p-2 rounded-lg`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="mr-2">{group.students} تلميذ</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <UserCheck className="w-4 h-4 ml-2" />
                  <span>المشرف: {group.supervisor}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 ml-2" />
                  <span>الجدول: {group.schedule}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => handleViewDetails(group)}
                  className={`flex-1 ${colorClasses.text} ${colorClasses.button} px-3 py-2 rounded transition-colors`}
                >
                  عرض التفاصيل
                </button>
                <button 
                  onClick={() => handleEdit(group)}
                  className="flex-1 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded transition-colors"
                >
                  تعديل
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={`تفاصيل ${selectedGroup?.name}`}
      >
        {selectedGroup && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">المشرف</label>
                <p className="mt-1 text-lg">{selectedGroup.supervisor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">عدد الثلاميذ</label>
                <p className="mt-1 text-lg">{selectedGroup.students}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">موعد الاجتماعات</label>
                <p className="mt-1 text-lg">{selectedGroup.details.meetingTime}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">القاعة</label>
                <p className="mt-1 text-lg">{selectedGroup.details.location}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">الاختبارات النفسية</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <span className="block text-green-600 text-2xl font-bold">{selectedGroup.details.completedTests}</span>
                  <span className="text-green-800">اختبارات مكتملة</span>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <span className="block text-orange-600 text-2xl font-bold">{selectedGroup.details.pendingTests}</span>
                  <span className="text-orange-800">اختبارات معلقة</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  handleViewPsychTests(selectedGroup.id);
                }}
                className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" />
                <span>إدارة الاختبارات النفسية</span>
              </button>
            </div>

            <div className="border-t pt-4">
              <button 
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  handleViewSchedule(selectedGroup);
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>عرض الجدول</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل ${selectedGroup?.name}`}
      >
        {selectedGroup && (
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">اسم الفوج</label>
                <input
                  type="text"
                  defaultValue={selectedGroup.name}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">المشرف</label>
                <input
                  type="text"
                  defaultValue={selectedGroup.supervisor}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">موعد الاجتماعات</label>
                <input
                  type="text"
                  defaultValue={selectedGroup.details.meetingTime}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">القاعة</label>
                <input
                  type="text"
                  defaultValue={selectedGroup.details.location}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title={`جدول ${selectedGroup?.name}`}
      >
        {selectedGroup && (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4">
              {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((day) => (
                <div key={day} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">{day}</h4>
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded border text-sm">
                      <span className="block font-medium">09:00 - 10:30</span>
                      <span className="text-gray-600">جلسة توجيه</span>
                    </div>
                    <div className="bg-white p-2 rounded border text-sm">
                      <span className="block font-medium">11:00 - 12:30</span>
                      <span className="text-gray-600">اختبار نفسي</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}