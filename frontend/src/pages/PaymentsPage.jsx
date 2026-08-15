import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiHeaders } from '../api/apiClient';

export default function PaymentsPage({ token, user, GATEWAY_URL }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const isAdmin = user && (user.role === 'ROLE_ADMIN' || user.email === 'admin@example.com');

  const fetchPayments = async () => {
    if (!token || !user || !user.email) return;
    const url = isAdmin ? `${GATEWAY_URL}/payments` : `${GATEWAY_URL}/payments/user/${user.email}`;
    try {
      setLoading(true);
      const res = await fetch(url, {
        headers: getApiHeaders(token)
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token, user]);

  // Download PDF Invoice File
  const handleDownloadInvoicePdf = async (paymentId) => {
    if (!token) return;
    try {
      const res = await fetch(`${GATEWAY_URL}/payments/bill/${paymentId}`, {
        headers: getApiHeaders(token)
      });

      if (res.ok) {
        const blob = await res.blob();
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${paymentId.slice(-8)}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Failed to download PDF invoice');
      }
    } catch (err) {
      alert('Error downloading PDF invoice: ' + err.message);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this payment transaction record?")) return;
    try {
      const res = await fetch(`${GATEWAY_URL}/payments/${paymentId}`, {
        method: 'DELETE',
        headers: getApiHeaders(token)
      });
      if (res.ok) {
        if (selectedBill && selectedBill.id === paymentId) {
          setSelectedBill(null);
        }
        fetchPayments();
      } else {
        alert('Failed to delete payment transaction');
      }
    } catch (err) {
      alert('Error deleting payment: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Payments & Billing Invoices</h2>
          <p className="text-sm text-slate-400">View transaction history and download official PDF billing receipts</p>
        </div>
        <button
          onClick={fetchPayments}
          className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 hover:bg-slate-800 font-medium"
        >
          Refresh Payments
        </button>
      </div>

      {!token ? (
        <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
          <p className="text-slate-400 mb-4">Please sign in to view payment history and download PDF invoice bills.</p>
          <Link
            to="/auth"
            className="px-6 py-2.5 bg-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/20 inline-block"
          >
            Go to Sign In
          </Link>
        </div>
      ) : loading ? (
        <div className="py-20 text-center text-slate-400">Loading payment records...</div>
      ) : payments.length === 0 ? (
        <div className="py-16 text-center glass-card rounded-2xl border border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
          </div>
          <p className="text-slate-300 font-medium">No payment transactions recorded yet.</p>
          <p className="text-xs text-slate-500">Payments will automatically be processed when you book cinema tickets!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Payments Table */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Payment ID</th>
                    <th className="px-5 py-4 font-semibold">Movie</th>
                    <th className="px-5 py-4 font-semibold">Email</th>
                    <th className="px-5 py-4 font-semibold">Amount & Method</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-slate-400">{p.id ? p.id.slice(-8) : 'N/A'}</td>
                      <td className="px-5 py-4 font-bold text-slate-200">{p.movieTitle || 'Cinema Ticket'}</td>
                      <td className="px-5 py-4 text-xs text-cyan-400">{p.userEmail}</td>
                      <td className="px-5 py-4 text-xs">
                        <p className="font-bold text-emerald-400 text-sm">Rs. {p.amount ? p.amount.toLocaleString() : '0.00'}</p>
                        <p className="text-slate-400 text-[11px]">{p.paymentMethod || 'Card'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {p.status || 'SUCCESS'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right flex items-center justify-end gap-2 h-[68px]">
                        <button
                          onClick={() => setSelectedBill(p)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-750 transition-all"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadInvoicePdf(p.id)}
                          className="px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-lg border border-cyan-500/20 transition-all"
                          title="Download PDF"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => handleDeletePayment(p.id)}
                          className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg border border-red-500/20 transition-all"
                          title="Delete Transaction"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side: Selected Invoice Bill Viewer */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Receipt Preview</span>
              {selectedBill && (
                <button
                  onClick={() => handleDownloadInvoicePdf(selectedBill.id)}
                  className="text-xs text-cyan-400 hover:underline font-semibold"
                >
                  Download .pdf
                </button>
              )}
            </h3>

            {selectedBill ? (
              <div className="space-y-4">
                <pre className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                  {selectedBill.billingDetails || 'No receipt details generated.'}
                </pre>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                Click "View Bill" on any transaction to preview the official invoice receipt.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
