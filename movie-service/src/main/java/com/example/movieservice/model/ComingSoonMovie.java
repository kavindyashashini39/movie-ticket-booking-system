package com.example.movieservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "coming_soon_movies")
public class ComingSoonMovie {

    @Id
    private String id;
    private String title;
    private String genre;
    private String description;
    private String director;
    private String expectedReleaseDate;
    private String imageUrl;
    private String trailerUrl;

    public ComingSoonMovie() {}

    public ComingSoonMovie(String title, String genre, String description, String director, String expectedReleaseDate, String imageUrl, String trailerUrl) {
        this.title = title;
        this.genre = genre;
        this.description = description;
        this.director = director;
        this.expectedReleaseDate = expectedReleaseDate;
        this.imageUrl = imageUrl;
        this.trailerUrl = trailerUrl;
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

    public String getExpectedReleaseDate() { return expectedReleaseDate; }
    public void setExpectedReleaseDate(String expectedReleaseDate) { this.expectedReleaseDate = expectedReleaseDate; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }
}
