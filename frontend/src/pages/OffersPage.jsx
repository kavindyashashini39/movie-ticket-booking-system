import React, { useState, useEffect } from 'react';
import { getApiHeaders } from '../api/apiClient';

export default function OffersPage({ token, GATEWAY_URL = 'http://localhost:8080' }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [copiedCode, setCopiedCode] = useState('');

  // Fetch offers from API
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${GATEWAY_URL}/movies/offers`, {
        headers: getApiHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setOffers(data);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const filteredOffers = filterType === 'ALL'
    ? offers
    : offers.filter(offer => offer.type === filterType);

  return (
    <div className="space-y-8 py-4">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 p-8 sm:p-12 flex flex-col justify-center min-h-[220px] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.15),transparent_40%)]"></div>
        <div className="relative z-20 max-w-2xl space-y-3">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-bold w-max uppercase tracking-wider">
            🎁 CineWave Promos
          </span>
          <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Exclusive Movie Offers & Promos
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Maximize your cinema experience with our special discount coupon codes, seasonal promotions, and family ticket bundles.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'DISCOUNT', 'PROMOTION', 'SPECIAL_PACKAGE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                filterType === type
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
        <button
          onClick={fetchOffers}
          className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-850"
        >
          Refresh Offers
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading promotional packages...</div>
      ) : filteredOffers.length === 0 ? (
        <div className="py-16 text-center glass-card rounded-2xl border border-slate-800 p-8">
          <p className="text-slate-400 font-medium">No offers found for the selected category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id || offer._id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all hover:scale-[1.02] flex flex-col justify-between"
            >
              <div>
                {/* Visual Header / Cover */}
                <div className="h-44 relative bg-slate-900 overflow-hidden">
                  <img
                    src={offer.imageUrl || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80'}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Category Tag */}
                  <span className="absolute top-3 left-3 bg-cyan-500/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {offer.type.replace('_', ' ')}
                  </span>
                  
                  {/* Value Tag */}
                  <div className="absolute bottom-3 right-3 text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Value</p>
                    <p className="text-xl font-black text-emerald-400">{offer.discountValue}% OFF</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-slate-100 leading-tight">{offer.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">{offer.description}</p>
                </div>
              </div>

              {/* Promo Actions & Info */}
              <div className="p-5 pt-0 border-t border-slate-900/60 mt-2 space-y-4">
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3">
                  <span>VALID UNTIL:</span>
                  <span className="font-semibold text-slate-300 font-mono">{offer.validUntil || 'Dec 31, 2026'}</span>
                </div>
                
                {offer.code ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-center text-xs font-mono font-bold tracking-widest text-cyan-400 select-all">
                      {offer.code}
                    </div>
                    <button
                      onClick={() => handleCopyCode(offer.code)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        copiedCode === offer.code
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {copiedCode === offer.code ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ) : (
                  <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition-all">
                    Claim Offer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
