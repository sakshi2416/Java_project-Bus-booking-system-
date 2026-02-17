package busbooking;

import busbooking.managers.*;
import busbooking.models.*;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Main now starts a tiny built-in HTTP server (port 8000) that serves the
 * static files under `web/` and exposes minimal JSON endpoints for admin
 * management. The server uses the same manager classes already present in
 * the project so the logic remains simple and beginner-friendly.
 */
public class Main {
    public static void main(String[] args) throws Exception {
        BusManager busManager = new BusManager();
        RouteManager routeManager = new RouteManager();
        PassengerManager passengerManager = new PassengerManager();
        BookingManager bookingManager = new BookingManager(busManager, passengerManager);

        // Seed demo data (same as console app did)
        Bus b1 = new Bus("BUS100","CityA-CityB", 900, 5, 200.0);
        Bus b2 = new Bus("BUS200","CityA-CityC", 1100, 3, 300.0);
        busManager.addBus(b1); busManager.addBus(b2);
        Route r1 = new Route("CityA-CityB"); r1.addStop("CityA"); r1.addStop("CityB");
        routeManager.addRoute(r1);

        // Start HTTP server on port 8000
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
        System.out.println("Server started at http://localhost:8000/");

        // Static file handler: serves files from the web/ folder
        server.createContext("/", exchange -> {
            String uri = exchange.getRequestURI().getPath();
            if (uri.equals("/")) uri = "/index.html";
            Path filePath = Paths.get("web" + uri).normalize();
            if (!filePath.startsWith(Paths.get("web"))) { // simple security
                send404(exchange);
                return;
            }
            if (Files.exists(filePath) && !Files.isDirectory(filePath)) {
                byte[] bytes = Files.readAllBytes(filePath);
                String ct = guessContentType(filePath.toString());
                exchange.getResponseHeaders().set("Content-Type", ct);
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) { os.write(bytes); }
            } else {
                send404(exchange);
            }
        });

        // API: ping
        server.createContext("/api/ping", exchange -> {
            sendJson(exchange, 200, "{\"status\":\"ok\"}");
        });

        // API: list buses
        server.createContext("/api/buses", exchange -> {
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                List<Bus> list = busManager.listAll();
                String json = list.stream().map(Main::busToJson).collect(Collectors.joining(",", "[", "]"));
                sendJson(exchange,200,json);
            } else if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                Map<String,String> form = readForm(exchange);
                String number = form.getOrDefault("number", "");
                String route = form.getOrDefault("route", "");
                long depart = Long.parseLong(form.getOrDefault("departure", "0"));
                int seats = Integer.parseInt(form.getOrDefault("seats", "0"));
                double price = Double.parseDouble(form.getOrDefault("price", "0"));
                Bus bus = new Bus(number, route, depart, seats, price);
                boolean ok = busManager.addBus(bus);
                sendJson(exchange, ok?200:400, "{\"ok\":" + ok + "}");
            } else {
                send404(exchange);
            }
        });

        // API: bookings: list
        server.createContext("/api/bookings", exchange -> {
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                Collection<?> list = bookingManager.allBookings();
                String json = list.stream().map(o -> bookingToJson((busbooking.models.Booking)o)).collect(Collectors.joining(",", "[", "]"));
                sendJson(exchange,200,json);
            } else {
                send404(exchange);
            }
        });

        // API: book (POST form: passengerName, phone, busNumber, requestedSeat(optional))
        server.createContext("/api/book", exchange -> {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) { send404(exchange); return; }
            Map<String,String> form = readForm(exchange);
            String pname = form.getOrDefault("passengerName", "");
            String phone = form.getOrDefault("phone", "");
            String busNumber = form.getOrDefault("busNumber", "");
            Passenger p = passengerManager.addPassenger(pname, phone);
            Booking bk = bookingManager.book(busNumber, p.id);
            if (bk==null) {
                sendJson(exchange,400,"{\"error\":\"bus not found\"}");
            } else {
                String resp = bookingToJson(bk);
                sendJson(exchange,200,resp);
            }
        });

        // API: cancel (POST form: ticketId)
        server.createContext("/api/cancel", exchange -> {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) { send404(exchange); return; }
            Map<String,String> form = readForm(exchange);
            String ticket = form.getOrDefault("ticketId", "");
            boolean ok = bookingManager.cancel(ticket);
            sendJson(exchange, ok?200:400, "{\"ok\":"+ok+"}");
        });

        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
        server.start();

        // Keep main thread alive
        System.out.println("Press Ctrl+C to stop the server.");
    }

    // --- helpers ---
    private static void send404(HttpExchange ex) throws IOException {
        String msg = "Not Found";
        ex.sendResponseHeaders(404, msg.length());
        try(OutputStream os=ex.getResponseBody()){ os.write(msg.getBytes()); }
    }

    private static void sendJson(HttpExchange ex, int code, String json) throws IOException {
        byte[] bytes = json.getBytes("UTF-8");
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        ex.sendResponseHeaders(code, bytes.length);
        try(OutputStream os=ex.getResponseBody()){ os.write(bytes); }
    }

    private static Map<String,String> readForm(HttpExchange ex) throws IOException{
        String body;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(ex.getRequestBody(), "UTF-8"))) {
            body = br.lines().collect(Collectors.joining("\n"));
        }
        Map<String,String> map = new HashMap<>();
        String[] pairs = body.split("&");
        for(String p : pairs){ if(p.isEmpty()) continue; String[] kv = p.split("=",2); String k = URLDecoder.decode(kv[0], "UTF-8"); String v = kv.length>1?URLDecoder.decode(kv[1], "UTF-8"):""; map.put(k,v); }
        return map;
    }

    private static String guessContentType(String path){
        if (path.endsWith(".html")) return "text/html; charset=utf-8";
        if (path.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (path.endsWith(".css")) return "text/css; charset=utf-8";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        if (path.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }

    private static String busToJson(Bus b){
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i=0;i<b.seats.length;i++) {
            sb.append(b.seats[i]?"true":"false");
            if (i < b.seats.length-1) sb.append(",");
        }
        sb.append("]");
        return String.format("{\"busNumber\":\"%s\",\"routeName\":\"%s\",\"departureTime\":%d,\"totalSeats\":%d,\"price\":%.2f,\"seats\":%s}",
                escape(b.busNumber), escape(b.routeName), b.departureTime, b.totalSeats, b.price, sb.toString());
    }

    private static String bookingToJson(Booking bk){
        return String.format("{\"ticketId\":\"%s\",\"busNumber\":\"%s\",\"passengerId\":\"%s\",\"seatIndex\":%d,\"bookingTime\":%d}",
                escape(bk.ticketId), escape(bk.busNumber), escape(bk.passengerId), bk.seatIndex, bk.bookingTime);
    }

    private static String escape(String s){ return s==null?"":s.replace("\\","\\\\").replace("\"","\\\""); }
}
