import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ token, user, handleLogout }) {
  const location = useLocation();

  const navItems = [
    { name: 'Movies Catalog', path: '/movies' },
    { name: 'Coming Soon', path: '/coming-soon' },
    { name: 'Offers', path: '/offers' },
    { name: 'Ticket Bookings', path: '/bookings' },
    { name: 'Payments & Invoices', path: '/payments' },
    { name: 'Notification Logs', path: '/notifications' }
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name - Clean SVG Icon */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H9l2 4H8L6 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                CineWave
              </span>
              <span className="text-[10px] block font-mono text-cyan-400/80 tracking-widest uppercase">
                Microservices Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth & Profile Actions */}
          <div className="flex items-center space-x-3">
            {token ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className={`hidden sm:block text-right px-3 py-1.5 rounded-xl border transition-all ${
                    location.pathname === '/profile'
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                      : 'border-slate-800 hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold">{user?.name || 'My Profile'}</p>
                  <p className="text-[10px] text-cyan-400">{user?.email}</p>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl border border-red-500/20 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
