import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const StudentTimetable = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get(`/api/timetable/${user.class}`);
        const data = Array.isArray(res.data) ? res.data : res.data?.timetable || [];
        setTimetable(data);
      } catch (error) {
        console.error('❌ Failed to load timetable:', error);
        setTimetable([]); // fallback
      }
    };

    if (user?.class) fetchTimetable();
  }, [user]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <h2 style={{ color: '#004aad' }}>📅 Weekly Timetable</h2>
      {days.map(day => (
        <div key={day} style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: '#222' }}>{day}</h4>
          <ul style={{ paddingLeft: '1.2rem' }}>
            {Array.isArray(timetable) &&
              timetable
                .filter(entry => entry.day === day)
                .map(session => (
                  <li key={session._id} style={{ marginBottom: '0.3rem' }}>
                    <strong>{session.subject}</strong> with {session.teacher} (
                    {session.startTime} - {session.endTime})
                  </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default StudentTimetable;
