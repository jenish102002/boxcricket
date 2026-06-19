package com.boxcricket.repository;

import com.boxcricket.entity.Slot;
import com.boxcricket.entity.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SlotRepository extends JpaRepository<Slot, Long> {

    List<Slot> findByVenueIdOrderByDateAscStartTimeAsc(Long venueId);

    List<Slot> findByVenueIdAndDateOrderByStartTimeAsc(Long venueId, LocalDate date);

    @Query("SELECT s FROM Slot s WHERE s.venue.id = :venueId AND s.date = :date AND s.status = :status ORDER BY s.startTime ASC")
    List<Slot> findByVenueIdAndDateAndStatus(@Param("venueId") Long venueId,
                                              @Param("date") LocalDate date,
                                              @Param("status") SlotStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Slot s WHERE s.id = :id")
    Optional<Slot> findByIdWithLock(@Param("id") Long id);

    boolean existsByVenueIdAndDateAndStartTimeAndEndTime(Long venueId, LocalDate date,
                                                          java.time.LocalTime startTime,
                                                          java.time.LocalTime endTime);

    @Query("SELECT s FROM Slot s WHERE s.venue.id = :venueId AND s.date BETWEEN :startDate AND :endDate ORDER BY s.date ASC, s.startTime ASC")
    List<Slot> findByVenueIdAndDateRange(@Param("venueId") Long venueId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(s) FROM Slot s WHERE s.status = 'AVAILABLE'")
    long countAvailableSlots();

    @Query("SELECT SUM(s.capacity) FROM Slot s WHERE s.status != 'BLOCKED'")
    Long sumTotalCapacity();

    @Query("SELECT SUM(s.bookedCount) FROM Slot s WHERE s.status != 'BLOCKED'")
    Long sumTotalBookedCount();
}
