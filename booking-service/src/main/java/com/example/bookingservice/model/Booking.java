package com.example.bookingservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "bookings")
public class Booking {
    
    @Id
    private String id;
    private String movieId;
    private String movieTitle;
    private String customerName;
    private String userEmail;
    private String contactNumber;
    private String showDate;
    private String showTime;
    private int numberOfTickets;
    private double ticketPrice;
    private double totalPrice;
    private String paymentMethod;
    private String cinemaHall;
    private String selectedSeats;
    private Date bookingDate = new Date();
    private String status = "CONFIRMED"; // CONFIRMED, CANCELLED, COMPLETED

    public Booking() {}

    public Booking(String movieId, String movieTitle, String customerName, String userEmail, String contactNumber, String showDate, String showTime, int numberOfTickets, double ticketPrice, double totalPrice, String paymentMethod) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.customerName = customerName;
        this.userEmail = userEmail;
        this.contactNumber = contactNumber;
        this.showDate = showDate;
        this.showTime = showTime;
        this.numberOfTickets = numberOfTickets;
        this.ticketPrice = ticketPrice;
        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;
        this.bookingDate = new Date();
        this.status = "CONFIRMED";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getShowDate() { return showDate; }
    public void setShowDate(String showDate) { this.showDate = showDate; }

    public String getShowTime() { return showTime; }
    public void setShowTime(String showTime) { this.showTime = showTime; }

    public int getNumberOfTickets() { return numberOfTickets; }
    public void setNumberOfTickets(int numberOfTickets) { this.numberOfTickets = numberOfTickets; }

    public double getTicketPrice() { return ticketPrice; }
    public void setTicketPrice(double ticketPrice) { this.ticketPrice = ticketPrice; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Date getBookingDate() { return bookingDate; }
    public void setBookingDate(Date bookingDate) { this.bookingDate = bookingDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCinemaHall() { return cinemaHall; }
    public void setCinemaHall(String cinemaHall) { this.cinemaHall = cinemaHall; }

    public String getSelectedSeats() { return selectedSeats; }
    public void setSelectedSeats(String selectedSeats) { this.selectedSeats = selectedSeats; }
}
