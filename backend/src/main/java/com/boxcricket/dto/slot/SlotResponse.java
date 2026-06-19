package com.boxcricket.dto.slot;

import com.boxcricket.entity.Slot;
import com.boxcricket.entity.SlotStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SlotResponse {
    private Long id;
    private Long venueId;
    private String venueName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer capacity;
    private Integer bookedCount;
    private SlotStatus status;
    private boolean available;
    private LocalDateTime createdAt;

    public static SlotResponse from(Slot slot) {
        return SlotResponse.builder()
                .id(slot.getId())
                .venueId(slot.getVenue().getId())
                .venueName(slot.getVenue().getName())
                .date(slot.getDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .capacity(slot.getCapacity())
                .bookedCount(slot.getBookedCount())
                .status(slot.getStatus())
                .available(slot.isAvailable())
                .createdAt(slot.getCreatedAt())
                .build();
    }
}
