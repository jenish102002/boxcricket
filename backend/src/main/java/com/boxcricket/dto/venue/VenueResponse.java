package com.boxcricket.dto.venue;

import com.boxcricket.entity.Venue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VenueResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private String imageUrl;
    private BigDecimal pricePerSlot;
    private Boolean active;
    private LocalDateTime createdAt;
    private Double latitude;
    private Double longitude;
    private Double distanceKm; // Optional, computed if GPS is passed

    public static VenueResponse from(Venue venue) {
        return VenueResponse.builder()
                .id(venue.getId())
                .name(venue.getName())
                .description(venue.getDescription())
                .location(venue.getLocation())
                .imageUrl(venue.getImageUrl())
                .pricePerSlot(venue.getPricePerSlot())
                .active(venue.getActive())
                .createdAt(venue.getCreatedAt())
                .latitude(venue.getLatitude())
                .longitude(venue.getLongitude())
                .build();
    }
}
