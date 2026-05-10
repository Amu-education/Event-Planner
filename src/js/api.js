// Api for fecthing weather data

export class Weather {


    getLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(GPS){
                const lat = GPS.coords.latitude;
                const lon = GPS.coords.longitude;
                callback(lat, lon);

    }, 
    function(error) {
    console.error("Error getting geolocation:", error);
    });

} else {
    console.error("Geolocation is not supported by this browser.");
}}







async weatherFetch(lat, lon, date) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${date}&end_date=${date}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }



        const data = await response.json();
        if (!data.daily) return null;


        const max  = Math.trunc(data.daily.temperature_2m_max[0]);
        const min  = Math.trunc(data.daily.temperature_2m_min[0]);

        return `Today's forecast: ${max}°C / ${min}°C`;


    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }


    
}

}



