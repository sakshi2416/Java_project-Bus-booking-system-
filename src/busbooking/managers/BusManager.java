package busbooking.managers;

import busbooking.models.Bus;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * BusManager handles bus CRUD and searches using simple Java collections.
 */
public class BusManager {
    // Store buses in a simple list and map (no custom data structure classes)
    private List<Bus> buses = new ArrayList<>();
    private Map<String, Bus> busMap = new HashMap<>();

    public boolean addBus(Bus b) {
        if (busMap.containsKey(b.busNumber)) return false;
        buses.add(b);
        busMap.put(b.busNumber, b);
        return true;
    }

    public boolean removeBus(String busNumber) {
        Bus b = busMap.remove(busNumber);
        if (b == null) return false;
        buses.remove(b);
        return true;
    }

    public Bus getBus(String busNumber) {
        return busMap.get(busNumber);
    }

    public List<Bus> listAll() {
        return new ArrayList<>(buses);
    }

    public List<Bus> sortByDeparture() {
        List<Bus> arr = new ArrayList<>(buses);
        arr.sort(Comparator.comparingLong(x -> x.departureTime));
        return arr;
    }

    public List<Bus> sortByAvailability() {
        List<Bus> arr = new ArrayList<>(buses);
        arr.sort(Comparator.comparingInt(Bus::availableSeats).reversed());
        return arr;
    }

    public List<Bus> findByRoute(String routeName) {
        List<Bus> res = new ArrayList<>();
        for (Bus b : buses) {
            if (b.routeName.equalsIgnoreCase(routeName)) {
                res.add(b);
            }
        }
        return res;
    }

    // Search by departure time using a simple linear scan
    public Bus searchByDepartureTime(long time) {
        for (Bus b : buses) {
            if (b.departureTime == time) {
                return b;
            }
        }
        return null;
    }

    // Binary search kept simple using a sorted list (optional helper)
    public Bus binarySearchByDeparture(long time) {
        List<Bus> sorted = sortByDeparture();
        int l = 0, r = sorted.size() - 1;
        while (l <= r) {
            int m = (l + r) / 2;
            Bus b = sorted.get(m);
            if (b.departureTime == time) return b;
            if (b.departureTime < time) l = m + 1;
            else r = m - 1;
        }
        return null;
    }
}
