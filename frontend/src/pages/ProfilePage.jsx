import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiHeaders } from '../api/apiClient';

export default function ProfilePage({ token, user, GATEWAY_URL }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!newPassword || !oldPassword) {
      setStatusMessage({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${GATEWAY_URL}/auth/change-password`, {
        method: 'POST',
        headers: getApiHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          email: user ? user.email : '',
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Your password has been updated successfully!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMessage({ type: 'error', text: data.error || data.message || 'Failed to update password.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error connecting to server: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">User Account Profile</h2>
          <p className="text-sm text-slate-400">View personal details and update account security credentials</p>
        </div>
      </div>

      {!token || !user ? (
        <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
          <p className="text-slate-400 mb-4">Please sign in to access your user profile.</p>
          <Link
            to="/auth"
            className="px-6 py-2.5 bg-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/20 inline-block"
          >
            Go to Sign In
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Details Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20 border border-cyan-400/30 mx-auto">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-bold text-slate-100 text-lg">{user.name || 'Registered User'}</h3>
                <p className="text-xs text-cyan-400 font-medium">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  {user.role || 'ROLE_USER'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Account ID:</span>
                <span className="font-mono text-slate-200">{user.id ? user.id.slice(-8) : 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <span className="text-emerald-400 font-semibold">Active & Authenticated</span>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="md:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Change Account Password</h3>
              <p className="text-xs text-slate-400">Update your security password to protect your account</p>
            </div>

            {statusMessage && (
              <div
                className={`p-4 rounded-xl border text-xs font-medium ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-950/50 border-red-500/30 text-red-300'
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Current Password *</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">New Password *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Updating Password...' : 'Submit Password Change'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
