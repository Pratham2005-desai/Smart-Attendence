import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ViewTimeTable from '../components/ViewTimeTable';

const Dashboard = () => {
  const { user } = useAuth();

  // Assuming attendancePercentage is fetched or calculated elsewhere
  // For demonstration, let's assume a placeholder value or null
  const attendancePercentage = user?.attendancePercentage ?? null;

  return (
    <div className="dashboard-container" style={{ maxWidth: '900px', margin: '3rem auto', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#007bff' }}>Student Dashboard</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>
          Welcome Back, {user?.name || 'Student'}!
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>
          Here is a quick overview of your attendance and leave status.
        </p>
      </section>

      <section style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 250px', padding: '1rem', background: '#e9f0ff', borderRadius: '10px', boxShadow: 'inset 0 0 10px #c3d7ff' }}>
          <h3 style={{ color: '#0056b3' }}>Attendance</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>
            {attendancePercentage !== null ? `${attendancePercentage}%` : 'No classes taken'}
          </p>
          <Link to="/scan" style={{ color: '#007bff', textDecoration: 'underline' }}>Mark Attendance</Link>
        </div>

        <div style={{ flex: '1 1 250px', padding: '1rem', background: '#e9f0ff', borderRadius: '10px', boxShadow: 'inset 0 0 10px #c3d7ff' }}>
          <h3 style={{ color: '#0056b3' }}>Leave Requests</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: '600' }}> </p>
          <Link to="/apply-leave" style={{ color: '#007bff', textDecoration: 'underline' }}>Apply for Leave</Link>
        </div>

        <div style={{ flex: '1 1 250px', padding: '1rem', background: '#e9f0ff', borderRadius: '10px', boxShadow: 'inset 0 0 10px #c3d7ff' }}>
          <h3 style={{ color: '#0056b3' }}>Session QR</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: '600' }}></p>
          <Link to="/qr-session" style={{ color: '#007bff', textDecoration: 'underline' }}>View Sessions</Link>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <ViewTimeTable />
      </section>
    </div>
  );
};

export default Dashboard;
