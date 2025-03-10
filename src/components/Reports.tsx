import React, { useState } from 'react';
import { FileText, Download, Trash2, Plus, Eye, Edit2, X, ChevronDown, Save } from 'lucide-react';

type Report = {
  id: number;
  title: string;
  date: string;
  type: string;
  status: string;
  content?: string;
  level?: string;
  group?: string;
  semester?: string;
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

export function Reports() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      title: 'تقرير متابعة الأفواج',
      date: '2024/03/20',
      type: 'شهري',
      status: 'مكتمل',
      content: 'محتوى تقرير متابعة الأفواج...',
      level: 'السنة الأولى',
      group: 'الفوج 1',
      semester: 'الفصل الأول'
    },
    {
      id: 2,
      title: 'تقرير الاختبارات النفسية',
      date: '2024/03/15',
      type: 'أسبوعي',
      status: 'مكتمل',
      content: 'محتوى تقرير الاختبارات النفسية...',
      level: 'السنة الثانية',
      group: 'الفوج 2',
      semester: 'الفصل الثاني'
    },
    {
      id: 3,
      title: 'تقرير التوجيه المهني',
      date: '2024/03/10',
      type: 'فصلي',
      status: 'مكتمل',
      content: 'محتوى تقرير التوجيه المهني...',
      level: 'السنة الثالثة',
      group: 'الفوج 3',
      semester: 'الفصل الثالث'
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [editedReport, setEditedReport] = useState<Report | null>(null);

  // New state for filters
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const levels = ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة'];
  const groups = ['الفوج 1', 'الفوج 2', 'الفوج 3', 'الفوج 4', 'الفوج 5'];
  const semesters = ['الفصل الأول', 'الفصل الثاني', 'الفصل الثالث'];

  const handleDeleteAll = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع التقارير؟')) {
      setReports([]);
    }
  };

  const handleDelete = (reportId: number) => {
    setReports(reports.filter(report => report.id !== reportId));
  };

  const handleDownload = (report: Report) => {
    const element = document.createElement('a');
    const file = new Blob([report.content || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${report.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
      report.id === updatedReport.id ? updatedReport : report
    ));
    setIsEditModalOpen(false);
    setEditedReport(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editedReport) {
      setEditedReport({
        ...editedReport,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSave = () => {
    if (editedReport) {
      handleSaveEdit(editedReport);
    }
  };

  const handleAddNewReport = (newReport: Omit<Report, 'id'>) => {
    const report = {
      ...newReport,
      id: Math.max(...reports.map(r => r.id), 0) + 1,
      date: new Date().toLocaleDateString('ar-SA'),
      status: 'مكتمل'
    };
    setReports([report, ...reports]);
    setIsNewReportModalOpen(false);
  };

  // Filter reports based on selected filters
  const filteredReports = reports.filter(report => {
    return (!selectedLevel || report.level === selectedLevel) &&
           (!selectedGroup || report.group === selectedGroup) &&
           (!selectedSemester || report.semester === selectedSemester);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة التقارير</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleDeleteAll}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>حذف جميع التقارير</span>
          </button>
          <button 
            onClick={() => setIsNewReportModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إنشاء تقرير جديد</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 relative">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white"
          >
            <option value="">جميع المستويات</option>
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="flex-1 relative">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white"
          >
            <option value="">جميع الأفواج</option>
            {groups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="flex-1 relative">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white"
          >
            <option value="">جميع الفصول</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

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
                    <span>{report.level}</span>
                    <span>•</span>
                    <span>{report.group}</span>
                    <span>•</span>
                    <span>{report.semester}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {report.status}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {report.type}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleView(report)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleEdit(report)}
                    className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded-full transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(report.id)}
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDownload(report)}
                    className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد تقارير تطابق المعايير المحددة</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedReport?.title || ''}
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{selectedReport.content}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium text-gray-700">المستوى:</span> {selectedReport.level}
              </div>
              <div>
                <span className="font-medium text-gray-700">الفوج:</span> {selectedReport.group}
              </div>
              <div>
                <span className="font-medium text-gray-700">الفصل:</span> {selectedReport.semester}
              </div>
              <div>
                <span className="font-medium text-gray-700">التاريخ:</span> {selectedReport.date}
              </div>
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
          <div className="flex flex-col h-full">
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عنوان التقرير
                </label>
                <input
                  name="title"
                  value={editedReport.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع التقرير
                </label>
                <select
                  name="type"
                  value={editedReport.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="يومي">يومي</option>
                  <option value="أسبوعي">أسبوعي</option>
                  <option value="شهري">شهري</option>
                  <option value="فصلي">فصلي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المستوى
                </label>
                <select
                  name="level"
                  value={editedReport.level}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  {levels.map((level) => (
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
                  value={editedReport.group}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  {groups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الفصل
                </label>
                <select
                  name="semester"
                  value={editedReport.semester}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  {semesters.map((semester) => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  محتوى التقرير
                </label>
                <textarea
                  name="content"
                  value={editedReport.content}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg h-32"
                  required
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white pt-4 mt-4 border-t flex justify-between items-center">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                <span>حفظ</span>
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleSaveEdit(editedReport)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  حفظ التغييرات
                </button>
              </div>
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
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddNewReport({
              title: formData.get('title') as string,
              type: formData.get('type') as string,
              content: formData.get('content') as string,
              level: formData.get('level') as string,
              group: formData.get('group') as string,
              semester: formData.get('semester') as string,
              date: new Date().toLocaleDateString('ar-SA'),
              status: 'مكتمل'
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان التقرير
            </label>
            <input
              name="title"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع التقرير
            </label>
            <select
              name="type"
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="يومي">يومي</option>
              <option value="أسبوعي">أسبوعي</option>
              <option value="شهري">شهري</option>
              <option value="فصلي">فصلي</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المستوى
            </label>
            <select
              name="level"
              className="w-full p-2 border rounded-lg"
              required
            >
              {levels.map((level) => (
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
              {groups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الفصل
            </label>
            <select
              name="semester"
              className="w-full p-2 border rounded-lg"
              required
            >
              {semesters.map((semester) => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              محتوى التقرير
            </label>
            <textarea
              name="content"
              className="w-full p-2 border rounded-lg h-32"
              required
            />
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