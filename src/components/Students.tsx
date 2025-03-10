import React, { useState } from 'react';
import { Plus, Search, Download, ChevronDown, Eye, Edit2, Trash2, X, Brain, Group as UserGroup } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const groups = [
  {
    name: 'الفوج 1',
    supervisor: 'محمد أحمد',
    schedule: 'الأحد - الخميس',
    students: 25,
    color: 'blue'
  },
  {
    name: 'الفوج 2',
    supervisor: 'أحمد محمود',
    schedule: 'السبت - الأربعاء',
    students: 22,
    color: 'purple'
  },
  {
    name: 'الفوج 3',
    supervisor: 'سارة خالد',
    schedule: 'الأحد - الخميس',
    students: 20,
    color: 'green'
  },
  {
    name: 'الفوج 4',
    supervisor: 'فاطمة علي',
    schedule: 'السبت - الأربعاء',
    students: 23,
    color: 'rose'
  },
  {
    name: 'الفوج 5',
    supervisor: 'عمر حسن',
    schedule: 'الأحد - الخميس',
    students: 21,
    color: 'orange'
  }
];

type PsychTest = {
  id: number;
  name: string;
  date: string;
  score: number;
  status: string;
};

type Student = {
  id: number;
  name: string;
  registrationNumber: string;
  level: string;
  group: string;
  registrationDate: string;
  psychTests: PsychTest[];
  status: string;
};

const MOCK_STUDENTS: Student[] = [
  {
    id: 1,
    name: 'أحمد محمد',
    registrationNumber: 'STD2024001',
    level: 'السنة الأولى',
    group: 'الفوج 1',
    registrationDate: '2024/03/15',
    psychTests: [
      { id: 1, name: 'اختبار الذكاء العاطفي', date: '2024/03/16', score: 85, status: 'مكتمل' },
      { id: 2, name: 'اختبار الميول المهنية', date: '2024/03/17', score: 92, status: 'مكتمل' },
      { id: 3, name: 'اختبار القدرات العقلية', date: '2024/03/18', score: 78, status: 'مكتمل' }
    ],
    status: 'نشط'
  },
  {
    id: 2,
    name: 'فاطمة علي',
    registrationNumber: 'STD2024002',
    level: 'السنة الثانية',
    group: 'الفوج 2',
    registrationDate: '2024/03/15',
    psychTests: [
      { id: 1, name: 'اختبار الذكاء العاطفي', date: '2024/03/16', score: 90, status: 'مكتمل' },
      { id: 2, name: 'اختبار الميول المهنية', date: '2024/03/17', score: 88, status: 'مكتمل' },
      { id: 3, name: 'اختبار القدرات العقلية', date: '2024/03/18', score: 95, status: 'مكتمل' },
      { id: 4, name: 'اختبار الشخصية', date: '2024/03/19', score: 87, status: 'مكتمل' }
    ],
    status: 'نشط'
  },
  {
    id: 3,
    name: 'يوسف أحمد',
    registrationNumber: 'STD2024003',
    level: 'السنة الثالثة',
    group: 'الفوج 3',
    registrationDate: '2024/03/15',
    psychTests: [
      { id: 1, name: 'اختبار الذكاء العاطفي', date: '2024/03/16', score: 82, status: 'مكتمل' },
      { id: 2, name: 'اختبار الميول المهنية', date: '2024/03/17', score: 85, status: 'مكتمل' }
    ],
    status: 'نشط'
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

export function Students() {
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [selectedGroupe, setSelectedGroupe] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPsychTestsModalOpen, setIsPsychTestsModalOpen] = useState(false);

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleViewPsychTests = (student: Student) => {
    setSelectedStudent(student);
    setIsPsychTestsModalOpen(true);
  };

  const handleDownloadStudents = () => {
    // Implementation for downloading students list
    console.log('Downloading students list...');
  };

  const handleDownloadGroups = () => {
    // Implementation for downloading groups list
    console.log('Downloading groups list...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الثلاميذ</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadStudents}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>تحميل قائمة الثلاميذ</span>
          </button>
          <button 
            onClick={handleDownloadGroups}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <UserGroup className="w-5 h-5" />
            <span>تحميل قائمة الأفواج</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>إضافة تلميذ جديد</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن تلميذ..."
            className="w-full pl-4 pr-10 py-2 border rounded-lg"
          />
        </div>
        <div className="relative">
          <select
            value={selectedNiveau}
            onChange={(e) => setSelectedNiveau(e.target.value)}
            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">المستوى</option>
            {['السنة الأولى', 'السنة الثانية', 'السنة الثالثة'].map((niveau) => (
              <option key={niveau} value={niveau}>{niveau}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={selectedGroupe}
            onChange={(e) => setSelectedGroupe(e.target.value)}
            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">الفوج</option>
            {['الفوج 1', 'الفوج 2', 'الفوج 3', 'الفوج 4', 'الفوج 5'].map((groupe) => (
              <option key={groupe} value={groupe}>{groupe}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الاسم</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">رقم التسجيل</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المستوى</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الفوج</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">تاريخ التسجيل</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الاختبارات النفسية</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {MOCK_STUDENTS.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.registrationNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.level}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.group}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.registrationDate}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleViewPsychTests(student)}
                    className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200"
                  >
                    {student.psychTests.length}/5
                  </button>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleView(student)}
                      className="text-blue-600 hover:text-blue-800"
                      title="عرض"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="تعديل"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(student)}
                      className="text-red-600 hover:text-red-800"
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="تفاصيل التلميذ"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">الاسم</label>
                <p className="mt-1 text-lg">{selectedStudent.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">رقم التسجيل</label>
                <p className="mt-1 text-lg">{selectedStudent.registrationNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">المستوى</label>
                <p className="mt-1 text-lg">{selectedStudent.level}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الفوج</label>
                <p className="mt-1 text-lg">{selectedStudent.group}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ التسجيل</label>
                <p className="mt-1 text-lg">{selectedStudent.registrationDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">عدد الاختبارات النفسية</label>
                <p className="mt-1 text-lg">{selectedStudent.psychTests.length}/5</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="تعديل بيانات التلميذ"
      >
        {selectedStudent && (
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">الاسم</label>
                <input
                  type="text"
                  defaultValue={selectedStudent.name}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">المستوى</label>
                <select
                  defaultValue={selectedStudent.level}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {['السنة الأولى', 'السنة الثانية', 'السنة الثالثة'].map((niveau) => (
                    <option key={niveau} value={niveau}>{niveau}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الفوج</label>
                <select
                  defaultValue={selectedStudent.group}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {['الفوج 1', 'الفوج 2', 'الفوج 3', 'الفوج 4', 'الفوج 5'].map((groupe) => (
                    <option key={groupe} value={groupe}>{groupe}</option>
                  ))}
                </select>
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

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="حذف التلميذ"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <p className="text-lg">
              هل أنت متأكد من حذف التلميذ {selectedStudent.name}؟
            </p>
            <div className="flex justify-end gap-3 mt-6">
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

      {/* Psychological Tests Modal */}
      <Modal
        isOpen={isPsychTestsModalOpen}
        onClose={() => setIsPsychTestsModalOpen(false)}
        title={`الاختبارات النفسية - ${selectedStudent?.name}`}
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">اسم الاختبار</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">التاريخ</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">النتيجة</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {selectedStudent.psychTests.map((test) => (
                    <tr key={test.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{test.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{test.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{test.score}%</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {test.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex justify-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-800">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsPsychTestsModalOpen(false)}
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