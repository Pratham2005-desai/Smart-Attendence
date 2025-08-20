import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ApplyLeave = () => {
  console.log("🚀 ApplyLeave component mounted");
  const { collegeId } = useAuth();   // ✅ Correct variable from AuthContext
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [leaves, setLeaves] = useState([]);

  // ✅ Fetch existing leaves on mount
  useEffect(() => {
    if (collegeId) {
      fetchLeaveStatus();
    }
  }, [collegeId]);

  const fetchLeaveStatus = async () => {
    try {
      console.log("📡 Fetching leave status for:", collegeId);
      const response = await axios.get(`/api/leave/status/${collegeId}`);
      console.log("✅ Leave status response:", response.data);
      setLeaves(response.data.leaves || []);
    } catch (error) {
      console.error("🚨 Error fetching leave status:", error.response?.data || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🖊️ handleSubmit triggered");

    const payload = {
      collegeId: collegeId,   // ✅ fixed
      startDate,
      endDate,
      reason,
    };

    console.log("📩 Submitting leave request:", payload);

    try {
      const response = await axios.post('/api/leave/apply', payload);
      console.log("✅ Leave apply response:", response.data);

      if (response.status === 201) {
        setMessage('✅ Leave application submitted successfully.');
        setStartDate('');
        setEndDate('');
        setReason('');
        fetchLeaveStatus();  // Refresh list
      } else {
        setMessage('❌ Failed to submit leave application.');
      }
    } catch (error) {
      console.error("🚨 Leave apply error:", error.response?.data || error.message);
      setMessage('🚨 Error submitting leave application.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '2rem auto', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h1>Apply for Leave</h1>

      {/* Leave Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="startDate">Start Date:</label><br />
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="endDate">End Date:</label><br />
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="reason">Reason:</label><br />
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows="4"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Submit
        </button>
      </form>

      {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}

      {/* Leave Status */}
      <div style={{ marginTop: '2rem' }}>
        <h2>My Leave Applications</h2>
        {leaves.length === 0 ? (
          <p>No leave applications found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Start Date</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>End Date</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Reason</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.startDate}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.endDate}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.reason}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ApplyLeave;
