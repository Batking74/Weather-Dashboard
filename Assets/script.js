const apiKey = '4de5b9b05ea00402efaa87dba6e0268f';
const latAndLon = 'https://nominatim.openstreetmap.org/search?format=json&q=';
const temp = document.getElementById('temp');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const buttons = document.getElementsByTagName('button');
const searchContainer = document.querySelector('.search-container');
const forecastContainer = document.getElementById('forecast-container');
let search;

const options = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
}

// Display search history
if(localStorage.length != 0) {
    for(let i = 0; i < localStorage.length; i++) {
        if(localStorage.key(i) != null && localStorage.key(i) != undefined) {
            const btn = document.createElement('button');
            btn.textContent = localStorage.key(i);
            searchContainer.append(btn);
        }
    }
    addButtonEventListeners();
}
else addButtonEventListeners();


// Retreiving the searched states latitude and longitude
async function displayForecast(e) {
    const searchValue = searchInput.value;
    const btnValue = e.target.textContent;
    try {
        if(searchValue != '') {
            validateBtn(btnValue, searchValue);
            const res = (await fetch(`${latAndLon}${search}`)).json();
            const data = await res;
            getWeather(data[0].lat, data[0].lon);
        }
    } catch(err) { console.log(err) }
}


// Displays wather data to webpage
async function getWeather(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const res = (await fetch(url)).json();
        const data = await res;
        const date = new Date(data.list[0].dt_txt);
        const daysToCome = getNextFiveDays(date, data);
        cityName.textContent = `${data.city.name} (${date.toLocaleString('en-US', options)})`;
        forecastContainer.textContent = '';
        for(let i = 0; i < daysToCome.length; i++) {
            const futureDate = new Date(daysToCome[i].dt_txt);
            forecastContainer.innerHTML += `
                <div>
                    <h3>${futureDate.toLocaleString('en-US', options)}</h3>
                    <p>Temp: ${daysToCome[i].main.temp} F</p>
                    <p>Wind: ${daysToCome[i].wind.speed} MPH</p>
                    <p>Humidity: ${daysToCome[i].main.humidity} %</p>
                </div>
            `
        }
        temp.textContent = `Temp: ${data.list[0].main.temp} F`;
        wind.textContent = `Wind: ${data.list[0].wind.speed} MPH`;
        humidity.textContent = `Humidity: ${data.list[0].main.humidity}%`;
        addButtonEventListeners();
    } catch(err) { console.log(err) }
}


// returns the next 5 days in the future and their forecasts
function getNextFiveDays(date, data) {
    let day = parseInt(date.toLocaleString('en-US', {day: 'numeric'})) + 1;
    let condition = day + 5;
    let daysToCome = [];
    for(let i = 0; day != condition; i++) {
        if(data.list[i] != undefined) {
            const v = parseInt(data.list[i].dt_txt.substring(8, 10));
            if(v == day) {
                daysToCome.push(data.list[i]);
                day++;
            }
            continue;
        }
        i++;
        day++;
    }
    return daysToCome;
}


function validateBtn(btnValue, searchValue) {
    const valueIsDuplicate = noDuplicateBtns(searchValue);
    const btn = document.createElement('button');

    // if user clicked on Search btn, and their value is not in the search history execute
    if(btnValue === 'Search' && !(valueIsDuplicate)) {
        search = searchValue;
        btn.textContent = search;
    }
    // if user clicked on Search btn, and their value is in the search history execute
    else if(btnValue === 'Search' && valueIsDuplicate) {
        search = searchInput.value;
        btn.textContent = search;
        searchContainer.append(btn);
        localStorage.setItem(search, search);
    }
    // if user clicked on a button thats in the search history execute
    else {
        search = btnValue;
    }
}


// Checks if the users searched value already exists in the search history
function noDuplicateBtns(value) {
    for(let i = 1; i < buttons.length; i++) {
        if(buttons[i].textContent === value) {
            return false;
        }
    }
    return true;
}

// Sets eventlisteners for all buttons
function addButtonEventListeners() {
    for(let btn of buttons) {
        btn.addEventListener('click', displayForecast);
    }
}