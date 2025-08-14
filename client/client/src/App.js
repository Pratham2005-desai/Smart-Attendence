import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import QRScanner from './components/QRScanner';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import TeacherQRSession from './pages/TeacherQRSession';
import TeacherDashboard from './pages/TeacherDashboard';
import QRGenerator from './pages/QRGenerator';
import ViewAttendance from './pages/ViewAttendance';
import ManualMarkAttendance from './pages/ManualMarkAttendance';
import AdminRegister from './pages/AdminRegister';
import Heatmap from './components/Heatmap';
import ChangePassword from './components/ChangePassword'; // corrected import path
import SuperAdminSwitcher from './pages/SuperAdminSwitcher';

function App() {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === 'superadmin';
  const isStudent = user?.role === 'student' || isSuperAdmin;
  const isTeacher = user?.role === 'teacher' || isSuperAdmin;
  const isAdmin = user?.role === 'admin' || isSuperAdmin;


  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Dashboard */}
        <Route
          path="/student"
          element={isStudent ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Teacher Dashboard */}
        <Route
          path="/teacher-dashboard"
          element={isTeacher ? <TeacherDashboard /> : <Navigate to="/login" />}
        />

        {/* Teacher: QR Generator */}
        <Route
          path="/teacher/generate-qr"
          element={isTeacher ? <QRGenerator /> : <Navigate to="/login" />}
        />

        {/* Teacher: View Attendance */}
        <Route
          path="/teacher/view-attendance"
          element={isTeacher ? <ViewAttendance /> : <Navigate to="/login" />}
        />

        {/* Teacher: Manual Mark Attendance */}
        <Route
          path="/teacher/manual-mark-attendance"
          element={isTeacher ? <ManualMarkAttendance /> : <Navigate to="/login" />}
        />

        {/* Teacher: Mark Attendance */}
        <Route
          path="/mark-attendance"
          element={isTeacher ? <ManualMarkAttendance /> : <Navigate to="/login" />}
        />

        {/* Student: Apply Leave */}
        <Route
          path="/apply-leave"
          element={isStudent ? <ApplyLeave /> : <Navigate to="/login" />}
        />

        {/* Teacher: QR Session Management */}
        <Route
          path="/qr-session"
          element={isTeacher ? <TeacherQRSession /> : <Navigate to="/login" />}
        />
        <Route
          path="/teacher/heatmap"
          element={isTeacher ? <Heatmap /> : <Navigate to="/login" />}
        />

        {/* Student: QR Scanner */}
        <Route
          path="/scan"
          element={isStudent ? <QRScanner /> : <Navigate to="/login" />}
        />

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminPanel /> : <Navigate to="/login" />}
        />

        {/* Admin Register */}
        <Route
          path="/admin-register"
          element={isAdmin ? <AdminRegister /> : <Navigate to="/login" />}
        />

        <Route
          path="/change-password"
          element={user ? <ChangePassword /> : <Navigate to="/login" />}
        />
        {/* Super Admin Switcher */}
        <Route
          path="/superadmin"
          element={isSuperAdmin ? <SuperAdminSwitcher /> : <Navigate to="/login" />}
        />


        {/* Catch-all */}
        <Route path="*" element={<p style={{ padding: '1rem' }}>404 - Page Not Found</p>} />
      </Routes>
      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        marginTop: 'auto',
        borderTop: '1px solid #ccc',
        backgroundColor: '#f8f9fa',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        © Pratham Desai
      </footer>
    </Router>
  );
}

export default App;
