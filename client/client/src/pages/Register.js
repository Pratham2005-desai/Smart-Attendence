import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    class: '',
    semester: '',
    collegeId: '', // ✅ Added
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('Registered successfully!');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.error) {
        setMessage(`Error: ${err.response.data.error}`);
      } else {
        setMessage('Error during registration');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <select name="role" onChange={handleChange}>
        <option value="student">Student</option>
      </select>

      {formData.role === 'student' && (
        <>
          <select name="class" onChange={handleChange} defaultValue="">
            <option value="" disabled>Select Class</option>
            <option value="Class 1">B.sc Computer Science</option>
            <option value="Class 2">B.sc Sports Management</option>
            <option value="Class 3">B.Com</option>
            <option value="Class 4">B.Com F&A</option>
            <option value="Class 5">BCA</option>
            <option value="Class 6">BBA </option>
            <option value="Class 7">BBA Capital Market</option>
            <option value="Class 8">BBA Family Business</option>
            <option value="Class 9">M.sc Sports Management</option>
          </select>
          <select name="semester" onChange={handleChange} defaultValue="">
            <option value="" disabled>Select Semester</option>
            <option value="Sem 1">Semester 1</option>
            <option value="Sem 2">Semester 2</option>
            <option value="Sem 3">Semester 3</option>
            <option value="Sem 4">Semester 4</option>
            <option value="Sem 5">Semester 5</option>
            <option value="Sem 6">Semester 6</option>
            <option value="Sem 7">Semester 7</option>
            <option value="Sem 8">Semester 8</option>
          </select>
          <input name="collegeId" placeholder="College ID" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        </>
      )}

      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
    </div>
  );
}

export default Register;
