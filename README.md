Event Planner Application - Made by Amukelani Xhantini

Description

This is a web-based event planning application built for creating and managing events, managing guests and guest lists especially tracking RSVPs. The application supports offline use.  


Features List

- Creating & managing events
- Edit & delete events
- Guest management
- RSVP tracking - allows for user to confirm RSVPs of confirmed attendees
- Dashboard overview - shows relevant stats and upcoming events based on the date
- Live weather - shows live weather forecast based on users location
- Offline support
- Responsive design

Libraries used
- Bootstrap used for styling 


API used:

1. Open-Meteo - it is a free forecast API. no API key needed to run it in your app, the API uses the user's coordinates and the days date to give the weather forecast for the day
2. Geolocation API - this is a browser based API used to obtain the user's coordinates and is given to the Open-Meteo API

How to Run Locally

1. Download the zip of the project 
2. Open the project in Visual Studio Code 
3. Open your terminal
4. navigate to src folder by entering "cd src"
5. Then enter in the terminal this command  "npx live-server"
6. The application will then run in your browser



How Offline Support Works

The application supports offline use. This is done by using a service worker which caches the apps files such as the HTML, CSS and the JS on first visit of the application. Then the service worker will serve the files and allow for normal functioning of the application and the data of the application is stored locally on the users browser using localStorage. The only feature that requires internet connection is weather data which is fetched using an API. The weather display will show "Unable to fetch weather data" when there is no internet connection. 

GitHub Repository Link: https://github.com/Amu-education/Event-Planner