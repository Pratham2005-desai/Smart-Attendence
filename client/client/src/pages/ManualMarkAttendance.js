import React, { useState } from 'react';
import axios from 'axios';

const ManualMarkAttendance = () => {
  const [studentId, setStudentId] = useState('');
  const [classCode, setClassCode] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !classCode || !subject || !teacherId || !dateTime) {
      setMessage('Please fill all fields');
      return;
    }
    try {
      const response = await axios.post('/api/attendance', {
        studentId,
        class: classCode,
        subject,
        teacherId,
        timestamp: new Date(dateTime).toISOString(),
      });
      if (response.status === 200) {
        setMessage('Attendance marked successfully');
        setStudentId('');
        setClassCode('');
        setSubject('');
        setTeacherId('');
        setDateTime('');
      } else {
        setMessage('Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage('Error marking attendance');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2>Manual Mark Attendance</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Student ID:</label><br />
          <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Class:</label><br />
          <input type="text" value={classCode} onChange={(e) => setClassCode(e.target.value)} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Subject:</label><br />
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Teacher ID:</label><br />
          <input type="text" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Date and Time:</label><br />
          <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
        </div>
        <button type="submit">Mark Attendance</button>
      </form>
    </div>
  );
};

export default ManualMarkAttendance;
