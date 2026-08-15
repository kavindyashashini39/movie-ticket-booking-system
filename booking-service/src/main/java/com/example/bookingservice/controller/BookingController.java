package com.example.bookingservice.controller;

import com.example.bookingservice.model.Booking;
import com.example.bookingservice.repository.BookingRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/bookings")
@Tag(name = "Booking & Order Management", description = "Endpoints for Student 3: Manual Ticket Booking CRUD operations")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping
    @Operation(summary = "Get all bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            return ResponseEntity.ok(bookingOpt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Booking not found with ID: " + id));
    }

    @GetMapping("/user/{email}")
    @Operation(summary = "Get bookings by user email")
    public ResponseEntity<List<Booking>> getBookingsByUserEmail(@PathVariable String email) {
        return ResponseEntity.ok(bookingRepository.findByUserEmail(email));
    }

    @PostMapping
    @Operation(summary = "Create a new manual ticket booking")
    public ResponseEntity<?> addBooking(@RequestBody Booking booking) {
        if (booking.getCustomerName() == null || booking.getCustomerName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Customer Name is required"));
        }
        if (booking.getUserEmail() == null || booking.getUserEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User Email is required"));
        }
        if (booking.getMovieTitle() == null || booking.getMovieTitle().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Movie Title is required"));
        }
        if (booking.getNumberOfTickets() <= 0) {
            booking.setNumberOfTickets(1);
        }
        if (booking.getTicketPrice() <= 0) {
            booking.setTicketPrice(12.50);
        }

        booking.setTotalPrice(booking.getNumberOfTickets() * booking.getTicketPrice());
        booking.setBookingDate(new Date());
        if (booking.getStatus() == null || booking.getStatus().isBlank()) {
            booking.setStatus("CONFIRMED");
        }

        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update booking status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable String id, @RequestBody Map<String, String> statusMap) {
        String newStatus = statusMap.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status field is required"));
        }

        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(newStatus.toUpperCase());
            Booking updatedBooking = bookingRepository.save(booking);
            return ResponseEntity.ok(updatedBooking);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Booking not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel and delete a booking")
    public ResponseEntity<?> deleteBooking(@PathVariable String id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Booking cancelled and deleted successfully", "id", id));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Booking not found with ID: " + id));
    }
}
