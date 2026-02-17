/*
  ===================================================================
  BUS BOOKING SYSTEM - DATA STRUCTURES & ALGORITHMS IMPLEMENTATION
  ===================================================================
  
  This project demonstrates the practical application of various data structures
  and algorithms in a real-world bus booking system.
  
  DATA STRUCTURES IMPLEMENTED:
  ----------------------------
  1. LINKED LIST - For maintaining bus/route order and iteration
  2. STACK - For undo functionality (LIFO - Last In, First Out)
  3. QUEUE - For waitlist management (FIFO - First In, First Out)
  4. BINARY SEARCH TREE (BST) - For efficient search by departure time
  5. GRAPH - For route representation and path finding
  6. MAP (Hash Table) - For O(1) lookups by key
  7. ARRAY - For seat management and various operations
  
  ALGORITHMS IMPLEMENTED:
  ----------------------
  1. MERGE SORT - For sorting buses by departure/availability
  2. BREADTH-FIRST SEARCH (BFS) - For finding shortest path between cities
  3. LINEAR SEARCH - For finding available seats
  4. DEBOUNCE - For optimizing search input performance
  
  ARCHITECTURE:
  ------------
  - Models: Bus, Route, Passenger, Booking (data classes)
  - Managers: Use multiple DS for efficient operations
  - UI: Interactive interface with real-time updates
  
  KEY CONCEPTS DEMONSTRATED:
  --------------------------
  - Time/Space Complexity analysis
  - Trade-offs between different data structures
  - When to use which data structure
  - Real-world application of DSA concepts
  
  ===================================================================
*/

// ==================== DATA STRUCTURES & ALGORITHMS ====================
// This section implements core data structures used in the bus booking system

/**
 * LINKED LIST DATA STRUCTURE
 * 
 * A Linked List is a linear data structure where elements are stored in nodes,
 * and each node contains a value and a reference (pointer) to the next node.
 * 
 * Advantages:
 * - Dynamic size (can grow/shrink at runtime)
 * - Efficient insertion/deletion at any position (O(1) if we have the node)
 * 
 * Disadvantages:
 * - No random access (must traverse from head to reach a node)
 * - Extra memory for storing pointers
 * 
 * Time Complexity:
 * - Insertion at end: O(1) with tail pointer
 * - Deletion: O(n) worst case (need to find the node)
 * - Search: O(n)
 */
class LinkedListNode {
  // Each node stores a value and a pointer to the next node
  constructor(v) {
    this.value = v;  // The data stored in this node
    this.next = null; // Pointer to the next node (null if this is the last node)
  }
}

class LinkedList {
  constructor() {
    this.head = null;  // Points to the first node in the list
    this.tail = null;  // Points to the last node (for O(1) insertion at end)
    this._size = 0;    // Track the number of nodes for O(1) size lookup
  }
  
  /**
   * Add a new node at the end of the linked list
   * Time Complexity: O(1) - because we maintain a tail pointer
   */
  add(v) {
    const n = new LinkedListNode(v);
    // If list is empty, new node becomes both head and tail
    if (!this.head) {
      this.head = this.tail = n;
    } else {
      // Append to end: current tail's next points to new node, then update tail
      this.tail.next = n;
      this.tail = n;
    }
    this._size++;
  }
  
  /**
   * Remove a node that matches the given condition
   * Time Complexity: O(n) - may need to traverse entire list
   * 
   * @param {Function} matchFn - Function that returns true for the node to remove
   * @returns {boolean} - True if node was found and removed
   */
  remove(matchFn) {
    let prev = null;      // Previous node (needed to update links)
    let cur = this.head;  // Current node being checked
    
    // Traverse the list
    while (cur) {
      // Check if current node matches the condition
      if (matchFn(cur.value)) {
        // Update links to remove the node
        if (prev == null) {
          // Removing head node
          this.head = cur.next;
        } else {
          // Removing middle or tail node
          prev.next = cur.next;
        }
        
        // If removing tail, update tail pointer
        if (cur === this.tail) {
          this.tail = prev;
        }
        
        this._size--;
        return true; // Node found and removed
      }
      // Move to next node
      prev = cur;
      cur = cur.next;
    }
    return false; // Node not found
  }
  
  /**
   * Convert linked list to array (for iteration/display)
   * Time Complexity: O(n) - must visit each node
   */
  toArray() {
    const out = [];
    let cur = this.head;
    // Traverse from head to tail, collecting values
    while (cur) {
      out.push(cur.value);
      cur = cur.next;
    }
    return out;
  }
  
  size() {
    return this._size;
  }
}

/**
 * STACK DATA STRUCTURE
 * 
 * A Stack is a LIFO (Last In, First Out) data structure.
 * Think of it like a stack of plates - you add to the top and remove from the top.
 * 
 * Operations:
 * - push(): Add element to top
 * - pop(): Remove and return top element
 * - peek(): View top element without removing
 * 
 * Use Case: Used for "Undo" functionality - each action is pushed onto stack,
 * and undo pops the last action.
 * 
 * Time Complexity: All operations are O(1)
 */
class Stack {
  constructor() {
    this._arr = []; // Using array to implement stack (could use linked list too)
  }
  
  // Add element to top of stack
  push(v) {
    this._arr.push(v);
  }
  
  // Remove and return top element (returns null if empty)
  pop() {
    return this._arr.length ? this._arr.pop() : null;
  }
  
  // View top element without removing it
  peek() {
    return this._arr.length ? this._arr[this._arr.length - 1] : null;
  }
  
  // Check if stack is empty
  isEmpty() {
    return this._arr.length === 0;
  }
}

/**
 * QUEUE DATA STRUCTURE
 * 
 * A Queue is a FIFO (First In, First Out) data structure.
 * Think of it like a line at a ticket counter - first person in is first person out.
 * 
 * Operations:
 * - enqueue(): Add element to rear (end)
 * - dequeue(): Remove and return front element
 * 
 * Use Case: Used for waitlist - passengers join the queue and are served in order.
 * 
 * Time Complexity:
 * - enqueue(): O(1) - adding to end
 * - dequeue(): O(n) - removing from front (array shift is O(n))
 *   Note: Could be O(1) with linked list implementation
 */
class Queue {
  constructor() {
    this._arr = []; // Using array to implement queue
  }
  
  // Add element to rear of queue
  enqueue(v) {
    this._arr.push(v);
  }
  
  // Remove and return front element (returns null if empty)
  // Note: shift() is O(n) - for better performance, use linked list with head/tail pointers
  dequeue() {
    return this._arr.length ? this._arr.shift() : null;
  }
  
  // Check if queue is empty
  isEmpty() {
    return this._arr.length === 0;
  }
  
  // Convert queue to array (for display)
  toArray() {
    return this._arr.slice(); // Return copy to prevent external modification
  }
}

/**
 * BINARY SEARCH TREE (BST) DATA STRUCTURE
 * 
 * A BST is a tree where each node has at most 2 children (left and right).
 * The key property: For any node, all values in left subtree < node < all values in right subtree.
 * 
 * Structure:
 *        [root]
 *        /    \
 *    [left]  [right]
 *     /  \     /  \
 *   ...  ... ...  ...
 * 
 * Advantages:
 * - Fast search: O(log n) average case (if balanced)
 * - Maintains sorted order
 * - Efficient insertion/deletion
 * 
 * Disadvantages:
 * - Can become unbalanced (worst case O(n) height)
 * - No guarantee of balance (unlike AVL or Red-Black trees)
 * 
 * Use Case: Store buses sorted by departure time for fast lookup
 * 
 * Time Complexity:
 * - Insert: O(log n) average, O(n) worst (unbalanced)
 * - Search: O(log n) average, O(n) worst (unbalanced)
 */
class BusBSTNode {
  constructor(key, bus) {
    this.key = key;      // Departure time (used for comparison)
    this.bus = bus;      // The bus object stored in this node
    this.left = null;    // Left child (buses with earlier departure)
    this.right = null;   // Right child (buses with later departure)
  }
}

class BusBST {
  constructor() {
    this.root = null; // Root node of the tree
  }
  
  /**
   * Insert a bus into the BST based on departure time
   * Time Complexity: O(log n) average, O(n) worst case
   */
  insert(bus) {
    const key = bus.departure; // Use departure time as the key
    this.root = this._insert(this.root, key, bus);
  }
  
  /**
   * Recursive helper for insertion
   * 
   * Algorithm:
   * 1. If current node is null, create new node here
   * 2. If key < current node's key, go left (earlier departure)
   * 3. If key >= current node's key, go right (later departure)
   * 4. Recursively insert in the appropriate subtree
   */
  _insert(node, key, bus) {
    // Base case: Found empty spot, create new node
    if (!node) {
      return new BusBSTNode(key, bus);
    }
    
    // Recursive case: Compare keys and go left or right
    if (key < node.key) {
      // Insert in left subtree (earlier departure)
      node.left = this._insert(node.left, key, bus);
    } else {
      // Insert in right subtree (later or equal departure)
      node.right = this._insert(node.right, key, bus);
    }
    
    return node; // Return the (possibly updated) node
  }
  
  /**
   * Search for a bus by departure time
   * Time Complexity: O(log n) average, O(n) worst case
   * 
   * Algorithm:
   * 1. Start at root
   * 2. Compare key with current node
   * 3. If equal, found!
   * 4. If key < current, go left
   * 5. If key > current, go right
   * 6. Repeat until found or reach null
   */
  search(key) {
    let cur = this.root;
    
    // Traverse tree from root
    while (cur) {
      if (key === cur.key) {
        // Found exact match
        return cur.bus;
      }
      // Go left if searching for earlier time, right if later
      cur = key < cur.key ? cur.left : cur.right;
    }
    
    return null; // Not found
  }
}

/**
 * MERGE SORT ALGORITHM
 * 
 * Merge Sort is a divide-and-conquer sorting algorithm.
 * 
 * How it works:
 * 1. Divide: Split array into two halves
 * 2. Conquer: Recursively sort both halves
 * 3. Combine: Merge the two sorted halves
 * 
 * Time Complexity: O(n log n) - always (best, average, worst)
 * Space Complexity: O(n) - needs temporary arrays for merging
 * 
 * Advantages:
 * - Guaranteed O(n log n) performance
 * - Stable sort (maintains relative order of equal elements)
 * - Good for large datasets
 * 
 * Disadvantages:
 * - Requires extra memory
 * - Not in-place (unlike quicksort)
 * 
 * Use Case: Sorting buses by departure time or availability
 */
function mergeSort(arr, cmp) {
  // Base case: Array of 0 or 1 element is already sorted
  if (arr.length <= 1) {
    return arr.slice(); // Return copy to avoid mutation
  }
  
  // Divide: Split array into two halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Conquer: Recursively sort both halves
  const sortedLeft = mergeSort(left, cmp);
  const sortedRight = mergeSort(right, cmp);
  
  // Combine: Merge the two sorted halves
  return merge(sortedLeft, sortedRight, cmp);
}

/**
 * Merge two sorted arrays into one sorted array
 * 
 * Algorithm:
 * 1. Compare first elements of both arrays
 * 2. Add smaller element to result
 * 3. Move pointer in array that had smaller element
 * 4. Repeat until one array is exhausted
 * 5. Add remaining elements from other array
 * 
 * Time Complexity: O(n + m) where n and m are sizes of arrays
 */
function merge(a, b, cmp) {
  const out = [];
  let i = 0; // Pointer for array 'a'
  let j = 0; // Pointer for array 'b'
  
  // Compare and merge while both arrays have elements
  while (i < a.length && j < b.length) {
    // Compare using comparator function
    // If a[i] <= b[j], add a[i] and move i forward
    // Otherwise, add b[j] and move j forward
    if (cmp(a[i], b[j]) <= 0) {
      out.push(a[i++]); // Add a[i], then increment i
    } else {
      out.push(b[j++]); // Add b[j], then increment j
    }
  }
  
  // Add remaining elements from array 'a' (if any)
  while (i < a.length) {
    out.push(a[i++]);
  }
  
  // Add remaining elements from array 'b' (if any)
  while (j < b.length) {
    out.push(b[j++]);
  }
  
  return out;
}

// ------------------ Models ------------------
const DEFAULT_SEATS = 40; // enforced global seat count
const ENFORCE_COLS = 4;   // enforced columns per bus

class Bus{ constructor(number,route,departure,seats,price){ this.number=number; this.route=route; this.departure=Number(departure); // total seats are enforced globally
    this.totalSeats = DEFAULT_SEATS; // ignore per-bus seat number to keep consistency
    this.price=Number(price);
    // initialize seats array and if a seats argument is passed it's ignored in favor of DEFAULT_SEATS
    this.seats = new Array(this.totalSeats).fill(false);
  }
  availableSeats(){ return this.seats.filter(s=>!s).length; }
  bookSeat(index){ if(index<0||index>=this.totalSeats) return false; if(this.seats[index]) return false; this.seats[index]=true; return true; }
  cancelSeat(index){ if(index<0||index>=this.totalSeats) return false; if(!this.seats[index]) return false; this.seats[index]=false; return true; }
  toString(){ return `${this.number} | ${this.route} | ${this.departure} | Seats:${this.availableSeats()}/${this.totalSeats} | ₹${this.price.toFixed(2)}`; } }

class RouteModel{ constructor(name,stops=[]){ this.name=name; this.stops=stops.slice(); } toString(){ return `${this.name} -> ${this.stops.join(' -> ')}`; } }

class Passenger{ constructor(id,name,phone){ this.id=id; this.name=name; this.phone=phone; } toString(){ return `${this.name} (${this.id}) ${this.phone||''}`; } }

class Booking{ constructor(ticketId,busNumber,passengerId,seatIndex){ this.ticketId=ticketId; this.busNumber=busNumber; this.passengerId=passengerId; this.seatIndex=seatIndex; this.time=Date.now(); } toString(){ return `${this.ticketId} | Bus:${this.busNumber} | Passenger:${this.passengerId} | Seat:${this.seatIndex>=0?this.seatIndex:'WAIT'} | Time:${this.time}`; } }

// ==================== MANAGER CLASSES ====================
// Managers use multiple data structures to provide efficient operations

/**
 * BUS MANAGER
 * 
 * Uses THREE data structures for different purposes:
 * 1. LinkedList - Maintains insertion order, easy to iterate
 * 2. Map (Hash Table) - O(1) lookup by bus number
 * 3. BST - O(log n) search by departure time
 * 
 * This is a great example of using multiple DS for different operations!
 * 
 * Trade-offs:
 * - More memory (store same data 3 times) but faster operations
 * - Each structure optimized for different use cases
 */
class BusManagerJS {
  constructor() {
    // LinkedList: Maintains order, easy to iterate all buses
    this.list = new LinkedList();
    
    // Map (Hash Table): O(1) lookup by bus number
    // Key: bus number, Value: bus object
    this.map = new Map();
    
    // BST: O(log n) search by departure time
    this.bst = new BusBST();
  }
  
  /**
   * Add a bus to all three data structures
   * Time Complexity: O(log n) - dominated by BST insertion
   * 
   * Why add to all three?
   * - LinkedList: For iteration and maintaining order
   * - Map: For fast lookup by bus number
   * - BST: For fast search by departure time
   */
  addBus(bus) {
    // Check if bus number already exists (using Map for O(1) check)
    if (this.map.has(bus.number)) {
      return false; // Duplicate bus number
    }
    
    // Add to all three structures
    this.list.add(bus);              // O(1) - add to end of linked list
    this.map.set(bus.number, bus);   // O(1) - hash table insertion
    this.bst.insert(bus);            // O(log n) - BST insertion
    
    return true;
  }
  
  /**
   * Remove a bus from all structures
   * Time Complexity: O(n) - dominated by LinkedList removal
   */
  removeBus(number) {
    const bus = this.map.get(number);
    if (!bus) return false; // Bus not found
    
    // Remove from all structures
    this.map.delete(number);                    // O(1) - hash table deletion
    this.list.remove(v => v.number === number); // O(n) - must find in linked list
    // Note: BST removal not implemented (would be O(log n))
    
    return true;
  }
  
  /**
   * Get bus by number - uses Map for O(1) lookup
   * Time Complexity: O(1) - hash table lookup
   */
  getBus(number) {
    return this.map.get(number) || null;
  }
  
  /**
   * Get all buses - uses LinkedList for iteration
   * Time Complexity: O(n) - must visit all nodes
   */
  allBuses() {
    return this.list.toArray();
  }
  
  /**
   * Sort buses by departure time using Merge Sort
   * Time Complexity: O(n log n) - merge sort
   */
  sortByDeparture() {
    return mergeSort(this.allBuses(), (a, b) => a.departure - b.departure);
  }
  
  /**
   * Sort buses by availability (most available first)
   * Time Complexity: O(n log n) - merge sort
   */
  sortByAvailability() {
    return mergeSort(this.allBuses(), (a, b) => b.availableSeats() - a.availableSeats());
  }
  
  /**
   * Find buses by route name - linear search
   * Time Complexity: O(n) - must check all buses
   */
  findByRoute(routeName) {
    return this.allBuses().filter(b => 
      b.route.toLowerCase() === routeName.toLowerCase()
    );
  }
  
  /**
   * Search bus by exact departure time - uses BST
   * Time Complexity: O(log n) average, O(n) worst case
   */
  searchByDeparture(t) {
    return this.bst.search(Number(t));
  }
}

/**
 * ROUTE MANAGER
 * 
 * Uses LinkedList to maintain routes in insertion order.
 * 
 * Why LinkedList?
 * - Simple structure for storing routes
 * - Easy to iterate and display
 * - Dynamic size (can add routes anytime)
 * 
 * Time Complexity:
 * - addRoute: O(1) - add to end of linked list
 * - all: O(n) - convert to array (must traverse all nodes)
 */
class RouteManagerJS {
  constructor() {
    // LinkedList: Maintains routes in insertion order
    this.list = new LinkedList();
  }
  
  /**
   * Add a route to the list
   * Time Complexity: O(1) - LinkedList add is O(1)
   */
  addRoute(r) {
    this.list.add(r);
  }
  
  /**
   * Get all routes as array
   * Time Complexity: O(n) - must traverse linked list
   */
  all() {
    return this.list.toArray();
  }
}

/**
 * PASSENGER MANAGER
 * 
 * Uses TWO Maps for efficient lookups:
 * 1. byId Map - O(1) lookup by passenger ID
 * 2. byName Map - O(1) lookup by name (handles multiple passengers with same name)
 * 
 * This demonstrates indexing - storing data in multiple ways for different queries.
 * 
 * Trade-off: Uses more memory (data stored twice) but enables fast lookups.
 */
class PassengerManagerJS {
  constructor() {
    // Map: O(1) lookup by passenger ID
    // Key: passenger ID, Value: Passenger object
    this.byId = new Map();
    
    // Map: O(1) lookup by name (case-insensitive)
    // Key: lowercase name, Value: Array of Passenger objects (handles duplicates)
    this.byName = new Map();
  }
  
  /**
   * Add a new passenger
   * Time Complexity: O(1) - Map operations are O(1)
   * 
   * Algorithm:
   * 1. Generate unique ID
   * 2. Create Passenger object
   * 3. Store in byId map
   * 4. Store in byName map (lowercase key for case-insensitive search)
   */
  add(name, phone) {
    // Generate unique passenger ID
    const id = 'P' + Math.random().toString(36).slice(2, 8);
    const p = new Passenger(id, name, phone);
    
    // Store in byId map for O(1) lookup by ID
    this.byId.set(id, p);
    
    // Store in byName map for O(1) lookup by name
    const k = name.toLowerCase(); // Case-insensitive key
    if (!this.byName.has(k)) {
      this.byName.set(k, []); // Initialize array if first passenger with this name
    }
    this.byName.get(k).push(p); // Add to array (handles duplicate names)
    
    return p;
  }
  
  /**
   * Get passenger by ID
   * Time Complexity: O(1) - Map lookup
   */
  getById(id) {
    return this.byId.get(id) || null;
  }
  
  /**
   * Search passengers by name (case-insensitive)
   * Time Complexity: O(1) - Map lookup
   * Returns array (multiple passengers can have same name)
   */
  searchByName(name) {
    return this.byName.get(name.toLowerCase()) || [];
  }
}

/**
 * BOOKING MANAGER
 * 
 * Manages ticket bookings using THREE data structures:
 * 1. Map - O(1) lookup of bookings by ticket ID
 * 2. Queue - FIFO waitlist for passengers when bus is full
 * 3. Stack - LIFO undo stack for reversing actions
 * 
 * This demonstrates practical use of different data structures!
 */
class BookingManagerJS {
  constructor(busMgr, passMgr) {
    this.busMgr = busMgr;  // Reference to bus manager
    this.passMgr = passMgr; // Reference to passenger manager
    
    // Map: Fast lookup of bookings by ticket ID
    // Key: ticket ID, Value: booking object
    this.bookings = new Map();
    
    // Queue: Waitlist - passengers waiting for seats (FIFO)
    // First passenger to join waitlist gets first available seat
    this.waitlist = new Queue();
    
    // Stack: Undo functionality (LIFO)
    // Last action performed is first to be undone
    this.undoStack = new Stack();
  }
  
  /**
   * Book a ticket for a passenger
   * 
   * Algorithm:
   * 1. Get the bus
   * 2. If specific seat requested and available, use it
   * 3. Otherwise, find first available seat (linear search)
   * 4. If no seat available, add to waitlist (seat = -1)
   * 5. Create booking and store in Map
   * 6. Push action to undo stack
   * 
   * Time Complexity: O(n) worst case (searching for available seat)
   * 
   * @param {string} busNumber - Bus to book on
   * @param {string} passengerId - Passenger ID
   * @param {number|null} requestedSeat - Optional: specific seat number
   * @returns {Booking|null} - Booking object or null if bus not found
   */
  book(busNumber, passengerId, requestedSeat = null) {
    const bus = this.busMgr.getBus(busNumber);
    if (!bus) return null; // Bus not found
    
    let seat = -1; // -1 means no seat (waitlist)
    
    // Check if specific seat was requested and is available
    if (requestedSeat !== null && 
        requestedSeat >= 0 && 
        requestedSeat < bus.totalSeats && 
        !bus.seats[requestedSeat]) {
      // Requested seat is valid and available
      seat = requestedSeat;
    } else {
      // Find first available seat (linear search through seat array)
      for (let i = 0; i < bus.totalSeats; i++) {
        if (!bus.seats[i]) {
          seat = i;
          break; // Found first available seat
        }
      }
      // If no seat found, seat remains -1 (waitlist)
    }
    
    // Generate unique ticket ID
    const ticket = 'T' + Math.random().toString(36).slice(2, 9);
    const booking = new Booking(ticket, busNumber, passengerId, seat);
    
    // Store booking in Map for O(1) lookup
    this.bookings.set(ticket, booking);
    
    if (seat >= 0) {
      // Seat was assigned - mark it as booked
      bus.bookSeat(seat);
      // Push to undo stack (Stack - LIFO)
      this.undoStack.push({ action: 'BOOK', booking });
    } else {
      // No seat available - add to waitlist (Queue - FIFO)
      this.waitlist.enqueue(passengerId);
      // Push to undo stack
      this.undoStack.push({ action: 'WAIT', booking });
    }
    
    return booking;
  }
  
  /**
   * Cancel a booking
   * 
   * Algorithm:
   * 1. Get booking from Map
   * 2. Remove from bookings Map
   * 3. If had a seat:
   *    - Free the seat
   *    - Check waitlist - if someone waiting, assign them the freed seat
   * 4. If was on waitlist:
   *    - Remove from waitlist (must rebuild queue to remove specific item)
   * 5. Push cancel action to undo stack
   * 
   * Time Complexity: O(n) - waitlist removal requires rebuilding queue
   * 
   * @param {string} ticketId - Ticket to cancel
   * @returns {boolean} - True if cancelled successfully
   */
  cancel(ticketId) {
    const b = this.bookings.get(ticketId);
    if (!b) return false; // Booking not found
    
    this.bookings.delete(ticketId); // Remove from Map
    const bus = this.busMgr.getBus(b.busNumber);
    
    if (b.seatIndex >= 0 && bus) {
      // Booking had a seat - free it
      bus.cancelSeat(b.seatIndex);
      
      // Check waitlist - if someone waiting, give them this seat
      // This demonstrates Queue FIFO behavior
      const next = this.waitlist.dequeue(); // Get first in queue
      if (next) {
        // Assign freed seat to next person in waitlist
        bus.bookSeat(b.seatIndex);
        const newTicket = 'T' + Math.random().toString(36).slice(2, 9);
        const nb = new Booking(newTicket, b.busNumber, next, b.seatIndex);
        this.bookings.set(newTicket, nb);
      }
      
      // Push cancel action to undo stack
      this.undoStack.push({ action: 'CANCEL', booking: b });
      return true;
    } else if (b.seatIndex < 0) {
      // Booking was on waitlist - remove from queue
      // Note: Queue doesn't support removing specific item, so we rebuild it
      const temp = [];
      let v;
      // Dequeue all, keeping only those not matching cancelled passenger
      while ((v = this.waitlist.dequeue()) !== null) {
        if (v !== b.passengerId) {
          temp.push(v);
        }
      }
      // Rebuild queue with remaining passengers
      temp.forEach(x => this.waitlist.enqueue(x));
      
      this.undoStack.push({ action: 'CANCEL_WAIT', booking: b });
      return true;
    }
    
    return false;
  }
  
  /**
   * Undo last action using Stack (LIFO)
   * 
   * This demonstrates Stack usage - last action is first undone
   * 
   * Time Complexity: O(1) for pop, O(n) for cancel operation
   * 
   * @returns {string} - Message describing what was undone
   */
  undo() {
    const a = this.undoStack.pop(); // Get last action (Stack - LIFO)
    if (!a) return 'Nothing to undo';
    
    // Undo by cancelling the booking
    if (a.action === 'BOOK') {
      this.cancel(a.booking.ticketId);
      return 'Undone booking ' + a.booking.ticketId;
    } else if (a.action === 'WAIT') {
      this.cancel(a.booking.ticketId);
      return 'Undone wait ' + a.booking.ticketId;
    }
    
    return 'Undo not supported for this action';
  }
  
  /**
   * Get all bookings
   * Time Complexity: O(n) - must iterate all values in Map
   */
  allBookings() {
    return Array.from(this.bookings.values());
  }
  
  /**
   * Get waitlist as array
   * Time Complexity: O(n) - converts queue to array
   */
  waitlistArray() {
    return this.waitlist.toArray();
  }
}

// ------------------ Persistence (localStorage) & Server API ------------------
const STORAGE_KEY='busbooking_v1';
function saveState(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadState(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)); }catch(e){ return null; } }

// If a Java server is available at the same origin, prefer server-backed
// storage and operations. Probe at startup and sync data from server.
let useServer = false;
let serverPollIntervalId = null;
function showServerBadge(){ try{ const el = document.getElementById('server-badge'); if(el) el.classList.remove('hidden'); }catch(e){} }
function hideServerBadge(){ try{ const el = document.getElementById('server-badge'); if(el) el.classList.add('hidden'); }catch(e){} }
async function probeServer(){
  try {
    const res = await fetch('/api/ping');
    if (!res.ok) return false;
    const j = await res.json();
    if (j && j.status === 'ok') {
      useServer = true;
      showServerBadge();
      await syncFromServer();
      startServerPolling();
      console.info('Server detected — using server-backed mode');
      return true;
    }
  } catch (e) {}
  useServer = false;
  hideServerBadge();
  return false;
}

function startServerPolling(){
  if (serverPollIntervalId) return; // already polling
  // Poll every 3 seconds
  serverPollIntervalId = setInterval(async ()=>{
    if (!useServer) { clearInterval(serverPollIntervalId); serverPollIntervalId = null; return; }
    try {
      await syncFromServer();
      populateRouteFilter();
      const source = document.getElementById('bus-source')?.value || '';
      const destination = document.getElementById('bus-destination')?.value || '';
      renderBusesInteractive(document.getElementById('bus-search') ? document.getElementById('bus-search').value : '', source, destination);
      renderRoutes();
      renderBookings();
      renderWaitlist();
      refreshAnalytics();
      const routesView = document.getElementById('view-routes');
      if(routesView && !routesView.classList.contains('hidden')) drawRouteGraph();
    } catch(e){ console.warn('Polling sync failed', e); }
  }, 3000);
}

function stopServerPolling(){ if (serverPollIntervalId) { clearInterval(serverPollIntervalId); serverPollIntervalId = null; } }

async function syncFromServer(){
  try {
    // fetch buses
    const bres = await fetch('/api/buses');
    if (bres.ok) {
      const buses = await bres.json();
      // clear local managers and populate from server
      // keep manager instances but clear their contents
      // (cheap approach: recreate managers)
      // preserve references used by UI
      // clear existing maps/structures
      // remove entries by reconstructing managers
      // NOTE: simple approach: instantiate fresh JS managers and replace globals
      const newBusMgr = new BusManagerJS();
      buses.forEach(b => {
        const bus = new Bus(b.busNumber || b.number, b.routeName || b.route, b.departureTime || b.departure, b.totalSeats || b.total || b.totalSeats, b.price || 0);
        if (Array.isArray(b.seats)) bus.seats = b.seats.slice();
        newBusMgr.addBus(bus);
      });
      // copy internal state to existing busMgr
      Object.assign(busMgr, newBusMgr);
    }
    // fetch bookings
    const bkres = await fetch('/api/bookings');
    if (bkres.ok) {
      const bks = await bkres.json();
      // clear existing bookings and passengers
      bookingMgr.bookings = new Map();
      passMgr.byId = new Map(); passMgr.byName = new Map();
      bks.forEach(b => {
        // ensure passenger exists (server may not expose name)
        let pid = b.passengerId || b.passenger || '';
        if (!passMgr.getById(pid)) {
          const pname = 'srv-' + (pid ? pid.slice(0,6) : Math.random().toString(36).slice(2,6));
          passMgr.byId.set(pid, new Passenger(pid, pname, ''));
          const k = pname.toLowerCase(); if(!passMgr.byName.has(k)) passMgr.byName.set(k,[]); passMgr.byName.get(k).push(passMgr.byId.get(pid));
        }
        const ticket = b.ticketId || b.ticket || b.id;
        const seatIndex = (typeof b.seatIndex === 'number')? b.seatIndex : (b.seat || -1);
        const bk = new Booking(ticket, b.busNumber, pid, seatIndex);
        bk.time = b.bookingTime || b.time || Date.now();
        bookingMgr.bookings.set(ticket, bk);
        // mark seat on bus
        const bus = busMgr.getBus(b.busNumber);
        if (bus && seatIndex>=0) bus.seats[seatIndex] = true;
      });
    }
  } catch (e) {
    console.warn('Failed to sync from server', e);
  }
}

// ------------------ App Initialization & UI ------------------
const busMgr=new BusManagerJS(); const routeMgr=new RouteManagerJS(); const passMgr=new PassengerManagerJS(); const bookingMgr=new BookingManagerJS(busMgr,passMgr);

const ADMIN_PASSCODE = 'ADMIN123';
const ROLE_STORAGE_KEY = 'busbooking_role';
let currentRole = 'user';
let currentView = 'buses';
let currentReportSort = 'departure';
let selectedSeat = null; // {busNumber, index}
let topBusesChart = null, topRoutesChart = null;
let chartsDirty = true;

function seedDemo(){ if(busMgr.allBuses().length>0) return; busMgr.addBus(new Bus('BUS100','CityA-CityB',900,40,200.0)); busMgr.addBus(new Bus('BUS200','CityA-CityC',1100,40,300.0)); routeMgr.addRoute(new RouteModel('CityA-CityB',['CityA','CityB'])); }

function saveAll(){
  if (useServer) return; // server mode persists on backend
  const state = { buses: busMgr.allBuses().map(b=>({number:b.number,route:b.route,departure:b.departure,totalSeats:b.totalSeats,price:b.price,seats:b.seats,layoutCols:b.layoutCols||null})), routes: routeMgr.all().map(r=>({name:r.name,stops:r.stops})), passengers: Array.from(passMgr.byId.values()).map(p=>({id:p.id,name:p.name,phone:p.phone})), bookings: bookingMgr.allBookings().map(b=>({ticketId:b.ticketId,busNumber:b.busNumber,passengerId:b.passengerId,seatIndex:b.seatIndex,time:b.time,paymentMethod:b.paymentMethod||'',paymentStatus:b.paymentStatus||'',source:b.source||'',destination:b.destination||'',travelDate:b.travelDate||''})), waitlist: bookingMgr.waitlistArray() };
  saveState(state);
}

function loadAll(){ const s=loadState(); if(!s) return; // restore buses
  s.buses.forEach(bobj=>{ const b=new Bus(bobj.number,bobj.route,bobj.departure,bobj.totalSeats,bobj.price);
      // normalize seats to DEFAULT_SEATS and copy any existing bookings into the first DEFAULT_SEATS slots
      b.seats = new Array(DEFAULT_SEATS).fill(false);
      if(Array.isArray(bobj.seats)){
        for(let i=0;i<Math.min(bobj.seats.length, DEFAULT_SEATS); i++){
          b.seats[i] = !!bobj.seats[i];
        }
      }
      b.totalSeats = DEFAULT_SEATS;
      b.layoutCols = ENFORCE_COLS;
      busMgr.addBus(b);
    });
  s.routes.forEach(r=>routeMgr.addRoute(new RouteModel(r.name,r.stops)));
  s.passengers.forEach(p=>passMgr.byId.set(p.id,new Passenger(p.id,p.name,p.phone)));
  passMgr.byId.forEach(p=>{ const k=p.name.toLowerCase(); if(!passMgr.byName.has(k)) passMgr.byName.set(k,[]); passMgr.byName.get(k).push(p); });
  // restore bookings with original ticket ids
  if(s.bookings) s.bookings.forEach(bobj=>{ const bk=new Booking(bobj.ticketId,bobj.busNumber,bobj.passengerId,bobj.seatIndex); bk.time = bobj.time || Date.now(); bookingMgr.bookings.set(bk.ticketId,bk); if(bk.seatIndex>=0){ const bus = busMgr.getBus(bk.busNumber); if(bus) bus.seats[bk.seatIndex] = true; } });
  // restore per-bus layoutCols
  if(s.buses) s.buses.forEach(bobj=>{ const bus = busMgr.getBus(bobj.number); if(bus) bus.layoutCols = bobj.layoutCols || bus.layoutCols; });
  // restore payment fields and route info
  if(s.bookings) s.bookings.forEach(bobj=>{ const bk2 = bookingMgr.bookings.get(bobj.ticketId); if(bk2){ bk2.paymentMethod = bobj.paymentMethod || ''; bk2.paymentStatus = bobj.paymentStatus || ''; bk2.source = bobj.source || ''; bk2.destination = bobj.destination || ''; bk2.travelDate = bobj.travelDate || ''; } });
  // restore waitlist
  if(s.waitlist) s.waitlist.forEach(pid=>bookingMgr.waitlist.enqueue(pid));
}

// ------------------ Toast Notification System ------------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s reverse';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * DEBOUNCE FUNCTION (Performance Optimization)
 * 
 * Debouncing limits how often a function can be called.
 * 
 * How it works:
 * - When function is called, wait for 'wait' milliseconds
 * - If called again before wait time expires, cancel previous call
 * - Only execute after 'wait' ms of no calls
 * 
 * Use Case: Search input
 * - User types "bus" -> triggers search 4 times (b, u, s, ...)
 * - Without debounce: 4 API calls or 4 filter operations
 * - With debounce: Only 1 operation after user stops typing
 * 
 * Example:
 * User types "bus" quickly:
 * - Type 'b': wait 300ms
 * - Type 'u' (after 100ms): cancel previous, wait 300ms
 * - Type 's' (after 100ms): cancel previous, wait 300ms
 * - Stop typing: after 300ms, execute search with "bus"
 * 
 * Time Complexity: O(1) per call
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout; // Stores the timeout ID
  
  // Return a new function that wraps the original
  return function executedFunction(...args) {
    // Clear any existing timeout
    clearTimeout(timeout);
    
    // Set new timeout
    timeout = setTimeout(() => {
      func(...args); // Execute function after wait time
    }, wait);
  };
}

// ------------------ UI Helpers ------------------
function renderBusesInteractive(filterText = '', source = '', destination = '') {
  const el = document.getElementById('buses-list');
  const loadingEl = document.getElementById('buses-loading');
  const countEl = document.getElementById('bus-count');
  const busesPanel = document.getElementById('buses-panel');
  
  if (!el) return;
  
  // Hide buses panel if source or destination is missing
  if (!source || !destination) {
    if (busesPanel) busesPanel.classList.add('hidden');
    el.innerHTML = '';
    return;
  }
  
  // Show buses panel
  if (busesPanel) busesPanel.classList.remove('hidden');
  
  // Show loading
  if (loadingEl) loadingEl.classList.remove('hidden');
  el.innerHTML = '';
  
  setTimeout(() => {
    const arr = busMgr.allBuses();
    let filtered = arr;
    
    // Filter by source and destination (both required)
    if (source && destination) {
      filtered = arr.filter(b => {
        const routeLower = b.route.toLowerCase();
        const sourceLower = source.toLowerCase();
        const destLower = destination.toLowerCase();
        
        // Check if route contains both source and destination
        const hasSource = routeLower.includes(sourceLower);
        const hasDestination = routeLower.includes(destLower);
        
        // Also check if route is in format "Source-Destination" or "Source->Destination"
        const routeParts = routeLower.split(/[->]/).map(p => p.trim());
        const hasSourceInParts = routeParts.some(p => p.includes(sourceLower));
        const hasDestInParts = routeParts.some(p => p.includes(destLower));
        
        return hasSource && hasDestination && hasSourceInParts && hasDestInParts;
      });
    }
    
    // Then apply text filter if provided
    if (filterText) {
      const ft = filterText.toLowerCase();
      filtered = filtered.filter(b => 
        b.number.toLowerCase().includes(ft) || 
        b.route.toLowerCase().includes(ft)
      );
    }
    
    // Update count
    if (countEl) {
      countEl.textContent = `${filtered.length} bus${filtered.length !== 1 ? 'es' : ''}`;
    }
    
    // Hide loading
    if (loadingEl) loadingEl.classList.add('hidden');
    
    if (filtered.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="empty-icon">🚌</div><p>No buses found for this route</p></div>';
      return;
    }
    
    el.innerHTML = '';
    filtered.forEach((b, index) => {
      const card = document.createElement('div');
      card.className = 'bus-card';
      card.innerHTML = `
        <div class="bus-card-header">
          <div>
            <div class="bus-number">${b.number}</div>
            <div class="bus-route">${b.route}</div>
            <div class="bus-time">🕐 ${formatDeparture(b.departure)}</div>
          </div>
          <div class="bus-availability">${b.availableSeats()}/${b.totalSeats}</div>
        </div>
        <div class="bus-details">
          <div class="bus-detail-item">
            <span class="bus-detail-label">Departure:</span>
            <span class="bus-detail-value">${formatDeparture(b.departure)}</span>
          </div>
          <div class="bus-detail-item">
            <span class="bus-detail-label">Price:</span>
            <span class="bus-detail-value">${formatCurrency(b.price)}</span>
          </div>
          <div class="bus-detail-item">
            <span class="bus-detail-label">Available:</span>
            <span class="bus-detail-value">${b.availableSeats()} seats</span>
          </div>
        </div>
        <div class="bus-actions">
          <button class="btn-quick-book" onclick="event.stopPropagation(); quickBook('${b.number}')">Quick Book</button>
        </div>
      `;
      
      card.addEventListener('click', () => showBusDetail(b.number));
      el.appendChild(card);
    });
  }, 300);
}

// Quick book function
async function quickBook(busNumber) {
  const bus = busMgr.getBus(busNumber);
  if (!bus) {
    showToast('Bus not found', 'error');
    return;
  }
  
  if (bus.availableSeats() === 0) {
    showToast('No seats available on this bus', 'warning');
    return;
  }
  
  // Switch to book view and pre-fill
  showView('book');
  document.getElementById('book-bus').value = busNumber;
  document.getElementById('book-bus').focus();
  showToast('Bus number filled. Enter passenger details to book.', 'info');
}
// Compute number of columns to use for a bus seat grid.
function getColsForBus(bus){ // enforce 4 columns for consistent bus layouts
  return ENFORCE_COLS;
} 
function renderRoutes(){ const el=document.getElementById('routes-list'); const arr=routeMgr.all(); el.textContent = arr.map(r=>r.toString()).join('\n') || '(no routes)'; }
function seatLabelFromIndex(bus, seatIndex){
  if(!bus || typeof seatIndex !== 'number' || seatIndex < 0) return 'WAIT';
  const cols = getColsForBus(bus);
  const row = Math.floor(seatIndex/cols);
  const col = (seatIndex % cols) + 1;
  return String.fromCharCode(65 + row) + col;
}
function formatCurrency(value){
  const num = Number(value);
  if(Number.isNaN(num)) return '₹0.00';
  return '₹' + num.toFixed(2);
}
function formatDeparture(value){
  const num = Number(value);
  if(Number.isNaN(num) || num <= 0) return '-';
  const str = num.toString().padStart(4,'0');
  const hours = str.slice(0, str.length - 2) || '00';
  const minutes = str.slice(-2);
  return `${hours}:${minutes}`;
}
function updateText(id, value){
  const el = document.getElementById(id);
  if(el) el.textContent = value;
}
function getReportDataset(){
  if(currentReportSort === 'availability') return busMgr.sortByAvailability();
  if(currentReportSort === 'price'){ return busMgr.allBuses().slice().sort((a,b)=>a.price-b.price); }
  return busMgr.sortByDeparture();
}

function renderBookings() {
  const table = document.getElementById('bookings-table');
  const tbody = table ? table.querySelector('tbody') : null;
  const empty = document.getElementById('bookings-empty');
  const arr = bookingMgr.allBookings();
  
  if (!table || !tbody) {
    const fallback = document.getElementById('bookings-list');
    if (fallback) fallback.textContent = arr.map(b => b.toString()).join('\n') || '(no bookings)';
    return;
  }
  
  tbody.innerHTML = '';
  
  if (arr.length === 0) {
    table.classList.add('hidden');
    if (empty) empty.classList.remove('hidden');
    return;
  }
  
  table.classList.remove('hidden');
  if (empty) empty.classList.add('hidden');
  
  // Sort by time (newest first)
  const sorted = arr.slice().sort((a, b) => b.time - a.time);
  
  sorted.forEach(b => {
    const bus = busMgr.getBus(b.busNumber);
    const seatStr = seatLabelFromIndex(bus, b.seatIndex);
    const passenger = passMgr.getById(b.passengerId) || { name: b.passengerId };
    const routeStr = (b.source && b.destination) ? `${b.source} → ${b.destination}` : (bus && bus.route ? bus.route : 'N/A');
    const dateStr = b.travelDate || 'N/A';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${b.ticketId}</strong></td>
      <td>${b.busNumber}</td>
      <td>${routeStr}</td>
      <td>${dateStr}</td>
      <td>${passenger.name || b.passengerId}</td>
      <td><span style="background: ${b.seatIndex >= 0 ? '#e3f2fd' : '#fff3e0'}; padding: 4px 8px; border-radius: 4px; font-weight: 600;">${seatStr}</span></td>
      <td>${new Date(b.time).toLocaleString()}</td>
      <td>${b.paymentMethod || 'N/A'} ${b.paymentStatus ? `(${b.paymentStatus})` : ''}</td>
      <td>
        <button class="btn-icon" onclick="printTicket('${b.ticketId}')" title="Print Ticket">🖨️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Print ticket function
function printTicket(ticketId) {
  const booking = bookingMgr.bookings.get(ticketId);
  if (!booking) {
    showToast('Ticket not found', 'error');
    return;
  }
  
  const bus = busMgr.getBus(booking.busNumber);
  const passenger = passMgr.getById(booking.passengerId) || { name: booking.passengerId, phone: '' };
  const seatStr = seatLabelFromIndex(bus, booking.seatIndex);
  
  const w = window.open('', '_blank');
  const html = `
    <!doctype html>
    <html>
      <head>
        <title>Ticket ${ticketId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
          .ticket { border: 3px solid #1976d2; border-radius: 12px; padding: 30px; background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%); }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #1976d2; margin: 0; }
          .ticket-info { display: grid; gap: 15px; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e7ef; }
          .info-label { color: #666; font-weight: 600; }
          .info-value { font-weight: 700; color: #1a1a1a; }
          .seat-badge { background: #1976d2; color: white; padding: 8px 16px; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: 700; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1>🚌 Bus Ticket</h1>
            <p style="color: #666;">Ticket ID: <strong>${ticketId}</strong></p>
          </div>
          <div class="ticket-info">
            <div class="info-row">
              <span class="info-label">Passenger Name:</span>
              <span class="info-value">${passenger.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Bus Number:</span>
              <span class="info-value">${booking.busNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Route:</span>
              <span class="info-value">${bus ? bus.route : 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Departure:</span>
              <span class="info-value">${bus ? formatDeparture(bus.departure) : 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Seat:</span>
              <span class="seat-badge">${seatStr}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Price:</span>
              <span class="info-value">${bus ? formatCurrency(bus.price) : 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment:</span>
              <span class="info-value">${booking.paymentMethod || 'N/A'} ${booking.paymentStatus ? `(${booking.paymentStatus})` : ''}${booking.txnId ? `<div class="mono" style="margin-top:6px;font-size:13px">Txn: ${booking.txnId}</div>` : ''}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Booking Date:</span>
              <span class="info-value">${new Date(booking.time).toLocaleString()}</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for choosing our bus service!</p>
            <p>Please arrive 15 minutes before departure time.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 500);
  showToast('Ticket opened for printing', 'success');
}
function renderWaitlist() {
  const el = document.getElementById('waitlist-list');
  const emptyEl = document.getElementById('waitlist-empty');
  const countEl = document.getElementById('waitlist-count');
  const arr = bookingMgr.waitlistArray();
  
  if (!el) return;
  
  if (countEl) {
    countEl.textContent = `${arr.length} waiting`;
  }
  
  if (arr.length === 0) {
    el.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }
  
  if (emptyEl) emptyEl.classList.add('hidden');
  el.innerHTML = '';
  
  arr.forEach((pid, index) => {
    const passenger = passMgr.getById(pid) || { name: pid, id: pid };
    const item = document.createElement('div');
    item.className = 'waitlist-item';
    item.innerHTML = `
      <div>
        <strong>#${index + 1}</strong> - ${passenger.name || pid}
        <span style="color: #666; font-size: 12px; margin-left: 8px;">(${pid})</span>
      </div>
      <div style="color: #666; font-size: 12px;">Waiting for seat...</div>
    `;
    el.appendChild(item);
  });
}
function renderReports(){
  const buses = busMgr.allBuses();
  const bookings = bookingMgr.allBookings();
  const totalSeats = buses.reduce((sum,b)=>sum + (b.totalSeats||0),0);
  const totalAvailable = buses.reduce((sum,b)=>sum + b.availableSeats(),0);
  const occupied = totalSeats - totalAvailable;
  const occupancyPct = totalSeats ? Math.round((occupied/totalSeats)*100) : 0;
  const avgPrice = buses.length ? buses.reduce((sum,b)=>sum + (b.price||0),0) / buses.length : 0;

  updateText('stat-total-buses', buses.length);
  updateText('stat-total-bookings', bookings.length);
  updateText('stat-occupancy', `${occupancyPct}%`);
  updateText('stat-avg-price', formatCurrency(avgPrice));

  const table = document.getElementById('reports-table');
  const tbody = table ? table.querySelector('tbody') : null;
  const empty = document.getElementById('reports-empty');
  if(!table || !tbody) return;

  const dataset = getReportDataset();
  tbody.innerHTML = '';
  if(dataset.length === 0){
    table.classList.add('hidden');
    if(empty) empty.classList.remove('hidden');
  } else {
    table.classList.remove('hidden');
    if(empty) empty.classList.add('hidden');
    dataset.forEach(bus=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${bus.number}</td>
        <td>${bus.route}</td>
        <td>${formatDeparture(bus.departure)}</td>
        <td>${formatCurrency(bus.price)}</td>
        <td>${bus.availableSeats()} / ${bus.totalSeats}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  const sortSelect = document.getElementById('report-sort');
  if(sortSelect && sortSelect.value !== currentReportSort) sortSelect.value = currentReportSort;
}
function populateRouteFilter(){ const sel=document.getElementById('bus-filter-route'); sel.innerHTML = '<option value="">--Filter by route--</option>'; const routes = routeMgr.all().map(r=>r.name); const unique=[...new Set(routes)]; unique.forEach(r=>{ const o=document.createElement('option'); o.value=r; o.textContent=r; sel.appendChild(o); }); }
function refreshAnalytics(forceCharts=false){
  renderReports();
  updateCharts(forceCharts);
}

function showView(view) {
  const target = document.getElementById('view-' + view);
  if (!target) return;
  if (target.dataset.requiresAdmin && currentRole !== 'admin') {
    showToast('Admin access required', 'warning');
    return;
  }
  
  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  
  // Remove active class from all nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  
  // Show target view
  target.classList.remove('hidden');
  currentView = view;
  
  // Set active nav button
  const activeBtn = document.querySelector(`[data-view="${view}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  
  // View-specific initialization
  if (view === 'reports') {
    renderReports();
    if (chartsDirty) updateCharts(true);
  }
  if (view === 'routes') {
    drawRouteGraph();
  }
  if (view === 'buses') {
    const source = document.getElementById('bus-source')?.value || '';
    const destination = document.getElementById('bus-destination')?.value || '';
    renderBusesInteractive(document.getElementById('bus-search')?.value || '', source, destination);
  }
}

function ensureAccessibleView(){
  const active = document.getElementById('view-'+currentView);
  if(active && (!active.dataset.requiresAdmin || currentRole==='admin')) return;
  showView('buses');
}

function setRole(role){
  currentRole = role === 'admin' ? 'admin' : 'user';
  try { localStorage.setItem(ROLE_STORAGE_KEY, currentRole); } catch(e){}
  const body = document.body;
  if(body){
    body.classList.toggle('role-admin', currentRole==='admin');
    body.classList.toggle('role-user', currentRole!=='admin');
  }
  const label = document.getElementById('role-label');
  if(label) label.textContent = `Role: ${currentRole==='admin' ? 'Admin' : 'User'}`;
  const toggleBtn = document.getElementById('btn-switch-role');
  if(toggleBtn) toggleBtn.textContent = currentRole==='admin' ? 'Switch to User' : 'Switch to Admin';
  ensureAccessibleView();
}

function initRoleControls(){
  try{
    const saved = localStorage.getItem(ROLE_STORAGE_KEY);
    if(saved === 'admin' || saved === 'user') currentRole = saved;
  }catch(e){}
  const btn = document.getElementById('btn-switch-role');
  if(btn){
    btn.addEventListener('click', async ()=>{
      if(currentRole==='admin'){ setRole('user'); await showAlert('Switched to user mode'); return; }
      const pass = prompt('Enter admin passcode');
      if(pass === ADMIN_PASSCODE){ setRole('admin'); await showAlert('Admin mode enabled'); }
      else await showAlert('Incorrect admin passcode');
    });
  }
  setRole(currentRole);
}

function isAdmin(){ return currentRole==='admin'; }

function ensureAdmin(actionLabel){
  if(isAdmin()) return true;
  showAlert(`Admin access required to ${actionLabel || 'perform this action'}.`);
  return false;
}

function showBusDetail(busNumber){
  const bus = busMgr.getBus(busNumber);
  if(!bus) return;
  const pane = document.getElementById('bus-detail');
  const content = document.getElementById('bus-detail-content');
  content.innerHTML = `<b>${bus.number}</b> - ${bus.route} - ${bus.departure} - ₹${bus.price.toFixed(2)}<br/>Available: ${bus.availableSeats()}/${bus.totalSeats}`;
  const seatMap = document.getElementById('seat-map');
  seatMap.innerHTML = '';
  // Determine a nice grid: use per-bus layoutCols if provided
  const total = bus.totalSeats;
  const cols = getColsForBus(bus);
  const rows = Math.ceil(total / cols);
  // Special-case the very common 2+aisle+2 layout (4 columns): create an aisle column between the two pairs
  if(cols === 4){
    // use exact seat width to keep left/right pairs close and an explicit aisle gap
    const seatW = 48; // px
    seatMap.style.gridTemplateColumns = `${seatW}px ${seatW}px var(--aisle) ${seatW}px ${seatW}px`;
    seatMap.style.gridAutoRows = '56px';
    // create labeled seats and position them while skipping the aisle column
    for(let i=0;i<total;i++){
      const row = Math.floor(i/cols);
      const col = (i%cols)+1; // 1..4
      const label = String.fromCharCode(65 + row) + col; // A1, A2...
      const s = document.createElement('div');
      s.className = 'seat' + (bus.seats[i] ? ' booked' : '');
      s.textContent = label;
      s.title = `Seat ${label}`;
      s.dataset.index = i;
      s.dataset.label = label;
      // map logical columns 1..4 to physical grid columns (skip column 3 as aisle)
      const gridCol = col <= 2 ? col : (col + 1);
      s.style.gridColumnStart = gridCol;
      s.style.gridRowStart = row + 1;
      if(!bus.seats[i]) s.addEventListener('click', ()=>selectSeat(bus.number, i, s));
      seatMap.appendChild(s);
    }
  } else {
    seatMap.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    seatMap.style.gridAutoRows = '56px';
    // create labeled seats: rows A.., columns 1..
    for(let i=0;i<total;i++){
      const row = Math.floor(i/cols);
      const col = (i%cols)+1;
      const label = String.fromCharCode(65 + row) + col; // A1, A2...
      const s = document.createElement('div');
      s.className = 'seat' + (bus.seats[i] ? ' booked' : '');
      s.textContent = label;
      s.title = `Seat ${label}`;
      s.dataset.index = i;
      s.dataset.label = label;
      s.style.gridColumnStart = col;
      s.style.gridRowStart = row + 1;
      if(!bus.seats[i]) s.addEventListener('click', ()=>selectSeat(bus.number, i, s));
      seatMap.appendChild(s);
    }
  }
  // seat caption (rows x cols)
  const captionEl = document.getElementById('seat-caption');
  if(captionEl){ const lastRowLetter = String.fromCharCode(65 + Math.max(0, rows-1)); captionEl.textContent = bus.layoutCols? `Layout: ${rows} row(s), ${cols} column(s) (custom)` : `Layout: ${rows} row(s) (A–${lastRowLetter}), ${cols} column(s)`; }
  pane.classList.remove('hidden');
  pane.setAttribute('aria-hidden','false');
}
function closeBusDetail(){ const pane=document.getElementById('bus-detail'); pane.classList.add('hidden'); pane.setAttribute('aria-hidden','true'); }

async function selectSeat(busNumber,index,seatEl){ // pick exact seat
  selectedSeat = {busNumber,index};
  document.getElementById('book-bus').value = busNumber;
  document.querySelectorAll('.seat.selected').forEach(x=>x.classList.remove('selected'));
  seatEl.classList.add('selected');
  const label = seatEl.dataset.label || index;
  await showAlert(`Selected seat ${label} on ${busNumber}. Click Quick Book to confirm (this reserves the selected seat).`);
}

// Payment processing with validation
function processPayment(bus, method){
  return new Promise(async (resolve)=>{
    if(!method || method==='none') return resolve(false);
    
    if(method==='cod' || method==='cash'){
      const ok = await showConfirm('Payment method: Cash on boarding (COD). Confirm booking (collect cash later)?');
      return resolve(ok);
    }
    
    if (method === 'qr') {
      try {
        const imgSrc = document.getElementById('payment-qr')?.src || '';
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        const titleEl = document.getElementById('modal-title');
        if (modal && body && titleEl) {
          titleEl.textContent = 'Scan & Confirm Payment';
          body.innerHTML = `<div style="text-align:center">
              <img src="${imgSrc}" alt="Scan to pay" style="max-width:260px;margin:12px auto;display:block" />
              <p>Scan the QR using your phone and complete payment of ₹${bus.price.toFixed(2)}.</p>
              <div style="margin-top:12px;text-align:left;display:inline-block;">
                <label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="qr-paid-checkbox" /> <span>I have completed the payment on my phone</span></label>
                <label style="display:block;margin-top:8px;font-size:13px;color:#555">Optional transaction/reference ID:<br /><input id="qr-txn" placeholder="e.g. TXN12345" style="width:260px;padding:8px;border-radius:6px;border:1px solid #ddd" /></label>
              </div>
            </div>`;
          modal.classList.remove('hidden');
          let txnVal = '';
          const ok = await new Promise(resolve => {
            const modalOkBtn = document.getElementById('modal-ok');
            const modalCancelBtn = document.getElementById('modal-cancel');
            const checkbox = document.getElementById('qr-paid-checkbox');
            const txnInput = document.getElementById('qr-txn');
            // start with OK disabled until checkbox is checked
            if(modalOkBtn) modalOkBtn.disabled = true;
            const onChange = () => {
              if(modalOkBtn) modalOkBtn.disabled = !checkbox.checked;
            };
            if(checkbox) checkbox.addEventListener('change', onChange);

            window.__modalPending = { type: 'confirm', resolve: (v) => { try { modal.classList.add('hidden'); } catch (e) {} resolve(v); }, cleanup: () => { try { if(checkbox) checkbox.removeEventListener('change', onChange); if(modalOkBtn) modalOkBtn.removeEventListener('click', onOk); if(modalCancelBtn) modalCancelBtn.removeEventListener('click', onCancel); } catch (e) {} window.__modalPending = null; } };

            const onOk = () => {
              // capture txn id locally
              txnVal = txnInput?.value?.trim() || '';
              window.__modalPending && window.__modalPending.resolve(true); window.__modalPending && window.__modalPending.cleanup();
            };
            const onCancel = () => { window.__modalPending && window.__modalPending.resolve(false); window.__modalPending && window.__modalPending.cleanup(); };
            if(modalOkBtn) modalOkBtn.addEventListener('click', onOk);
            if(modalCancelBtn) modalCancelBtn.addEventListener('click', onCancel);
          });
          if (!ok) return resolve(false);
          // attach txn id to global pending so booking can pick it up if needed
          const txn = txnVal || '';
          if(txn) console.log('QR payment txn:', txn);
          // store txn id globally for booking step to attach
          window.__lastPaymentTxn = txn || '';

          showToast('QR Payment confirmed!', 'success');
          return resolve(true);
        }
      } catch (e) { /* fallback to simple confirm */ }
      // Fallback for environments where modal cannot be used: require user to type PAID to confirm
      const typed = prompt(`Scan QR to pay ₹${bus.price.toFixed(2)}. After completing payment, type PAID here to confirm:`);
      const ok2 = (typed && typed.trim().toUpperCase() === 'PAID');
      if (!ok2) return resolve(false);
      showToast('Payment confirmed (QR).', 'success');
      return resolve(true);
    }
    
    if(method==='card'){
      await showAlert('Card payments have been removed. Please use Scan QR, NetBanking or Cash.');
      return resolve(false);
    }
    
    if(method==='netbanking'){
      const bank = document.getElementById('bank-select')?.value || '';
      const userId = document.getElementById('netbanking-userid')?.value.trim() || '';
      const password = document.getElementById('netbanking-password')?.value.trim() || '';
      
      if(!bank || !userId || !password){
        await showAlert('Please fill in all netbanking details');
        return resolve(false);
      }
      
      const bankNames = {
        'sbi': 'State Bank of India',
        'hdfc': 'HDFC Bank',
        'icici': 'ICICI Bank',
        'axis': 'Axis Bank',
        'pnb': 'Punjab National Bank',
        'bob': 'Bank of Baroda'
      };
      
      const ok = await showConfirm(`Pay ₹${bus.price.toFixed(2)} via ${bankNames[bank]} NetBanking?\n\nUser ID: ${userId}\n\n(Simulation: Payment will be processed)`);
      if(ok){
        // Simulate payment processing delay
        await new Promise(r => setTimeout(r, 2000));
        showToast('NetBanking Payment successful!', 'success');
      }
      return resolve(ok);
    }
    
    // Fallback for unknown methods
    const ok = await showConfirm(`Proceed to pay ₹${bus.price.toFixed(2)} via ${method}? (this is a simulation)`);
    resolve(ok);
  });
}

// Export bookings as CSV
function exportBookingsCSV(){
  const rows = [['TicketId','BusNumber','Route','PassengerId','PassengerName','Seat','Time','Price','PaymentMethod','PaymentStatus']];
  bookingMgr.allBookings().forEach(b=>{
    const bus = busMgr.getBus(b.busNumber) || {};
    const p = passMgr.getById(b.passengerId) || {name:''};
    const seatLabel = (b.seatIndex>=0) ? (()=>{ const cols = getColsForBus(bus); const row = Math.floor(b.seatIndex/cols); const col = (b.seatIndex%cols)+1; return String.fromCharCode(65+row)+col; })() : 'WAIT';
    rows.push([b.ticketId, b.busNumber, bus.route||'', b.passengerId, p.name||'', seatLabel, new Date(b.time).toLocaleString(), bus.price ? bus.price.toFixed(2) : '', b.paymentMethod||'', b.paymentStatus||'']);
  });
  const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'bookings.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

// Open printable report (user can save as PDF using browser Print)
function exportBookingsPrint(){
  const rows = bookingMgr.allBookings();
  const w = window.open('', '_blank');
  const html = `<!doctype html><html><head><title>Bookings Report</title><style>body{font-family:sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#1976d2;color:#fff}</style></head><body><h2>Bookings Report</h2><table><thead><tr><th>Ticket</th><th>Bus</th><th>Route</th><th>Passenger</th><th>Seat</th><th>Time</th><th>Payment</th><th>Status</th></tr></thead><tbody>${rows.map(b=>{const bus=busMgr.getBus(b.busNumber)||{};const p=passMgr.getById(b.passengerId)||{};const cols=getColsForBus(bus);const seat = b.seatIndex>=0 ? (()=>{ const row=Math.floor(b.seatIndex/cols); const col=(b.seatIndex%cols)+1; return String.fromCharCode(65+row)+col; })() : 'WAIT'; return `<tr><td>${b.ticketId}</td><td>${b.busNumber}</td><td>${bus.route||''}</td><td>${p.name||''}</td><td>${seat}</td><td>${new Date(b.time).toLocaleString()}</td><td>${b.paymentMethod||''}</td><td>${b.paymentStatus||''}</td></tr>`}).join('')}</tbody></table><p><em>Use browser print to save as PDF.</em></p></body></html>`;
  w.document.write(html); w.document.close(); w.focus(); setTimeout(()=>w.print(),500);
}

// Modal helpers (promise-based)
function showAlert(msg){ return new Promise(resolve=>{ try{ const modal=document.getElementById('modal'); const body=document.getElementById('modal-body'); const ok = document.getElementById('modal-ok'); const cancelBtn = document.getElementById('modal-cancel'); if(!modal||!body||!ok||!cancelBtn){ // fallback: alert
      alert(msg);
      return resolve();
    }
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = 'Information';
    body.textContent = msg;
    modal.classList.remove('hidden');
    if (cancelBtn) cancelBtn.style.display = 'none';
    // store pending resolver so global handler can also resolve if needed
    window.__modalPending = { type:'alert', resolve: ()=>{ try { modal.classList.add('hidden'); } catch(e){} resolve(); }, cleanup: ()=>{ try{ ok.removeEventListener('click', onOk); }catch(e){} window.__modalPending=null; } };
    const onOk=()=>{ window.__modalPending && window.__modalPending.resolve(); window.__modalPending && window.__modalPending.cleanup(); };
    ok.addEventListener('click',onOk);
  } catch(e){ console.warn('showAlert failed, falling back to native alert', e); alert(msg); resolve(); }
}); }

function showConfirm(msg){ return new Promise(resolve=>{ try{ const modal=document.getElementById('modal'); const body=document.getElementById('modal-body'); const ok=document.getElementById('modal-ok'); const cancelBtn=document.getElementById('modal-cancel'); if(!modal||!body||!ok||!cancelBtn){ // fallback
      const r = confirm(msg); return resolve(r);
    }
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = 'Confirm';
    body.textContent = msg;
    modal.classList.remove('hidden');
    if (cancelBtn) cancelBtn.style.display = 'inline-block';
    window.__modalPending = { type:'confirm', resolve: (v)=>{ try{ modal.classList.add('hidden'); } catch(e){} resolve(v); }, cleanup: ()=>{ try{ ok.removeEventListener('click', onOk); cancelBtn.removeEventListener('click', onCancel); }catch(e){} window.__modalPending=null; } };
    const onOk=()=>{ window.__modalPending && window.__modalPending.resolve(true); window.__modalPending && window.__modalPending.cleanup(); };
    const onCancel=()=>{ window.__modalPending && window.__modalPending.resolve(false); window.__modalPending && window.__modalPending.cleanup(); };
    ok.addEventListener('click',onOk); cancelBtn.addEventListener('click',onCancel);
  } catch(e){ console.warn('showConfirm failed, falling back to native confirm', e); const r = confirm(msg); resolve(r); }
}); }

// Global safety: if original listeners fail or are not attached, ensure clicks on modal buttons resolve the pending promise and hide the modal
window.addEventListener('click', function(e){ try{ if(!e.target) return; const id = e.target.id; if(id!=='modal-ok' && id!=='modal-cancel') return; const pending = window.__modalPending; if(!pending) { // still hide modal if present
    const modal=document.getElementById('modal'); if(modal) modal.classList.add('hidden'); return; }
    if(id==='modal-ok') pending.resolve(pending.type==='confirm'? true : undefined); else pending.resolve(pending.type==='confirm'? false : undefined);
    if(pending.cleanup) pending.cleanup();
  } catch(err){ /* swallow */ } });

// ==================== GRAPH DATA STRUCTURE & BFS ALGORITHM ====================

/**
 * GRAPH DATA STRUCTURE
 * 
 * A Graph is a collection of nodes (vertices) connected by edges.
 * 
 * Representation: Adjacency List
 * - Each node maps to a Set of its neighbors
 * - Efficient for sparse graphs (few edges)
 * - Space: O(V + E) where V = vertices, E = edges
 * 
 * Example:
 *   CityA -> [CityB, CityC]
 *   CityB -> [CityA, CityD]
 *   CityC -> [CityA]
 *   CityD -> [CityB]
 * 
 * Use Case: Represent bus routes where cities are nodes and routes are edges
 * 
 * Types:
 * - Undirected: Edge (A,B) means you can go A->B and B->A
 * - Directed: Edge (A,B) means only A->B (not implemented here)
 */
class Graph {
  constructor() {
    // Adjacency list: Map of node -> Set of neighbors
    // Using Map for O(1) node lookup, Set for O(1) neighbor check
    this.adj = new Map();
  }
  
  /**
   * Add a node to the graph
   * Time Complexity: O(1)
   */
  addNode(n) {
    // Only add if node doesn't exist
    if (!this.adj.has(n)) {
      this.adj.set(n, new Set()); // Initialize with empty neighbor set
    }
  }
  
  /**
   * Add an undirected edge between two nodes
   * Time Complexity: O(1)
   * 
   * Undirected means: if A is connected to B, then B is connected to A
   */
  addEdge(a, b) {
    // Ensure both nodes exist
    this.addNode(a);
    this.addNode(b);
    
    // Add bidirectional connection
    this.adj.get(a).add(b); // A can reach B
    this.adj.get(b).add(a); // B can reach A
  }
  
  /**
   * Get all neighbors of a node
   * Time Complexity: O(1) to get set, O(degree) to convert to array
   */
  neighbors(n) {
    return Array.from(this.adj.get(n) || []);
  }
  
  /**
   * BREADTH-FIRST SEARCH (BFS) PATH FINDING
   * 
   * BFS finds the SHORTEST PATH (minimum number of edges) between two nodes.
   * 
   * How it works:
   * 1. Start from source node
   * 2. Explore all neighbors at current level before going deeper
   * 3. Use a Queue (FIFO) to process nodes level by level
   * 4. Track previous node to reconstruct path
   * 
   * Algorithm:
   * 1. Initialize queue with source node
   * 2. Mark source as visited (prev map)
   * 3. While queue not empty:
   *    a. Dequeue current node
   *    b. If it's destination, we're done!
   *    c. For each unvisited neighbor:
   *       - Mark as visited (add to prev map)
   *       - Enqueue for processing
   * 4. Reconstruct path by following prev pointers from destination to source
   * 
   * Time Complexity: O(V + E) where V = vertices, E = edges
   * Space Complexity: O(V) for queue and prev map
   * 
   * Why BFS for shortest path?
   * - Explores level by level, so first time we reach destination is shortest path
   * - Unlike DFS which might go deep before finding destination
   * 
   * @param {string} src - Source city/node
   * @param {string} dst - Destination city/node
   * @returns {Array|null} - Path as array of nodes, or null if no path exists
   */
  bfsPath(src, dst) {
    // Check if both nodes exist in graph
    if (!this.adj.has(src) || !this.adj.has(dst)) {
      return null; // One or both nodes don't exist
    }
    
    // Queue for BFS (FIFO - first in, first out)
    const q = [src];
    
    // Map to track previous node in path (for path reconstruction)
    // Key: node, Value: previous node that led to this node
    // src has no previous, so we set it to null
    const prev = new Map();
    prev.set(src, null);
    
    // BFS main loop: process nodes level by level
    while (q.length > 0) {
      // Dequeue: get first node (FIFO)
      const u = q.shift();
      
      // Check if we reached destination
      if (u === dst) {
        break; // Found destination, stop searching
      }
      
      // Explore all neighbors of current node
      for (const v of this.adj.get(u)) {
        // Only process unvisited nodes
        if (!prev.has(v)) {
          // Mark as visited: record that we reached 'v' from 'u'
          prev.set(v, u);
          // Enqueue for processing in next level
          q.push(v);
        }
      }
    }
    
    // Check if path exists (destination was reached)
    if (!prev.has(dst)) {
      return null; // No path exists
    }
    
    // Reconstruct path by following prev pointers backwards
    const path = [];
    let cur = dst; // Start from destination
    
    // Follow prev pointers until we reach source (prev = null)
    while (cur !== null) {
      path.push(cur);
      cur = prev.get(cur); // Move to previous node
    }
    
    // Path was built backwards (dst -> ... -> src), so reverse it
    return path.reverse(); // Now: src -> ... -> dst
  }
  
  /**
   * Get all nodes in the graph
   * Time Complexity: O(V) where V = number of vertices
   */
  nodes() {
    return Array.from(this.adj.keys());
  }
}

/**
 * Build graph from route data
 * 
 * Converts route information into a graph structure.
 * 
 * Algorithm:
 * - For each route (e.g., "CityA -> CityB -> CityC")
 * - Create edges between consecutive stops
 * - CityA connects to CityB, CityB connects to CityC
 * 
 * Example:
 * Route 1: [CityA, CityB, CityC]
 * Route 2: [CityB, CityD]
 * 
 * Resulting graph:
 *   CityA <-> CityB <-> CityC
 *   CityB <-> CityD
 * 
 * This allows finding paths between any two cities using BFS.
 * 
 * Time Complexity: O(R * S) where R = routes, S = stops per route
 */
function buildGraphFromRoutes() {
  const g = new Graph();
  
  // Process each route
  routeMgr.all().forEach(route => {
    const stops = route.stops;
    
    // Create edges between consecutive stops
    // If route is [A, B, C], create edges: A-B and B-C
    for (let i = 0; i < stops.length - 1; i++) {
      // Add undirected edge: can travel both ways
      g.addEdge(stops[i], stops[i + 1]);
    }
  });
  
  return g;
}

function drawRouteGraph(path=[]){ const cvs=document.getElementById('route-graph'); const ctx=cvs.getContext('2d'); ctx.clearRect(0,0,cvs.width,cvs.height); const g=buildGraphFromRoutes(); const nodes = g.nodes(); if(nodes.length===0){ ctx.fillText('(no nodes)',10,20); return; } const cx=cvs.width/2, cy=cvs.height/2, r=Math.min(cx,cy)-40; const coords = {}; nodes.forEach((n,i)=>{ const a = (i/nodes.length) * Math.PI*2; const x = cx + Math.cos(a)*r; const y = cy + Math.sin(a)*r; coords[n]={x,y}; }); // draw edges
  ctx.strokeStyle='#cfdff0'; ctx.lineWidth=2; g.nodes().forEach(u=>{ g.neighbors(u).forEach(v=>{ if(u<v){ const A=coords[u]; const B=coords[v]; ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke(); } }); }); // highlight path
  if(path && path.length>1){ ctx.strokeStyle='#ff8b8b'; ctx.lineWidth=4; for(let i=0;i<path.length-1;i++){ const A=coords[path[i]]; const B=coords[path[i+1]]; ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke(); } }
  // draw nodes
  nodes.forEach(n=>{ const p=coords[n]; ctx.fillStyle = (path && path.includes(n))? '#3fbf3f' : '#1976d2'; ctx.beginPath(); ctx.arc(p.x,p.y,14,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.font='12px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n,p.x,p.y); }); }

// ------------------ Charts (Chart.js) ------------------
function updateCharts(force=false){
  const reportsView = document.getElementById('view-reports');
  if(!force && reportsView && reportsView.classList.contains('hidden')){
    chartsDirty = true;
    return;
  }
  const topBusesCanvas = document.getElementById('chart-top-buses');
  const topRoutesCanvas = document.getElementById('chart-top-routes');
  if(!topBusesCanvas || !topRoutesCanvas) return;
  const topBusesCtx = topBusesCanvas.getContext('2d');
  const topRoutesCtx = topRoutesCanvas.getContext('2d');
  if(!topBusesCtx || !topRoutesCtx) return;
  chartsDirty = false;
  const buses = busMgr.sortByAvailability().slice(0,6);
  const labels = buses.map(b=>b.number);
  const data = buses.map(b=>b.availableSeats());
  if(topBusesChart) topBusesChart.destroy();
  topBusesChart = new Chart(topBusesCtx,{
    type:'bar',
    data:{ labels, datasets:[{label:'Available seats', data, backgroundColor:'#1976d2'}] },
    options:{ responsive:true, maintainAspectRatio:false }
  });
  const counts={};
  busMgr.allBuses().forEach(b=>counts[b.route]=(counts[b.route]||0)+1);
  const entries = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const rlabels = entries.map(e=>e[0]);
  const rdata = entries.map(e=>e[1]);
  if(topRoutesChart) topRoutesChart.destroy();
  topRoutesChart = new Chart(topRoutesCtx,{
    type:'pie',
    data:{ labels:rlabels, datasets:[{data:rdata, backgroundColor:['#1976d2','#3fbf3f','#ff9b9b','#ffc36d','#8be38b','#9b8bff']}] },
    options:{ responsive:true, maintainAspectRatio:false }
  });
}

// ------------------ Wiring UI ------------------
document.addEventListener('DOMContentLoaded', async ()=>{
  // Probe server first; if available, sync from server and avoid localStorage restore
  await probeServer();
  if (!useServer) { seedDemo(); loadAll(); }
  populateRouteFilter(); renderBusesInteractive('', '', ''); renderRoutes(); renderBookings(); renderWaitlist(); drawRouteGraph(); refreshAnalytics();
  initRoleControls();
  showView(currentView);
  
  // Set minimum date to today for booking date
  const bookDateInput = document.getElementById('book-date');
  if (bookDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookDateInput.setAttribute('min', today);
  }
  
  // Payment method change handler
  const paymentMethodSelect = document.getElementById('payment-method');
  if (paymentMethodSelect) {
    paymentMethodSelect.addEventListener('change', (e) => {
      const method = e.target.value;
      const qrMsg = document.getElementById('qr-msg');
      if (qrMsg) qrMsg.classList.add('hidden');
      // Hide all payment fields
      document.querySelectorAll('.payment-fields').forEach(field => {
        field.classList.add('hidden');
        // Clear required attributes
        field.querySelectorAll('input, select').forEach(input => {
          input.removeAttribute('required');
        });
      });
      
      // Show relevant fields based on method
      if (method === 'qr') {
        const qrFields = document.getElementById('qr-fields');
        if (qrFields) {
          qrFields.classList.remove('hidden');
        }
      } else if (method === 'netbanking') {
        const netbankingFields = document.getElementById('netbanking-fields');
        if (netbankingFields) {
          netbankingFields.classList.remove('hidden');
          ['bank-select', 'netbanking-userid', 'netbanking-password'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.setAttribute('required', 'required');
          });
        }
      }
    });
    
    // Trigger change event to set initial state
    paymentMethodSelect.dispatchEvent(new Event('change'));
  }

  // QR image fallback: if loading fails, replace with placeholder and show message
  (function(){
    const paymentQr = document.getElementById('payment-qr');
    const qrMsg = document.getElementById('qr-msg');
    if(!paymentQr) return;
    const onMissing = (msg)=>{
      if(qrMsg){ qrMsg.textContent = msg; qrMsg.classList.remove('hidden'); }
      try{ paymentQr.src = 'qr-sample.svg'; }catch(e){}
      if(typeof showToast === 'function') showToast(msg,'warning');
    };
    paymentQr.addEventListener('error', ()=> onMissing('QR image failed to load. Showing placeholder.'));
    // If already failed to load (cached), check naturalWidth
    if(paymentQr.complete && paymentQr.naturalWidth === 0){
      onMissing('QR image failed to load. Showing placeholder.');
    }
  })();
  
  // Card number formatting (add spaces every 4 digits)
  const cardNumberInput = document.getElementById('card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s/g, '');
      if (value.length > 16) value = value.slice(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
      e.target.value = value;
    });
  }
  
  // Card expiry formatting (MM/YY)
  const cardExpiryInput = document.getElementById('card-expiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }
  
  // CVV - only numbers
  const cardCvvInput = document.getElementById('card-cvv');
  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // Modal close handlers
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      const modal = document.getElementById('modal');
      if (modal) modal.classList.add('hidden');
      if (window.__modalPending) {
        window.__modalPending.resolve(false);
        window.__modalPending = null;
      }
    });
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', () => {
      const modal = document.getElementById('modal');
      if (modal) modal.classList.add('hidden');
      if (window.__modalPending) {
        window.__modalPending.resolve(false);
        window.__modalPending = null;
      }
    });
  }
  
  // Navigation
  document.querySelectorAll('nav button').forEach(btn => btn.addEventListener('click', () => {
    const view = btn.dataset.view;
    if (view) showView(view);
  }));

  // Source and destination search
  const sourceInput = document.getElementById('bus-source');
  const destinationInput = document.getElementById('bus-destination');
  const btnSearchRoute = document.getElementById('btn-search-route');
  
  function updateBusList() {
    const source = sourceInput?.value || '';
    const destination = destinationInput?.value || '';
    const searchText = document.getElementById('bus-search')?.value || '';
    renderBusesInteractive(searchText, source, destination);
  }
  
  if (btnSearchRoute) {
    btnSearchRoute.addEventListener('click', () => {
      updateBusList();
      showToast('Searching buses...', 'info');
    });
  }
  
  // Debounced search for source and destination
  const debouncedRouteSearch = debounce(() => {
    updateBusList();
  }, 300);
  
  if (sourceInput) {
    sourceInput.addEventListener('input', debouncedRouteSearch);
  }
  if (destinationInput) {
    destinationInput.addEventListener('input', debouncedRouteSearch);
  }
  
  document.getElementById('btn-refresh').addEventListener('click', () => {
    populateRouteFilter();
    updateBusList();
    showToast('Buses refreshed', 'success');
  });
  
  // Debounced search for better performance
  const debouncedSearch = debounce((value) => {
    const source = sourceInput?.value || '';
    const destination = destinationInput?.value || '';
    renderBusesInteractive(value, source, destination);
  }, 300);
  
  document.getElementById('bus-search').addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });
  document.getElementById('bus-filter-route').addEventListener('change',(e)=>{ 
    const v=e.target.value; 
    const source = sourceInput?.value || '';
    const destination = destinationInput?.value || '';
    if(!v) renderBusesInteractive(document.getElementById('bus-search').value, source, destination); 
    else renderBusesInteractive(v, source, destination); 
  });

  // add bus with validation for seats / cols
  const addBusForm = document.getElementById('form-add-bus');
  if(addBusForm) addBusForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!ensureAdmin('add buses')) return;
    const n = document.getElementById('bus-number').value.trim();
    const r = document.getElementById('bus-route').value.trim();
    const d = document.getElementById('bus-depart').value.trim();
    const s = document.getElementById('bus-seats').value.trim();
    const colsVal = (document.getElementById('bus-cols') && document.getElementById('bus-cols').value.trim()) || '';
    const p = document.getElementById('bus-price').value.trim();
    const colsErr = document.getElementById('bus-cols-error'); if(colsErr) colsErr.textContent = '';
    if(!n || !r){ await showAlert('Please provide bus number and route'); return; }
    // validate seats (we accept the input but enforce global DEFAULT_SEATS)
    const seatsNum = Number(s);
    if(Number.isNaN(seatsNum) || seatsNum <= 0 || !Number.isInteger(seatsNum)){ await showAlert('Seats must be a positive integer'); return; }
    // validate price
    const priceNum = Number(p);
    if(Number.isNaN(priceNum) || priceNum < 0){ await showAlert('Price must be a valid non-negative number'); return; }
    // ignore user-provided columns and seats and enforce defaults for consistency
    if(seatsNum !== DEFAULT_SEATS){ showToast(`Seats set to ${DEFAULT_SEATS} for consistency`, 'info'); }
    let parsedCols = null;
    if(colsVal){ showToast(`Columns are enforced to ${ENFORCE_COLS}`, 'info'); }
    const b = new Bus(n,r,d,DEFAULT_SEATS,priceNum);
    b.layoutCols = ENFORCE_COLS;
    if (useServer) {
      // POST to server and sync
      try {
        const body = new URLSearchParams({ number: n, route: r, departure: d, seats: seatsNum.toString(), price: priceNum.toString() });
        const res = await fetch('/api/buses', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
        if (res.ok) {       await syncFromServer(); 
      const source = document.getElementById('bus-source')?.value || '';
      const destination = document.getElementById('bus-destination')?.value || '';
      renderBusesInteractive('', source, destination); 
      populateRouteFilter(); 
      refreshAnalytics(); 
      await showAlert('Bus added (server)'); } 
        else { await showAlert('Server rejected bus add'); }
      } catch (err) { await showAlert('Failed to add bus to server'); }
    } else {
      if (busMgr.addBus(b)) {
        const source = document.getElementById('bus-source')?.value || '';
        const destination = document.getElementById('bus-destination')?.value || '';
        renderBusesInteractive('', source, destination);
        populateRouteFilter();
        saveAll();
        showToast('Bus added successfully!', 'success');
      } else {
        showToast('Bus number already exists', 'error');
      }
    }
    e.target.reset(); refreshAnalytics();
  });

  // close bus detail
  document.getElementById('btn-close-detail').addEventListener('click',()=>closeBusDetail());

  // add route
  const addRouteForm = document.getElementById('form-add-route');
  if(addRouteForm) addRouteForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!ensureAdmin('add routes')) return;
    const name=document.getElementById('route-name').value.trim();
    const stops=document.getElementById('route-stops').value.split(',').map(x=>x.trim()).filter(x=>x);
    if(!name) return;
    routeMgr.addRoute(new RouteModel(name,stops));
    renderRoutes(); populateRouteFilter(); saveAll(); drawRouteGraph(); refreshAnalytics();
    await showAlert('Route added'); e.target.reset();
  });

  // book (uses selectedSeat if present and matches bus)
  document.getElementById('form-book').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const bookSource = document.getElementById('book-source')?.value.trim() || '';
    const bookDestination = document.getElementById('book-destination')?.value.trim() || '';
    const travelDate = document.getElementById('book-date')?.value || '';
    const name = document.getElementById('pass-name').value.trim();
    const phone = document.getElementById('pass-phone').value.trim();
    const busn = document.getElementById('book-bus').value.trim();
    const method = (document.getElementById('payment-method') && document.getElementById('payment-method').value) || 'none';
    if(!name || !busn || !bookSource || !bookDestination || !travelDate) {
      await showAlert('Please fill in all required fields (Source, Destination, Date, Passenger Name, and Bus Number)');
      return;
    }
    const bus = busMgr.getBus(busn);
    if(!bus) { await showAlert('Bus not found'); return; }
    
    // Validate that bus route matches source and destination
    const routeLower = bus.route.toLowerCase();
    const sourceLower = bookSource.toLowerCase();
    const destLower = bookDestination.toLowerCase();
    const routeParts = routeLower.split(/[->]/).map(p => p.trim());
    const hasSource = routeLower.includes(sourceLower) && routeParts.some(p => p.includes(sourceLower));
    const hasDest = routeLower.includes(destLower) && routeParts.some(p => p.includes(destLower));
    
    if(!hasSource || !hasDest) {
      await showAlert(`Selected bus ${busn} does not match the route from ${bookSource} to ${bookDestination}. Please select a different bus.`);
      return;
    }
    const p = passMgr.add(name, phone);
    let requestedSeat = null;
    if(selectedSeat && selectedSeat.busNumber===busn) requestedSeat = selectedSeat.index;
    // process payment simulation
    const paid = await processPayment(bus, method);
    if(!paid){ await showAlert('Payment cancelled. Booking not completed.'); return; }
    if (useServer) {
      try {
        const body = new URLSearchParams({ passengerName: name, phone: phone, busNumber: busn, requestedSeat: requestedSeat===null? '': String(requestedSeat) });
        const res = await fetch('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
        if (!res.ok) { await showAlert('Server booking failed'); }
        else {
          const jb = await res.json();
          // server returns booking JSON
          const ticket = jb.ticketId || jb.ticket || jb.id;
          const seatIndex = (typeof jb.seatIndex === 'number')? jb.seatIndex : (jb.seat || -1);
          const bk = new Booking(ticket, busn, p.id, seatIndex);
          bk.time = jb.time || jb.bookingTime || Date.now();
          bk.paymentMethod = method || '';
          bk.paymentStatus = method==='cod' ? 'COD' : 'Paid';
          // attach txn id when available (for QR)
          if(window.__lastPaymentTxn){ bk.txnId = window.__lastPaymentTxn; window.__lastPaymentTxn = null; }
          bk.source = bookSource;
          bk.destination = bookDestination;
          bk.travelDate = travelDate;
          bookingMgr.bookings.set(bk.ticketId, bk);
          if (seatIndex>=0) { const b = busMgr.getBus(busn); if (b) b.seats[seatIndex] = true; }
          const seatStr = bk.seatIndex>=0 ? (()=>{ const cols = getColsForBus(bus); const row=Math.floor(bk.seatIndex/cols); const col=(bk.seatIndex%cols)+1; return String.fromCharCode(65+row)+col; })() : 'WAIT';
          await showAlert('Booked: '+bk.ticketId + (seatStr?(' | Seat: '+seatStr):'') + ` | Date: ${travelDate}`);
        }
      } catch (err) { await showAlert('Failed to book via server'); }
    } else {
      const bk = bookingMgr.book(busn, p.id, requestedSeat);
      if(!bk) { await showAlert('Failed to create booking'); }
      else {
        // attach payment metadata
        bk.paymentMethod = method || '';
        bk.paymentStatus = method==='cod' ? 'COD' : 'Paid';
        if(window.__lastPaymentTxn){ bk.txnId = window.__lastPaymentTxn; window.__lastPaymentTxn = null; }
        bk.source = bookSource;
        bk.destination = bookDestination;
        bk.travelDate = travelDate;
        const seatStr = bk.seatIndex >= 0 ? (() => { const cols = getColsForBus(bus); const row = Math.floor(bk.seatIndex / cols); const col = (bk.seatIndex % cols) + 1; return String.fromCharCode(65 + row) + col; })() : 'WAIT';
        showToast(`Booking confirmed! Ticket: ${bk.ticketId} | Seat: ${seatStr} | Date: ${travelDate}`, 'success');
      }
    }
    selectedSeat = null;
    const source = document.getElementById('bus-source')?.value || '';
    const destination = document.getElementById('bus-destination')?.value || '';
    renderBusesInteractive('', source, destination); renderBookings(); renderWaitlist(); saveAll(); refreshAnalytics(); e.target.reset();
  });

  // cancel (server-aware)
  const cancelBtn = document.getElementById('btn-cancel');
  if(cancelBtn) cancelBtn.addEventListener('click', async ()=>{
    if(!ensureAdmin('cancel tickets')) return;
    const id=document.getElementById('cancel-ticket').value.trim(); if(!id) return; const ok = await showConfirm('Confirm cancel ticket '+id+'?'); if(!ok) return;
    if (useServer) {
      try {
        const body = new URLSearchParams({ ticketId: id });
        const res = await fetch('/api/cancel', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
        if (res.ok) { await syncFromServer(); await showAlert('Cancelled (server)'); }
        else await showAlert('Server cancel failed');
      } catch (err) { await showAlert('Failed to cancel via server'); }
    } else {
      const res2 = bookingMgr.cancel(id);
      await showAlert(res2? 'Cancelled' : 'Ticket not found');
    }
    const source = document.getElementById('bus-source')?.value || '';
    const destination = document.getElementById('bus-destination')?.value || '';
    renderBusesInteractive('', source, destination); renderBookings(); renderWaitlist(); saveAll(); refreshAnalytics();
  });

  // undo
  const undoBtn = document.getElementById('btn-undo');
  if(undoBtn) undoBtn.addEventListener('click', async ()=>{
    if(!ensureAdmin('undo actions')) return;
    const res = bookingMgr.undo(); await showAlert(res); renderBusesInteractive(); renderBookings(); renderWaitlist(); saveAll(); refreshAnalytics();
  });

  // report controls
  const reportSortSelect = document.getElementById('report-sort');
  if(reportSortSelect){
    reportSortSelect.addEventListener('change',(e)=>{
      currentReportSort = e.target.value || 'departure';
      renderReports();
      updateCharts(true);
    });
  }
  const refreshReportsBtn = document.getElementById('btn-refresh-reports');
  if(refreshReportsBtn) refreshReportsBtn.addEventListener('click',()=>{ refreshAnalytics(true); });

  // route graph path search
  document.getElementById('btn-find-path').addEventListener('click', ()=>{ const src=document.getElementById('graph-src').value.trim(); const dst=document.getElementById('graph-dst').value.trim(); const g = buildGraphFromRoutes(); const path = g.bfsPath(src,dst); const out=document.getElementById('path-output'); if(!path) out.textContent = '(no path)'; else out.textContent = 'Path: '+path.join(' -> '); drawRouteGraph(path); });

  // Print ticket button
  const btnPrintTicket = document.getElementById('btn-print-ticket');
  if (btnPrintTicket) {
    btnPrintTicket.addEventListener('click', () => {
      const bookings = bookingMgr.allBookings();
      if (bookings.length === 0) {
        showToast('No bookings to print', 'warning');
        return;
      }
      // Print the most recent booking
      const latest = bookings.sort((a, b) => b.time - a.time)[0];
      printTicket(latest.ticketId);
    });
  }
  
  // Exports
  const btnCsv = document.getElementById('btn-export-csv');
  if (btnCsv) {
    btnCsv.addEventListener('click', () => {
      exportBookingsCSV();
      showToast('CSV exported successfully', 'success');
    });
  }
  
  const btnPdf = document.getElementById('btn-export-pdf');
  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      exportBookingsPrint();
      showToast('Report opened for printing', 'success');
    });
  }
});

// End of file
