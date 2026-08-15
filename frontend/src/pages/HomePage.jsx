import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage({ movies, setSelectedMovie }) {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Banner with Main Featured Image */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
        <Link to="/" className="block cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80"
            alt="Main Cinema Banner"
            className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-105 transition-all duration-700"
          />
        </Link>
        <div className="absolute inset-0 z-20 p-8 sm:p-12 flex flex-col justify-center max-w-2xl space-y-4">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-bold w-max uppercase tracking-wider">
            Cinema & Ticket Microservices Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Experience Next-Gen Cinema Bookings
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Powered by a distributed architecture with API Gateway orchestration, OAuth 2.0 security, and automated email/SMS notifications.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/movies"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/25 transition-all"
            >
              Browse Movies Catalog
            </Link>
            <Link
              to="/coming-soon"
              className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all"
            >
              View Coming Soon Movies
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Topic Cards */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Explore Microservice Domains</h2>
          <p className="text-sm text-slate-400">Integrated modules across the system architecture</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <Link to="/movies" className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xl mb-4 border border-cyan-500/20">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H9l2 4H8L6 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Movies Catalog</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Browse movie catalog, filter by genre, view director details, and add new movie titles.
              </p>
            </div>
          </Link>

          <Link to="/coming-soon" className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xl mb-4 border border-blue-500/20">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 16H5V8h9v8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Coming Soon</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Upcoming movies, release dates, genre tags, synopses, and official teaser trailers.
              </p>
            </div>
          </Link>

          <Link to="/offers" className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl mb-4 border border-amber-500/20">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.5 2.5 0 0 0-5-0c0 .35.07.69.18 1H9.82C9.93 5.69 10 5.35 10 5a2.5 2.5 0 0 0-5-0c0 .35.07.69.18 1H3c-1.1 0-1.99.9-1.99 2L1 18c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5-1c0-.55.45-1 1-1s1 .45 1 1s-.45 1-1 1s-1-.45-1-1zm-10 0c0-.55.45-1 1-1s1 .45 1 1s-.45 1-1 1s-1-.45-1-1zm12 13H3v-2h14v2zm0-5H3V8h14v5z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Offers & Promos</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Copy student discount codes, browse special combos, and couple/family weekend promotion packages.
              </p>
            </div>
          </Link>

          <Link to="/bookings" className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl mb-4 border border-emerald-500/20">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46s-.81-2.77-2-3.46V6h16v2.54z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Ticket Bookings</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Select seats, place ticket reservations, view live price calculations, and manage active bookings.
              </p>
            </div>
          </Link>

          <Link to="/notifications" className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xl mb-4 border border-indigo-500/20">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Notification Logs</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Real-time booking confirmation emails, SMS alerts, and notification history logs.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Movies Horizontal Scroll / Grid */}
      {movies && movies.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-100">Featured Now Showing</h2>
            <Link to="/movies" className="text-xs font-semibold text-cyan-400 hover:underline">View All Movies →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.slice(0, 4).map((movie) => (
              <div key={movie.id} className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between p-4">
                <div>
                  <img src={movie.imageUrl} alt={movie.title} className="w-full h-40 object-cover rounded-xl mb-3" />
                  <h4 className="font-bold text-slate-100 text-base">{movie.title}</h4>
                  <p className="text-xs text-cyan-400 font-medium">{movie.genre}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-extrabold text-emerald-400 text-base">Rs. {movie.ticketPrice ? movie.ticketPrice.toLocaleString() : '1,500'}</span>
                  <button
                    onClick={() => setSelectedMovie(movie)}
                    className="px-3 py-1.5 bg-cyan-500 text-white rounded-lg text-xs font-bold"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
