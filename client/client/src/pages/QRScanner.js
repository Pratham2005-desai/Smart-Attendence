import React, { useState } from 'react';
import axios from 'axios';

function QRScanner() {
  const [gps, setGps] = useState(null);
  const [status, setStatus] = useState('Waiting to scan...');

  const onScan = async (sessionId) => {
    if (!gps) {
      return setStatus("Location not available");
    }

    try {
      const res = await axios.post('/api/attendance/mark', {
        sessionId,
        location: gps
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setStatus(res.data.message);
    } catch (err) {
      setStatus('Failed to mark attendance');
    }
  };

  return (
    <div>
      <h3>Scan QR Code</h3>
      <QRReader
        delay={300}
        onError={(err) => console.error(err)}
        onScan={(data) => data && onScan(data)}
        style={{ width: '100%' }}
      />
      <p>{status}</p>
    </div>
  );
}

export default QRScanner;
