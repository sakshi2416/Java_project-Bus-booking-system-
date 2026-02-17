package busbooking.models;

import java.util.ArrayList;
import java.util.List;

/**
 * Route represents a sequence of city stops.
 * Uses a simple ArrayList internally (Array usage) to keep stops.
 */
public class Route {
    public String name; // e.g., "CityA-CityB"
    public List<String> stops = new ArrayList<>();

    public Route(String name) {
        this.name = name;
    }

    public void addStop(String city) {
        stops.add(city);
    }

    public void removeStop(String city) {
        stops.remove(city);
    }

    @Override
    public String toString() {
        return name + " -> " + String.join(" -> ", stops);
    }
}
