import React, { useState } from 'react';
import { getApiHeaders } from '../api/apiClient';

export default function NotificationsPage({ token, user, notifications, fetchNotifications, handleDeleteNotification, GATEWAY_URL }) {
  const [selectedNotification, setSelectedNotification] = useState(null);

  const isAdmin = user && (user.role === 'ROLE_ADMIN' || user.email === 'admin@example.com');
  const displayedNotifications = isAdmin
    ? notifications
    : notifications.filter((n) => n.userEmail === (user ? user.email : ''));

  const handleNotificationClick = async (notif) => {
    setSelectedNotification(notif);

    // If it's already read, no need to send PUT request
    if (notif.readStatus) return;

    try {
      const res = await fetch(`${GATEWAY_URL}/notifications/${notif.id}/read`, {
        method: 'PUT',
        headers: getApiHeaders(token)
      });
      if (res.ok) {
        // Refresh notifications list to update read statuses dynamically
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Notification Logs</h2>
          <p className="text-sm text-slate-400">Automated booking confirmations and system alerts</p>
        </div>
        <button
          onClick={fetchNotifications}
          className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 hover:bg-slate-800 font-medium transition-all"
        >
          Refresh Notifications
        </button>
      </div>

      {!token ? (
        <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
          <p className="text-slate-400">Please sign in to view notification history.</p>
        </div>
      ) : displayedNotifications.length === 0 ? (
        <div className="py-16 text-center glass-card rounded-2xl border border-slate-800 p-8 space-y-3">
          <p className="text-slate-300 font-medium">No notification logs recorded.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedNotifications.map((n) => {
            const isUnread = !n.readStatus;
            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group hover:scale-[1.01] ${
                  isUnread
                    ? 'border-cyan-500/50 bg-slate-900/60 shadow-[0_0_12px_rgba(6,182,212,0.08)]'
                    : 'border-slate-850 bg-slate-950/40 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      isUnread 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-850 text-slate-400 border border-slate-800'
                    }`}>
                      {n.type || 'EMAIL'}
                    </span>
                    <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                      </span>
                      <button
                        onClick={() => handleDeleteNotification(n.id)}
                        className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold rounded-lg border border-red-500/20 transition-all"
                        title="Delete notification"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Subject and Read/Unread indicator */}
                  <h4 className="font-bold text-slate-200 text-sm mt-2.5 flex items-center">
                    {isUnread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse mr-2 flex-shrink-0 shadow-[0_0_6px_#22d3ee]"></span>
                    )}
                    <span className="line-clamp-1">{n.subject}</span>
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-1.5">{n.message}</p>
                </div>
                
                <p className="text-[10px] text-slate-500 font-mono border-t border-slate-900/60 pt-2 flex items-center justify-between">
                  <span>To: {n.userEmail}</span>
                  <span className="text-cyan-400 font-bold uppercase tracking-wider text-[9px] group-hover:underline">
                    {isUnread ? "Read Info →" : "View details"}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Notification Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-md w-full space-y-5 shadow-2xl relative animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider">
                  {selectedNotification.type || 'SYSTEM'}
                </span>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Received: {selectedNotification.timestamp ? new Date(selectedNotification.timestamp).toLocaleString() : 'Just now'}
                </p>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-4 text-xs leading-relaxed">
              <div>
                <h3 className="text-slate-100 font-bold text-sm mb-1 uppercase tracking-wide">Subject</h3>
                <p className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-850 font-medium">
                  {selectedNotification.subject}
                </p>
              </div>

              <div>
                <h3 className="text-slate-100 font-bold text-sm mb-1 uppercase tracking-wide">Message Content</h3>
                <p className="text-slate-350 bg-slate-900/60 p-4 rounded-xl border border-slate-850 whitespace-pre-wrap leading-relaxed font-mono">
                  {selectedNotification.message}
                </p>
              </div>

              <div>
                <h3 className="text-slate-100 font-bold text-[10px] mb-1 uppercase tracking-wide">Recipient Details</h3>
                <p className="text-slate-400 font-mono">userEmail: {selectedNotification.userEmail}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedNotification(null)}
                className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
