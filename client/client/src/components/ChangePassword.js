import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function ChangePassword() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (newPassword !== confirmNewPassword) {
      setMessage("❌ New passwords do not match.");
      return;
    }

    try {
      const res = await api.post('/api/auth/change-password', {
        email: user.email,
        currentPassword,
        newPassword,
      });
      setMessage("✅ Password updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Password update failed.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Change Password</h2>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Update Password</button>
      <p>{message}</p>
    </div>
  );
}

export default ChangePassword;
