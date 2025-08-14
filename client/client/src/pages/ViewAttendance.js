import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Heatmap from '../components/Heatmap';

const ViewAttendance = () => {
  const [filter, setFilter] = useState('day');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/attendance?filter=${filter}`);
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      alert('Failed to fetch attendance data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, [filter]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(attendanceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, `attendance_${filter}.xlsx`);
  };

  // Prepare data for heatmap: aggregate attendance count by studentId and date (or other logic)
  const heatmapData = attendanceData.map(record => ({
    x: new Date(record.timestamp).toLocaleDateString(),
    y: record.studentId,
    value: 1, // For simplicity, count 1 per record; can be aggregated if needed
  }));

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2>View Attendance</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="filter">Filter by: </label>
        <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="semester">Semester</option>
        </select>
        <button onClick={fetchAttendance} style={{ marginLeft: '1rem' }}>Refresh</button>
        <button onClick={exportToExcel} style={{ marginLeft: '1rem' }} disabled={attendanceData.length === 0}>Export to Excel</button>
      </div>
      {loading ? (
        <p>Loading attendance data...</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Student ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Class</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subject</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Teacher ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '8px' }}>No attendance records found.</td>
                </tr>
              ) : (
                attendanceData.map((record, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.studentId}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.class}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.subject}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.teacherId}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(record.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <h3>Attendance Heatmap</h3>
          <Heatmap data={heatmapData} width={800} height={400} />
        </>
      )}
    </div>
  );
};

export default ViewAttendance;
