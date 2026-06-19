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
import com.boxcricket.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BoxCricketApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(BoxCricketApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(BoxCricketApplication.class, args);
    }

    @Bean
    public CommandLineRunner bootstrapData(JdbcTemplate jdbcTemplate, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                // Ensure Postgres allows large Base64 images. 
                jdbcTemplate.execute("ALTER TABLE venues ALTER COLUMN image_url TYPE TEXT;");
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
                logger.info("✅ Created demo Admin account: admin@boxcricket.com / admin123");
            }

            // Insert Demo User
            if (!userRepository.existsByEmail("rahul@example.com")) {
                userRepository.save(User.builder()
                        .name("Rahul (Demo User)")
                        .email("rahul@example.com")
                        .passwordHash(passwordEncoder.encode("user123"))
                        .role(Role.USER)
                        .build());
                logger.info("✅ Created demo User account: rahul@example.com / user123");
            }
        };
    }
}
