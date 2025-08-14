import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar-modern">
      <div className="navbar-brand">
        <img src="/Logo.jpg" alt="Logo" />
        <h3>TransStadia University</h3>
      </div>

      <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
        {!user && <li><Link to="/login">Login</Link></li>}
        {user?.role === 'student' && (
          <>
            <li><Link to="/student">Dashboard</Link></li>
            <li><Link to="/scan">Scan QR</Link></li>
          </>
        )}
        {user?.role === 'teacher' && (
          <>
            <li><Link to="/teacher-dashboard">Teacher Dashboard</Link></li>
            <li><Link to="/mark-attendance">Mark Attendance</Link></li>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <li><Link to="/admin">Admin Panel</Link></li>
            <li><Link to="/admin-register">Register User</Link></li>
          </>
        )}
        {user && (
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
