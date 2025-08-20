import React, { useEffect, useState } from 'react';
import api from '../api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const att = await api.get("/api/admin/attendance");
      const lv = await api.get("/api/admin/leaves");
      setAttendance(att.data);
      setLeaves(lv.data);
    } catch (err) {
      alert("Failed to fetch admin data: " + (err.response?.data?.error || err.message));
    }
  };

  const exportExcel = async () => {
    try {
      const res = await api.get("/api/admin/export", { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Failed to export attendance: " + (err.response?.data?.error || err.message));
    }
  };

  // ✅ New: update leave status
  const updateLeaveStatus = async (leaveId, status) => {
    try {
      const res = await api.put(`/api/admin/leaves/${leaveId}`, { status });
      console.log("✅ Leave updated:", res.data);
      fetchAll(); // refresh list
    } catch (err) {
      alert("Failed to update leave: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Panel</h2>

      <button className="export-btn" onClick={exportExcel}>
        📥 Export Attendance (Excel)
      </button>

      {/* Attendance Section */}
      <div className="dashboard-card">
        <h3>Attendance Records</h3>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Status</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(a => (
              <tr key={a._id}>
                <td>{a.studentId}</td>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.status}</td>
                <td>{a.class}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leaves Section */}
      <div className="dashboard-card">
        <h3>Leave Requests</h3>
        <table className="styled-table">
          <thead>
            <tr>
              <th>College ID</th>
              <th>Start</th>
              <th>End</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Applied At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l._id}>
                <td>{l.collegeId}</td>
                <td>{l.startDate}</td>
                <td>{l.endDate}</td>
                <td>{l.reason}</td>
                <td>{l.status}</td>
                <td>{l.appliedAt || "-"}</td>
                <td>
                  {l.status === "pending" ? (
                    <>
                      <button onClick={() => updateLeaveStatus(l._id, "approved")}>Approve</button>
                      <button onClick={() => updateLeaveStatus(l._id, "rejected")}>Reject</button>
                    </>
                  ) : (
                    <span>{l.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
