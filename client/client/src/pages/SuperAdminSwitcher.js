import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SuperAdminSwitcher = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== 'superadmin') return <p>Access denied.</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
      <h2>👑 Super Admin Mode</h2>
      <p>Welcome {user.name || 'Super Admin'} (SA-001)</p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <button onClick={() => navigate('/admin')}>🛠️ Go to Admin Panel</button>
        <button onClick={() => navigate('/teacher-dashboard')}>👩‍🏫 Go to Teacher Dashboard</button>
        <button onClick={() => navigate('/student')}>🎓 Go to Student Dashboard</button>
      </div>
    </div>
  );
};

export default SuperAdminSwitcher;
