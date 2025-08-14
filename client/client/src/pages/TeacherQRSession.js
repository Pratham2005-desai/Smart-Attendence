import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

function TeacherQRSession() {
  const [duration, setDuration] = useState(30);
  const [location, setLocation] = useState({ lat: '', lon: '' });
  const [sessionId, setSessionId] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const [status, setStatus] = useState('');

  const createSession = async () => {
    if (!location.lat || !location.lon) {
      setStatus('Please enter valid latitude and longitude');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/attendance/session/create', {
        duration,
        location: { lat: parseFloat(location.lat), lon: parseFloat(location.lon), radius: 100 }
      });
      setSessionId(res.data.sessionId);
      setExpiry(new Date(res.data.expiry).toLocaleString());
      setStatus('QR session created');
    } catch (err) {
      setStatus('Failed to create session');
    }
  };

  const closeSession = async () => {
    if (!sessionId) {
      setStatus('No active session to close');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/attendance/session/close', { sessionId });
      setStatus('QR session closed');
      setSessionId(null);
      setExpiry(null);
    } catch (err) {
      setStatus('Failed to close session');
    }
  };

  return (
    <div>
      <h2>Teacher QR Session Management</h2>
      <div>
        <label>Duration (minutes): </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min="1"
          max="120"
        />
      </div>
      <div>
        <label>Latitude: </label>
        <input
          type="text"
          value={location.lat}
          onChange={(e) => setLocation({ ...location, lat: e.target.value })}
          placeholder="e.g. 19.123"
        />
      </div>
      <div>
        <label>Longitude: </label>
        <input
          type="text"
          value={location.lon}
          onChange={(e) => setLocation({ ...location, lon: e.target.value })}
          placeholder="e.g. 72.345"
        />
      </div>
      <button onClick={createSession} disabled={sessionId !== null}>Create QR Session</button>
      <button onClick={closeSession} disabled={sessionId === null}>Close QR Session</button>
      {sessionId && (
        <>
          <p>Session ID: {sessionId}</p>
          <p>Expires at: {expiry}</p>
          <div style={{ marginTop: '1rem' }}>
            <QRCodeCanvas value={sessionId} size={256} />
          </div>
        </>
      )}
      <p>Status: {status}</p>
    </div>
  );
}

export default TeacherQRSession;
