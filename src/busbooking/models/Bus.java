package busbooking.models;

import java.util.Arrays;
import java.util.UUID;

/**
 * Bus model.
 * DSA notes:
 * - `seats` is represented as a boolean array for seat allocation (Array usage).
 */
public class Bus {
    public String busNumber; // unique
    public String routeName;
    public long departureTime; // epoch millis or simplified integer
    public int totalSeats;
    public boolean[] seats; // true = booked
    public double price;

    public Bus(String busNumber, String routeName, long departureTime, int totalSeats, double price) {
        this.busNumber = busNumber;
        this.routeName = routeName;
        this.departureTime = departureTime;
        this.totalSeats = totalSeats;
        this.seats = new boolean[totalSeats];
        this.price = price;
    }

    public int availableSeats() {
        int c = 0;
        for (boolean s : seats) if (!s) c++;
        return c;
    }

    public boolean bookSeat(int seatIndex) {
        if (seatIndex < 0 || seatIndex >= totalSeats) return false;
        if (seats[seatIndex]) return false;
        seats[seatIndex] = true;
        return true;
    }

    public boolean cancelSeat(int seatIndex) {
        if (seatIndex < 0 || seatIndex >= totalSeats) return false;
        if (!seats[seatIndex]) return false;
        seats[seatIndex] = false;
        return true;
    }

    @Override
    public String toString() {
        return String.format("Bus[%s] Route:%s Depart:%d Seats:%d/%d Price:%.2f",
                busNumber, routeName, departureTime, availableSeats(), totalSeats, price);
    }
}
