package com.boxcricket.dto.booking;

import com.boxcricket.entity.Booking;
import com.boxcricket.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long slotId;
    private Long venueId;
    private String venueName;
    private String venueLocation;
    private LocalDate slotDate;
    private LocalTime slotStartTime;
    private LocalTime slotEndTime;
    private BookingStatus status;
    private BigDecimal amount;
    private LocalDateTime createdAt;

    public static BookingResponse from(Booking booking) {
        var slot = booking.getSlot();
        var venue = slot.getVenue();
        var user = booking.getUser();
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .slotId(slot.getId())
                .venueId(venue.getId())
                .venueName(venue.getName())
                .venueLocation(venue.getLocation())
                .slotDate(slot.getDate())
                .slotStartTime(slot.getStartTime())
                .slotEndTime(slot.getEndTime())
                .status(booking.getStatus())
                .amount(booking.getAmount())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
