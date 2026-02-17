Bus Booking System (Console Java)

This is a simple, GUI based Java web application that demonstrates core DSA concepts while implementing a Bus Booking System.

Features implemented:

Structure
Bus Booking System (Console Java + Static Web Demo)

This is a simple, beginner-friendly project demonstrating core DSA concepts while implementing a Bus Booking System.

Features implemented:
- Bus Management: add, remove, update buses
- Route Management: add/remove/view routes
- Booking: book, cancel, view tickets
- Seat allocation and waitlist
- Undo last booking/cancellation using a stack
- Sorting and searching of buses
- Reports & analytics

Structure
- `src/busbooking/models` : Java model classes (console app)
- `src/busbooking/utils` : Java data structures and algorithms
- `src/busbooking/managers` : Java manager classes
- `src/busbooking/Main.java` : Java console menu
- `web/` : Static single-page web app (HTML/CSS/JS) — client-side demo

Java Compile & Run (Windows PowerShell)

cd to the project root containing `src` then run:

```powershell
javac -d out src/busbooking/**/*.java
java -cp out busbooking.Main
```

Web Demo (Static SPA)

- `web/index.html` : single-page frontend
- `web/styles.css` : styles
- `web/app.js` : client-side models, DSA utilities, managers, and UI wiring

Note: Payment flow updated — **Card** and **UPI** options removed; **Scan QR** added. Replace `web/qr-sample.svg` with your actual QR image to enable QR payments.

Run the web version: open `web/index.html` in your browser (no server required).

Notes
- The project intentionally uses clear, commented code showing where DSA concepts are used. It's designed for learning and demonstration rather than production use.

Compile & Run (Windows PowerShell)

cd to the project root containing `src` then run:

```powershell
javac -d out src/busbooking/**/*.java
java -cp out busbooking.Main
```

Notes


