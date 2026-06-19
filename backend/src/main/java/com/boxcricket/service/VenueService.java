package com.boxcricket.service;

import com.boxcricket.dto.venue.VenueRequest;
import com.boxcricket.dto.venue.VenueResponse;
import com.boxcricket.entity.Venue;
import com.boxcricket.exception.ResourceNotFoundException;
import com.boxcricket.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public List<VenueResponse> getAllActiveVenues(String search, Double userLat, Double userLng) {
        List<Venue> venues;
        if (search != null && !search.trim().isEmpty()) {
            venues = venueRepository.searchActiveVenues(search.trim());
        } else {
            venues = venueRepository.findByActiveTrueOrderByCreatedAtDesc();
        }

        List<VenueResponse> responses = venues.stream()
                .map(v -> {
                    VenueResponse dto = VenueResponse.from(v);
                    if (userLat != null && userLng != null && v.getLatitude() != null && v.getLongitude() != null) {
                        double dist = calculateHaversineDistance(userLat, userLng, v.getLatitude(), v.getLongitude());
                        dto.setDistanceKm(Math.round(dist * 10.0) / 10.0); // Round to 1 decimal place
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        if (userLat != null && userLng != null) {
            // Sort by nearest distance (venues without coordinates go to the end)
            responses.sort((v1, v2) -> {
                if (v1.getDistanceKm() == null && v2.getDistanceKm() == null) return 0;
                if (v1.getDistanceKm() == null) return 1;
                if (v2.getDistanceKm() == null) return -1;
                return Double.compare(v1.getDistanceKm(), v2.getDistanceKm());
            });
        }

        return responses;
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in kilometers
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    @Transactional(readOnly = true)
    public List<VenueResponse> getAllVenues() {
        return venueRepository.findAll()
                .stream()
                .map(VenueResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VenueResponse getVenueById(Long id) {
        return venueRepository.findById(id)
                .map(VenueResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));
    }

    @Transactional
    public VenueResponse createVenue(VenueRequest request) {
        Venue venue = Venue.builder()
                .name(request.getName())
                .description(request.getDescription())
                .location(request.getLocation())
                .imageUrl(request.getImageUrl())
                .pricePerSlot(request.getPricePerSlot())
                .active(request.getActive() != null ? request.getActive() : true)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();
        return VenueResponse.from(venueRepository.save(venue));
    }

    @Transactional
    public VenueResponse updateVenue(Long id, VenueRequest request) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));

        venue.setName(request.getName());
        venue.setDescription(request.getDescription());
        venue.setLocation(request.getLocation());
        if (request.getImageUrl() != null) venue.setImageUrl(request.getImageUrl());
        venue.setPricePerSlot(request.getPricePerSlot());
        if (request.getActive() != null) venue.setActive(request.getActive());
        venue.setLatitude(request.getLatitude());
        venue.setLongitude(request.getLongitude());

        return VenueResponse.from(venueRepository.save(venue));
    }

    @Transactional
    public void deleteVenue(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));
        venueRepository.delete(venue);
    }
}
