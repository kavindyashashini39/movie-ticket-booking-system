package com.example.movieservice.controller;

import com.example.movieservice.model.Offer;
import com.example.movieservice.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/movies/offers")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class OfferController {

    @Autowired
    private OfferRepository offerRepository;

    @GetMapping
    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOfferById(@PathVariable String id) {
        Optional<Offer> offerOpt = offerRepository.findById(id);
        if (offerOpt.isPresent()) {
            return ResponseEntity.ok(offerOpt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Offer not found with ID: " + id);
    }

    @PostMapping
    public ResponseEntity<?> createOffer(@RequestBody Offer offer) {
        if (offer.getTitle() == null || offer.getTitle().isBlank()) {
            return ResponseEntity.badRequest().body("Offer title is required");
        }
        Offer savedOffer = offerRepository.save(offer);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOffer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOffer(@PathVariable String id) {
        if (offerRepository.existsById(id)) {
            offerRepository.deleteById(id);
            return ResponseEntity.ok("Offer deleted successfully with ID: " + id);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Offer not found with ID: " + id);
    }
}
