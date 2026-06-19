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
    public List<VenueResponse> getAllActiveVenues() {
        return venueRepository.findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(VenueResponse::from)
                .collect(Collectors.toList());
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

        return VenueResponse.from(venueRepository.save(venue));
    }

    @Transactional
    public void deleteVenue(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));
        venueRepository.delete(venue);
    }
}
