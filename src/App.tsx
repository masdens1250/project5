import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar';

// Lazy loading des composants
const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const Students = lazy(() => import('./components/Students').then(module => ({ default: module.Students })));
const Groups = lazy(() => import('./components/Groups').then(module => ({ default: module.Groups })));
const PsychTests = lazy(() => import('./components/PsychTests').then(module => ({ default: module.PsychTests })));
const VideoConference = lazy(() => import('./components/VideoConference').then(module => ({ default: module.VideoConference })));
const Reports = lazy(() => import('./components/Reports').then(module => ({ default: module.Reports })));
const Settings = lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })));
const Recommendations = lazy(() => import('./components/Recommendations').then(module => ({ default: module.Recommendations })));
const TestInterface = lazy(() => import('./components/TestInterface').then(module => ({ default: module.TestInterface })));
const TestResults = lazy(() => import('./components/TestResults').then(module => ({ default: module.TestResults })));

// Composant de chargement
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="loading-spinner w-12 h-12"></div>
  </div>
);

// Composant de transition pour les pages
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Composant de mise en page avec protection des routes
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <PageTransition>
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </PageTransition>
      </main>
    </div>
  );
};

// Configuration des routes avec leurs métadonnées
const routes = [
  { path: '/', element: <Dashboard />, title: 'لوحة القيادة' },
  { path: '/students', element: <Students />, title: 'إدارة الثلاميذ' },
  { path: '/groups', element: <Groups />, title: 'إدارة الأفواج' },
  { path: '/psych-tests', element: <PsychTests />, title: 'الاختبارات النفسية' },
  { path: '/video-conference', element: <VideoConference />, title: 'مؤتمر الفيديو' },
  { path: '/reports', element: <Reports />, title: 'إدارة التقارير' },
  { path: '/recommendations', element: <Recommendations />, title: 'التوصيات' },
  { path: '/settings', element: <Settings />, title: 'الإعدادات' },
  { path: '/test-interface', element: <TestInterface />, title: 'واجهة الاختبار' },
  { path: '/test-results', element: <TestResults />, title: 'نتائج الاختبار' }
];

function App() {
  return (
    <Router>
      <ProtectedLayout>
        <Routes>
          {routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProtectedLayout>
    </Router>
  );
}

export default App;