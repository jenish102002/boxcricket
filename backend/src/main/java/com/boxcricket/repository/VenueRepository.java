package com.boxcricket.repository;

import com.boxcricket.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByActiveTrue();
    List<Venue> findByActiveTrueOrderByCreatedAtDesc();

    @org.springframework.data.jpa.repository.Query("SELECT v FROM Venue v WHERE v.active = true AND (LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(v.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Venue> searchActiveVenues(@org.springframework.data.repository.query.Param("keyword") String keyword);
}
