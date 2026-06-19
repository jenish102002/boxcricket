package com.boxcricket.dto.slot;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BulkSlotRequest {
    @NotNull(message = "Venue ID is required")
    private Long venueId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Day start time is required")
    private LocalTime dayStartTime;

    @NotNull(message = "Day end time is required")
    private LocalTime dayEndTime;

    @Min(value = 1, message = "Slot duration must be at least 1 hour")
    private Integer slotDurationHours = 1;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity = 1;
}
