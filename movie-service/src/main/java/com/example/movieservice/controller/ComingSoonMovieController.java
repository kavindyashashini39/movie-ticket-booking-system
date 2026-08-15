package com.example.movieservice.controller;

import com.example.movieservice.model.ComingSoonMovie;
import com.example.movieservice.repository.ComingSoonMovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/movies/coming-soon")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ComingSoonMovieController {

    @Autowired
    private ComingSoonMovieRepository comingSoonMovieRepository;

    @GetMapping
    public List<ComingSoonMovie> getAllComingSoonMovies() {
        return comingSoonMovieRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComingSoonMovieById(@PathVariable String id) {
        Optional<ComingSoonMovie> movieOpt = comingSoonMovieRepository.findById(id);
        if (movieOpt.isPresent()) {
            return ResponseEntity.ok(movieOpt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Upcoming movie not found with ID: " + id);
    }

    @PostMapping
    public ResponseEntity<?> createComingSoonMovie(@RequestBody ComingSoonMovie movie) {
        if (movie.getTitle() == null || movie.getTitle().isBlank()) {
            return ResponseEntity.badRequest().body("Movie title is required");
        }
        ComingSoonMovie savedMovie = comingSoonMovieRepository.save(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComingSoonMovie(@PathVariable String id) {
        if (comingSoonMovieRepository.existsById(id)) {
            comingSoonMovieRepository.deleteById(id);
            return ResponseEntity.ok("Upcoming movie deleted successfully with ID: " + id);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Upcoming movie not found with ID: " + id);
    }
}
