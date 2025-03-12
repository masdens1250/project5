import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Calendar, BookOpen, UserCheck, Brain, X, ChevronRight, Search, ChevronDown, Save, Play, Timer, Award, Eye, Edit2, Trash2 } from 'lucide-react';

type Test = {
  id: number;
  title: string;
  description: string;
  duration: string;
  color: string;
  questions: Question[];
  totalQuestions: number;
  level: string;
  group: string;
  type: 'فردي' | 'جماعي';
};

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer?: number;
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export function PsychTests() {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStartTestModalOpen, setIsStartTestModalOpen] = useState(false);
  const [selectedTestToStart, setSelectedTestToStart] = useState<Test | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedType, setSelectedType] = useState<'فردي' | 'جماعي' | ''>('');

  const [tests] = useState<Test[]>([
    {
      id: 1,
      title: 'اختبار الذكاء العاطفي',
      description: 'تقييم القدرة على فهم وإدارة العواطف',
      duration: '30 دقيقة',
      color: 'blue',
      questions: [],
      totalQuestions: 25,
      level: 'السنة الأولى',
      group: 'الفوج 1',
      type: 'فردي'
    },
    {
      id: 2,
      title: 'اختبار الميول المهنية',
      description: 'تحديد الميول والتوجهات المهنية',
      duration: '45 دقيقة',
      color: 'purple',
      questions: [],
      totalQuestions: 25,
      level: 'السنة الثانية',
      group: 'الفوج 2',
      type: 'جماعي'
    },
    {
      id: 3,
      title: 'اختبار القدرات العقلية',
      description: 'تقييم قدرات التفكير المنطقي وحل المشكلات',
      duration: '40 دقيقة',
      color: 'green',
      questions: [],
      totalQuestions: 25,
      level: 'السنة الثالثة',
      group: 'الفوج 3',
      type: 'فردي'
    }
  ]);

  const handleStartTest = (test: Test) => {
    navigate('/test-interface', { 
      state: { 
        test,
        testId: test.id,
        testName: test.title,
        duration: test.duration
      } 
    });
  };

  const handleView = (test: Test) => {
    setSelectedTest(test);
    setIsViewModalOpen(true);
  };

  const handleEdit = (test: Test) => {
    setSelectedTest(test);
    setIsEditModalOpen(true);
  };

  const handleDelete = (testId: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
      // Implement delete logic
      console.log('Deleting test:', testId);
    }
  };

  const getTestIcon = (title: string) => {
    if (title.includes('الذكاء العاطفي')) return Brain;
    if (title.includes('الميول المهنية')) return Users;
    if (title.includes('القدرات العقلية')) return Brain;
    return Brain;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel || test.level === selectedLevel;
    const matchesGroup = !selectedGroup || test.group === selectedGroup;
    const matchesType = !selectedType || test.type === selectedType;

    return matchesSearch && matchesLevel && matchesGroup && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الاختبارات النفسية</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>إضافة اختبار جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن اختبار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border rounded-lg"
          />
        </div>
        <div className="relative">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white"
          >
            <option value="">جميع المستويات</option>
            <option value="السنة الأولى">السنة الأولى</option>
            <option value="السنة الثانية">السنة الثانية</option>
            <option value="السنة الثالثة">السنة الثالثة</option>
          </select>
          <ChevronDown className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white"
          >
            <option value="">جميع الأفواج</option>
            <option value="الفوج 1">الفوج 1</option>
            <option value="الفوج 2">الفوج 2</option>
            <option value="الفوج 3">الفوج 3</option>
          </select>
          <ChevronDown className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'فردي' | 'جماعي' | '')}
            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white"
          >
            <option value="">نوع الاختبار</option>
            <option value="فردي">فردي</option>
            <option value="جماعي">جماعي</option>
          </select>
          <ChevronDown className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => {
          const colorClasses = getColorClasses(test.color);
          const TestIcon = getTestIcon(test.title);
          return (
            <div key={test.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-2 ${colorClasses.bg} rounded-lg`}>
                  <TestIcon className={`w-6 h-6 ${colorClasses.text}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-2 ${colorClasses.text}`}>{test.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {test.level}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {test.group}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {test.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Timer className="w-4 h-4" />
                      <span>{test.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartTest(test)}
                        className={`p-2 ${colorClasses.bg} rounded-lg transition-colors hover:opacity-80`}
                        title="بدء الاختبار"
                      >
                        <Play className={`w-5 h-5 ${colorClasses.text}`} />
                      </button>
                      <button
                        onClick={() => handleView(test)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEdit(test)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="تعديل"
                      >
                        <Edit2 className="w-5 h-5 text-gray-600 hover:text-yellow-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="تفاصيل الاختبار"
      >
        {selectedTest && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">الوصف</h3>
              <p className="text-gray-600">{selectedTest.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">المستوى</h3>
                <p className="text-gray-600">{selectedTest.level}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">الفوج</h3>
                <p className="text-gray-600">{selectedTest.group}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">نوع الاختبار</h3>
                <p className="text-gray-600">{selectedTest.type}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">المدة</h3>
              <p className="text-gray-600">{selectedTest.duration}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="تعديل الاختبار"
      >
        {selectedTest && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان الاختبار
              </label>
              <input
                type="text"
                defaultValue={selectedTest.title}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف
              </label>
              <textarea
                defaultValue={selectedTest.description}
                className="w-full p-2 border rounded-lg h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المستوى
                </label>
                <select
                  defaultValue={selectedTest.level}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="السنة الأولى">السنة الأولى</option>
                  <option value="السنة الثانية">السنة الثانية</option>
                  <option value="السنة الثالثة">السنة الثالثة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الفوج
                </label>
                <select
                  defaultValue={selectedTest.group}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="الفوج 1">الفوج 1</option>
                  <option value="الفوج 2">الفوج 2</option>
                  <option value="الفوج 3">الفوج 3</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}