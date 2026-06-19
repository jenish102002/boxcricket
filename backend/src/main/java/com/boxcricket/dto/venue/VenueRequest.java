package com.boxcricket.dto.venue;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VenueRequest {
    @NotBlank(message = "Venue name is required")
    private String name;

    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    private String imageUrl;

    @NotNull(message = "Price per slot is required")
    @DecimalMin(value = "0.01", message = "Price must be positive")
    private BigDecimal pricePerSlot;

    private Boolean active = true;

    private Double latitude;

    private Double longitude;
}
