const apiKey = '4de5b9b05ea00402efaa87dba6e0268f';
const latAndLon = 'https://nominatim.openstreetmap.org/search?format=json&q=';
const temp = document.getElementById('temp');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const buttons = document.getElementsByTagName('button');

for(let btn of buttons) {
    btn.addEventListener('click', displayForecast)
}

const options = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
}


searchBtn.addEventListener('click', displayForecast);

// Retreiving the searched states latitude and longitude
async function displayForecast(e) {
    if(searchInput.value != '') {
        let search;
        // Checking if the user clicked on a button or searched
        if(e.target.textContent === 'Search') {
            search = searchInput.value;
        }
        else {
            search = e.target.textContent;
        }
        const res = (await fetch(`${latAndLon}${search}`)).json();
        const data = await res;
        getWeather(data[0].lat, data[0].lon);
    }
}

async function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const res = (await fetch(url)).json();
    const data = await res;
    const date = new Date(data.list[0].dt_txt);
    cityName.textContent = `${data.city.name} (${date.toLocaleString('en-US', options)})`;
    temp.textContent = `${data.list[0].main.temp} F`;
    wind.textContent = `${data.list[0].wind.speed} MPH`;
    humidity.textContent = `${data.list[0].main.humidity}%`;

    console.log()
}