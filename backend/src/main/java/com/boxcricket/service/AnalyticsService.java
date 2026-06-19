package com.boxcricket.service;

import com.boxcricket.dto.analytics.RevenueDataPoint;
import com.boxcricket.dto.analytics.SlotStatusBreakdown;
import com.boxcricket.dto.analytics.SummaryResponse;
import com.boxcricket.dto.analytics.VenueAnalyticsResponse;
import com.boxcricket.repository.BookingRepository;
import com.boxcricket.repository.SlotRepository;
import com.boxcricket.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public SummaryResponse getSummary() {
        BigDecimal totalRevenue = bookingRepository.sumRevenue();
        long totalBookings = bookingRepository.countConfirmed();
        long activeVenues = venueRepository.findByActiveTrue().size();
        long totalSlots = slotRepository.count();
        long availableSlots = slotRepository.countAvailableSlots();

        Long totalCapacity = slotRepository.sumTotalCapacity();
        Long totalBooked = slotRepository.sumTotalBookedCount();
        double occupancyRate = (totalCapacity != null && totalCapacity > 0)
                ? (double) (totalBooked != null ? totalBooked : 0) / totalCapacity * 100
                : 0.0;

        return SummaryResponse.builder()
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .totalBookings(totalBookings)
                .occupancyRate(Math.round(occupancyRate * 10.0) / 10.0)
                .activeVenues(activeVenues)
                .totalSlots(totalSlots)
                .availableSlots(availableSlots)
                .build();
    }

    @Transactional(readOnly = true)
    public List<RevenueDataPoint> getRevenueSeries(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);

        return bookingRepository.findRevenueBetween(start, end)
                .stream()
                .map(row -> RevenueDataPoint.builder()
                        .period(row[0] != null ? row[0].toString() : "")
                        .revenue(row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO)
                        .bookings(row[2] != null ? Long.parseLong(row[2].toString()) : 0L)
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VenueAnalyticsResponse> getRevenueByVenue() {
        return bookingRepository.findRevenueByVenue()
                .stream()
                .map(row -> VenueAnalyticsResponse.builder()
                        .venueName(row[0] != null ? row[0].toString() : "")
                        .venueId(row[1] != null ? Long.parseLong(row[1].toString()) : 0L)
                        .revenue(row[2] != null ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO)
                        .bookings(row[3] != null ? Long.parseLong(row[3].toString()) : 0L)
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SlotStatusBreakdown> getSlotStatusBreakdown() {
        return bookingRepository.findSlotStatusBreakdown()
                .stream()
                .map(row -> SlotStatusBreakdown.builder()
                        .status(row[0] != null ? row[0].toString() : "")
                        .count(row[1] != null ? Long.parseLong(row[1].toString()) : 0L)
                        .build())
                .collect(Collectors.toList());
    }
}
