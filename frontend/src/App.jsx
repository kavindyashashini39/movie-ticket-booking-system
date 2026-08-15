import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import BookingsPage from './pages/BookingsPage';
import PaymentsPage from './pages/PaymentsPage';
import NotificationsPage from './pages/NotificationsPage';
import OffersPage from './pages/OffersPage';
import ComingSoonPage from './pages/ComingSoonPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

// Central API Client
import { GATEWAY_URL, CLIENT_SECRET, getApiHeaders } from './api/apiClient';

function MainApp() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_data') || 'null'));

  // Data States
  const [movies, setMovies] = useState([
    { id: '1', title: 'Dharmayuddhaya 2', genre: 'Sinhala Crime / Thriller', description: 'A thrilling Sri Lankan crime drama following the aftermath of a family protector\'s struggle.', director: 'Aruna Jayawardena', rating: 4.6, ticketPrice: 1500.0, availableSeats: 80, imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Dharmayuddhaya_sinhala_film.jpg' },
    { id: '2', title: 'Riverstone', genre: 'Sinhala Thriller / Drama', description: 'A deep Sri Lankan drama investigating mysterious happenings around the scenic Riverstone hills.', director: 'Lalith Rathnayake', rating: 4.4, ticketPrice: 1400.0, availableSeats: 85, imageUrl: 'https://img.youtube.com/vi/bx4dGkZnhNI/hqdefault.jpg' },
    { id: '3', title: 'Room No 106', genre: 'Sinhala Thriller', description: 'A suspenseful hotel mystery movie set inside a locked room with dark secrets.', director: 'Suranga de Alwis', rating: 4.2, ticketPrice: 1500.0, availableSeats: 70, imageUrl: 'https://img.youtube.com/vi/HSgpBtfxbOA/hqdefault.jpg' },
    { id: '4', title: 'Father', genre: 'Sinhala Drama', description: 'A touching Sri Lankan family drama exploring paternal love and emotional reconciliation.', director: 'Suranga de Alwis', rating: 4.3, ticketPrice: 1300.0, availableSeats: 90, imageUrl: 'https://img.youtube.com/vi/bx4dGkZnhNI/hqdefault.jpg' },
    { id: '5', title: 'F1: The Movie', genre: 'English Action / Sport / Drama', description: 'An adrenaline-fueled sports drama about a veteran Formula One driver coming out of retirement.', director: 'Joseph Kosinski', rating: 7.6, ticketPrice: 2000.0, availableSeats: 100, imageUrl: 'https://image.tmdb.org/t/p/w500/9PXZIUsSDh4alB80jheWX4fhZmy.jpg' },
    { id: '6', title: 'Superman', genre: 'English Action / Adventure / Sci-Fi', description: 'A legendary hero returns to balance his Kryptonian heritage with his human upbringing.', director: 'James Gunn', rating: 7.0, ticketPrice: 2200.0, availableSeats: 95, imageUrl: 'https://image.tmdb.org/t/p/w500/uXIQDjEamAbBAZ79y6OhvcAKOzs.jpg' },
    { id: '7', title: 'Jurassic World: Rebirth', genre: 'English Action / Adventure / Sci-Fi', description: 'A new expedition ventures into isolated equatorial regions to secure crucial dinosaur DNA.', director: 'Gareth Edwards', rating: 5.8, ticketPrice: 2000.0, availableSeats: 85, imageUrl: 'https://image.tmdb.org/t/p/w500/1RICxzeoNCAO5NpcRMIgg1XT6fm.jpg' },
    { id: '8', title: 'Mission: Impossible – The Final Reckoning', genre: 'English Action / Spy / Thriller', description: 'Ethan Hunt and the IMF team embark on their final, most dangerous globetrotting mission yet.', director: 'Christopher McQuarrie', rating: 7.1, ticketPrice: 2200.0, availableSeats: 90, imageUrl: 'https://image.tmdb.org/t/p/w500/iKPsC9EFUafRP9SrUznI61getVP.jpg' },
    { id: '9', title: 'Coolie', genre: 'Tamil Action / Crime / Thriller', description: 'A high-octane action thriller highlighting the intense gold smuggling operations in port cities.', director: 'Lokesh Kanagaraj', rating: 6.0, ticketPrice: 1800.0, availableSeats: 95, imageUrl: 'https://image.tmdb.org/t/p/w500/1DTgscsgScjTicF4tHiYcoOke1y.jpg' },
    { id: '10', title: 'Good Bad Ugly', genre: 'Tamil Action / Crime / Drama', description: 'An epic crime thriller exploring the grey zones of a three-way battle for control.', director: 'Adhik Ravichandran', rating: 5.3, ticketPrice: 1700.0, availableSeats: 80, imageUrl: 'https://image.tmdb.org/t/p/w500/8DbYYluzdiGDAZzsaP7DWGbwfLd.jpg' },
    { id: '11', title: 'Dragon', genre: 'Tamil Comedy / Romance / Drama', description: 'A humorous and romantic drama following the life of a quirky young adult.', director: 'Ashwath Marimuthu', rating: 7.0, ticketPrice: 1600.0, availableSeats: 90, imageUrl: 'https://image.tmdb.org/t/p/w500/vKNJPuejtE6Xrp6RK6LKsQcbL8L.jpg' },
    { id: '12', title: 'Veera Dheera Sooran: Part 2', genre: 'Tamil Action / Thriller', description: 'The relentless action saga continues as the brave protagonist stands up against local mafias.', director: 'S. U. Arun Kumar', rating: 7.5, ticketPrice: 1800.0, availableSeats: 85, imageUrl: 'https://image.tmdb.org/t/p/w500/6iiWsXJ31BVbypWwzvoPKx24NFQ.jpg' },
    { id: '13', title: 'Chhaava', genre: 'Hindi Historical / Action / Drama', description: 'A grand historical epic about the courageous life of Chhatrapati Sambhaji Maharaj.', director: 'Laxman Utekar', rating: 7.3, ticketPrice: 1800.0, availableSeats: 100, imageUrl: 'https://image.tmdb.org/t/p/w500/ubRsrzb6NRW8YhVTJ6jG1kpNvCi.jpg' },
    { id: '14', title: 'Sitaare Zameen Par', genre: 'Hindi Comedy / Drama / Sport', description: 'An uplifting sports comedy drama detailing mentorship and child empowerment.', director: 'R. S. Prasanna', rating: 6.9, ticketPrice: 1700.0, availableSeats: 95, imageUrl: 'https://image.tmdb.org/t/p/w500/adYjCJGSNiL7CIaDW3g0Bcg7r2Z.jpg' },
    { id: '15', title: 'Sky Force', genre: 'Hindi Action / War / Drama', description: 'A dramatic action thriller honoring the valiant air forces and aviation warfare.', director: 'Abhishek Kapur', rating: 6.8, ticketPrice: 1600.0, availableSeats: 80, imageUrl: 'https://upload.wikimedia.org/wikipedia/en/e/ec/Sky_Force_poster.jpg' },
    { id: '16', title: 'Raid 2', genre: 'Hindi Crime / Thriller / Drama', description: 'The return of the honest income tax officer, initiating a massive raid on a corrupt politician.', director: 'Raj Kumar Gupta', rating: 6.6, ticketPrice: 1700.0, availableSeats: 85, imageUrl: 'https://upload.wikimedia.org/wikipedia/en/8/82/Raid_2_poster.jpg' },
    { id: '17', title: 'Heidi: Rescue of the Lynx', genre: 'German Animation / Adventure', description: 'A beautiful alpine animation about young Heidi protecting a rare lynx in the mountains.', director: 'Tobias Schwarz', rating: 4.5, ticketPrice: 1400.0, availableSeats: 75, imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d5/Heidi_-_Die_Legende_vom_Luchs.png' },
    { id: '18', title: 'Heldin (Late Shift)', genre: 'German Drama', description: 'A suspenseful drama tracing the struggles of a courageous nurse during her nocturnal shifts.', director: 'Petra Volpe', rating: 4.4, ticketPrice: 1500.0, availableSeats: 80, imageUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e9/Late_Shift_film_poster.jpg' },
    { id: '19', title: 'Franz', genre: 'German / Czech Biography / Drama', description: 'A deep, artistic biography detailing the literary life and thoughts of Franz Kafka.', director: 'Agnieszka Holland', rating: 4.6, ticketPrice: 1600.0, availableSeats: 70, imageUrl: 'https://upload.wikimedia.org/wikipedia/en/6/60/Franz_2025.jpeg' },
    { id: '20', title: 'Die drei ??? und der Karpatenhund', genre: 'German Adventure / Mystery', description: 'The three young detectives set out to solve the eerie mystery of the Carpathian dog.', director: 'Tim Dünschede', rating: 4.5, ticketPrice: 1400.0, availableSeats: 85, imageUrl: 'https://img.youtube.com/vi/ldCC7EvGYjE/hqdefault.jpg' }
  ]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Booking Modal & Form State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [completedBooking, setCompletedBooking] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    movieId: '',
    movieTitle: '',
    cinemaHall: 'Scope Cinemas - Colombo City Centre',
    customerName: user ? user.name || '' : '',
    userEmail: user ? user.email || '' : '',
    contactNumber: '',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '10:30 AM',
    selectedSeats: '',
    numberOfTickets: 1,
    ticketPrice: 1500.0,
    paymentMethod: 'Credit / Debit Card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  // Add Movie Form Modal & State
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [imageInputMode, setImageInputMode] = useState('url');
  const [newMovie, setNewMovie] = useState({
    title: '',
    genre: 'Comedy',
    description: '',
    director: '',
    rating: 4.8,
    ticketPrice: 1500.0,
    availableSeats: 80,
    imageUrl: ''
  });

  // Open Booking Modal
  const handleOpenBookingModal = (movie) => {
    if (!token) {
      setMessage({
        type: 'error',
        text: '🔒 Account required! Please sign in or register to book movie tickets.'
      });
      navigate('/auth');
      return;
    }

    setBookingStep(1);
    setCompletedBooking(null);
    
    // Register global preselect cinema helper for MoviesPage.jsx to communicate with App.jsx
    window.preselectCinema = (cinemaName) => {
      setBookingForm((prev) => ({ ...prev, cinemaHall: cinemaName }));
    };

    if (movie) {
      setSelectedMovie(movie);
      setBookingForm((prev) => ({
        ...prev,
        movieId: movie.id || '',
        movieTitle: movie.title || '',
        ticketPrice: movie.ticketPrice || 1500.0,
        customerName: user ? user.name || prev.customerName : prev.customerName,
        userEmail: user ? user.email || prev.userEmail : prev.userEmail,
        selectedSeats: '',
        numberOfTickets: 1
      }));
    } else {
      const defaultMovie = movies.length > 0 ? movies[0] : null;
      setSelectedMovie(defaultMovie);
      setBookingForm((prev) => ({
        ...prev,
        movieId: defaultMovie ? defaultMovie.id : '',
        movieTitle: defaultMovie ? defaultMovie.title : 'Kathuru Mithuru',
        ticketPrice: defaultMovie ? defaultMovie.ticketPrice : 1200.0,
        customerName: user ? user.name || prev.customerName : prev.customerName,
        userEmail: user ? user.email || prev.userEmail : prev.userEmail,
        selectedSeats: '',
        numberOfTickets: 1
      }));
    }
    setShowBookingModal(true);
  };

  // Fetch Movies
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${GATEWAY_URL}/movies`, {
        headers: getApiHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${GATEWAY_URL}/bookings`, {
        headers: getApiHeaders(token)
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Notifications
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${GATEWAY_URL}/notifications`, {
        headers: getApiHeaders(token)
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Notification Log Handler
  const handleDeleteNotification = async (notificationId) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this notification log?')) return;

    try {
      const res = await fetch(`${GATEWAY_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: getApiHeaders(token)
      });
      if (res.ok) {
        fetchNotifications();
        setMessage({ type: 'success', text: 'Notification deleted successfully.' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      alert('Failed to delete notification: ' + err.message);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${GATEWAY_URL}/auth/users`, {
        headers: getApiHeaders(token)
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchNotifications();
      fetchUsers();
    }
  }, [token]);

  // Handle Image File Upload
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMovie({ ...newMovie, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('jwt_token', newToken);
    localStorage.setItem('user_data', JSON.stringify(newUser));
    setBookingForm((prev) => ({
      ...prev,
      customerName: newUser.name || '',
      userEmail: newUser.email || ''
    }));
    setMessage({ type: 'success', text: 'Authentication successful! Redirecting to Home.' });
    setTimeout(() => {
      setMessage(null);
      navigate('/');
    }, 1500);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    navigate('/');
  };

  const handleSelectMovieInForm = (e) => {
    const movieId = e.target.value;
    const foundMovie = movies.find((m) => m.id === movieId);
    if (foundMovie) {
      setSelectedMovie(foundMovie);
      setBookingForm((prev) => ({
        ...prev,
        movieId: foundMovie.id,
        movieTitle: foundMovie.title,
        ticketPrice: foundMovie.ticketPrice || 1500.0
      }));
    } else {
      setBookingForm((prev) => ({
        ...prev,
        movieId: '',
        movieTitle: movieId
      }));
    }
  };

  // Add Movie Handler
  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in first to add movies.');
      navigate('/auth');
      return;
    }
    if (!newMovie.imageUrl) {
      alert('Please enter an image URL or upload an image file for the movie.');
      return;
    }

    try {
      const res = await fetch(`${GATEWAY_URL}/movies`, {
        method: 'POST',
        headers: getApiHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(newMovie)
      });
      if (res.ok) {
        setShowAddMovieModal(false);
        setNewMovie({
          title: '',
          genre: 'Comedy',
          description: '',
          director: '',
          rating: 4.8,
          ticketPrice: 1500.0,
          availableSeats: 80,
          imageUrl: ''
        });
        fetchMovies();
        setMessage({ type: 'success', text: 'New movie saved to database!' });
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err) {
      alert('Failed to add movie: ' + err.message);
    }
  };

  const handleDownloadReceiptPdf = (bookingId) => {
    const ticketElement = document.getElementById('e-ticket-receipt-card');
    if (!ticketElement) {
      alert('Ticket preview not found.');
      return;
    }

    html2canvas(ticketElement, {
      scale: 3,
      useCORS: true,
      backgroundColor: null
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 350;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [imgWidth, imgHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`E-Ticket-Receipt-${bookingId ? bookingId.slice(-8) : 'booking'}.pdf`);
    }).catch(err => {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF ticket: ' + err.message);
    });
  };

  // Submit Ticket Booking Handler
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in to submit ticket bookings!');
      navigate('/auth');
      return;
    }

    if (!bookingForm.movieTitle || !bookingForm.customerName || !bookingForm.userEmail || !bookingForm.contactNumber) {
      alert('Please fill out all required fields (Movie, Customer Name, Email, and Phone Number).');
      return;
    }

    try {
      const ticketPrice = bookingForm.ticketPrice || 1500.0;
      const numberOfTickets = parseInt(bookingForm.numberOfTickets) || 1;
      const totalPrice = ticketPrice * numberOfTickets;

      // 1. Save Ticket Booking
      const bookingPayload = {
        movieId: bookingForm.movieId || 'm_custom',
        movieTitle: bookingForm.movieTitle,
        cinemaHall: bookingForm.cinemaHall,
        customerName: bookingForm.customerName,
        userEmail: bookingForm.userEmail,
        contactNumber: bookingForm.contactNumber,
        showDate: bookingForm.showDate,
        showTime: bookingForm.showTime,
        selectedSeats: bookingForm.selectedSeats,
        numberOfTickets: numberOfTickets,
        ticketPrice: ticketPrice,
        paymentMethod: bookingForm.paymentMethod
      };

      const res = await fetch(`${GATEWAY_URL}/bookings`, {
        method: 'POST',
        headers: getApiHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(bookingPayload)
      });

      if (res.ok) {
        const savedBooking = await res.json();

        // 2. Process Payment Record in payment-service
        await fetch(`${GATEWAY_URL}/payments/process`, {
          method: 'POST',
          headers: getApiHeaders(token, { 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            userEmail: bookingForm.userEmail,
            movieTitle: bookingForm.movieTitle,
            amount: totalPrice,
            paymentMethod: bookingForm.paymentMethod
          })
        });

        // 3. Dispatch Notification in notification-service
        await fetch(`${GATEWAY_URL}/notifications/send`, {
          method: 'POST',
          headers: getApiHeaders(token, { 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            userEmail: bookingForm.userEmail,
            subject: `Booking & Payment Confirmed: ${bookingForm.movieTitle}`,
            message: `Hello ${bookingForm.customerName}, your booking of ${numberOfTickets} ticket(s) for ${bookingForm.movieTitle} on ${bookingForm.showDate} (${bookingForm.showTime}) is confirmed! Total Paid: Rs. ${totalPrice.toLocaleString()} via ${bookingForm.paymentMethod}. Booking ID: ${savedBooking.id}`,
            type: 'EMAIL'
          })
        });

        setCompletedBooking(savedBooking);
        setBookingStep(6);
        fetchBookings();
        fetchNotifications();
        setMessage({ 
          type: 'success', 
          text: `Booking saved and Payment processed (Rs. ${totalPrice.toLocaleString()}) successfully!`
        });
        setTimeout(() => setMessage(null), 6000);
      } else {
        const errData = await res.json();
        alert('Booking error: ' + (errData.error || errData.message || 'Failed to save booking'));
      }
    } catch (err) {
      alert('Error placing booking: ' + err.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!token) return;
    try {
      const res = await fetch(`${GATEWAY_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: getApiHeaders(token)
      });
      if (res.ok) {
        fetchBookings();
        setMessage({ type: 'success', text: 'Booking cancelled successfully' });
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err) {
      alert('Error cancelling booking');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar token={token} user={user} handleLogout={handleLogout} />

      {message && (
        <div className="max-w-full px-6 lg:px-12 mt-4 w-full">
          <div className="p-4 rounded-xl glass-card border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <p className="text-sm font-medium">{message.text}</p>
              {message.payload && (
                <button
                  onClick={() => handleDownloadReceipt(message.payload)}
                  className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 shadow-md"
                >
                  <span>📥 Download E-Ticket</span>
                </button>
              )}
            </div>
            <button onClick={() => setMessage(null)} className="text-xs text-emerald-400 hover:underline">Dismiss</button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-full w-full px-6 lg:px-12 py-4">
        <Routes>
          <Route path="/" element={<HomePage movies={movies} setSelectedMovie={(movie) => handleOpenBookingModal(movie)} />} />
          <Route
            path="/movies"
            element={
              <MoviesPage
                movies={movies}
                loading={loading}
                setSelectedMovie={(movie) => handleOpenBookingModal(movie)}
                setShowAddMovieModal={setShowAddMovieModal}
                fetchMovies={fetchMovies}
                user={user}
              />
            }
          />
          <Route
            path="/bookings"
            element={
              <BookingsPage
                token={token}
                user={user}
                bookings={bookings}
                fetchBookings={fetchBookings}
                handleCancelBooking={handleCancelBooking}
                onOpenBookingModal={handleOpenBookingModal}
              />
            }
          />
          <Route
            path="/payments"
            element={<PaymentsPage token={token} user={user} GATEWAY_URL={GATEWAY_URL} />}
          />
          <Route
            path="/notifications"
            element={
              <NotificationsPage
                token={token}
                user={user}
                notifications={notifications}
                fetchNotifications={fetchNotifications}
                handleDeleteNotification={handleDeleteNotification}
                GATEWAY_URL={GATEWAY_URL}
              />
            }
          />
          <Route
            path="/offers"
            element={<OffersPage token={token} GATEWAY_URL={GATEWAY_URL} />}
          />
          <Route
            path="/coming-soon"
            element={<ComingSoonPage GATEWAY_URL={GATEWAY_URL} />}
          />
          <Route
            path="/profile"
            element={<ProfilePage token={token} user={user} GATEWAY_URL={GATEWAY_URL} />}
          />
          <Route
            path="/auth"
            element={<AuthPage handleAuthSuccess={handleAuthSuccess} GATEWAY_URL={GATEWAY_URL} />}
          />
        </Routes>
      </main>

      {/* Ticket Booking Form Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-xl w-full space-y-5 my-8 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-xl">Movie Ticket Booking</h3>
                <p className="text-xs text-slate-400">Step {bookingStep} of 5: {
                  bookingStep === 1 ? "Select Schedule" :
                  bookingStep === 2 ? "Select Seats" :
                  bookingStep === 3 ? "Customer Details" :
                  bookingStep === 4 ? "Demo Payment" : "Confirm Booking"
                }</p>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)} 
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-300"
                style={{ width: `${(bookingStep / 5) * 100}%` }}
              ></div>
            </div>

            {/* Step 1: Movie Selection, Cinema, Date, Time */}
            {bookingStep === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-xs">Select Movie Title *</label>
                  {movies.length > 0 ? (
                    <select
                      value={bookingForm.movieId}
                      onChange={handleSelectMovieInForm}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                    >
                      {movies.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title} - (Rs. {m.ticketPrice ? m.ticketPrice.toLocaleString() : '1,500'})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={bookingForm.movieTitle}
                      onChange={(e) => setBookingForm({ ...bookingForm, movieTitle: e.target.value })}
                      placeholder="Enter Movie Title"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-xs">Select Cinema / Film Hall *</label>
                  <select
                    value={bookingForm.cinemaHall}
                    onChange={(e) => setBookingForm({ ...bookingForm, cinemaHall: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Scope Cinemas - Colombo City Centre">Scope Cinemas - Colombo City Centre</option>
                    <option value="Regal Cinema - Kandy Town">Regal Cinema - Kandy Town</option>
                    <option value="Queens Cinema - Galle Fort">Queens Cinema - Galle Fort</option>
                    <option value="Cine City - Jaffna Plaza">Cine City - Jaffna Plaza</option>
                    <option value="Savoy 3D Cinema - Negombo Beach">Savoy 3D Cinema - Negombo Beach</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Show Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.showDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, showDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Show Time *</label>
                    <select
                      value={bookingForm.showTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, showTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="10:30 AM">10:30 AM (Morning Show)</option>
                      <option value="12:30 PM">12:30 PM (Matinee Show)</option>
                      <option value="04:30 PM">04:30 PM (Evening Show)</option>
                      <option value="06:30 PM">06:30 PM (Night Show)</option>
                    </select>
                  </div>
                </div>

                {selectedMovie && (
                  <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                    <img
                      src={selectedMovie.imageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'}
                      alt={selectedMovie.title}
                      className="w-12 h-14 object-cover rounded-xl border border-slate-700"
                    />
                    <div className="text-xs">
                      <h4 className="font-extrabold text-cyan-400 text-sm">{selectedMovie.title}</h4>
                      <p className="text-slate-400">{selectedMovie.genre} • Director: {selectedMovie.director}</p>
                      <p className="font-bold text-emerald-400 mt-0.5">Rs. {selectedMovie.ticketPrice ? selectedMovie.ticketPrice.toLocaleString() : '1,500'} per ticket</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-xs font-semibold hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg"
                  >
                    Next: Select Seats →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Seat Selection */}
            {bookingStep === 2 && (
              <div className="space-y-5 text-xs text-center">
                {/* Cinema Screen Art */}
                <div className="w-full relative py-2">
                  <div className="w-4/5 mx-auto bg-slate-800 h-1.5 rounded-full shadow-[0_0_12px_#22d3ee] border-b border-cyan-400/50"></div>
                  <p className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-widest mt-1">Screen</p>
                </div>

                {/* 4x6 Seat Grid Layout */}
                <div className="grid grid-cols-6 gap-3 max-w-sm mx-auto p-4 bg-slate-900/40 rounded-2xl border border-slate-850">
                  {['A', 'B', 'C', 'D'].map((row) => (
                    [1, 2, 3, 4, 5, 6].map((col) => {
                      const seatId = `${row}${col}`;
                      const isSelected = bookingForm.selectedSeats.split(', ').filter(Boolean).includes(seatId);
                      return (
                        <button
                          key={seatId}
                          type="button"
                          onClick={() => {
                            let currentSeats = bookingForm.selectedSeats.split(', ').filter(Boolean);
                            if (currentSeats.includes(seatId)) {
                              currentSeats = currentSeats.filter(s => s !== seatId);
                            } else {
                              currentSeats.push(seatId);
                            }
                            setBookingForm({
                              ...bookingForm,
                              selectedSeats: currentSeats.join(', '),
                              numberOfTickets: Math.max(1, currentSeats.length)
                            });
                          }}
                          className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                            isSelected 
                              ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-black shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {seatId}
                        </button>
                      );
                    })
                  ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center space-x-6 text-[10px] text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3.5 h-3.5 bg-slate-950/60 border border-slate-800 rounded"></span>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3.5 h-3.5 bg-cyan-500 rounded shadow-[0_0_6px_#06b6d4]"></span>
                    <span>Selected</span>
                  </div>
                </div>

                {/* Selected Details */}
                <div className="p-3 bg-slate-900 border border-slate-850 rounded-2xl text-left">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="text-slate-400 font-medium">Selected Seats</p>
                      <p className="font-mono font-bold text-cyan-400 text-sm">
                        {bookingForm.selectedSeats || "None Selected"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 font-medium">Total Tickets</p>
                      <p className="font-extrabold text-slate-200 text-sm">
                        {bookingForm.selectedSeats.split(', ').filter(Boolean).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="flex-1 py-2.5 bg-slate-900 border border-slate-850 text-slate-400 rounded-xl text-xs font-semibold hover:bg-slate-850"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    disabled={!bookingForm.selectedSeats}
                    onClick={() => setBookingStep(3)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all ${
                      bookingForm.selectedSeats
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850'
                    }`}
                  >
                    Next: Customer Details →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Customer Details */}
            {bookingStep === 3 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                    placeholder="e.g. Nimal Perera"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={bookingForm.userEmail}
                    onChange={(e) => setBookingForm({ ...bookingForm, userEmail: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.contactNumber}
                    onChange={(e) => setBookingForm({ ...bookingForm, contactNumber: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="flex-1 py-2.5 bg-slate-900 border border-slate-850 text-slate-400 rounded-xl text-xs font-semibold hover:bg-slate-850"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    disabled={!bookingForm.customerName || !bookingForm.userEmail || !bookingForm.contactNumber}
                    onClick={() => setBookingStep(4)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all ${
                      bookingForm.customerName && bookingForm.userEmail && bookingForm.contactNumber
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850'
                    }`}
                  >
                    Next: Demo Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Demo Payment Simulation */}
            {bookingStep === 4 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Method *</label>
                  <select
                    value={bookingForm.paymentMethod}
                    onChange={(e) => setBookingForm({ ...bookingForm, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Credit / Debit Card">Credit / Debit Card (Visa/Mastercard)</option>
                    <option value="Online Banking / PayHere">Online Banking / PayHere (Simulation)</option>
                  </select>
                </div>

                {/* Demo Card Fields */}
                <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-3">
                  <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-2">💳 Sandbox Demo Card Details</p>
                  
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength="19"
                      value={bookingForm.cardNumber}
                      onChange={(e) => setBookingForm({ ...bookingForm, cardNumber: e.target.value })}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Expiry Date</label>
                      <input
                        type="text"
                        maxLength="5"
                        value={bookingForm.cardExpiry}
                        onChange={(e) => setBookingForm({ ...bookingForm, cardExpiry: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength="3"
                        value={bookingForm.cardCvv}
                        onChange={(e) => setBookingForm({ ...bookingForm, cardCvv: e.target.value })}
                        placeholder="123"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-1">Note: Enter any demo inputs. No real transaction takes place.</p>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(3)}
                    className="flex-1 py-2.5 bg-slate-900 border border-slate-855 text-slate-400 rounded-xl text-xs font-semibold hover:bg-slate-850"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStep(5)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg"
                  >
                    Next: Review Summary →
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Booking Summary & Confirm */}
            {bookingStep === 5 && (
              <div className="space-y-4 text-xs">
                {/* Styled Booking Summary Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden font-mono p-5 text-slate-300 leading-relaxed shadow-xl space-y-4">
                  <div className="text-center border-b border-slate-800/80 pb-3">
                    <p className="text-emerald-400 font-black tracking-widest uppercase">--------------------------------</p>
                    <p className="text-slate-100 font-black text-sm tracking-wider uppercase">BOOKING SUMMARY</p>
                    <p className="text-emerald-400 font-black tracking-widest uppercase">--------------------------------</p>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Movie       :</span>
                      <span className="text-slate-200 font-bold">{bookingForm.movieTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cinema      :</span>
                      <span className="text-slate-200 font-bold text-right max-w-[240px] truncate">{bookingForm.cinemaHall}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date        :</span>
                      <span className="text-slate-200 font-bold">{bookingForm.showDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Show Time   :</span>
                      <span className="text-slate-200 font-bold">{bookingForm.showTime}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-850 pt-3 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Seats       :</span>
                      <span className="text-cyan-400 font-bold font-mono">{bookingForm.selectedSeats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tickets     :</span>
                      <span className="text-slate-200 font-bold">{bookingForm.selectedSeats.split(', ').filter(Boolean).length}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-850 pt-3 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ticket Price:</span>
                      <span className="text-slate-200 font-mono">Rs. {selectedMovie ? selectedMovie.ticketPrice.toLocaleString() : '1,500'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-black border-t border-dashed border-slate-800 pt-2.5 mt-2">
                      <span className="text-slate-400 uppercase">Total       :</span>
                      <span className="text-emerald-400 font-mono text-base">Rs. {((selectedMovie ? selectedMovie.ticketPrice : 1500) * bookingForm.selectedSeats.split(', ').filter(Boolean).length).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCreateBooking} className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(4)}
                    className="flex-1 py-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-xs font-semibold hover:bg-slate-850"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 uppercase tracking-wider"
                  >
                    [ Confirm Booking ]
                  </button>
                </form>
              </div>
            )}

            {bookingStep === 6 && completedBooking && (
              <div className="space-y-6 text-xs text-center">
                <div className="py-2">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-2">
                    ✓
                  </div>
                  <h4 className="text-base font-extrabold text-slate-100">Booking Confirmed!</h4>
                  <p className="text-slate-400 text-xs mt-1">Your official e-ticket pass is ready for download.</p>
                </div>

                {/* Professional E-Ticket Receipt Card */}
                <div 
                  id="e-ticket-receipt-card"
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-left max-w-sm mx-auto flex flex-col p-6 space-y-4 relative"
                  style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(6,182,212,0.06), transparent)' }}
                >
                  {/* Left and Right punches for ticket cut-out look */}
                  <div className="absolute -left-3.5 top-[180px] w-7 h-7 bg-slate-950 rounded-full border-r border-slate-850 z-10"></div>
                  <div className="absolute -right-3.5 top-[180px] w-7 h-7 bg-slate-950 rounded-full border-l border-slate-850 z-10"></div>

                  {/* Ticket Header */}
                  <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                    <div>
                      <p className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">CINEMA ENTRY PASS</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">Booking ID: {completedBooking.id ? completedBooking.id.slice(-8).toUpperCase() : 'N/A'}</p>
                    </div>
                    <span className="text-slate-500 text-lg">🎟️</span>
                  </div>

                  {/* Movie Info */}
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Movie Title</p>
                    <h5 className="text-base font-black text-slate-100 leading-tight">{completedBooking.movieTitle}</h5>
                    <p className="text-[10px] text-amber-400 font-semibold">{completedBooking.cinemaHall}</p>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Date</p>
                      <p className="text-slate-200 font-bold text-xs">{completedBooking.showDate}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Showtime</p>
                      <p className="text-slate-200 font-bold text-xs">{completedBooking.showTime}</p>
                    </div>
                  </div>

                  {/* Tear/Divider Line */}
                  <div className="border-t-2 border-dashed border-slate-800/80 my-2 pt-2 relative"></div>

                  {/* Seats & Ticket Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Selected Seats</p>
                      <p className="text-cyan-400 font-bold font-mono text-sm leading-none mt-1">
                        {completedBooking.selectedSeats || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Tickets Count</p>
                      <p className="text-slate-200 font-bold text-sm leading-none mt-1">
                        {completedBooking.numberOfTickets} Ticket(s)
                      </p>
                    </div>
                  </div>

                  {/* Total Paid Section */}
                  <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase font-bold">Total Amount Paid</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{completedBooking.paymentMethod}</p>
                    </div>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      Rs. {completedBooking.totalPrice ? completedBooking.totalPrice.toLocaleString() : '0'}
                    </span>
                  </div>

                  {/* Barcode Mockup */}
                  <div className="pt-2">
                    <div className="w-full bg-white h-7 flex items-center justify-center space-x-1 px-4 rounded-md overflow-hidden opacity-85">
                      {[1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3].map((w, idx) => (
                        <div key={idx} className="bg-slate-950 h-full" style={{ width: `${w}px` }}></div>
                      ))}
                    </div>
                    <p className="text-[8px] text-center text-slate-500 font-mono uppercase tracking-widest mt-1">
                      *T-{completedBooking.id ? completedBooking.id.slice(-10) : '00000'}*
                    </p>
                  </div>
                </div>

                {/* PDF Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadReceiptPdf(completedBooking.id)}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                  >
                    <span>📥 Download PDF Ticket</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      setSelectedMovie(null);
                      setCompletedBooking(null);
                    }}
                    className="py-3 px-6 bg-slate-900 border border-slate-800 text-slate-350 hover:bg-slate-850 rounded-xl text-xs font-semibold"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-md w-full space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-lg">Add New Movie</h3>
                <p className="text-xs text-slate-400">Add movie details & poster</p>
              </div>
              <button onClick={() => setShowAddMovieModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddMovie} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Movie Title *</label>
                <input
                  type="text"
                  required
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  placeholder="e.g. Kathuru Mithuru"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Genre *</label>
                  <input
                    type="text"
                    required
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    placeholder="Comedy / Action"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Director *</label>
                  <input
                    type="text"
                    required
                    value={newMovie.director}
                    onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                    placeholder="Giriraj Kaushalya"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Ticket Price (Rs.) *</label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={newMovie.ticketPrice}
                    onChange={(e) => setNewMovie({ ...newMovie, ticketPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Rating (1-5) *</label>
                  <input
                    type="number"
                    step="0.1"
                    max="5"
                    required
                    value={newMovie.rating}
                    onChange={(e) => setNewMovie({ ...newMovie, rating: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-300 font-semibold">Movie Poster Image *</label>
                  <div className="flex space-x-2 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-2 py-0.5 text-[10px] rounded-md font-bold transition-all ${
                        imageInputMode === 'url' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('file')}
                      className={`px-2 py-0.5 text-[10px] rounded-md font-bold transition-all ${
                        imageInputMode === 'file' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      File Upload
                    </button>
                  </div>
                </div>

                {imageInputMode === 'url' ? (
                  <input
                    type="url"
                    required
                    value={newMovie.imageUrl}
                    onChange={(e) => setNewMovie({ ...newMovie, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30"
                  />
                )}

                {newMovie.imageUrl && (
                  <div className="mt-2 relative w-full h-36 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                    <img src={newMovie.imageUrl} alt="Poster Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">Preview Ready</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Synopsis / Description</label>
                <textarea
                  rows="2"
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                  placeholder="Enter movie synopsis..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                ></textarea>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMovieModal(false)}
                  className="flex-1 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-cyan-500 text-white rounded-lg font-bold shadow-md shadow-cyan-500/20"
                >
                  Save Movie to DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
