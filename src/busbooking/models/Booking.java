package busbooking.models;

import java.util.UUID;

/**
 * Booking record linking passenger and bus and seat. Booking IDs use UUIDs and are stored in maps for O(1) lookup.
 */
public class Booking {
    public String ticketId;
    public String busNumber;
    public String passengerId;
    public int seatIndex; // -1 if waitlisted
    public long bookingTime;

    public Booking(String busNumber, String passengerId, int seatIndex) {
        this.ticketId = UUID.randomUUID().toString();
        this.busNumber = busNumber;
        this.passengerId = passengerId;
        this.seatIndex = seatIndex;
        this.bookingTime = System.currentTimeMillis();
    }

    @Override
    public String toString() {
        return String.format("Ticket[%s] Bus:%s Passenger:%s Seat:%s Time:%d",
                ticketId, busNumber, passengerId, seatIndex >= 0 ? seatIndex : "WAITLIST", bookingTime);
    }
}
