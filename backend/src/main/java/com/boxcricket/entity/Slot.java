package com.boxcricket.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "slots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"venue", "bookings"})
@ToString(exclude = {"venue", "bookings"})
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 1;

    @Column(nullable = false)
    @Builder.Default
    private Integer bookedCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SlotStatus status = SlotStatus.AVAILABLE;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "slot", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings;

    public boolean isAvailable() {
        return status == SlotStatus.AVAILABLE && bookedCount < capacity;
    }
}
