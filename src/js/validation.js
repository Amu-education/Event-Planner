// This is form validation for guest modal and event modal

export class Validation {

    validateEventForm(name, date) {
        if (name === "") {
            return "Event name is required."
        }
        if (date === "") {
            return "Event date is required."
        }
        return null;
    }

    validateGuest(name, email, existingEmails) {
        if (name === "") {
            return "Guest name is required."
        }

        if (email === "") {
            return "Guest email is required."
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return "Please enter a valid email address."
        }
        if (existingEmails.includes(email)) {
            return "Email is already in use"
        }

        return null;
    }



}



