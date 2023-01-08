function showTime() {
  let now = new Date();

  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let currentTime = document.querySelector("#currentTimeDisplay");
  currentTime.innerHTML = `${day} ${hours}:${minutes}`;

  //changing background image

  let background = document.querySelector("#background");
  let appWrapper = document.querySelector("#weather-app");
  if (hours >= 7 && hours <= 18) {
    background.classList.add("day");
    background.classList.remove("night");
    appWrapper.classList.add("day-active");
    appWrapper.classList.remove("night-active");
  } else {
    background.classList.add("night");
    background.classList.remove("day");
    appWrapper.classList.add("night-active");
    appWrapper.classList.remove("day-active");
  }
}

let units = "metric";
let apiKey = "6a48a550fc04f170639e60d52b8a6bc5";

function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showSearchWeather);
}

function searchCityValue(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-input");
  let city = searchInput.value;
  search(city);
}

//grabbing the forecast data from city coordinates
function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

//displays the weather information when city is entered into search field or after current location button is selected
function showSearchWeather(response) {
  let displayCity = document.querySelector("h1");
  displayCity.innerHTML = response.data.name;
  let temperature = Math.round(response.data.main.temp);
  let currentTemperature = document.querySelector("#temperature");
  currentTemperature.innerHTML = temperature;
  console.log(response.data);
  celsiusTemperature = temperature;

  document.querySelector("#current-description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#current-icon").innerHTML = `
    <img
      class="current-icon"
      src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png"
      alt="" width="150"
    />`;
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  getForecast(response.data.coord);
}
///converts the dt in the data to days of the week
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

///shows the forecast weather repeating for each day of the week
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  showTime();
  forecast.forEach(function (forecastDay, index) {
    if (index < 7 && index > 0) {
      console.log(forecastDay);
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2">
                <div class="weather-forecast-date">${formatDay(
                  forecastDay.dt
                )}</div>
                <img class="forecast-icon" src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" alt="" width="40"/>
                <div class="weather-forecast-temperature">
                <span class="weather-forecast-temperature-max" id="max-temp">${Math.round(
                  forecastDay.temp.max
                )}°    </span>
                <span class="weather-forecast-temperature-min" id="min-temp">${Math.round(
                  forecastDay.temp.min
                )}° </span>
              
                </div>
              </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//gets current position when that button is clicked
function getPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showSearchWeather);
  console.log(apiUrl);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = celsiusTemperature;
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(getPosition);
}

let celsiusTemperature = null;

let searchCity = document.querySelector("#city-form");
searchCity.addEventListener("submit", searchCityValue);

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentPosition);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celcius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

search("Newmarket");
//showTime();
//displayForecast();
