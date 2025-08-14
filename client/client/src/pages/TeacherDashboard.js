import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="teacher-dashboard-container" style={{ maxWidth: '900px', margin: '3rem auto', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#007bff' }}>Teacher Dashboard</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>
          Welcome Back, Professor {user?.name || ''}
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>
          Access your utilities below.
        </p>
      </section>

      <section style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 250px', padding: '1rem', background: '#e9f0ff', borderRadius: '10px', boxShadow: 'inset 0 0 10px #c3d7ff' }}>
          <h3 style={{ color: '#0056b3' }}>Generate QR Code</h3>
          <p style={{ fontSize: '1rem', color: '#333' }}>Create QR codes for your sessions.</p>
          <Link to="/teacher/generate-qr" style={{ color: '#007bff', textDecoration: 'underline' }}>Go to QR Generator</Link>
        </div>

        <div style={{ flex: '1 1 250px', padding: '1rem', background: '#e9f0ff', borderRadius: '10px', boxShadow: 'inset 0 0 10px #c3d7ff' }}>
          <h3 style={{ color: '#0056b3' }}>Check Attendance</h3>
          <p style={{ fontSize: '1rem', color: '#333' }}>View attendance records for your classes.</p>
          <Link to="/teacher/view-attendance" style={{ color: '#007bff', textDecoration: 'underline' }}>View Attendance</Link>
        </div>
        
        <div style={{ flex: '1 1 250px', padding: '1rem', background: '#e9f0ff', borderRadius: '10px', boxShadow: 'inset 0 0 10px #c3d7ff' }}>
          <h3 style={{ color: '#0056b3' }}>Heatmap</h3>
          <p style={{ fontSize: '1rem', color: '#333' }}>View attendance heatmap.</p>
          <Link to="/teacher/heatmap" style={{ color: '#007bff', textDecoration: 'underline' }}>View Heatmap</Link>
        </div>
        <div style={{ flex: '1 1 250px', padding: '1rem', background: '#e9f0ff', borderRadius: '10px', boxShadow: 'inset 0 0 10px #c3d7ff' }}>
          <h3 style={{ color: '#0056b3' }}>Manual Mark Attendance</h3>
          <p style={{ fontSize: '1rem', color: '#333' }}>Manually add attendance records.</p>
          <Link to="/teacher/manual-mark-attendance" style={{ color: '#007bff', textDecoration: 'underline' }}>Mark Attendance</Link>
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;
