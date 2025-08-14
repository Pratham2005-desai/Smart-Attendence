import React, { useState } from 'react';
import axios from 'axios';

function AdminRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeId: '',
    password: '',
    role: 'admin'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.collegeId.trim() || !formData.password.trim()) {
      setMessageType('error');
      setMessage('Please fill in all fields.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessageType('error');
      setMessage('Please enter a valid email.');
      return false;
    }
    if (formData.password.length < 6) {
      setMessageType('error');
      setMessage('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/create-user`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessageType('success');
      setMessage(`${formData.role} account created successfully!`);

      setFormData({
        name: '',
        email: '',
        collegeId: '',
        password: '',
        role: 'admin'
      });
    } catch (err) {
      setMessageType('error');
      if (err.response?.data?.error) {
        setMessage(`Error: ${err.response.data.error}`);
      } else {
        setMessage('Error during user creation');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create User Account</h2>

        <input
          style={styles.input}
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          name="collegeId"
          placeholder="College ID"
          value={formData.collegeId}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <select
          style={styles.input}
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>

        <button
          style={styles.button}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>

        {message && (
          <p
            style={{
              color: messageType === 'success' ? 'green' : 'red',
              marginTop: '10px',
              fontWeight: 'bold'
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#f8f8f8', // Off-white
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '350px',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    textAlign: 'center',
    color: '#1e4e8c', // Blue tone
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px'
  },
  button: {
    backgroundColor: '#1e4e8c', // Blue tone
    color: 'white',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default AdminRegister;
