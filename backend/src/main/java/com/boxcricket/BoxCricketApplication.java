package com.boxcricket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.boxcricket.entity.Role;
import com.boxcricket.entity.User;
import com.boxcricket.entity.Venue;
import com.boxcricket.entity.Slot;
import com.boxcricket.entity.SlotStatus;
import com.boxcricket.repository.UserRepository;
import com.boxcricket.repository.VenueRepository;
import com.boxcricket.repository.SlotRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@SpringBootApplication
public class BoxCricketApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(BoxCricketApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(BoxCricketApplication.class, args);
    }

    @Bean
    public CommandLineRunner bootstrapData(
            JdbcTemplate jdbcTemplate, 
            UserRepository userRepository, 
            VenueRepository venueRepository,
            SlotRepository slotRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                // Ensure Postgres allows large Base64 images. 
                jdbcTemplate.execute("ALTER TABLE venues ALTER COLUMN image_url TYPE TEXT;");
                
                // Fix broken Unsplash image in production database if it was already seeded
                jdbcTemplate.execute("UPDATE venues SET image_url = 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80' WHERE image_url LIKE '%photo-1593341646782-e0be1f5e4e75%';");

                // Backfill GPS coordinates for demo venues
                jdbcTemplate.execute("UPDATE venues SET latitude = 19.1136, longitude = 72.8697 WHERE name = 'Royal Box Cricket' AND latitude IS NULL;");
                jdbcTemplate.execute("UPDATE venues SET latitude = 12.9352, longitude = 77.6245 WHERE name = 'Urban Smash Arena' AND latitude IS NULL;");
                
                logger.info("✅ Database schema verified: image_url is TEXT");
            } catch (Exception e) {
                logger.debug("Schema migration skipped (expected on SQLite)");
            }

            // Insert Demo Admin
            if (!userRepository.existsByEmail("admin@boxcricket.com")) {
                userRepository.save(User.builder()
                        .name("Demo Admin")
                        .email("admin@boxcricket.com")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build());
                logger.info("✅ Created demo Admin account");
            }

            // Insert Demo User
            if (!userRepository.existsByEmail("rahul@example.com")) {
                userRepository.save(User.builder()
                        .name("Rahul (Demo User)")
                        .email("rahul@example.com")
                        .passwordHash(passwordEncoder.encode("user123"))
                        .role(Role.USER)
                        .build());
                logger.info("✅ Created demo User account");
            }

            // Insert Demo Venues & Slots if database is empty
            if (venueRepository.count() == 0) {
                Venue venue1 = Venue.builder()
                        .name("Royal Box Cricket")
                        .location("Andheri East, Mumbai")
                        .description("Premium astroturf with floodlights, dugout seating, and equipment rental available on site.")
                        .pricePerSlot(new BigDecimal("1200.00"))
                        .imageUrl("https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80")
                        .latitude(19.1136)
                        .longitude(72.8697)
                        .active(true)
                        .build();
                venueRepository.save(venue1);

                Venue venue2 = Venue.builder()
                        .name("Urban Smash Arena")
                        .location("Koramangala, Bengaluru")
                        .description("High quality enclosed cricket arena. Open 24/7. Perfect for night tournaments.")
                        .pricePerSlot(new BigDecimal("1500.00"))
                        .imageUrl("https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=800")
                        .latitude(12.9352)
                        .longitude(77.6245)
                        .active(true)
                        .build();
                venueRepository.save(venue2);

                // Add sample slots for the next 3 days
                LocalDate today = LocalDate.now();
                for (int day = 0; day < 3; day++) {
                    LocalDate targetDate = today.plusDays(day);
                    for (int hour = 18; hour <= 21; hour++) {
                        // Slots for Venue 1
                        slotRepository.save(Slot.builder()
                                .venue(venue1)
                                .date(targetDate)
                                .startTime(LocalTime.of(hour, 0))
                                .endTime(LocalTime.of(hour + 1, 0))
                                .capacity(1)
                                .bookedCount(0)
                                .status(SlotStatus.AVAILABLE)
                                .build());
                        
                        // Slots for Venue 2
                        slotRepository.save(Slot.builder()
                                .venue(venue2)
                                .date(targetDate)
                                .startTime(LocalTime.of(hour, 0))
                                .endTime(LocalTime.of(hour + 1, 0))
                                .capacity(1)
                                .bookedCount(0)
                                .status(SlotStatus.AVAILABLE)
                                .build());
                    }
                }
                logger.info("✅ Created Demo Venues & Slots");
            }
        };
    }
}
