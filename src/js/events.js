
// Class for Events
export class Event {
    constructor(name, type, date, time, location, guests = []) {
        this.id = Date.now().toString();
        this.name = name;
        this.type = type;
        this.date = date;
        this.time = time;
        this.location = location;
        this.guests = guests;

        

    }

    addGuest(guest) {
        this.guests.push(guest);
    }

    removeGuest(guestEmail) {
        this.guests = this.guests.filter(guest => guest.email !== guestEmail);
    }

    getRsvpPercentage() {
        if (this.guests.length === 0) return 0;
        const Count = this.guests.filter(guest => guest.rsvp).length;
        return (Count / this.guests.length) * 100;
    }

    getGuestsCount() {
        return this.guests.length;
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            date: this.date,
            time: this.time,
            location: this.location,
            guests: this.guests.map(guest => guest.toJson()),
        }
    }

    isUpcoming() {
        const now = new Date();
        const eventDateTime = new Date(`${this.date}T${this.time}`);
        return eventDateTime > now;
    }

    static fromJson(eventJson) {
        const event = new Event(eventJson.name, eventJson.type, eventJson.date, eventJson.time, eventJson.location);
        event.id = eventJson.id;
        event.guests = eventJson.guests.map(guestJson => Guest.fromJson(guestJson));
        return event;
    }







}


// Class for guests
export class Guest {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.rsvp = false;
    }

    changeRsvp() {
        this.rsvp = !this.rsvp;
    }

    toJson() {
        return {
            name: this.name,
            email: this.email,
            rsvp: this.rsvp
        }
    }

    static fromJson(guestJson) {
        const guest = new Guest(guestJson.name, guestJson.email);
        guest.rsvp = guestJson.rsvp;
        return guest;
    }
}


// Class for mangaging events
export class EventManager {
    constructor(eventStorageKey = 'events') {
        this.events = [];
        this.eventStorageKey = eventStorageKey;
        this.loadEvents();
    }

    loadEvents() {
        const eventsJson = localStorage.getItem(this.eventStorageKey);
        if (eventsJson) {
            const eventsArray = JSON.parse(eventsJson);
            this.events = eventsArray.map(eventJson => Event.fromJson(eventJson));
        } else {
            this.events = [];
        }
    }

    saveEvent(event) {
        this.events.push(event);
        localStorage.setItem(this.eventStorageKey, JSON.stringify(this.events.map(event => event.toJson())));
    }

    updateEvent(id, fields) {
        const event = this.findEventById(id);
        if (!event) return;
        Object.assign(event, fields);
        this.commit();
    }

    deleteEvent(id) {
        this.events = this.events.filter(event => event.id !== id);
        localStorage.setItem(this.eventStorageKey, JSON.stringify(this.events.map(event => event.toJson())));
    }

    getEventStats() {
        const totalEvents = this.events.length;

        const guestTotal = this.events.reduce((total, event) => total + event.getGuestsCount(), 0);
        const nextEvent = this.events.filter(event => event.isUpcoming()).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))[0] || null;

        return {
            totalEvents,
            guestTotal,
            nextEvent
        }
    } 

    findEventById(id) {
        return this.events.find(event => event.id === id);
    }

    commit() {
        localStorage.setItem(this.eventStorageKey, JSON.stringify(this.events.map(event => event.toJson())));
    }

}

