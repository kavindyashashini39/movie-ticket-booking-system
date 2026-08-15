package com.example.movieservice.repository;

import com.example.movieservice.model.ComingSoonMovie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComingSoonMovieRepository extends MongoRepository<ComingSoonMovie, String> {
}
