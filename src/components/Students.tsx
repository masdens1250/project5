import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Download, ChevronDown, Eye, Edit2, Trash2, X, Brain, Group as UserGroup, RefreshCw } from 'lucide-react';

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'ذكر' | 'أنثى';
  level: string;
  group: string;
  isRepeating: boolean;
  psychTests: {
    total: number;
    completed: number;
  };
  status: string;
};

type Group = {
  id: number;
  name: string;
  level: string;
  studentsCount: number;
};

const MOCK_STUDENTS: Student[] = [
  {
    id: 1,
    firstName: 'أحمد',
    lastName: 'محمد',
    birthDate: '2005/03/15',
    gender: 'ذكر',
    level: 'السنة الأولى',
    group: 'الفوج 1',
    isRepeating: false,
    psychTests: {
      total: 5,
      completed: 3
    },
    status: 'نشط'
  },
  {
    id: 2,
    firstName: 'فاطمة',
    lastName: 'علي',
    birthDate: '2005/06/22',
    gender: 'أنثى',
    level: 'السنة الثانية',
    group: 'الفوج 2',
    isRepeating: true,
    psychTests: {
      total: 5,
      completed: 4
    },
    status: 'نشط'
  },
  {
    id: 3,
    firstName: 'يوسف',
    lastName: 'أحمد',
    birthDate: '2005/09/10',
    gender: 'ذكر',
    level: 'السنة الثالثة',
    group: 'الفوج 3',
    isRepeating: false,
    psychTests: {
      total: 5,
      completed: 5
    },
    status: 'نشط'
  }
];

const MOCK_GROUPS: Group[] = [
  { id: 1, name: 'الفوج 1', level: 'السنة الأولى', studentsCount: 25 },
  { id: 2, name: 'الفوج 2', level: 'السنة الثانية', studentsCount: 22 },
  { id: 3, name: 'الفوج 3', level: 'السنة الثالثة', studentsCount: 20 }
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
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedRepeating, setSelectedRepeating] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [groups, setGroups] = useState(MOCK_GROUPS);

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

  const handleFetchStudents = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStudents(MOCK_STUDENTS);
      alert('تم جلب قائمة الثلاميذ بنجاح');
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('حدث خطأ أثناء جلب قائمة الثلاميذ');
    }
  };

  const handleDownloadStudents = () => {
    // Add UTF-8 BOM
    const BOM = '\uFEFF';
    
    // Create CSV headers and content with proper formatting
    const headers = ['الاسم', 'اللقب', 'تاريخ الازدياد', 'الجنس', 'المستوى', 'الفوج', 'معيد'];
    const csvContent = [
      headers.join('\t'),
      ...students.map(student => 
        [
          student.firstName,
          student.lastName,
          student.birthDate,
          student.gender,
          student.level,
          student.group,
          student.isRepeating ? 'نعم' : 'لا'
        ].join('\t')
      )
    ].join('\n');

    // Create and download file with BOM
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'قائمة_الثلاميذ.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddNewStudent = (formData: FormData) => {
    const newStudent: Student = {
      id: students.length + 1,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      birthDate: formData.get('birthDate') as string,
      gender: formData.get('gender') as 'ذكر' | 'أنثى',
      level: formData.get('level') as string,
      group: formData.get('group') as string,
      isRepeating: formData.get('isRepeating') === 'نعم',
      psychTests: { total: 0, completed: 0 },
      status: 'نشط'
    };
    setStudents([...students, newStudent]);
    setIsNewStudentModalOpen(false);
  };

  // Filter students based on all criteria
  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.firstName + ' ' + student.lastName)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel || student.level === selectedLevel;
    const matchesGroup = !selectedGroup || student.group === selectedGroup;
    const matchesRepeating = !selectedRepeating || 
      (selectedRepeating === 'نعم' ? student.isRepeating : !student.isRepeating);

    return matchesSearch && matchesLevel && matchesGroup && matchesRepeating;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الثلاميذ</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsNewStudentModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة تلميذ جديد</span>
          </button>
          <button
            onClick={handleFetchStudents}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>جلب قائمة الثلاميذ</span>
          </button>
          <button
            onClick={handleDownloadStudents}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>تحميل قائمة الثلاميذ</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن تلميذ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border rounded-lg"
          />
        </div>
        <div className="relative">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-gray-700"
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
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-gray-700"
          >
            <option value="">الفوج</option>
            {groups.map((group) => (
              <option key={group.id} value={group.name}>{group.name}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={selectedRepeating}
            onChange={(e) => setSelectedRepeating(e.target.value)}
            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-gray-700"
          >
            <option value="">معيد</option>
            <option value="نعم">نعم</option>
            <option value="لا">لا</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الاسم</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">اللقب</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">تاريخ الازدياد</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الجنس</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المستوى</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الفوج</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">معيد</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الاختبارات النفسية</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{student.firstName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{student.lastName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.birthDate}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.gender}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.level}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.group}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    student.isRepeating 
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {student.isRepeating ? 'نعم' : 'لا'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {student.psychTests.completed}/{student.psychTests.total}
                  </span>
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
                <p className="mt-1 text-lg">{selectedStudent.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">اللقب</label>
                <p className="mt-1 text-lg">{selectedStudent.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ الازدياد</label>
                <p className="mt-1 text-lg">{selectedStudent.birthDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الجنس</label>
                <p className="mt-1 text-lg">{selectedStudent.gender}</p>
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
                <label className="block text-sm font-medium text-gray-700">معيد</label>
                <p className="mt-1 text-lg">{selectedStudent.isRepeating ? 'نعم' : 'لا'}</p>
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
                  defaultValue={selectedStudent.firstName}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">اللقب</label>
                <input
                  type="text"
                  defaultValue={selectedStudent.lastName}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ الازدياد</label>
                <input
                  type="date"
                  defaultValue={selectedStudent.birthDate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الجنس</label>
                <select
                  defaultValue={selectedStudent.gender}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
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
                  {groups.map((group) => (
                    <option key={group.id} value={group.name}>{group.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">معيد</label>
                <select
                  defaultValue={selectedStudent.isRepeating ? 'نعم' : 'لا'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
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
              هل أنت متأكد من حذف التلميذ {selectedStudent.firstName} {selectedStudent.lastName}؟
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
                  setStudents(students.filter(s => s.id !== selectedStudent.id));
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

      {/* New Student Modal */}
      <Modal
        isOpen={isNewStudentModalOpen}
        onClose={() => setIsNewStudentModalOpen(false)}
        title="إضافة تلميذ جديد"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddNewStudent(new FormData(e.currentTarget));
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">الاسم</label>
              <input
                name="firstName"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">اللقب</label>
              <input
                name="lastName"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">تاريخ الازدياد</label>
              <input
                name="birthDate"
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">الجنس</label>
              <select
                name="gender"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">المستوى</label>
              <select
                name="level"
                required
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
                name="group"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.name}>{group.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">معيد</label>
              <select
                name="isRepeating"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="نعم">نعم</option>
                <option value="لا">لا</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewStudentModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              إضافة
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}