package busbooking.managers;

import busbooking.models.Route;

import java.util.ArrayList;
import java.util.List;

/**
 * RouteManager stores routes in a simple list and provides basic CRUD operations.
 */
public class RouteManager {
    private List<Route> routes = new ArrayList<>();

    public void addRoute(Route r) {
        routes.add(r);
    }

    public boolean removeRoute(String name) {
        for (int i = 0; i < routes.size(); i++) {
            Route r = routes.get(i);
            if (r.name.equals(name)) {
                routes.remove(i);
                return true;
            }
        }
        return false;
    }

    public List<Route> listAll() {
        return new ArrayList<>(routes);
    }
}
