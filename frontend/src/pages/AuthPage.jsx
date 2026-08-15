import React, { useState } from 'react';
import { getApiHeaders } from '../api/apiClient';

export default function AuthPage({ handleAuthSuccess, GATEWAY_URL }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [userRole, setUserRole] = useState('user'); // 'user' | 'admin'
  const [adminSecretCode, setAdminSecretCode] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    // Admin Secret Security Passcode Check
    if (userRole === 'admin') {
      const validAdminCodes = ['ADMIN123', 'admin123', 'ADMIN2026', 'admin'];
      if (!adminSecretCode || !validAdminCodes.includes(adminSecretCode.trim())) {
        setAuthError('❌ Invalid Admin Secret Security Passcode! Only authorized administrators can access Admin Role.');
        return;
      }
    }

    const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
    const roleValue = userRole === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER';
    const payload = authMode === 'login' 
      ? { email: authEmail, password: authPassword }
      : { name: authName, email: authEmail, password: authPassword, role: roleValue };

    try {
      const res = await fetch(`${GATEWAY_URL}${endpoint}`, {
        method: 'POST',
        headers: getApiHeaders(null, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });
      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = {};
      }

      if (res.ok) {
        setAuthSuccess(authMode === 'login' ? 'Login successful!' : 'Registration successful!');
        
        // Ensure user object has role populated correctly
        const authUser = data.user || {};
        if (userRole === 'admin' || authEmail === 'admin@example.com') {
          authUser.role = 'ROLE_ADMIN';
        }
        handleAuthSuccess(data.token, authUser);
      } else {
        setAuthError(data.error || data.message || `Authentication failed (Status ${res.status})`);
      }
    } catch (err) {
      setAuthError('Cannot connect to API Gateway at ' + GATEWAY_URL + '. Please verify the backend services are running.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {authMode === 'login' ? 'Account Login' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-400">
            Secure Authentication Portal
          </p>
        </div>

        {authError && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-medium text-center">
            {authError}
          </div>
        )}

        {authSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-medium text-center">
            {authSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selector (User vs Admin) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Select Account Role</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => { setUserRole('user'); setAuthError(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                  userRole === 'user'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>👤 Student / Customer</span>
              </button>
              <button
                type="button"
                onClick={() => { setUserRole('admin'); setAuthError(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                  userRole === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🛡️ Administrator</span>
              </button>
            </div>
          </div>

          {/* Secret Passcode Field for Admin Role */}
          {userRole === 'admin' && (
            <div className="animate-fade-in">
              <label className="block text-xs font-bold text-amber-400 mb-1.5">
                Admin Secret Security Passcode *
              </label>
              <input
                type="password"
                required
                value={adminSecretCode}
                onChange={(e) => setAdminSecretCode(e.target.value)}
                placeholder="Enter Secret Code (e.g. ADMIN123)"
                className="w-full px-4 py-2.5 bg-slate-900 border border-amber-500/50 rounded-xl text-sm text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
              <p className="text-[10px] text-slate-500 mt-1">Authorized admins only. Secret passcode required to sign in as admin.</p>
            </div>
          )}

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-10 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors p-1"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a19.49 19.49 0 015.63-5.63m4.24-1.37a10.05 10.05 0 012.13-.3c7 0 10 7 10 7a19.49 19.49 0 01-3.63 4.63m-3.24 1.37a3 3 0 11-4.24-4.24M1 1l22 22" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition-all mt-2"
          >
            {authMode === 'login' ? 'Sign In & Authenticate' : 'Register Account'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login');
              setAuthError('');
              setAuthSuccess('');
            }}
            className="text-xs text-cyan-400 hover:underline font-medium"
          >
            {authMode === 'login' ? "Don't have an account? Register here" : 'Already registered? Log in here'}
          </button>
        </div>
      </div>
    </div>
  );
}
