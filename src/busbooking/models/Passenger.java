package busbooking.models;

/**
 * Passenger model. Stored in hash maps for fast lookup (Hash Table concept).
 */
public class Passenger {
    public String id; // unique passenger id (could be UUID)
    public String name;
    public String phone;

    public Passenger(String id, String name, String phone) {
        this.id = id;
        this.name = name;
        this.phone = phone;
    }

    @Override
    public String toString() {
        return String.format("Passenger[%s] %s (%s)", id, name, phone);
    }
}
