package com.boxcricket.repository;

import com.boxcricket.entity.Booking;
import com.boxcricket.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'CONFIRMED'")
    long countConfirmed();

    @Query("SELECT COALESCE(SUM(b.amount), 0) FROM Booking b WHERE b.status = 'CONFIRMED'")
    java.math.BigDecimal sumRevenue();

    @Query("SELECT COALESCE(SUM(b.amount), 0) FROM Booking b WHERE b.status = 'CONFIRMED' AND b.createdAt BETWEEN :start AND :end")
    java.math.BigDecimal sumRevenueBetween(@Param("start") LocalDateTime start,
                                            @Param("end") LocalDateTime end);

    // Native query for revenue time series (SQLite strftime)
    @Query(value = """
            SELECT strftime('%Y-%m-%d', b.created_at) as period,
                   SUM(b.amount) as revenue,
                   COUNT(b.id) as bookings
            FROM bookings b
            WHERE b.status = 'CONFIRMED'
              AND b.created_at BETWEEN :start AND :end
            GROUP BY strftime('%Y-%m-%d', b.created_at)
            ORDER BY period ASC
            """, nativeQuery = true)
    List<Object[]> findRevenueBetween(@Param("start") LocalDateTime start,
                                       @Param("end") LocalDateTime end);

    // Revenue by venue
    @Query(value = """
            SELECT v.name as venue_name, v.id as venue_id,
                   SUM(b.amount) as revenue,
                   COUNT(b.id) as bookings
            FROM bookings b
            JOIN slots s ON b.slot_id = s.id
            JOIN venues v ON s.venue_id = v.id
            WHERE b.status = 'CONFIRMED'
            GROUP BY v.id, v.name
            ORDER BY revenue DESC
            """, nativeQuery = true)
    List<Object[]> findRevenueByVenue();

    // Slot status breakdown
    @Query(value = """
            SELECT s.status, COUNT(s.id) as count
            FROM slots s
            GROUP BY s.status
            """, nativeQuery = true)
    List<Object[]> findSlotStatusBreakdown();

    boolean existsByUserIdAndSlotId(Long userId, Long slotId);
}
