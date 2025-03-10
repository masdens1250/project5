import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Students } from './components/Students';
import { Groups } from './components/Groups';
import { PsychTests } from './components/PsychTests';
import { VideoConference } from './components/VideoConference';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';

function App() {
  return (
    <Router>
      <div dir="rtl" className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/psych-tests" element={<PsychTests />} />
            <Route path="/video-conference" element={<VideoConference />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;