import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, FileText, ChevronDown, Search, Plus, Eye, Edit2, Trash2, X } from 'lucide-react';

type Recommendation = {
  id: number;
  title: string;
  description: string;
  type: string;
  objectives: string[];
  testId?: number;
  testName?: string;
  studentName?: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
};

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    title: 'تطوير المهارات القيادية',
    description: 'برنامج تدريبي لتطوير المهارات القيادية وبناء الشخصية',
    type: 'تطوير شخصي',
    objectives: [
      'تعزيز الثقة بالنفس',
      'تطوير مهارات التواصل',
      'تحسين القدرة على اتخاذ القرارات'
    ],
    testId: 1,
    testName: 'اختبار الذكاء العاطفي',
    studentName: 'أحمد محمد',
    date: '2024/03/20',
    status: 'in-progress'
  },
  {
    id: 2,
    title: 'التدريب العملي في مجال العلوم',
    description: 'برنامج تدريبي في المختبرات العلمية',
    type: 'تدريب مهني',
    objectives: [
      'اكتساب خبرة عملية',
      'تطوير المهارات التقنية',
      'التعرف على بيئة العمل المخبرية'
    ],
    testId: 2,
    testName: 'اختبار الميول المهنية',
    studentName: 'فاطمة علي',
    date: '2024/03/19',
    status: 'pending'
  },
  {
    id: 3,
    title: 'تعزيز مهارات التفكير النقدي',
    description: 'برنامج لتطوير مهارات التحليل وحل المشكلات',
    type: 'تطوير أكاديمي',
    objectives: [
      'تحسين القدرة على التحليل',
      'تطوير مهارات حل المشكلات',
      'تعزيز التفكير المنطقي'
    ],
    testId: 3,
    testName: 'اختبار القدرات العقلية',
    studentName: 'يوسف أحمد',
    date: '2024/03/18',
    status: 'completed'
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

export function Recommendations() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleViewTest = (testId: number | undefined) => {
    if (testId) {
      navigate('/psych-tests', { state: { testId } });
    }
  };

  const handleViewStudent = (studentName: string | undefined) => {
    if (studentName) {
      navigate('/students', { state: { studentName } });
    }
  };

  const getStatusColor = (status: Recommendation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Recommendation['status']) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'completed':
        return 'مكتمل';
      default:
        return status;
    }
  };

  const filteredRecommendations = MOCK_RECOMMENDATIONS.filter(recommendation => {
    const matchesSearch = recommendation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recommendation.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || recommendation.type === selectedType;
    const matchesStatus = !selectedStatus || recommendation.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة التوصيات</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>إضافة توصية جديدة</span>
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في التوصيات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border rounded-lg"
          />
        </div>
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-gray-700"
          >
            <option value="">نوع التوصية</option>
            <option value="تطوير شخصي">تطوير شخصي</option>
            <option value="تدريب مهني">تدريب مهني</option>
            <option value="تطوير أكاديمي">تطوير أكاديمي</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-gray-700"
          >
            <option value="">الحالة</option>
            <option value="pending">قيد الانتظار</option>
            <option value="in-progress">قيد التنفيذ</option>
            <option value="completed">مكتمل</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredRecommendations.map((recommendation) => (
          <div key={recommendation.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{recommendation.title}</h3>
                  <p className="text-gray-600">{recommendation.description}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(recommendation.status)}`}>
                {getStatusText(recommendation.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">نوع التوصية</span>
                <p className="font-medium">{recommendation.type}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">التاريخ</span>
                <p className="font-medium">{recommendation.date}</p>
              </div>
              {recommendation.testName && (
                <div>
                  <span className="text-sm text-gray-500">الاختبار المرتبط</span>
                  <button
                    onClick={() => handleViewTest(recommendation.testId)}
                    className="block font-medium text-blue-600 hover:text-blue-800"
                  >
                    {recommendation.testName}
                  </button>
                </div>
              )}
              {recommendation.studentName && (
                <div>
                  <span className="text-sm text-gray-500">التلميذ</span>
                  <button
                    onClick={() => handleViewStudent(recommendation.studentName)}
                    className="block font-medium text-blue-600 hover:text-blue-800"
                  >
                    {recommendation.studentName}
                  </button>
                </div>
              )}
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">الأهداف</h4>
              <ul className="space-y-1">
                {recommendation.objectives.map((objective, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-green-600" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedRecommendation(recommendation);
                  setIsViewModalOpen(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setSelectedRecommendation(recommendation);
                  setIsEditModalOpen(true);
                }}
                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setSelectedRecommendation(recommendation);
                  setIsDeleteModalOpen(true);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="تفاصيل التوصية"
      >
        {selectedRecommendation && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">العنوان</h3>
              <p>{selectedRecommendation.title}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">الوصف</h3>
              <p>{selectedRecommendation.description}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">الأهداف</h3>
              <ul className="space-y-2">
                {selectedRecommendation.objectives.map((objective, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="تعديل التوصية"
      >
        {selectedRecommendation && (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العنوان
              </label>
              <input
                type="text"
                defaultValue={selectedRecommendation.title}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف
              </label>
              <textarea
                defaultValue={selectedRecommendation.description}
                className="w-full p-2 border rounded-lg h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                النوع
              </label>
              <select
                defaultValue={selectedRecommendation.type}
                className="w-full p-2 border rounded-lg"
              >
                <option value="تطوير شخصي">تطوير شخصي</option>
                <option value="تدريب مهني">تدريب مهني</option>
                <option value="تطوير أكاديمي">تطوير أكاديمي</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحالة
              </label>
              <select
                defaultValue={selectedRecommendation.status}
                className="w-full p-2 border rounded-lg"
              >
                <option value="pending">قيد الانتظار</option>
                <option value="in-progress">قيد التنفيذ</option>
                <option value="completed">مكتمل</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الأهداف
              </label>
              <div className="space-y-2">
                {selectedRecommendation.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={objective}
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="w-full p-2 border border-dashed rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  إضافة هدف جديد
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3">
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

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="حذف التوصية"
      >
        {selectedRecommendation && (
          <div className="space-y-4">
            <p className="text-lg">
              هل أنت متأكد من حذف التوصية "{selectedRecommendation.title}"؟
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  // Handle delete logic here
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}