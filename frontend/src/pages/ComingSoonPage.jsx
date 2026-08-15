import React, { useState, useEffect } from 'react';
import { getApiHeaders } from '../api/apiClient';

export default function ComingSoonPage({ GATEWAY_URL = 'http://localhost:8080' }) {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState(null);

  // Fetch upcoming movies from API
  const fetchUpcomingMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${GATEWAY_URL}/movies/coming-soon`, {
        headers: getApiHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setUpcomingMovies(data);
      }
    } catch (err) {
      console.error('Error fetching upcoming movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingMovies();
  }, []);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('embed/')) return url;
      const urlObj = new URL(url);
      let videoId = '';
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get('v');
      }
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 p-8 sm:p-12 flex flex-col justify-center min-h-[220px] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_40%)]"></div>
        <div className="relative z-20 max-w-2xl space-y-3">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold w-max uppercase tracking-wider">
            🔜 Coming Soon
          </span>
          <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Upcoming Movies & Release Dates
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Get a sneak peek at the most anticipated international blockbusters and local Sinhala cinema releases heading to CineWave theaters.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading upcoming releases...</div>
      ) : upcomingMovies.length === 0 ? (
        <div className="py-16 text-center glass-card rounded-2xl border border-slate-800 p-8">
          <p className="text-slate-400 font-medium">No upcoming movies registered at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {upcomingMovies.map((movie) => (
            <div
              key={movie.id || movie._id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all hover:scale-[1.02] flex flex-col justify-between"
            >
              <div>
                {/* Poster Cover */}
                <div className="h-64 relative bg-slate-900 overflow-hidden group">
                  <img
                    src={movie.imageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Genre Tag */}
                  <span className="absolute top-3 left-3 bg-blue-600/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {movie.genre || 'Cinema'}
                  </span>
                  
                  {/* Trailer Overlay Button */}
                  {movie.trailerUrl && (
                    <button
                      onClick={() => setActiveTrailer(movie)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-full bg-cyan-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
                        <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </button>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-100 leading-tight">{movie.title}</h3>
                    <p className="text-[11px] text-cyan-400 font-medium">Director: {movie.director || 'N/A'}</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{movie.description}</p>
                </div>
              </div>

              {/* Release Date info & actions */}
              <div className="p-5 pt-0 mt-2 border-t border-slate-900/60 space-y-4">
                <div className="flex items-center justify-between text-xs pt-3">
                  <span className="text-slate-500 font-semibold">EXPECTED RELEASE:</span>
                  <span className="font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md px-2 py-0.5 font-mono">
                    {movie.expectedReleaseDate}
                  </span>
                </div>
                
                {movie.trailerUrl ? (
                  <button
                    onClick={() => setActiveTrailer(movie)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 text-cyan-400 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 16H5V8h9v8z" />
                    </svg>
                    <span>Watch Teaser / Trailer</span>
                  </button>
                ) : (
                  <div className="py-2 text-center text-slate-500 text-xs italic font-medium border border-dashed border-slate-850 rounded-xl">
                    Trailer coming soon
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trailer Modal overlay */}
      {activeTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="glass-card max-w-4xl w-full rounded-3xl overflow-hidden border border-slate-800 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
              <h3 className="font-bold text-slate-100 text-base sm:text-lg">{activeTrailer.title} - Official Trailer</h3>
              <button
                onClick={() => setActiveTrailer(null)}
                className="text-slate-400 hover:text-white font-semibold text-lg"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                title={`${activeTrailer.title} Trailer`}
                src={getYoutubeEmbedUrl(activeTrailer.trailerUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
