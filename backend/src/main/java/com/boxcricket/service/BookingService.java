package com.boxcricket.service;

import com.boxcricket.dto.booking.BookingRequest;
import com.boxcricket.dto.booking.BookingResponse;
import com.boxcricket.entity.*;
import com.boxcricket.exception.BadRequestException;
import com.boxcricket.exception.ResourceNotFoundException;
import com.boxcricket.exception.UnauthorizedException;
import com.boxcricket.repository.BookingRepository;
import com.boxcricket.repository.SlotRepository;
import com.boxcricket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final UserRepository userRepository;

    /**
     * Creates a booking with pessimistic locking to prevent double-booking.
     * Amount is computed server-side from venue's pricePerSlot.
     */
    @Transactional
    public BookingResponse createBooking(BookingRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Acquire pessimistic write lock on the slot
        Slot slot = slotRepository.findByIdWithLock(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + request.getSlotId()));

        // Server-side validations
        if (slot.getStatus() == SlotStatus.BLOCKED) {
            throw new BadRequestException("This slot is blocked and cannot be booked");
        }
        if (slot.getStatus() == SlotStatus.BOOKED || slot.getBookedCount() >= slot.getCapacity()) {
            throw new BadRequestException("This slot is fully booked");
        }
        if (slot.getDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot book a slot in the past");
        }

        // Server-side amount computation
        Venue venue = slot.getVenue();

        // Increment bookedCount atomically
        slot.setBookedCount(slot.getBookedCount() + 1);
        if (slot.getBookedCount() >= slot.getCapacity()) {
            slot.setStatus(SlotStatus.BOOKED);
        }
        slotRepository.save(slot);

        Booking booking = Booking.builder()
                .user(user)
                .slot(slot)
                .status(BookingStatus.CONFIRMED)
                .amount(venue.getPricePerSlot())
                .build();

        return BookingResponse.from(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long userId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Ownership check — non-admins can only cancel own bookings
        if (!isAdmin && !booking.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        // Prevent cancelling past bookings for non-admins
        if (!isAdmin && booking.getSlot().getDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot cancel a past booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        // Free up the slot
        Slot slot = booking.getSlot();
        if (slot.getBookedCount() > 0) {
            slot.setBookedCount(slot.getBookedCount() - 1);
        }
        if (slot.getStatus() == SlotStatus.BOOKED && slot.getBookedCount() < slot.getCapacity()) {
            slot.setStatus(SlotStatus.AVAILABLE);
        }
        slotRepository.save(slot);

        return BookingResponse.from(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }
}
