package com.example.movieservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "movies")
public class Movie {
    
    @Id
    private String id;
    private String title;
    private String genre;
    private String description;
    private String director;
    private double rating;
    private double ticketPrice;
    private int availableSeats;
    private String imageUrl;

    public Movie() {}

    public Movie(String title, String genre, String description, String director, double rating, double ticketPrice, int availableSeats, String imageUrl) {
        this.title = title;
        this.genre = genre;
        this.description = description;
        this.director = director;
        this.rating = rating;
        this.ticketPrice = ticketPrice;
        this.availableSeats = availableSeats;
        this.imageUrl = imageUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public double getTicketPrice() { return ticketPrice; }
    public void setTicketPrice(double ticketPrice) { this.ticketPrice = ticketPrice; }

    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
