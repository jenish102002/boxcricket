package com.boxcricket.repository;

import com.boxcricket.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByActiveTrue();
    List<Venue> findByActiveTrueOrderByCreatedAtDesc();
}
