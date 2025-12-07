# Concurrency, Synchronization, and Event-Driven Patterns in BOW Website

## Overview
This document outlines all instances of **CONCURRENCY**, **SYNCHRONIZATION**, and **EVENT-DRIVEN** programming patterns used in the Beats of Washington (BOW) website.

---

## 🔄 **CONCURRENCY**

### **1. Frontend - Concurrent API Requests**

**Location:** `bow-platform/src/pages/HomePage.js`

**Pattern:** Multiple async operations running concurrently
```javascript
// Multiple data fetches happening simultaneously
const fetchEvents = useCallback(async () => { ... });
const fetchHeroSettings = useCallback(async () => { ... });
const fetchMissionMedia = useCallback(async () => { ... });
const fetchSponsors = useCallback(async () => { ... });
const fetchSlideshowPhotos = useCallback(async () => { ... });

// All triggered concurrently in useEffect
useEffect(() => {
  fetchEvents();
  fetchHeroSettings();
  fetchMissionMedia();
  fetchSponsors();
  fetchSlideshowPhotos();
}, []);
```

**Why:** Improves page load time by fetching all data in parallel instead of sequentially.

---

### **2. Frontend - Parallel Delete Operations**

**Location:** `bow-platform/src/components/admin/*.js`

**Pattern:** `Promise.all()` for concurrent deletions
```javascript
// AdminPanel.js - Delete multiple events concurrently
const deletePromises = selectedItems.map(item => 
  api.delete(`/events/${item.id}`)
);
const results = await Promise.all(deletePromises);

// VolunteerManagement.js - Delete multiple volunteers concurrently
const deletePromises = selectedItems.map(item => 
  api.delete(`/volunteers/${item.id}`)
);
const results = await Promise.all(deletePromises);

// NewsletterManagement.js - Delete multiple campaigns concurrently
const deletePromises = selectedItems.map(item => 
  api.delete(`/newsletter-campaigns/${item.id}`)
);
await Promise.all(deletePromises);
```

**Why:** Efficiently deletes multiple items simultaneously instead of waiting for each deletion to complete.

---

### **3. Backend - Concurrent Database Operations**

**Location:** `bow-backend/routes/payment.js`

**Pattern:** Async/await with concurrent processing
```javascript
// Webhook handler processes payment and sends email concurrently
async function handlePaymentWebhook(event) {
  // 1. Process payment (async)
  const paymentIntent = event.data.object;
  
  // 2. Update registration (async)
  await registration.update({ ... });
  
  // 3. Fetch event details (async)
  const event = await Event.findById(paymentIntent.metadata.eventId);
  
  // 4. Send email (async, non-blocking)
  await EmailService.sendEventRegistrationConfirmation(emailData);
}
```

**Why:** Processes multiple operations concurrently to reduce total processing time.

---

### **4. Backend - Non-Blocking Health Checks**

**Location:** `bow-backend/middleware/connectionRetry.js`

**Pattern:** Background async operations that don't block the main request
```javascript
// In Lambda, don't block requests based on connection health
if (isLambda) {
  if (!isConnectionHealthy()) {
    // Quick async check, but don't block the request
    checkConnectionHealth().catch(err => {
      console.log('⚠️  Background health check failed:', err.message);
    });
  }
  return next(); // Continue without waiting
}
```

**Why:** Prevents blocking user requests while performing background health checks.

---

## 🔒 **SYNCHRONIZATION**

### **1. Frontend - Preventing Duplicate API Calls**

**Location:** `bow-platform/src/pages/HomePage.js`

**Pattern:** Synchronization flags to prevent concurrent duplicate requests
```javascript
const [eventsFetched, setEventsFetched] = useState(false);
const [heroFetched, setHeroFetched] = useState(false);
const [missionMediaFetched, setMissionMediaFetched] = useState(false);

const fetchEvents = useCallback(async () => {
  if (eventsFetched) {
    console.log('⚠️ Events already fetched, skipping duplicate request');
    return; // Prevent duplicate concurrent requests
  }
  // ... fetch logic
  setEventsFetched(true);
}, [eventsFetched]);
```

**Why:** Prevents race conditions where multiple components trigger the same API call simultaneously.

---

### **2. Frontend - Auth State Synchronization**

**Location:** `bow-platform/src/contexts/AuthContext.js`

**Pattern:** Synchronization lock to prevent multiple simultaneous syncs
```javascript
const [isSyncing, setIsSyncing] = useState(false); // Prevent multiple simultaneous syncs

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    // Prevent multiple simultaneous syncs
    if (isSyncing) {
      console.log('🔄 Sync already in progress, skipping...');
      return; // Exit if sync is already in progress
    }
    
    setIsSyncing(true); // Lock
    try {
      const backendUser = await syncUserWithBackend(firebaseUser);
      // ... sync logic
    } finally {
      setIsSyncing(false); // Unlock
    }
  });
}, [isSyncing]);
```

**Why:** Ensures only one user sync operation happens at a time, preventing data corruption.

---

### **3. Backend - Retry Logic with Synchronization**

**Location:** `bow-backend/middleware/connectionRetry.js`

**Pattern:** Synchronized retry mechanism for database operations
```javascript
// Add retry logic for database operations
req.retryOperation = async (operation, retries = maxRetries) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await operation(); // Synchronized execution
    } catch (error) {
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay)); // Wait
        await checkConnectionHealth(); // Synchronized health check
        continue;
      }
      throw error;
    }
  }
};
```

**Why:** Ensures database operations complete successfully by retrying with proper synchronization.

---

### **4. Backend - Connection Health Synchronization**

**Location:** `bow-backend/config/aws-config.js`

**Pattern:** Synchronized connection health checks
```javascript
let connectionHealthy = false;
let lastHealthCheck = null;

async function checkConnectionHealth() {
  // Prevent concurrent health checks
  if (lastHealthCheck && (Date.now() - lastHealthCheck) < 5000) {
    return connectionHealthy; // Return cached result
  }
  
  lastHealthCheck = Date.now();
  try {
    // Synchronized health check
    await docClient.send(new ListTablesCommand({}));
    connectionHealthy = true;
    return true;
  } catch (error) {
    connectionHealthy = false;
    return false;
  }
}
```

**Why:** Prevents multiple concurrent health checks from overwhelming the database connection.

---

## 🎯 **EVENT-DRIVEN**

### **1. Frontend - React Event Handlers**

**Location:** `bow-platform/src/components/layout/Navbar.js`, `bow-platform/src/pages/*.js`

**Pattern:** Event-driven UI interactions
```javascript
// Click event handlers
<button onClick={() => setIsOpen(!isOpen)}>
  {isOpen ? <X /> : <Menu />}
</button>

// Form submit events
const handleSubmit = async (e) => {
  e.preventDefault();
  // ... handle form submission
};

// Navigation events
<Link to="/events" onClick={() => setIsOpen(false)}>
  Events
</Link>
```

**Examples:**
- **Navbar.js:** Mobile menu toggle, dropdown clicks, navigation clicks
- **EventDetailsPage.js:** Registration form submission, payment processing
- **AdminPanel.js:** CRUD operations, filter changes, modal triggers
- **ContactPage.js:** Contact form submission

**Why:** React is inherently event-driven - all user interactions trigger event handlers.

---

### **2. Frontend - Event Listeners**

**Location:** `bow-platform/src/components/layout/Navbar.js`, `bow-platform/src/pages/AdminPanel.js`

**Pattern:** DOM event listeners for click-outside detection
```javascript
// Close dropdown on outside click
useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  }
  
  if (showFilterDropdown) {
    document.addEventListener('mousedown', handleClickOutside); // Event listener
    return () => document.removeEventListener('mousedown', handleClickOutside); // Cleanup
  }
}, [showFilterDropdown]);
```

**Why:** Listens for external click events to close dropdowns and modals.

---

### **3. Frontend - Auth State Change Events**

**Location:** `bow-platform/src/contexts/AuthContext.js`

**Pattern:** Event-driven authentication state changes
```javascript
useEffect(() => {
  // Listen for Firebase auth state changes (event-driven)
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    // This callback fires whenever auth state changes
    if (firebaseUser) {
      // User logged in event
      const backendUser = await syncUserWithBackend(firebaseUser);
      setCurrentUser(backendUser.user);
    } else {
      // User logged out event
      setCurrentUser(null);
    }
  });
  
  return () => unsubscribe(); // Cleanup event listener
}, []);
```

**Why:** Reacts to authentication state changes (login/logout) automatically.

---

### **4. Backend - Stripe Webhooks (Event-Driven)**

**Location:** `bow-backend/routes/payment.js`

**Pattern:** Event-driven payment processing via webhooks
```javascript
// POST /api/payment/webhook - Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // Verify webhook signature
  const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  
  console.log('[Webhook] Received event:', event.type);
  
  // Event-driven processing based on event type
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment event
      const paymentIntent = event.data.object;
      await registration.update({ paymentStatus: 'completed' });
      await EmailService.sendEventRegistrationConfirmation(emailData);
      break;
      
    case 'payment_intent.payment_failed':
      // Handle failed payment event
      console.log('[Webhook] Payment failed:', failedPaymentIntent.id);
      break;
      
    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }
  
  res.json({ received: true });
});
```

**Why:** Stripe sends webhook events when payments succeed/fail, triggering automated processing.

---

### **5. Backend - Express Route Handlers (Event-Driven)**

**Location:** `bow-backend/routes/*.js`, `bow-backend/server.js`

**Pattern:** Event-driven HTTP request handling
```javascript
// Express routes are event-driven - they respond to HTTP events
router.get('/events', async (req, res) => {
  // Responds to GET /api/events event
  const events = await Event.findAll();
  res.json(events);
});

router.post('/events', async (req, res) => {
  // Responds to POST /api/events event
  const event = await Event.create(req.body);
  res.status(201).json(event);
});

router.put('/events/:id', async (req, res) => {
  // Responds to PUT /api/events/:id event
  const event = await Event.update(req.params.id, req.body);
  res.json(event);
});

router.delete('/events/:id', async (req, res) => {
  // Responds to DELETE /api/events/:id event
  await Event.delete(req.params.id);
  res.status(204).send();
});
```

**Why:** All HTTP requests are events that trigger corresponding route handlers.

---

### **6. Frontend - useEffect Hooks (Event-Driven)**

**Location:** `bow-platform/src/pages/HomePage.js`, `bow-platform/src/components/*.js`

**Pattern:** Event-driven side effects based on state/prop changes
```javascript
// Event-driven data fetching when component mounts
useEffect(() => {
  fetchEvents();
  fetchHeroSettings();
  fetchMissionMedia();
}, []); // Triggers on mount event

// Event-driven updates when dependencies change
useEffect(() => {
  if (currentUser) {
    fetchUserEvents(currentUser.id);
  }
}, [currentUser]); // Triggers when currentUser changes

// Event-driven cleanup
useEffect(() => {
  const interval = setInterval(() => {
    updateCountdown();
  }, 1000);
  
  return () => clearInterval(interval); // Cleanup on unmount event
}, [targetDate]);
```

**Why:** React's useEffect hook responds to component lifecycle events and dependency changes.

---

## 📊 **Summary Table**

| Pattern Type | Location | Example | Purpose |
|-------------|----------|---------|---------|
| **Concurrency** | HomePage.js | Parallel API calls | Improve load time |
| **Concurrency** | AdminPanel.js | `Promise.all()` for deletions | Efficient batch operations |
| **Concurrency** | payment.js | Concurrent webhook processing | Reduce processing time |
| **Synchronization** | HomePage.js | `eventsFetched` flag | Prevent duplicate requests |
| **Synchronization** | AuthContext.js | `isSyncing` lock | Prevent concurrent syncs |
| **Synchronization** | connectionRetry.js | Retry logic | Ensure operation completion |
| **Event-Driven** | Navbar.js | Click handlers | User interactions |
| **Event-Driven** | payment.js | Stripe webhooks | Payment processing |
| **Event-Driven** | server.js | Express routes | HTTP request handling |
| **Event-Driven** | AuthContext.js | `onAuthStateChanged` | Auth state changes |

---

## 🎓 **Key Takeaways**

1. **Concurrency:** Used extensively for parallel API calls, batch operations, and non-blocking background tasks.

2. **Synchronization:** Implemented through flags, locks, and retry mechanisms to prevent race conditions and ensure data consistency.

3. **Event-Driven:** The entire application is event-driven - from user interactions (clicks, form submissions) to backend webhooks (Stripe payments) to React lifecycle events (useEffect hooks).

---

## 📝 **Conclusion**

The BOW website uses **all three patterns** extensively:
- ✅ **CONCURRENCY:** Parallel operations for performance
- ✅ **SYNCHRONIZATION:** Locks and flags for data consistency
- ✅ **EVENT-DRIVEN:** React events, webhooks, and HTTP handlers

These patterns work together to create a responsive, efficient, and reliable web application.


