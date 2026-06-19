package com.boxcricket.dto.slot;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SlotRequest {
    @NotNull(message = "Venue ID is required")
    private Long venueId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity = 1;
}
