import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Brain, Target, RefreshCw } from 'lucide-react';

export function TestResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, testName, timeSpent } = location.state || {};

  const formatTimeSpent = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} دقيقة و ${remainingSeconds} ثانية`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    if (score >= 40) return 'بحاجة إلى تحسين';
    return 'ضعيف';
  };

  const recommendations = [
    'تطوير المهارات التقنية في مجال البرمجة',
    'حضور ورش عمل في مجال التصميم',
    'التركيز على تعلم لغات البرمجة الحديثة',
    'المشاركة في مشاريع عملية'
  ];

  const objectives = [
    'إتقان لغة برمجة واحدة على الأقل',
    'بناء محفظة أعمال شخصية',
    'التعرف على أساسيات تطوير الويب',
    'تطوير مهارات حل المشكلات'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            <span>عودة</span>
          </button>
          <h1 className="text-2xl font-bold">نتائج الاختبار</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Score Card */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                <Award className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">{testName}</h2>
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                {Math.round(score)}%
              </div>
              <p className="text-gray-600">
                {getScoreText(score)}
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">الوقت المستغرق</p>
                <p className="font-medium">{formatTimeSpent(timeSpent)}</p>
              </div>
              <button
                onClick={() => navigate('/psych-tests')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>إعادة الاختبار</span>
              </button>
            </div>
          </div>

          {/* Recommendations and Objectives */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold">التوصيات</h2>
              </div>
              <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold">الأهداف المقترحة</h2>
              </div>
              <ul className="space-y-3">
                {objectives.map((obj, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}