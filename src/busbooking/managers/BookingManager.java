package busbooking.managers;

import busbooking.models.Booking;
import busbooking.models.Bus;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * BookingManager handles bookings, cancellations, waitlist, and undo
 * using simple Java collections (lists and maps).
 */
public class BookingManager {
    private BusManager busManager;
    private Map<String, Booking> bookingsByTicket = new HashMap<>();

    // Waitlist and undo history implemented with basic lists
    private List<String> waitlist = new ArrayList<>(); // store passengerId for waitlist
    private List<BookingAction> undoStack = new ArrayList<>();

    public BookingManager(BusManager b, PassengerManager p) {
        this.busManager = b;
    }

    public Booking book(String busNumber, String passengerId) {
        Bus bus = busManager.getBus(busNumber);
        if (bus == null) return null;
        // find first available seat
        int seat = -1;
        for (int i = 0; i < bus.totalSeats; i++) {
            if (!bus.seats[i]) {
                seat = i;
                break;
            }
        }
        if (seat >= 0) {
            bus.bookSeat(seat);
            Booking booking = new Booking(busNumber, passengerId, seat);
            bookingsByTicket.put(booking.ticketId, booking);
            pushUndo(new BookingAction("BOOK", booking));
            return booking;
        } else {
            // full -> add to waitlist
            enqueueWaitlist(passengerId);
            Booking booking = new Booking(busNumber, passengerId, -1);
            bookingsByTicket.put(booking.ticketId, booking);
            pushUndo(new BookingAction("WAIT", booking));
            return booking;
        }
    }

    public boolean cancel(String ticketId) {
        Booking b = bookingsByTicket.remove(ticketId);
        if (b == null) return false;
        Bus bus = busManager.getBus(b.busNumber);
        if (b.seatIndex >= 0 && bus != null) {
            bus.cancelSeat(b.seatIndex);
            // if waitlist has someone, allocate
            String nextPid = dequeueWaitlist();
            if (nextPid != null) {
                int seat = b.seatIndex; // freed seat
                bus.bookSeat(seat);
                Booking nb = new Booking(bus.busNumber, nextPid, seat);
                bookingsByTicket.put(nb.ticketId, nb);
            }
            pushUndo(new BookingAction("CANCEL", b));
            return true;
        } else if (b.seatIndex < 0) {
            // was on waitlist -> remove from waitlist if present
            String pid = b.passengerId;
            for (int i = 0; i < waitlist.size(); ) {
                if (waitlist.get(i).equals(pid)) {
                    waitlist.remove(i);
                } else {
                    i++;
                }
            }
            pushUndo(new BookingAction("CANCEL_WAIT", b));
            return true;
        }
        return false;
    }

    public Booking getBooking(String ticketId) {
        return bookingsByTicket.get(ticketId);
    }

    public void undoLast() {
        BookingAction a = popUndo();
        if (a == null) {
            System.out.println("Nothing to undo");
            return;
        }
        switch (a.type) {
            case "BOOK":
                // cancel booked seat
                Booking bk = a.booking;
                cancel(bk.ticketId);
                System.out.println("Undone booking " + bk.ticketId);
                break;
            case "WAIT":
                // remove waitlist entry
                cancel(a.booking.ticketId);
                System.out.println("Undone waitlist entry " + a.booking.ticketId);
                break;
            case "CANCEL":
            case "CANCEL_WAIT":
                System.out.println("Undo of cancellations not implemented fully");
                break;
        }
    }

    private void enqueueWaitlist(String pid) {
        waitlist.add(pid);
    }

    private String dequeueWaitlist() {
        if (waitlist.isEmpty()) return null;
        return waitlist.remove(0);
    }

    private void pushUndo(BookingAction action) {
        undoStack.add(action);
    }

    private BookingAction popUndo() {
        if (undoStack.isEmpty()) return null;
        return undoStack.remove(undoStack.size() - 1);
    }

    private static class BookingAction {
        String type;
        Booking booking;

        BookingAction(String t, Booking b) {
            this.type = t;
            this.booking = b;
        }
    }

    public Collection<Booking> allBookings() {
        return bookingsByTicket.values();
    }
}
