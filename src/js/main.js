import { Event, Guest, EventManager } from "./events.js";
import { Validation } from "./validation.js";
import { Weather } from "./api.js";
import "../css/bootstrap.css";
import "../css/styles.css";
import "./bootstrap.bundle.js";





const validator = new Validation();

const manager = new EventManager();
const weather = new Weather();



const today = new Date().toISOString().split("T")[0];
const dateNowElement = new Date().toDateString()
const addGuestBtn = document.getElementById("modal-add-guest-btn");
document.getElementById('date-now').textContent = dateNowElement;
document.getElementById("event-date").setAttribute("min", today);

// Handles both creating and editing an event using the same form and pre-filling data for editing a form
document.getElementById("make-an-event").addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("event-error").textContent = "";
    const name = document.getElementById("event-name").value.trim();
    const date = document.getElementById("event-date").value;
    const time = document.getElementById("event-time").value;
    const location = document.getElementById("event-location").value.trim();
    const type = document.getElementById("event-type").value;

    const error = validator.validateEventForm(name, date);
    if (error) {
        document.getElementById("event-error").textContent = error;
        return;
    }



    const editEventById = document.getElementById("edit-event-id").value;
    if (editEventById) {
        manager.updateEvent(editEventById, {name, date, time, location, type});
        bootstrap.Modal.getInstance(document.getElementById("event-form")).hide();
    } else {
        const newEvent = new Event(name, type, date, time, location);
        manager.saveEvent(newEvent);
    }
    closeEventModal();
    renderEventList();
    renderStats();
});




let currentEvent = null;

function openEventModal(id) {
    currentEvent = manager.findEventById(id);
    document.getElementById("event-name").value = currentEvent.name;
    document.getElementById("event-date").value = currentEvent.date;
    document.getElementById("event-time").value = currentEvent.time;
    document.getElementById("event-location").value = currentEvent.location;
    document.getElementById("event-type").value = currentEvent.type;
    document.getElementById("edit-event-id").value = id;
    const eventModal = new bootstrap.Modal(document.getElementById("event-form"));
    eventModal.show();



    
    
}



// Function to add a guest
function addGuest() {
    if (!currentEvent) return;



    const name = document.getElementById("modal-guest-name").value.trim()
    const email = document.getElementById("modal-guest-email").value.trim();

    const existingEmails = currentEvent.guests.map(guest => guest.email.toLowerCase());

    const error = validator.validateGuest(name, email, existingEmails);
    if (error) {
        document.getElementById("modal-guest-error").textContent = error;
        return;
    }

    document.getElementById("modal-guest-error").textContent = "";
    const guest = new Guest(name, email);
    currentEvent.addGuest(guest);
    manager.commit();
    renderEventList();
    renderGuestList(currentEvent.id);

    document.getElementById("modal-guest-name").value = "";
    document.getElementById("modal-guest-email").value = "";
}


addGuestBtn.addEventListener("click", function() {
    console.log("Add Guest button clicked");
        addGuest();
        renderStats();
        renderEventList();

});

//This function render stats in the overview section
function renderStats() {
    const stats = manager.getEventStats();
    document.getElementById("total-events").textContent = stats.totalEvents;
    document.getElementById("total-guests").textContent = stats.guestTotal;
    document.getElementById("upcoming-event-title").textContent = stats.nextEvent ? stats.nextEvent.name : "No upcoming events";
    document.getElementById("upcoming-event-time").innerHTML = stats.nextEvent ? `Date: ${stats.nextEvent.date} <p>Time: ${stats.nextEvent.time}</p>` : "No upcoming events";

}

//Renders the event lists in the events tab
function renderEventList() {
    const eventList = document.getElementById("events-grid");
    eventList.innerHTML = "";

    const events = manager.events;

    if (events.length === 0) {
        eventList.innerHTML = `<p id="no-event-text" class="text-muted">No events yet. Click "Add Event" to create one.</p>`;
        homePageEventsList();
        return;
    }

    events.forEach(event => {
        const confirmedCount = event.guests.filter(g => g.rsvp).length;
        const totalGuests = event.getGuestsCount();

        const radius = 14;
        const circumference = 2 * Math.PI * radius;
        const filled = totalGuests > 0 ? (confirmedCount / totalGuests) * circumference : 0;
        const empty = circumference - filled;

    
    const card = document.createElement('div')
    card.className = "col-md-6 col-lg-4";
    card.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
            <h5 class="card-title">${event.name}</h5>
            <p class="card-text text-muted small">${event.type}</p>
            <p class="small mb-1">
                Date: ${event.date} <br>Time: ${event.time}
            </p>
            <p class="small mb-1">
                Location: ${event.location}
            </p>
            </div>
            <div class="card-footer d-flex align-items-center justify-content-between gap-3">
            <div class="d-flex align-items-center gap-2">
                <svg width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#dee2e6" stroke-width="4"/>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#2FA084" stroke-width="4"
                    stroke-dasharray="${filled} ${empty}"
                    stroke-linecap="round"
                    transform="rotate(-90 18 18)"/>
                <text x="18" y="22" text-anchor="middle" font-size="10" font-weight="500" fill="#333">
                    ${confirmedCount}/${totalGuests}
                </text>
                </svg>
                <div>
                <div id="rsvp-label">RSVP</div>
                <div id="confirmed-label">${confirmedCount} confirmed</div>
                </div>
            </div>
            <div class="d-flex gap-3">
                <button class="btn btn-sm btn-outline-primary guests-btn" data-id="${event.id}">Guests</button>
                <button class="btn btn-sm btn-outline-warning edit-btn" data-id="${event.id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${event.id}">Delete</button>
            </div>
            </div>
        </div>
    `
    eventList.appendChild(card)
  })
  renderStats();
  homePageEventsList();


  cardFunctions()
}

// These are buttons on the card footer used to manage individual events 
function cardFunctions() {
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function() {
            if (confirm("Are you sure you want to delete this event?")) { /// change to popup
                const eventId = this.getAttribute("data-id");
                manager.deleteEvent(eventId);
                renderEventList();
                renderStats();
            }
        })
    })
    document.querySelectorAll(".guests-btn").forEach(button => {
        button.addEventListener("click", function() {
            const eventId = this.getAttribute("data-id");
            openGuestModal(eventId);
        })
    })


    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function() {
            const eventId = this.getAttribute("data-id");
            openEventModal(eventId);
        })
    })
}

// Brings the guest list modal used to manage guests
function renderGuestList(eventId) {
    const event = manager.findEventById(eventId);
    if (!event) return;

    const guestList = document.getElementById("modal-guest-list");
    guestList.innerHTML = "";

    for (const guest of event.guests) {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        listItem.innerHTML = `
            <div>${guest.name} (${guest.email.toLowerCase()})</div>
            <div class="d-flex gap-2">
                <div class="badge ${guest.rsvp ? 'bg-success' : 'bg-secondary'}">
                    ${guest.rsvp ? 'Confirmed' : 'Pending'}
                </div>
                <button class="btn btn-sm btn-outline-success rsvp-btn" data-email="${guest.email}">Confirm RSVP</button>
                <button class="btn btn-sm btn-outline-danger remove-guest-btn" data-email="${guest.email}">Remove</button>
            </div>`
        guestList.appendChild(listItem);
    }

    guestList.querySelectorAll(".rsvp-btn").forEach(button => {
        button.addEventListener("click", function() {
            const email = this.getAttribute("data-email");
            const guest = event.guests.find(guest => guest.email === email);
            if (guest) {
                guest.changeRsvp();
                manager.commit();
                renderEventList();
                renderGuestList(currentEvent.id);
            }
        })
    })

    guestList.querySelectorAll(".remove-guest-btn").forEach(button => {
        button.addEventListener("click", function() {
            const email = this.getAttribute("data-email");
            event.guests = event.guests.filter(guest => guest.email !== email);
            currentEvent.removeGuest(this.dataset.email);
            manager.commit();
            renderGuestList(currentEvent.id);
            renderEventList();
            renderStats();
        })
    })

    homePageEventsList();
}

function openGuestModal(eventId) {
    currentEvent = manager.findEventById(eventId);
    renderGuestList(eventId);
    const guestModal = new bootstrap.Modal(document.getElementById("guest-modal"));
    guestModal.show();
}

weather.getLocation(async(lat, lon) => {
    const temperature = await weather.weatherFetch(lat, lon, today);
    if (temperature) {
        document.getElementById("current-weather").textContent = temperature;
    } else {
        document.getElementById("current-weather").textContent = "Unable to fetch weather data.";
    }
});

function closeEventModal() {
    bootstrap.Modal.getInstance(document.getElementById("event-form")).hide();

}
// ensures that when user closes modal data is cleared
document.getElementById("event-form").addEventListener("hidden.bs.modal", function() {
    document.getElementById("make-an-event").reset();
    document.getElementById("event-error").textContent = "";
    document.getElementById("edit-event-id").value = "";
});

// Shows Events on Home Tab
function homePageEventsList() {
    const homePageEvents = document.getElementById("event-list");

    const upcomingEvents = manager.events.filter(event => event.isUpcoming()).slice(0, 4).sort((a, b) => new Date(a.date) - new Date(b.date));
    if (upcomingEvents.length === 0) {
        homePageEvents.innerHTML = `<p class="text-muted">No upcoming events.</p>`;
        return;
    }

    homePageEvents.innerHTML = `
    <div class="d-flex flex-column gap-2">
    ${upcomingEvents.map(event => `
        <div class="event-row" data-id="${event.id}">
        <div>
            <div class="event-row-name">${event.name}</div>
            <p class="event-row-details">${event.type} · ${event.location}</p>
        </div>
        <div class="text-end">
             <p class="event-row-guests">${event.getGuestsCount()} guests</p>
             <p class="event-row-date">${event.date} · ${event.time}</p>
        </div>
        </div>
    `).join("")}

    </div>
    `;
    document.querySelectorAll(".event-row").forEach(row => {
        row.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            openGuestModal(id);
        });
    });
}

// For Offline Use
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registered'));
}



renderEventList();
renderStats();