package com.example.movieservice.controller;

import com.example.movieservice.model.Movie;
import com.example.movieservice.repository.MovieRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/movies")
@Tag(name = "Movie & Product Catalog", description = "Endpoints for Student 2: Movie Catalog CRUD operations")
public class MovieController {

    @Autowired
    private MovieRepository movieRepository;

    @GetMapping
    @Operation(summary = "Get all movies or search by genre/title")
    public List<Movie> getAllMovies(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String search) {

        if (genre != null && !genre.isBlank()) {
            return movieRepository.findByGenreContainingIgnoreCase(genre);
        }
        if (search != null && !search.isBlank()) {
            return movieRepository.findByTitleContainingIgnoreCase(search);
        }
        return movieRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get movie by ID")
    public ResponseEntity<?> getMovieById(@PathVariable String id) {
        Optional<Movie> movieOpt = movieRepository.findById(id);
        if (movieOpt.isPresent()) {
            return ResponseEntity.ok(movieOpt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Movie not found with ID: " + id));
    }

    @PostMapping
    @Operation(summary = "Add a new movie to catalog")
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie) {
        if (movie.getTicketPrice() <= 0) {
            movie.setTicketPrice(12.50);
        }
        if (movie.getAvailableSeats() <= 0) {
            movie.setAvailableSeats(50);
        }
        Movie savedMovie = movieRepository.save(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update movie details")
    public ResponseEntity<?> updateMovie(@PathVariable String id, @RequestBody Movie movieDetails) {
        Optional<Movie> movieOpt = movieRepository.findById(id);
        if (movieOpt.isPresent()) {
            Movie movie = movieOpt.get();
            if (movieDetails.getTitle() != null) movie.setTitle(movieDetails.getTitle());
            if (movieDetails.getGenre() != null) movie.setGenre(movieDetails.getGenre());
            if (movieDetails.getDescription() != null) movie.setDescription(movieDetails.getDescription());
            if (movieDetails.getDirector() != null) movie.setDirector(movieDetails.getDirector());
            if (movieDetails.getRating() > 0) movie.setRating(movieDetails.getRating());
            if (movieDetails.getTicketPrice() > 0) movie.setTicketPrice(movieDetails.getTicketPrice());
            if (movieDetails.getAvailableSeats() >= 0) movie.setAvailableSeats(movieDetails.getAvailableSeats());
            if (movieDetails.getImageUrl() != null) movie.setImageUrl(movieDetails.getImageUrl());

            Movie updatedMovie = movieRepository.save(movie);
            return ResponseEntity.ok(updatedMovie);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Movie not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete movie by ID")
    public ResponseEntity<?> deleteMovie(@PathVariable String id) {
        if (movieRepository.existsById(id)) {
            movieRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Movie deleted successfully", "id", id));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Movie not found with ID: " + id));
    }
}
