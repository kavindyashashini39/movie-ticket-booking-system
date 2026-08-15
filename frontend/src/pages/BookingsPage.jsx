import React from 'react';
import { Link } from 'react-router-dom';

export default function BookingsPage({ token, user, bookings, fetchBookings, handleCancelBooking, onOpenBookingModal }) {
  const isAdmin = user && (user.role === 'ROLE_ADMIN' || user.email === 'admin@example.com');
  const displayedBookings = isAdmin
    ? bookings
    : bookings.filter((b) => b.userEmail === (user ? user.email : ''));

  return (
    <div className="space-y-6 py-4">
      {/* Top Bar with Title and "Book New Ticket" Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            {isAdmin ? 'All Ticket Bookings Registry (Admin View)' : 'My Ticket Bookings'}
          </h2>
          <p className="text-sm text-slate-400">
            {isAdmin ? 'View and manage all customer ticket reservations across the system' : 'View your active ticket reservations'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onOpenBookingModal(null)}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all"
          >
            <span>+ Book New Ticket</span>
          </button>
          <button
            onClick={fetchBookings}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm hover:bg-slate-800 text-slate-300 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {!token ? (
        <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
          <p className="text-slate-400 mb-4">Please sign in to view active ticket bookings directory.</p>
          <Link
            to="/auth"
            className="px-6 py-2.5 bg-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/20 inline-block"
          >
            Go to Sign In
          </Link>
        </div>
      ) : displayedBookings.length === 0 ? (
        <div className="py-16 text-center glass-card rounded-2xl border border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46s-.81-2.77-2-3.46V6h16v2.54zM11 7h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"/>
            </svg>
          </div>
          <p className="text-slate-300 font-medium">No active ticket bookings found.</p>
          <button
            onClick={() => onOpenBookingModal(null)}
            className="px-6 py-2.5 bg-cyan-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20 inline-block"
          >
            + Create First Booking
          </button>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Booking ID</th>
                  <th className="px-6 py-4 font-semibold">Movie</th>
                  <th className="px-6 py-4 font-semibold">Customer Details</th>
                  <th className="px-6 py-4 font-semibold">Show Schedule</th>
                  <th className="px-6 py-4 font-semibold">Tickets</th>
                  <th className="px-6 py-4 font-semibold">Total & Payment</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {displayedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{b.id ? b.id.slice(-8) : 'N/A'}</td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-bold text-slate-200 text-sm">{b.movieTitle}</p>
                      {b.cinemaHall && (
                        <p className="text-[10px] text-amber-400 font-semibold mt-0.5">{b.cinemaHall}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-bold text-slate-100">{b.customerName || 'N/A'}</p>
                      <p className="text-cyan-400">{b.userEmail}</p>
                      <p className="text-slate-500">{b.contactNumber || ''}</p>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-semibold text-slate-300">{b.showDate || 'Today'}</p>
                      <p className="text-slate-400">{b.showTime || '10:30 AM'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-bold text-slate-100 text-sm">{b.numberOfTickets}</p>
                      {b.selectedSeats && (
                        <p className="text-[10px] text-cyan-400 font-mono mt-0.5">Seats: {b.selectedSeats}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-bold text-emerald-400 text-sm">Rs. {b.totalPrice ? b.totalPrice.toLocaleString() : '0'}</p>
                      <p className="text-slate-400 text-[11px]">{b.paymentMethod || 'Card'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        b.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg border border-red-500/20 transition-all"
                      >
                        Cancel Booking
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
