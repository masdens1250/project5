import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Timer, AlertCircle, CheckCircle2, XCircle, Plus, Edit2, Trash2, Pause, Play } from 'lucide-react';

type Question = {
  id: number;
  text: string;
  options: string[];
  answer?: number;
};

type TestState = {
  currentQuestionIndex: number;
  answers: Record<number, number>;
  timeRemaining: number;
  isComplete: boolean;
  isPaused: boolean;
};

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'ما هو المجال المهني الذي تفضله؟',
    options: [
      'العمل التقني والهندسي',
      'المجال الطبي والصحي',
      'التعليم والتدريس',
      'الأعمال والإدارة'
    ]
  },
  {
    id: 2,
    text: 'كيف تفضل قضاء وقت فراغك؟',
    options: [
      'القراءة والبحث',
      'العمل اليدوي والحرف',
      'التواصل مع الآخرين',
      'حل المشكلات والألغاز'
    ]
  },
  {
    id: 3,
    text: 'ما هو نمط العمل الذي تفضله؟',
    options: [
      'العمل الفردي المستقل',
      'العمل ضمن فريق',
      'العمل مع الجمهور',
      'العمل في المكتب'
    ]
  },
  {
    id: 4,
    text: 'ما هي المهارات التي تتميز بها؟',
    options: [
      'التحليل والتفكير المنطقي',
      'الإبداع والابتكار',
      'التواصل والتعامل مع الآخرين',
      'التنظيم وإدارة الوقت'
    ]
  },
  {
    id: 5,
    text: 'ما هو المجال الدراسي الذي تميل إليه؟',
    options: [
      'العلوم والرياضيات',
      'الآداب واللغات',
      'العلوم الاجتماعية',
      'الفنون والتصميم'
    ]
  },
  {
    id: 6,
    text: 'كيف تتعامل مع المواقف الصعبة؟',
    options: [
      'أحلل الموقف وأضع خطة',
      'أطلب المساعدة من الآخرين',
      'أعتمد على حدسي',
      'أبحث عن حلول إبداعية'
    ]
  },
  {
    id: 7,
    text: 'ما هي البيئة المفضلة لديك للعمل؟',
    options: [
      'بيئة هادئة ومنظمة',
      'بيئة نشطة وديناميكية',
      'بيئة إبداعية وملهمة',
      'بيئة تقليدية ومستقرة'
    ]
  },
  {
    id: 8,
    text: 'كيف تفضل التعلم؟',
    options: [
      'من خلال القراءة والدراسة',
      'من خلال التجربة العملية',
      'من خلال المناقشة والحوار',
      'من خلال المشاهدة والملاحظة'
    ]
  },
  {
    id: 9,
    text: 'ما هي أهم قيمة في العمل بالنسبة لك؟',
    options: [
      'الإنجاز والتقدم',
      'الاستقرار والأمان',
      'الإبداع والابتكار',
      'التأثير الاجتماعي'
    ]
  },
  {
    id: 10,
    text: 'كيف تتخذ قراراتك المهمة؟',
    options: [
      'بناءً على التحليل المنطقي',
      'بناءً على المشاعر والحدس',
      'بعد استشارة الآخرين',
      'بناءً على التجارب السابقة'
    ]
  },
  {
    id: 11,
    text: 'ما هو نوع المشاريع التي تفضل العمل عليها؟',
    options: [
      'مشاريع تقنية وتطويرية',
      'مشاريع إبداعية وفنية',
      'مشاريع اجتماعية وإنسانية',
      'مشاريع تنظيمية وإدارية'
    ]
  },
  {
    id: 12,
    text: 'كيف تتعامل مع الضغط والتوتر؟',
    options: [
      'أركز على حل المشكلة',
      'أطلب الدعم من الآخرين',
      'أمارس هواية أو نشاط ترفيهي',
      'أخذ وقت للتأمل والراحة'
    ]
  },
  {
    id: 13,
    text: 'ما هي مهاراتك في التواصل؟',
    options: [
      'جيد في الكتابة والتعبير',
      'جيد في الحديث والإقناع',
      'جيد في الاستماع والفهم',
      'جيد في التواصل غير اللفظي'
    ]
  },
  {
    id: 14,
    text: 'كيف ترى نفسك بعد 5 سنوات؟',
    options: [
      'في منصب قيادي',
      'خبير في مجال معين',
      'صاحب مشروع خاص',
      'باحث أو أكاديمي'
    ]
  },
  {
    id: 15,
    text: 'ما هي أهم مهارة تريد تطويرها؟',
    options: [
      'المهارات التقنية',
      'مهارات القيادة',
      'مهارات التواصل',
      'مهارات التفكير النقدي'
    ]
  },
  {
    id: 16,
    text: 'كيف تفضل العمل مع الآخرين؟',
    options: [
      'كقائد للفريق',
      'كعضو في الفريق',
      'بشكل مستقل',
      'كمستشار أو موجه'
    ]
  },
  {
    id: 17,
    text: 'ما هو نوع التحديات التي تجذبك؟',
    options: [
      'التحديات التقنية',
      'التحديات الإبداعية',
      'التحديات الاجتماعية',
      'التحديات التنظيمية'
    ]
  },
  {
    id: 18,
    text: 'كيف تتعامل مع التغيير؟',
    options: [
      'أتكيف بسرعة',
      'أحتاج لوقت للتأقلم',
      'أقاوم التغيير',
      'أقود التغيير'
    ]
  },
  {
    id: 19,
    text: 'ما هي أهم صفة شخصية لديك؟',
    options: [
      'الدقة والتنظيم',
      'الإبداع والابتكار',
      'التعاطف والفهم',
      'الطموح والمثابرة'
    ]
  },
  {
    id: 20,
    text: 'كيف تفضل تلقي التغذية الراجعة؟',
    options: [
      'بشكل مباشر وصريح',
      'بشكل لطيف ودبلوماسي',
      'من خلال التقييم الكتابي',
      'من خلال المناقشة المفتوحة'
    ]
  },
  {
    id: 21,
    text: 'ما هو نوع البيئة التعليمية المفضلة لديك؟',
    options: [
      'التعلم الذاتي',
      'التعلم في مجموعات',
      'التعلم مع مدرب',
      'التعلم عبر الإنترنت'
    ]
  },
  {
    id: 22,
    text: 'كيف تتعامل مع المواعيد النهائية؟',
    options: [
      'أنجز العمل مبكراً',
      'أعمل تحت الضغط',
      'أطلب المساعدة عند الحاجة',
      'أنظم وقتي بدقة'
    ]
  },
  {
    id: 23,
    text: 'ما هو نوع المسؤولية التي تفضلها؟',
    options: [
      'قيادة المشاريع',
      'تنفيذ المهام',
      'حل المشكلات',
      'تدريب الآخرين'
    ]
  },
  {
    id: 24,
    text: 'كيف تفضل عرض أفكارك؟',
    options: [
      'من خلال العروض التقديمية',
      'من خلال الكتابة',
      'من خلال النقاش',
      'من خلال النماذج العملية'
    ]
  },
  {
    id: 25,
    text: 'ما هي أهدافك المهنية الرئيسية؟',
    options: [
      'تحقيق الاستقرار المالي',
      'التأثير في المجتمع',
      'التطور المهني المستمر',
      'تحقيق التوازن بين العمل والحياة'
    ]
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
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export function TestInterface() {
  const navigate = useNavigate();
  const location = useLocation();
  const test = location.state?.test;
  
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [testState, setTestState] = useState<TestState>({
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 30 * 60, // 30 minutes in seconds
    isComplete: false,
    isPaused: false
  });

  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', '']
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!testState.isPaused && !testState.isComplete && testState.timeRemaining > 0) {
      timer = setInterval(() => {
        setTestState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [testState.isPaused, testState.isComplete]);

  useEffect(() => {
    if (testState.timeRemaining <= 0 && !testState.isComplete) {
      handleTestComplete();
    }
  }, [testState.timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setTestState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answerIndex }
    }));
  };

  const handleNext = () => {
    if (testState.currentQuestionIndex < questions.length - 1) {
      setTestState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handlePrevious = () => {
    if (testState.currentQuestionIndex > 0) {
      setTestState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const handleTestComplete = () => {
    setTestState(prev => ({ ...prev, isComplete: true }));
    const score = calculateScore();
    navigate('/test-results', { 
      state: { 
        score,
        testName: test?.title,
        answers: testState.answers,
        timeSpent: 1800 - testState.timeRemaining
      }
    });
  };

  const calculateScore = () => {
    return Object.keys(testState.answers).length / questions.length * 100;
  };

  const toggleTimer = () => {
    setTestState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleAddQuestion = () => {
    if (newQuestion.text && newQuestion.options.every(option => option)) {
      const newQuestionObj: Question = {
        id: questions.length + 1,
        text: newQuestion.text,
        options: newQuestion.options
      };
      setQuestions([...questions, newQuestionObj]);
      setNewQuestion({ text: '', options: ['', '', '', ''] });
      setIsAddQuestionModalOpen(false);
    }
  };

  const handleEditQuestion = () => {
    if (selectedQuestion && selectedQuestion.text && selectedQuestion.options.every(option => option)) {
      setQuestions(questions.map(q => 
        q.id === selectedQuestion.id ? selectedQuestion : q
      ));
      setIsEditQuestionModalOpen(false);
      setSelectedQuestion(null);
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const currentQuestion = questions[testState.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            <span>عودة</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                testState.isPaused ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {testState.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              <span>{testState.isPaused ? 'استئناف' : 'إيقاف مؤقت'}</span>
            </button>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{formatTime(testState.timeRemaining)}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="font-medium">السؤال {testState.currentQuestionIndex + 1} من {questions.length}</span>
            </div>
          </div>
        </div>

        {/* Question Management */}
        <div className="mb-6 flex justify-end gap-4">
          <button
            onClick={() => setIsAddQuestionModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة سؤال</span>
          </button>
          <button
            onClick={() => {
              setSelectedQuestion(currentQuestion);
              setIsEditQuestionModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            <Edit2 className="w-5 h-5" />
            <span>تعديل السؤال</span>
          </button>
          <button
            onClick={() => handleDeleteQuestion(currentQuestion.id)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-5 h-5" />
            <span>حذف السؤال</span>
          </button>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold mb-6">{currentQuestion.text}</h2>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestion.id, index)}
                className={`w-full text-right p-4 rounded-lg border-2 transition-all ${
                  testState.answers[currentQuestion.id] === index
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={testState.currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg ${
              testState.currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            السابق
          </button>
          {testState.currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleTestComplete}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              إنهاء الاختبار
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              التالي
            </button>
          )}
        </div>

        {/* Add Question Modal */}
        <Modal
          isOpen={isAddQuestionModalOpen}
          onClose={() => setIsAddQuestionModalOpen(false)}
          title="إضافة سؤال جديد"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نص السؤال</label>
              <input
                type="text"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">الخيارات</label>
              {newQuestion.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.options];
                    newOptions[index] = e.target.value;
                    setNewQuestion({ ...newQuestion, options: newOptions });
                  }}
                  placeholder={`الخيار ${index + 1}`}
                  className="w-full p-2 border rounded-lg"
                />
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddQuestionModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إضافة
              </button>
            </div>
          </div>
        </Modal>

        {/* Edit Question Modal */}
        <Modal
          isOpen={isEditQuestionModalOpen}
          onClose={() => setIsEditQuestionModalOpen(false)}
          title="تعديل السؤال"
        >
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نص السؤال</label>
                <input
                  type="text"
                  value={selectedQuestion.text}
                  onChange={(e) => setSelectedQuestion({ ...selectedQuestion, text: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">الخيارات</label>
                {selectedQuestion.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...selectedQuestion.options];
                      newOptions[index] = e.target.value;
                      setSelectedQuestion({ ...selectedQuestion, options: newOptions });
                    }}
                    placeholder={`الخيار ${index + 1}`}
                    className="w-full p-2 border rounded-lg"
                  />
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditQuestionModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleEditQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}