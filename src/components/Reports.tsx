import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Trash2, Plus, Eye, Edit2, X, ChevronDown, Save, Play, Timer, Award, Eye as EyeIcon, FileInput, Filter, Search, Calendar, RefreshCw, ArrowUpDown, CheckCircle2, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type Report = {
  id: number;
  title: string;
  date: string;
  type: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  school: string;
  counselor: string;
  academicYear: string;
  level: string;
  groupCount: number;
  studentCount: number;
  subject: string;
  coverage: {
    groups: string[];
    counts: number[];
    dates: string[];
    percentage: number;
    objectives: string[];
  };
  notes: string;
  lastModified: string;
  author: string;
  tags: string[];
};

const PREDEFINED_DATA = {
  schools: ['متوسطة الأمل', 'متوسطة النور', 'متوسطة السلام'],
  counselor: 'محمد أحمد',
  academicYears: ['2024/2025', '2025/2026'],
  levels: ['السنة الاولى متوسط', 'السنة الثانية متوسط', 'السنة الثالثة متوسط', 'السنة الرابعة متوسط'],
  subjects: [
    'تحقيق كفاءة الاندماج و التكيف مع الوسط المدرسي الجديد',
    'تطوير المهارات الدراسية والتنظيمية',
    'التوجيه المهني والأكاديمي'
  ],
  objectives: [
    [
      'تعريف التلميذ ب:',
      '- المحيط المدرسي الجديد و مساعدته على التكيف معه',
      '- الفريق التربوي و الإداري',
      '- مواقيت و معاملات المواد',
      '- اساليب التقويم للفروض و الاختبارات'
    ],
    [
      'تطوير مهارات:',
      '- التنظيم والتخطيط',
      '- المذاكرة الفعالة',
      '- إدارة الوقت',
      '- التركيز والانتباه'
    ],
    [
      'توجيه التلميذ نحو:',
      '- اكتشاف ميوله وقدراته',
      '- التعرف على المسارات المهنية',
      '- اتخاذ القرارات المهنية',
      '- التخطيط للمستقبل'
    ]
  ],
  notes: [
    'تجاوب و اهتمام من طرف التلاميذ من خلال تبادل المعلومات',
    'مشاركة فعالة وحماس كبير من التلاميذ',
    'تفاعل إيجابي وطرح أسئلة مفيدة'
  ],
  tags: [
    'تقرير شهري',
    'تقرير فصلي',
    'تقييم الأداء',
    'توجيه مهني',
    'متابعة دراسية',
    'نشاط جماعي'
  ]
};

// Modal Component
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

const ReportTemplate = React.forwardRef<HTMLDivElement, { report: Report }>(({ report }, ref) => {
  return (
    <div ref={ref} dir="rtl" className="bg-white p-8 min-h-[29.7cm] w-[21cm] mx-auto" style={{ fontFamily: '"Traditional Arabic", "Arabic Typesetting", Arial' }}>
      <div className="text-center font-bold text-2xl mb-8">الجمهورية الجزائرية الديمقراطية الشعبية</div>
      
      <div className="flex justify-between mb-6">
        <div>مديرية التربية لولاية مستغانم</div>
        <div>مركز التوجيه و الإرشاد المدرسي و المهني</div>
      </div>

      <div className="flex justify-between mb-6">
        <div><span className="underline">متوسطة</span>: {report.school}</div>
        <div><span className="underline">السنة الدراسية</span>: {report.academicYear}</div>
      </div>

      <div className="mb-6">
        <div><span className="underline">مستشار التوجيه</span>: {report.counselor}</div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-xl font-bold underline mb-2">تقرير عملية الإعلام</h1>
        <div className="text-lg">( {report.type} )</div>
      </div>

      <div className="mb-6">
        <strong className="underline">المستوى:</strong> {report.level}
      </div>

      <div className="mb-6">
        <strong className="underline">التعداد الإجمالي في المستوى:</strong>
      </div>

      <table className="w-full border-collapse mb-6">
        <thead>
          <tr>
            <th className="border border-black p-2">الأفواج</th>
            <th className="border border-black p-2">عدد التلاميذ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2 text-center">{report.groupCount}</td>
            <td className="border border-black p-2 text-center">{report.studentCount}</td>
          </tr>
        </tbody>
      </table>

      <div className="mb-6">
        <strong className="underline">الموضوع:</strong> {report.subject}
      </div>

      <div className="mb-6">
        <strong className="underline">التغطية الإعلامية:</strong>
      </div>

      <table className="w-full border-collapse mb-6">
        <thead>
          <tr>
            <th className="border border-black p-2">الأفواج</th>
            <th className="border border-black p-2">تعداد التلاميذ</th>
            <th className="border border-black p-2">تاريخ التدخل</th>
            <th className="border border-black p-2">نسبة التغطية</th>
            <th className="border border-black p-2">الأهداف</th>
          </tr>
        </thead>
        <tbody>
          {report.coverage.groups.map((group, index) => (
            <tr key={index}>
              <td className="border border-black p-2">{group}</td>
              <td className="border border-black p-2">{report.coverage.counts[index]}</td>
              <td className="border border-black p-2">{report.coverage.dates[index]}</td>
              {index === 0 && (
                <td className="border border-black p-2 text-center" rowSpan={report.coverage.groups.length}>
                  {report.coverage.percentage}%
                </td>
              )}
              {index === 0 && (
                <td className="border border-black p-2 text-right" rowSpan={report.coverage.groups.length + 1}>
                  {report.coverage.objectives.map((objective, i) => (
                    <div key={i}>{objective}</div>
                  ))}
                </td>
              )}
            </tr>
          ))}
          <tr>
            <td className="border border-black p-2 font-bold">مج</td>
            <td className="border border-black p-2 font-bold">{report.coverage.counts.reduce((a, b) => a + b, 0)}</td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2 text-blue-600 font-bold">100%</td>
          </tr>
        </tbody>
      </table>

      <div className="mb-6">
        <strong className="underline">الملاحظات المستخلصة:</strong>
      </div>

      <div className="border border-black p-4 mb-8 min-h-[100px]">
        {report.notes}
      </div>

      <div className="flex justify-between mt-12">
        <div className="text-right pr-24">
          <strong className="underline text-lg">مستشار التوجيه و الإرشاد م.م</strong>
        </div>
        <div className="text-left pl-24">
          <strong className="underline text-lg">مدير المتوسطة</strong>
        </div>
      </div>
    </div>
  );
});

ReportTemplate.displayName = 'ReportTemplate';

export function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      title: 'تقرير عملية الإعلام',
      date: '2024/03/20',
      type: 'الفصل الاول',
      status: 'approved',
      school: 'متوسطة الأمل',
      counselor: 'محمد أحمد',
      academicYear: '2024/2025',
      level: 'السنة الاولى متوسط',
      groupCount: 4,
      studentCount: 91,
      subject: 'تحقيق كفاءة الاندماج و التكيف مع الوسط المدرسي الجديد',
      coverage: {
        groups: ['1/4', '2/1', '3/1', '4/1'],
        counts: [24, 22, 22, 23],
        dates: ['2024/10/02', '2024/10/01', '2024/10/01', '2024/10/02'],
        percentage: 100,
        objectives: [
          'تعريف التلميذ ب:',
          '- المحيط المدرسي الجديد و مساعدته على التكيف معه',
          '- الفريق التربوي و الإداري',
          '- مواقيت و معاملات المواد',
          '- اساليب التقويم للفروض و الاختبارات'
        ]
      },
      notes: 'تجاوب و اهتمام من طرف التلاميذ من خلال تبادل المعلومات',
      lastModified: '2024/03/20 14:30',
      author: 'محمد أحمد',
      tags: ['تقرير شهري', 'توجيه مهني']
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [editedReport, setEditedReport] = useState<Report | null>(null);
  const [newReport, setNewReport] = useState<Partial<Report>>({
    title: 'تقرير عملية الإعلام',
    type: 'الفصل الاول',
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    school: '',
    counselor: '',
    academicYear: '',
    level: '',
    groupCount: 0,
    studentCount: 0,
    subject: '',
    coverage: {
      groups: [],
      counts: [],
      dates: [],
      percentage: 100,
      objectives: []
    },
    notes: '',
    tags: []
  });

  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Report['status'] | ''>('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortField, setSortField] = useState<keyof Report>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const reportTemplateRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async (report: Report) => {
    if (!reportTemplateRef.current) return;

    const canvas = await html2canvas(reportTemplateRef.current, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${report.title}.pdf`);
  };

  const handleDelete = (reportId: number) => {
    setReports(reports.filter(report => report.id !== reportId));
    setIsDeleteModalOpen(false);
  };

  const handleEdit = (report: Report) => {
    setSelectedReport(report);
    setEditedReport({ ...report });
    setIsEditModalOpen(true);
  };

  const handleView = (report: Report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const handleSaveEdit = (updatedReport: Report) => {
    setReports(reports.map(report => 
      report.id === updatedReport.id ? {
        ...updatedReport,
        lastModified: new Date().toLocaleString('ar-DZ')
      } : report
    ));
    setIsEditModalOpen(false);
    setEditedReport(null);
  };

  const handleCreateNewReport = () => {
    const newReportObj: Report = {
      id: reports.length + 1,
      title: newReport.title || 'تقرير عملية الإعلام',
      date: newReport.date || new Date().toISOString().split('T')[0],
      type: newReport.type || 'الفصل الاول',
      status: 'draft',
      school: newReport.school || '',
      counselor: PREDEFINED_DATA.counselor,
      academicYear: newReport.academicYear || '',
      level: newReport.level || '',
      groupCount: newReport.groupCount || 0,
      studentCount: newReport.studentCount || 0,
      subject: newReport.subject || '',
      coverage: {
        groups: newReport.coverage?.groups || [],
        counts: newReport.coverage?.counts || [],
        dates: newReport.coverage?.dates || [],
        percentage: newReport.coverage?.percentage || 100,
        objectives: newReport.coverage?.objectives || []
      },
      notes: newReport.notes || '',
      lastModified: new Date().toLocaleString('ar-DZ'),
      author: PREDEFINED_DATA.counselor,
      tags: newReport.tags || []
    };

    setReports([...reports, newReportObj]);
    setIsNewReportModalOpen(false);
    setNewReport({});
  };

  const handleAutoFill = () => {
    const randomSchool = PREDEFINED_DATA.schools[Math.floor(Math.random() * PREDEFINED_DATA.schools.length)];
    const randomAcademicYear = PREDEFINED_DATA.academicYears[Math.floor(Math.random() * PREDEFINED_DATA.academicYears.length)];
    const randomLevel = PREDEFINED_DATA.levels[Math.floor(Math.random() * PREDEFINED_DATA.levels.length)];
    const randomSubject = PREDEFINED_DATA.subjects[Math.floor(Math.random() * PREDEFINED_DATA.subjects.length)];
    const randomObjectives = PREDEFINED_DATA.objectives[Math.floor(Math.random() * PREDEFINED_DATA.objectives.length)];
    const randomNote = PREDEFINED_DATA.notes[Math.floor(Math.random() * PREDEFINED_DATA.notes.length)];
    const randomTags = PREDEFINED_DATA.tags
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    const groupCount = Math.floor(Math.random() * 3) + 3;
    const groups = Array.from({ length: groupCount }, (_, i) => `${i + 1}/1`);
    const counts = Array.from({ length: groupCount }, () => Math.floor(Math.random() * 10) + 20);
    const dates = Array.from({ length: groupCount }, () => {
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 30));
      return date.toISOString().split('T')[0];
    });

    setNewReport({
      ...newReport,
      school: randomSchool,
      counselor: PREDEFINED_DATA.counselor,
      academicYear: randomAcademicYear,
      level: randomLevel,
      groupCount: groupCount,
      studentCount: counts.reduce((a, b) => a + b, 0),
      subject: randomSubject,
      coverage: {
        groups,
        counts,
        dates,
        percentage: 100,
        objectives: randomObjectives
      },
      notes: randomNote,
      tags: randomTags
    });
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'draft':
        return 'مسودة';
      case 'pending':
        return 'قيد المراجعة';
      case 'approved':
        return 'معتمد';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  const filteredReports = reports
    .filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !selectedStatus || report.status === selectedStatus;
      const matchesSchool = !selectedSchool || report.school === selectedSchool;
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(tag => report.tags.includes(tag));
      const matchesDateRange = (!dateRange.start || report.date >= dateRange.start) &&
                             (!dateRange.end || report.date <= dateRange.end);

      return matchesSearch && matchesStatus && matchesSchool && matchesTags && matchesDateRange;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction * aValue.localeCompare(bValue);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة التقارير</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsNewReportModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>إنشاء تقرير جديد</span>
          </button>
          <button
            onClick={() => {
              // Implement refresh logic
              alert('تم تحديث قائمة التقارير');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* Filtres avancés */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في التقارير..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-lg"
            />
          </div>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Report['status'] | '')}
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-gray-700"
            >
              <option value="">الحالة</option>
              <option value="draft">مسودة</option>
              <option value="pending">قيد المراجعة</option>
              <option value="approved">معتمد</option>
              <option value="rejected">مرفوض</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-gray-700"
            >
              <option value="">المدرسة</option>
              {PREDEFINED_DATA.schools.map((school) => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={() => {
              setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
            }}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <ArrowUpDown className="w-5 h-5" />
            <span>{sortDirection === 'asc' ? 'تصاعدي' : 'تنازلي'}</span>
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {PREDEFINED_DATA.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleToggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Liste des rapports */}
      <div className="grid gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{report.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.school}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(report.status)}`}>
                  {getStatusText(report.status)}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleView(report)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-full transition-colors"
                    title="عرض"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleEdit(report)}
                    className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded-full transition-colors"
                    title="تعديل"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedReport(report);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDownloadPDF(report)}
                    className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="تحميل PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tags et métadonnées */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                {report.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <span>آخر تعديل: {report.lastModified}</span>
                <span className="mx-2">•</span>
                <span>بواسطة: {report.author}</span>
              </div>
            </div>

            {/* Indicateurs de progression */}
            {report.status ===   'pending' && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">60% مكتمل</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="عرض التقرير"
      >
        {selectedReport && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <ReportTemplate ref={reportTemplateRef} report={selectedReport} />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleDownloadPDF(selectedReport)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>تحميل PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="تعديل التقرير"
      >
        {editedReport && (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (editedReport) handleSaveEdit(editedReport);
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المدرسة</label>
                <select
                  value={editedReport.school}
                  onChange={(e) => setEditedReport({ ...editedReport, school: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {PREDEFINED_DATA.schools.map((school) => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مستشار التوجيه</label>
                <input
                  type="text"
                  value={PREDEFINED_DATA.counselor}
                  readOnly
                  className="w-full p-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السنة الدراسية</label>
                <select
                  value={editedReport.academicYear}
                  onChange={(e) => setEditedReport({ ...editedReport, academicYear: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {PREDEFINED_DATA.academicYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المستوى</label>
                <select
                  value={editedReport.level}
                  onChange={(e) => setEditedReport({ ...editedReport, level: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {PREDEFINED_DATA.levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select
                  value={editedReport.status}
                  onChange={(e) => setEditedReport({ ...editedReport, status: e.target.value as Report['status'] })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="draft">مسودة</option>
                  <option value="pending">قيد المراجعة</option>
                  <option value="approved">معتمد</option>
                  <option value="rejected">مرفوض</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الموضوع</label>
              <select
                value={editedReport.subject}
                onChange={(e) => setEditedReport({ ...editedReport, subject: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                {PREDEFINED_DATA.subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الملاحظات</label>
              <select
                value={editedReport.notes}
                onChange={(e) => setEditedReport({ ...editedReport, notes: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                {PREDEFINED_DATA.notes.map((note) => (
                  <option key={note} value={note}>{note}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التصنيفات</label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_DATA.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const newTags = editedReport.tags.includes(tag)
                        ? editedReport.tags.filter(t => t !== tag)
                        : [...editedReport.tags, tag];
                      setEditedReport({ ...editedReport, tags: newTags });
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      editedReport.tags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
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
        title="حذف التقرير"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-red-50 text-red-800 rounded-lg">
              <AlertCircle className="w-6 h-6" />
              <p className="font-medium">هل أنت متأكد من حذف هذا التقرير؟</p>
            </div>
            <p className="text-gray-600">
              سيتم حذف التقرير "{selectedReport.title}" نهائياً. هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(selectedReport.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Report Modal */}
      <Modal
        isOpen={isNewReportModalOpen}
        onClose={() => setIsNewReportModalOpen(false)}
        title="إنشاء تقرير جديد"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleCreateNewReport();
        }} className="space-y-4">
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={handleAutoFill}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FileInput className="w-5 h-5" />
              <span>ملء تلقائي</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المدرسة</label>
              <select
                value={newReport.school}
                onChange={(e) => setNewReport({ ...newReport, school: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">اختر المدرسة</option>
                {PREDEFINED_DATA.schools.map((school) => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مستشار التوجيه</label>
              <input
                type="text"
                value={PREDEFINED_DATA.counselor}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السنة الدراسية</label>
              <select
                value={newReport.academicYear}
                onChange={(e) => setNewReport({ ...newReport, academicYear: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">اختر السنة الدراسية</option>
                {PREDEFINED_DATA.academicYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المستوى</label>
              <select
                value={newReport.level}
                onChange={(e) => setNewReport({ ...newReport, level: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">اختر المستوى</option>
                {PREDEFINED_DATA.levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأفواج</label>
              <input
                type="number"
                value={newReport.groupCount || ''}
                onChange={(e) => setNewReport({ ...newReport, groupCount: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عدد التلاميذ</label>
              <input
                type="number"
                value={newReport.studentCount || ''}
                onChange={(e) => setNewReport({ ...newReport, studentCount: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الموضوع</label>
            <select
              value={newReport.subject}
              onChange={(e) => setNewReport({ ...newReport, subject: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">اختر الموضوع</option>
              {PREDEFINED_DATA.subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الملاحظات</label>
            <select
              value={newReport.notes}
              onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">اختر الملاحظات</option>
              {PREDEFINED_DATA.notes.map((note) => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">التصنيفات</label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_DATA.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const newTags = newReport.tags?.includes(tag)
                      ? newReport.tags.filter(t => t !== tag)
                      : [...(newReport.tags || []), tag];
                    setNewReport({ ...newReport, tags: newTags });
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    newReport.tags?.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewReportModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              إنشاء التقرير
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}