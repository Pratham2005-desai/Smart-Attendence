import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Assuming you have a CSS file for styling

function Login() {
  const [collegeId, setCollegeId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await api.post('/api/auth/login', { collegeId, password });
      login(res.data.user, res.data.token);
      setMessage('Login successful');

      if (res.data.success && res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.success && res.data.user.role === 'student') navigate('/student');
      else if (res.data.success && res.data.user.role === 'teacher') navigate('/teacher-dashboard');
      else navigate('/login');

    } catch (err) {
      setMessage('Invalid college ID or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Please log in to continue</p>

        <input
          type="text"
          placeholder="College ID"
          value={collegeId}
          onChange={(e) => setCollegeId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
        <p className="login-message">{message}</p>
      </div>
    </div>
  );
}

export default Login;
