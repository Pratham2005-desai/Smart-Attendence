import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './Generator.css';

function QRGenerator() {
  const [classCode, setClassCode] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [expiry, setExpiry] = useState(10);

  const generateQr = () => {
    if (!classCode || !subject || !teacherId) {
      alert('Please fill all fields');
      return;
    }
    const url = `${window.location.origin}/scan?class=${classCode}&subject=${subject}&tid=${teacherId}`;
    setQrValue(url);
  };

  return (
    <div className="qr-generator-container">
      <h2>QR Code Generator</h2>
      <div className="form-group">
        <label>Class:</label>
        <input type="text" value={classCode} onChange={(e) => setClassCode(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Subject:</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Teacher ID:</label>
        <input type="text" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Expiry (minutes):</label>
        <input type="number" value={expiry} onChange={(e) => setExpiry(e.target.value)} min="1" max="60" />
      </div>
      <button onClick={generateQr}>Generate QR Code</button>
      {qrValue && (
        <div className="qr-code">
          <QRCodeCanvas value={qrValue} size={256} />
          <p>Expires in: {expiry} minutes</p>
          <button onClick={() => setQrValue('')} style={{ marginTop: '1rem' }}>Close QR Code</button>
        </div>
      )}
    </div>
  );
}

export default QRGenerator;
