import React, { useState, useEffect } from 'react';
import { User, Lock, Bell } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  // Load current user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  });

  const [fullname, setFullname] = useState(currentUser.fullname || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    currentUser.profile_photo 
      ? `http://localhost:5000/${currentUser.profile_photo}` 
      : ''
  );

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch fresh profile data on load
  useEffect(() => {
    if (currentUser.id) {
      axios.get(`http://localhost:5000/api/auth/profile/${currentUser.id}`)
        .then(res => {
          const user = res.data;
          setCurrentUser(user);
          setFullname(user.fullname || '');
          setEmail(user.email || '');
          if (user.profile_photo) {
            setPreviewUrl(`http://localhost:5000/${user.profile_photo}`);
          }
          localStorage.setItem('user', JSON.stringify(user));
        })
        .catch(err => console.error('Failed to fetch profile:', err));
    }
  }, [currentUser.id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!fullname || !email) {
      alert('Name and Email are required.');
      return;
    }

    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('email', email);
    if (selectedFile) {
      formData.append('profile_photo', selectedFile);
    }

    axios.put(`http://localhost:5000/api/auth/profile/${currentUser.id}`, formData)
      .then(res => {
        alert(res.data.message);
        const updatedUser = res.data.user;
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('authChange'));
      })
      .catch(err => {
        console.error('Failed to update profile:', err);
        alert(err.response?.data?.message || 'Error updating profile');
      });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    axios.post(`http://localhost:5000/api/auth/change-password/${currentUser.id}`, {
      currentPassword,
      newPassword
    })
      .then(res => {
        alert(res.data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(err => {
        console.error('Failed to change password:', err);
        alert(err.response?.data?.message || 'Error changing password');
      });
  };

  return (
    <div className="admin-animate-fade-in">

      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Settings
        </h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '20px'
        }}
      >

        {/* Sidebar */}
        <div
          style={{
            background: '#fff',
            padding: '15px',
            borderRadius: '12px'
          }}
        >
          <button
            className="admin-btn"
            style={{
              width: '100%',
              marginBottom: '10px',
              justifyContent: 'flex-start',
              background: activeTab === 'profile' ? 'var(--admin-accent-purple)' : 'transparent',
              color: activeTab === 'profile' ? '#fff' : 'var(--admin-text-primary)',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} />
            &nbsp; Profile
          </button>

          <button
            className="admin-btn"
            style={{
              width: '100%',
              marginBottom: '10px',
              justifyContent: 'flex-start',
              background: activeTab === 'password' ? 'var(--admin-accent-purple)' : 'transparent',
              color: activeTab === 'password' ? '#fff' : 'var(--admin-text-primary)',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveTab('password')}
          >
            <Lock size={16} />
            &nbsp; Password
          </button>

          <button
            className="admin-btn"
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              background: activeTab === 'notifications' ? 'var(--admin-accent-purple)' : 'transparent',
              color: activeTab === 'notifications' ? '#fff' : 'var(--admin-text-primary)',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} />
            &nbsp; Notifications
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            background: '#fff',
            padding: '25px',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <h3>Profile Settings</h3>

                {/* Profile Photo Display & Upload */}
                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', marginTop: '16px' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border-color)' }}>
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--admin-text-secondary)', fontSize: '0.8rem' }}>No Photo</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ cursor: 'pointer', display: 'inline-block', padding: '6px 12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border-color)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--admin-text-primary)', transition: 'background-color 0.2s' }}>
                      Choose Profile Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-secondary)' }}>Supported formats: JPG, PNG, GIF</span>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="admin-form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  className="admin-btn admin-btn-primary"
                  onClick={handleUpdateProfile}
                >
                  Update Profile
                </button>
              </motion.div>
            )}

            {activeTab === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <h3>Change Password</h3>

                <div className="admin-form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    className="admin-form-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="admin-form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="admin-form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  className="admin-btn admin-btn-primary"
                  onClick={handleChangePassword}
                >
                  Update Password
                </button>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <h3>Notification Settings</h3>

                <label
                  style={{
                    display: 'block',
                    marginBottom: '15px'
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                  />
                  {' '}
                  New Order Alerts
                </label>

                <label
                  style={{
                    display: 'block',
                    marginBottom: '15px'
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                  />
                  {' '}
                  Low Stock Alerts
                </label>

                <label
                  style={{
                    display: 'block',
                    marginBottom: '15px'
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                  />
                  {' '}
                  Customer Registration Alerts
                </label>

                <button
                  className="admin-btn admin-btn-primary"
                >
                  Save Settings
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}