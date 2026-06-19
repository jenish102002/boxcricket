package com.boxcricket.service;

import com.boxcricket.dto.slot.BulkSlotRequest;
import com.boxcricket.dto.slot.SlotRequest;
import com.boxcricket.dto.slot.SlotResponse;
import com.boxcricket.entity.Slot;
import com.boxcricket.entity.SlotStatus;
import com.boxcricket.entity.Venue;
import com.boxcricket.exception.BadRequestException;
import com.boxcricket.exception.ResourceNotFoundException;
import com.boxcricket.repository.SlotRepository;
import com.boxcricket.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final SlotRepository slotRepository;
    private final VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public List<SlotResponse> getSlotsByVenue(Long venueId, LocalDate date) {
        venueRepository.findById(venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + venueId));

        List<Slot> slots;
        if (date != null) {
            slots = slotRepository.findByVenueIdAndDateOrderByStartTimeAsc(venueId, date);
        } else {
            slots = slotRepository.findByVenueIdOrderByDateAscStartTimeAsc(venueId);
        }
        return slots.stream().map(SlotResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SlotResponse> getAllSlots() {
        return slotRepository.findAll()
                .stream()
                .map(SlotResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SlotResponse getSlotById(Long id) {
        return slotRepository.findById(id)
                .map(SlotResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + id));
    }

    @Transactional
    public SlotResponse createSlot(SlotRequest request) {
        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + request.getVenueId()));

        if (request.getStartTime().isAfter(request.getEndTime()) || request.getStartTime().equals(request.getEndTime())) {
            throw new BadRequestException("Start time must be before end time");
        }

        if (slotRepository.existsByVenueIdAndDateAndStartTimeAndEndTime(
                request.getVenueId(), request.getDate(), request.getStartTime(), request.getEndTime())) {
            throw new BadRequestException("A slot with the same time already exists for this venue and date");
        }

        Slot slot = Slot.builder()
                .venue(venue)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .capacity(request.getCapacity() != null ? request.getCapacity() : 1)
                .status(SlotStatus.AVAILABLE)
                .build();

        return SlotResponse.from(slotRepository.save(slot));
    }

    @Transactional
    public List<SlotResponse> createBulkSlots(BulkSlotRequest request) {
        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + request.getVenueId()));

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date must be before end date");
        }

        List<Slot> createdSlots = new ArrayList<>();
        LocalDate currentDate = request.getStartDate();

        while (!currentDate.isAfter(request.getEndDate())) {
            LocalTime currentTime = request.getDayStartTime();

            while (currentTime.plusHours(request.getSlotDurationHours()).compareTo(request.getDayEndTime()) <= 0) {
                LocalTime slotEnd = currentTime.plusHours(request.getSlotDurationHours());

                if (!slotRepository.existsByVenueIdAndDateAndStartTimeAndEndTime(
                        venue.getId(), currentDate, currentTime, slotEnd)) {
                    Slot slot = Slot.builder()
                            .venue(venue)
                            .date(currentDate)
                            .startTime(currentTime)
                            .endTime(slotEnd)
                            .capacity(request.getCapacity())
                            .status(SlotStatus.AVAILABLE)
                            .build();
                    createdSlots.add(slot);
                }
                currentTime = slotEnd;
            }
            currentDate = currentDate.plusDays(1);
        }

        return slotRepository.saveAll(createdSlots)
                .stream()
                .map(SlotResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public SlotResponse updateSlot(Long id, SlotRequest request) {
        Slot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + id));

        if (request.getDate() != null) slot.setDate(request.getDate());
        if (request.getStartTime() != null) slot.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) slot.setEndTime(request.getEndTime());
        if (request.getCapacity() != null) slot.setCapacity(request.getCapacity());

        return SlotResponse.from(slotRepository.save(slot));
    }

    @Transactional
    public void deleteSlot(Long id) {
        Slot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + id));
        slotRepository.delete(slot);
    }
}
