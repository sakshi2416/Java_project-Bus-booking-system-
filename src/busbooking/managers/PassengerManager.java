package busbooking.managers;

import busbooking.models.Passenger;

import java.util.*;

/**
 * PassengerManager demonstrates HashMap for O(1) lookups by passenger ID.
 */
public class PassengerManager {
    private Map<String, Passenger> byId = new HashMap<>();
    private Map<String, List<Passenger>> byName = new HashMap<>();

    public Passenger addPassenger(String name, String phone) {
        String id = UUID.randomUUID().toString();
        Passenger p = new Passenger(id, name, phone);
        byId.put(id, p);
        byName.computeIfAbsent(name.toLowerCase(), k -> new ArrayList<>()).add(p);
        return p;
    }

    public Passenger getById(String id) { return byId.get(id); }

    public List<Passenger> searchByName(String name) {
        return byName.getOrDefault(name.toLowerCase(), Collections.emptyList());
    }
}
