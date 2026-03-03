import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 确保这里的路径字母大小写，跟你真实的文件名一模一样！
import Navbar from './components/navbar';
import ClientHome from './pages/clientHome';
import Login from './pages/login';
import AdminIAM from './pages/adminIAM';
import CalendarPage from './pages/calendarPage';
import AdminLogs from './pages/adminLogs';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ClientHome />} />
        <Route path="/login" element={<Login />} />
        
        {/* 新的路线 */}
        <Route path="/admin-iam" element={<AdminIAM />} />
        <Route path="/admin-logs" element={<AdminLogs />} />
        <Route path="/calendar" element={<CalendarPage />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}