import React, { useState } from 'react';
import { Plus, ClipboardList, Eye, Edit2, Trash2, X, Save, Search, ChevronDown } from 'lucide-react';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer?: number;
};

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

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 flex flex-col max-h-[90vh]">
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

const INITIAL_QUESTIONS = Array(25).fill(null).map((_, index) => ({
  id: index + 1,
  text: '',
  options: ['', '', '', ''],
  correctAnswer: undefined
}));

const LEVELS = ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة'];
const GROUPS = ['الفوج 1', 'الفوج 2', 'الفوج 3', 'الفوج 4', 'الفوج 5'];
const TEST_TYPES = ['فردي', 'جماعي'] as const;

export function PsychTests() {
  const [tests, setTests] = useState<Test[]>([
    {
      id: 1,
      title: 'اختبار الذكاء العاطفي',
      description: 'تقييم القدرة على فهم وإدارة العواطف',
      duration: '30 دقيقة',
      color: 'rose',
      questions: INITIAL_QUESTIONS,
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
      questions: INITIAL_QUESTIONS,
      totalQuestions: 25,
      level: 'السنة الثانية',
      group: 'الفوج 2',
      type: 'جماعي'
    }
  ]);

  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);
  const [editedTest, setEditedTest] = useState<Test | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedType, setSelectedType] = useState<'فردي' | 'جماعي' | ''>('');

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel || test.level === selectedLevel;
    const matchesGroup = !selectedGroup || test.group === selectedGroup;
    const matchesType = !selectedType || test.type === selectedType;

    return matchesSearch && matchesLevel && matchesGroup && matchesType;
  });

  const getColorClasses = (color: string) => {
    const colors = {
      rose: {
        bg: 'bg-rose-100',
        text: 'text-rose-600',
        button: 'bg-rose-600 hover:bg-rose-700',
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
      },
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
      },
      orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700',
      },
      indigo: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-600',
        button: 'bg-indigo-600 hover:bg-indigo-700',
      },
    };
    return colors[color as keyof typeof colors];
  };

  const handleView = (test: Test) => {
    setSelectedTest(test);
    setIsViewModalOpen(true);
  };

  const handleEdit = (test: Test) => {
    setSelectedTest(test);
    setEditedTest({
      ...test,
      questions: test.questions.length === 25 ? test.questions : INITIAL_QUESTIONS
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (testId: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
      setTests(tests.filter(test => test.id !== testId));
    }
  };

  const handleQuestionChange = (questionId: number, field: keyof Question, value: string | string[]) => {
    if (!editedTest) return;

    setEditedTest({
      ...editedTest,
      questions: editedTest.questions.map(q =>
        q.id === questionId
          ? { ...q, [field]: value }
          : q
      )
    });
  };

  const handleOptionChange = (questionId: number, optionIndex: number, value: string) => {
    if (!editedTest) return;

    setEditedTest({
      ...editedTest,
      questions: editedTest.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
            }
          : q
      )
    });
  };

  const handleCorrectAnswerChange = (questionId: number, value: number) => {
    if (!editedTest) return;

    setEditedTest({
      ...editedTest,
      questions: editedTest.questions.map(q =>
        q.id === questionId
          ? { ...q, correctAnswer: value }
          : q
      )
    });
  };

  const handleSaveTest = () => {
    if (!editedTest) return;

    setTests(tests.map(test =>
      test.id === editedTest.id ? editedTest : test
    ));
    setIsEditModalOpen(false);
    setEditedTest(null);
  };

  const handleAddNewTest = (newTest: Omit<Test, 'id' | 'questions' | 'totalQuestions'>) => {
    const test = {
      ...newTest,
      id: Math.max(...tests.map(t => t.id), 0) + 1,
      questions: INITIAL_QUESTIONS,
      totalQuestions: 25
    };
    setTests([test, ...tests]);
    setIsNewTestModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الاختبارات النفسية</h1>
        <button 
          onClick={() => setIsNewTestModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة اختبار جديد</span>
        </button>
      </div>

      {/* Filters */}
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
            {LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
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
            {GROUPS.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
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
            {TEST_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => {
          const colorClasses = getColorClasses(test.color);
          return (
            <div key={test.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-2 ${colorClasses.bg} rounded-lg`}>
                  <ClipboardList className={`w-6 h-6 ${colorClasses.text}`} />
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
                    <span className="text-sm text-gray-500">{test.duration}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(test)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Eye className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEdit(test)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Edit2 className="w-5 h-5 text-gray-600 hover:text-yellow-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
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
        title={selectedTest?.title || ''}
      >
        {selectedTest && (
          <div className="space-y-6">
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
            <div>
              <h3 className="font-medium text-gray-700 mb-2">الأسئلة ({selectedTest.totalQuestions} سؤال)</h3>
              <div className="space-y-4">
                {selectedTest.questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">
                      {index + 1}. {question.text || 'لم يتم تعيين السؤال بعد'}
                    </p>
                    {question.text && (
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              id={`option-${question.id}-${optionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              readOnly
                              className="text-blue-600"
                            />
                            <label htmlFor={`option-${question.id}-${optionIndex}`}>
                              {option || 'لم يتم تعيين الخيار بعد'}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
        {editedTest && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عنوان الاختبار
                </label>
                <input
                  type="text"
                  value={editedTest.title}
                  onChange={(e) => setEditedTest({ ...editedTest, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المدة
                </label>
                <input
                  type="text"
                  value={editedTest.duration}
                  onChange={(e) => setEditedTest({ ...editedTest, duration: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المستوى
                </label>
                <select
                  value={editedTest.level}
                  onChange={(e) => setEditedTest({ ...editedTest, level: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الفوج
                </label>
                <select
                  value={editedTest.group}
                  onChange={(e) => setEditedTest({ ...editedTest, group: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {GROUPS.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع الاختبار
                </label>
                <select
                  value={editedTest.type}
                  onChange={(e) => setEditedTest({ ...editedTest, type: e.target.value as 'فردي' | 'جماعي' })}
                  className="w-full p-2 border rounded-lg"
                >
                  {TEST_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف
              </label>
              <textarea
                value={editedTest.description}
                onChange={(e) => setEditedTest({ ...editedTest, description: e.target.value })}
                className="w-full p-2 border rounded-lg h-24"
              />
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">الأسئلة ({editedTest.totalQuestions} سؤال)</h3>
              <div className="space-y-6">
                {editedTest.questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        السؤال {index + 1}
                      </label>
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                        placeholder="أدخل نص السؤال"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => handleCorrectAnswerChange(question.id, optionIndex)}
                            className="text-blue-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                            placeholder={`الخيار ${optionIndex + 1}`}
                            className="flex-1 p-2 border rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white pt-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveTest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Test Modal */}
      <Modal
        isOpen={isNewTestModalOpen}
        onClose={() => setIsNewTestModalOpen(false)}
        title="إضافة اختبار جديد"
      >
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddNewTest({
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              duration: formData.get('duration') as string,
              color: 'blue',
              level: formData.get('level') as string,
              group: formData.get('group') as string,
              type: formData.get('type') as 'فردي' | 'جماعي'
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان الاختبار
            </label>
            <input
              name="title"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المستوى
              </label>
              <select
                name="level"
                className="w-full p-2 border rounded-lg"
                required
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الفوج
              </label>
              <select
                name="group"
                className="w-full p-2 border rounded-lg"
                required
              >
                {GROUPS.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نوع الاختبار
              </label>
              <select
                name="type"
                className="w-full p-2 border rounded-lg"
                required
              >
                {TEST_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف
            </label>
            <textarea
              name="description"
              className="w-full p-2 border rounded-lg h-32"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المدة
            </label>
            <input
              name="duration"
              placeholder="مثال: 30 دقيقة"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewTestModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              إضافة الاختبار
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}