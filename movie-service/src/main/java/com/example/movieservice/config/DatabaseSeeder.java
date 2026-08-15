package com.example.movieservice.config;

import com.example.movieservice.model.Movie;
import com.example.movieservice.model.Offer;
import com.example.movieservice.model.ComingSoonMovie;
import com.example.movieservice.repository.MovieRepository;
import com.example.movieservice.repository.OfferRepository;
import com.example.movieservice.repository.ComingSoonMovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private ComingSoonMovieRepository comingSoonMovieRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Movies
        movieRepository.deleteAll();
        List<Movie> defaultMovies = List.of(
            new Movie("Dharmayuddhaya 2", "Sinhala Crime / Thriller", "A thrilling Sri Lankan crime drama following the aftermath of a family protector's struggle.", "Aruna Jayawardena", 4.6, 1500.00, 80, "https://upload.wikimedia.org/wikipedia/en/c/c2/Dharmayuddhaya_sinhala_film.jpg"),
            new Movie("Riverstone", "Sinhala Thriller / Drama", "A deep Sri Lankan drama investigating mysterious happenings around the scenic Riverstone hills.", "Lalith Rathnayake", 4.4, 1400.00, 85, "https://img.youtube.com/vi/bx4dGkZnhNI/hqdefault.jpg"),
            new Movie("Room No 106", "Sinhala Thriller", "A suspenseful hotel mystery movie set inside a locked room with dark secrets.", "Suranga de Alwis", 4.2, 1500.00, 70, "https://img.youtube.com/vi/HSgpBtfxbOA/hqdefault.jpg"),
            new Movie("Father", "Sinhala Drama", "A touching Sri Lankan family drama exploring paternal love and emotional reconciliation.", "Suranga de Alwis", 4.3, 1300.00, 90, "https://img.youtube.com/vi/bx4dGkZnhNI/hqdefault.jpg"),
            new Movie("F1: The Movie", "English Action / Sport / Drama", "An adrenaline-fueled sports drama about a veteran Formula One driver coming out of retirement.", "Joseph Kosinski", 7.6, 2000.00, 100, "https://image.tmdb.org/t/p/w500/9PXZIUsSDh4alB80jheWX4fhZmy.jpg"),
            new Movie("Superman", "English Action / Adventure / Sci-Fi", "A legendary hero returns to balance his Kryptonian heritage with his human upbringing.", "James Gunn", 7.0, 2200.00, 95, "https://image.tmdb.org/t/p/w500/uXIQDjEamAbBAZ79y6OhvcAKOzs.jpg"),
            new Movie("Jurassic World: Rebirth", "English Action / Adventure / Sci-Fi", "A new expedition ventures into isolated equatorial regions to secure crucial dinosaur DNA.", "Gareth Edwards", 5.8, 2000.00, 85, "https://image.tmdb.org/t/p/w500/1RICxzeoNCAO5NpcRMIgg1XT6fm.jpg"),
            new Movie("Mission: Impossible – The Final Reckoning", "English Action / Spy / Thriller", "Ethan Hunt and the IMF team embark on their final, most dangerous globetrotting mission yet.", "Christopher McQuarrie", 7.1, 2200.00, 90, "https://image.tmdb.org/t/p/w500/iKPsC9EFUafRP9SrUznI61getVP.jpg"),
            new Movie("Coolie", "Tamil Action / Crime / Thriller", "A high-octane action thriller highlighting the intense gold smuggling operations in port cities.", "Lokesh Kanagaraj", 6.0, 1800.00, 95, "https://image.tmdb.org/t/p/w500/1DTgscsgScjTicF4tHiYcoOke1y.jpg"),
            new Movie("Good Bad Ugly", "Tamil Action / Crime / Drama", "An epic crime thriller exploring the grey zones of a three-way battle for control.", "Adhik Ravichandran", 5.3, 1700.00, 80, "https://image.tmdb.org/t/p/w500/8DbYYluzdiGDAZzsaP7DWGbwfLd.jpg"),
            new Movie("Dragon", "Tamil Comedy / Romance / Drama", "A humorous and romantic drama following the life of a quirky young adult.", "Ashwath Marimuthu", 7.0, 1600.00, 90, "https://image.tmdb.org/t/p/w500/vKNJPuejtE6Xrp6RK6LKsQcbL8L.jpg"),
            new Movie("Veera Dheera Sooran: Part 2", "Tamil Action / Thriller", "The relentless action saga continues as the brave protagonist stands up against local mafias.", "S. U. Arun Kumar", 7.5, 1800.00, 85, "https://image.tmdb.org/t/p/w500/6iiWsXJ31BVbypWwzvoPKx24NFQ.jpg"),
            new Movie("Chhaava", "Hindi Historical / Action / Drama", "A grand historical epic about the courageous life of Chhatrapati Sambhaji Maharaj.", "Laxman Utekar", 7.3, 1800.00, 100, "https://image.tmdb.org/t/p/w500/ubRsrzb6NRW8YhVTJ6jG1kpNvCi.jpg"),
            new Movie("Sitaare Zameen Par", "Hindi Comedy / Drama / Sport", "An uplifting sports comedy drama detailing mentorship and child empowerment.", "R. S. Prasanna", 6.9, 1700.00, 95, "https://image.tmdb.org/t/p/w500/adYjCJGSNiL7CIaDW3g0Bcg7r2Z.jpg"),
            new Movie("Sky Force", "Hindi Action / War / Drama", "A dramatic action thriller honoring the valiant air forces and aviation warfare.", "Abhishek Kapur", 6.8, 1600.00, 80, "https://upload.wikimedia.org/wikipedia/en/e/ec/Sky_Force_poster.jpg"),
            new Movie("Raid 2", "Hindi Crime / Thriller / Drama", "The return of the honest income tax officer, initiating a massive raid on a corrupt politician.", "Raj Kumar Gupta", 6.6, 1700.00, 85, "https://upload.wikimedia.org/wikipedia/en/8/82/Raid_2_poster.jpg"),
            new Movie("Heidi: Rescue of the Lynx", "German Animation / Adventure", "A beautiful alpine animation about young Heidi protecting a rare lynx in the mountains.", "Tobias Schwarz", 4.5, 1400.00, 75, "https://upload.wikimedia.org/wikipedia/en/d/d5/Heidi_-_Die_Legende_vom_Luchs.png"),
            new Movie("Heldin (Late Shift)", "German Drama", "A suspenseful drama tracing the struggles of a courageous nurse during her nocturnal shifts.", "Petra Volpe", 4.4, 1500.00, 80, "https://upload.wikimedia.org/wikipedia/en/e/e9/Late_Shift_film_poster.jpg"),
            new Movie("Franz", "German / Czech Biography / Drama", "A deep, artistic biography detailing the literary life and thoughts of Franz Kafka.", "Agnieszka Holland", 4.6, 1600.00, 70, "https://upload.wikimedia.org/wikipedia/en/6/60/Franz_2025.jpeg"),
            new Movie("Die drei ??? und der Karpatenhund", "German Adventure / Mystery", "The three young detectives set out to solve the eerie mystery of the Carpathian dog.", "Tim Dünschede", 4.5, 1400.00, 85, "https://img.youtube.com/vi/ldCC7EvGYjE/hqdefault.jpg")
        );
        movieRepository.saveAll(defaultMovies);
        System.out.println(">>> SEEDED 20 MOVIES WITH CLEAN ENGLISH TITLES AND LKR PRICING SUCCESSFULLY! <<<");

        // 2. Seed Offers
        offerRepository.deleteAll();
        List<Offer> defaultOffers = List.of(
            new Offer("Student Discount", "Get 20% off on any Sinhala comedy movie ticket with a valid student ID card.", "STUDENT20", 20.0, "DISCOUNT", "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80", "2026-12-31"),
            new Offer("Double Delight Couple Package", "Get two tickets, a large popcorn, and two drinks for a special price of Rs. 3,500.", "COUPLEPACK", 15.0, "SPECIAL_PACKAGE", "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80", "2026-10-31"),
            new Offer("Mid-Week Magic Promo", "Enjoy a flat 15% discount on all movie screenings on Wednesdays.", "MIDWEEK15", 15.0, "PROMOTION", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80", "2026-11-30"),
            new Offer("Weekend Family Bundle", "Book 4 or more tickets and get a free large tub of popcorn and a 10% discount.", "FAMILY4", 10.0, "SPECIAL_PACKAGE", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80", "2026-12-31")
        );
        offerRepository.saveAll(defaultOffers);
        System.out.println(">>> SEEDED 4 SPECIAL OFFERS & PROMOTIONS SUCCESSFULLY! <<<");

        // 3. Seed Coming Soon Movies
        comingSoonMovieRepository.deleteAll();
        List<ComingSoonMovie> defaultComingSoon = List.of(
            new ComingSoonMovie("Gladiator II", "Action Historical", "Years after witnessing the death of the revered hero Maximus, Lucius is forced to enter the Colosseum.", "Ridley Scott", "2026-11-22", "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&auto=format&fit=crop&q=80", "https://www.youtube.com/watch?v=1Vngh17hYQM"),
            new ComingSoonMovie("Moana 2", "Animation Family", "After receiving an unexpected call from her wayfinding ancestors, Moana journeys to the far seas of Oceania.", "David G. Derrick Jr.", "2026-11-27", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80", "https://www.youtube.com/watch?v=hXXDN-m4MBI"),
            new ComingSoonMovie("Sinhabahu: Rise of the Dynasty", "Sinhala History", "An epic Sri Lankan historical detailing the legendary origins of the Sinhalese kingdom.", "Somaratne Dissanayake", "2026-09-18", "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80", "https://www.youtube.com/watch?v=DypT10U1Fxs"),
            new ComingSoonMovie("Avatar 3: Fire and Ash", "Sci-Fi Adventure", "The continuation of Jake Sully and Neytiri's journey on Pandora, introducing a hostile volcanic clan.", "James Cameron", "2026-12-18", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80", "https://www.youtube.com/watch?v=zPHsOClcQXY")
        );
        comingSoonMovieRepository.saveAll(defaultComingSoon);
        System.out.println(">>> SEEDED 4 UPCOMING COMING SOON MOVIES SUCCESSFULLY! <<<");
    }
}
