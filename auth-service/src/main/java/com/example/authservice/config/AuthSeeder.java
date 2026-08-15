package com.example.authservice.config;

import com.example.authservice.model.User;
import com.example.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AuthSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User demoUser = new User();
            demoUser.setName("Student User");
            demoUser.setEmail("student@example.com");
            demoUser.setPassword("password123");
            demoUser.setRole("ROLE_USER");

            User adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword("admin123");
            adminUser.setRole("ROLE_ADMIN");

            userRepository.saveAll(List.of(demoUser, adminUser));
            System.out.println(">>> SEEDED DEFAULT DEMO USERS (student@example.com & admin@example.com) SUCCESSFULLY! <<<");
        }
    }
}
