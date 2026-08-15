import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: "https://image.tmdb.org/t/p/w1280/eGX66zonvc4bXg3rM08RUxdYSDx.jpg",
    title: "Superman",
    tagline: "A legendary hero returns to balance his Kryptonian heritage with his human upbringing."
  },
  {
    image: "https://image.tmdb.org/t/p/w1280/zNriRTr0kWwyaXPzdg1EIxf0BWk.jpg",
    title: "Jurassic World: Rebirth",
    tagline: "A new expedition ventures into isolated equatorial regions to secure crucial dinosaur DNA."
  },
  {
    image: "https://image.tmdb.org/t/p/w1280/538U9snNc2fpnOmYXAPUh3zn31H.jpg",
    title: "Mission: Impossible – The Final Reckoning",
    tagline: "Ethan Hunt and the IMF team embark on their final, most dangerous globetrotting mission yet."
  },
  {
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600",
    title: "Cinematic Experience",
    tagline: "Discover premium cinema screenings across Sri Lankan towns."
  }
];

const cinemas = [
  {
    id: "scope-colombo",
    name: "Scope Cinemas - Colombo City Centre",
    town: "Colombo",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80",
    description: "Experience the ultimate in cinema entertainment with state-of-the-art Dolby Atmos sound and laser projection at the Colombo City Centre Mall.",
    movieIndices: [0, 1, 2, 3]
  },
  {
    id: "regal-kandy",
    name: "Regal Cinema - Kandy Town",
    town: "Kandy",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    description: "A heritage theater blending classical architecture with modern digital surround sound and high-back luxury seating in the heart of Kandy.",
    movieIndices: [4, 5, 6, 7]
  },
  {
    id: "queens-galle",
    name: "Queens Cinema - Galle Fort",
    town: "Galle",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    description: "Enjoy your favorite blockbusters in a beautifully restored colonial theater located near the historic Dutch Galle Fort.",
    movieIndices: [8, 0, 1, 2]
  },
  {
    id: "cinecity-jaffna",
    name: "Cine City - Jaffna Plaza",
    town: "Jaffna",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80",
    description: "The premier movie hub in the Northern province, featuring multi-screen projection, cozy recliner seats, and a modern dining lounge.",
    movieIndices: [3, 4, 5, 6]
  },
  {
    id: "savoy-negombo",
    name: "Savoy 3D Cinema - Negombo Beach",
    town: "Negombo",
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&auto=format&fit=crop&q=80",
    description: "Experience high-definition 3D blockbusters with active glasses, premium sound systems, and a relaxing breeze near the Negombo beach road.",
    movieIndices: [7, 8, 0, 1]
  }
];

export default function MoviesPage({ movies, loading, setSelectedMovie, setShowAddMovieModal, fetchMovies, user }) {
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [activeMovieId, setActiveMovieId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (selectedCinema) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedCinema]);

  const handleSelectCinema = (cinema) => {
    setSelectedCinema(cinema);
    setActiveMovieId(null);
    setSearchQuery('');
    setSelectedGenre('ALL');
  };

  const handleBackToCinemas = () => {
    setSelectedCinema(null);
    setActiveMovieId(null);
  };

  // Helper to get 4 movies for the chosen cinema
  const getCinemaMovies = () => {
    if (!selectedCinema || !movies || movies.length === 0) return [];
    
    // Map movies by index based on selected cinema indices
    const cinemaMovies = selectedCinema.movieIndices
      .map(idx => movies[idx])
      .filter(Boolean); // filter out undefined if list size < index

    // Apply search and genre filters on the 4 movies
    return cinemaMovies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (movie.director && movie.director.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (movie.description && movie.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGenre = selectedGenre === 'ALL' || movie.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  };

  const currentCinemaMovies = getCinemaMovies();
  const activeMovie = movies.find(m => m.id === activeMovieId);

  // Genres from current cinema's movies
  const getAvailableGenres = () => {
    if (!selectedCinema) return ['ALL'];
    const cinemaMovies = selectedCinema.movieIndices.map(idx => movies[idx]).filter(Boolean);
    return ['ALL', ...new Set(cinemaMovies.map((m) => m.genre).filter(Boolean))];
  };

  const genres = getAvailableGenres();

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {selectedCinema ? `${selectedCinema.town} - Movies Catalog` : 'Select a Cinema Hall'}
          </h2>
          <p className="text-sm text-slate-400">
            {selectedCinema 
              ? `Explore active movie screenings at ${selectedCinema.name}` 
              : 'Choose a cinema hall from Sri Lankan cities to view available movies'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedCinema && (
            <button
              onClick={handleBackToCinemas}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-semibold text-slate-300 transition-all flex items-center space-x-2"
            >
              <span>← Back to Cinemas</span>
            </button>
          )}
          {user && (user.role === 'ROLE_ADMIN' || user.email === 'admin@example.com') && (
            <button
              onClick={() => setShowAddMovieModal(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-semibold text-cyan-400 transition-all flex items-center space-x-1"
            >
              <span>+ Add Movie</span>
            </button>
          )}
          <button
            onClick={fetchMovies}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            title="Refresh Catalog"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main View Grid */}
      {!selectedCinema ? (
        <div className="space-y-8">
          {/* Slideshow Banner */}
          <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 h-[280px] sm:h-[350px] shadow-2xl flex items-center justify-center text-center px-6">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-55' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/60 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
              </div>
            ))}

            {/* Overlaid details on transparent backdrop */}
            <div className="relative z-10 max-w-2xl bg-slate-950/50 backdrop-blur-md border border-slate-800/80 px-8 py-6 sm:py-8 rounded-3xl space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Select a Cinema Hall
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-semibold tracking-wide max-w-lg mx-auto">
                Choose a cinema hall from Sri Lankan cities to view available movies
              </p>
            </div>
          </div>

          {/* Step 1: Cinema Hall Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {cinemas.map((cinema) => (
              <div
                key={cinema.id}
                onClick={() => handleSelectCinema(cinema)}
                className="glass-card rounded-3xl overflow-hidden border border-slate-850 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.03] hover:shadow-cyan-500/5 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 relative bg-slate-900 overflow-hidden">
                    <img
                      src={cinema.image}
                      alt={cinema.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <span className="absolute top-3 left-3 bg-cyan-500/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      📍 {cinema.town}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors leading-snug">
                      {cinema.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {cinema.description}
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <div className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs text-center group-hover:bg-cyan-500/10 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all">
                    Browse 4 Movies →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Step 2: Selected Cinema View */
        <div className="space-y-8">
          {/* Cinema Banner Details Header */}
          <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 p-6 sm:p-10 flex flex-col justify-center min-h-[220px] shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
            <img 
              src={selectedCinema.image} 
              alt={selectedCinema.name}
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
            />
            <div className="relative z-20 max-w-3xl space-y-3">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-bold w-max uppercase tracking-wider">
                📍 {selectedCinema.town} Province Screenings
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-100 leading-tight">
                {selectedCinema.name}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {selectedCinema.description}
              </p>
            </div>
          </div>

          {/* Search and Genre Filters on the 4 Movies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            <div className="relative md:col-span-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search movies in this cinema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              )}
            </div>

            <div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                <option value="ALL">All Genres ({genres.length - 1})</option>
                {genres.filter(g => g !== 'ALL').map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 4 Movies List Grid */}
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading cinema movies...</div>
          ) : currentCinemaMovies.length === 0 ? (
            <div className="py-12 text-center glass-card rounded-2xl border border-slate-800 text-slate-400">
              No movies matched search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentCinemaMovies.map((movie) => {
                const isActive = movie.id === activeMovieId;
                return (
                  <div
                    key={movie.id || movie._id}
                    onClick={() => setActiveMovieId(movie.id)}
                    className={`glass-card rounded-3xl overflow-hidden border cursor-pointer transition-all flex flex-col justify-between ${
                      isActive 
                        ? 'border-cyan-500 shadow-lg shadow-cyan-500/5 scale-[1.01]' 
                        : 'border-slate-850 hover:border-slate-750 hover:scale-[1.01]'
                    }`}
                  >
                    <div>
                      <div className="h-60 relative overflow-hidden bg-slate-900">
                        <img
                          src={movie.imageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-[10px] font-bold text-amber-400">
                          ★ {movie.rating || 4.5}
                        </div>
                        <div className="absolute bottom-3 left-3 bg-cyan-500/90 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                          {movie.genre || 'Cinema'}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="text-base font-bold text-slate-100 line-clamp-1">{movie.title}</h3>
                        <p className="text-[10px] text-cyan-400 font-semibold">Director: {movie.director}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{movie.description}</p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-900/60 mt-2 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase font-bold">Price</p>
                        <p className="text-sm font-extrabold text-cyan-400 font-mono">Rs. {movie.ticketPrice ? movie.ticketPrice.toLocaleString() : '1,500'}</p>
                      </div>
                      <span className="text-[11px] text-cyan-400 font-bold hover:underline">
                        View Details {isActive ? '↓' : '→'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Movie Detail View & Booking Trigger */}
          {activeMovie && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/60 backdrop-blur-lg grid grid-cols-1 md:grid-cols-3 gap-8 items-center animate-fade-in">
              <div className="md:col-span-1 h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={activeMovie.imageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'}
                  alt={activeMovie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-2 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                      {activeMovie.genre}
                    </span>
                    <span className="text-sm font-bold text-amber-400 flex items-center space-x-1">
                      <span>★</span> <span>{activeMovie.rating || 4.5}</span>
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-100">{activeMovie.title}</h3>
                  <p className="text-xs sm:text-sm font-bold text-cyan-400/80">Directed by {activeMovie.director || 'N/A'}</p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeMovie.description || 'No description available for this cinematic release.'}
                </p>

                {/* Showtimes and Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800/80 pt-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">STANDARD SCREENINGS</span>
                    <div className="flex flex-wrap gap-2">
                      {['10:30 AM', '12:30 PM', '04:30 PM', '06:30 PM'].map((time) => (
                        <span key={time} className="px-2.5 py-1 bg-slate-950/60 border border-slate-850 rounded-lg text-slate-300 font-medium">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 font-bold block mb-1">TICKET PRICE</span>
                    <p className="text-xl font-black text-emerald-400 font-mono">
                      Rs. {activeMovie.ticketPrice ? activeMovie.ticketPrice.toLocaleString() : '1,500'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      // Trigger booking flow. Pre-populate cinema hall and movie details
                      setSelectedMovie(activeMovie);
                      // Add specific configuration for preselecting the cinema
                      if (window.preselectCinema) {
                        window.preselectCinema(selectedCinema.name);
                      }
                    }}
                    className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>🎬 Book Tickets for {activeMovie.title}</span>
                  </button>
                  <button
                    onClick={() => setActiveMovieId(null)}
                    className="py-3.5 px-6 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-2xl text-xs font-semibold"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
