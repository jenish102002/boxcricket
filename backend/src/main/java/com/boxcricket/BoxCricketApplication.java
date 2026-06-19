package com.boxcricket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class BoxCricketApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(BoxCricketApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(BoxCricketApplication.class, args);
    }

    @Bean
    public CommandLineRunner migrateSchema(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Ensure Postgres allows large Base64 images. 
                // Will gracefully fail and be ignored on SQLite which already supports it.
                jdbcTemplate.execute("ALTER TABLE venues ALTER COLUMN image_url TYPE TEXT;");
                logger.info("✅ Database schema verified: image_url is TEXT");
            } catch (Exception e) {
                logger.debug("Schema migration skipped (expected on SQLite)");
            }
        };
    }
}
