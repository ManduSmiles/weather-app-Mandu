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

let units = "metric";
let apiKey = "f26f2823d9c6f82b0d99ff14bc39b859";

function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showSearchWeather);
}

function searchCityValue(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-input");
  let city = searchInput.value;
  // let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  // axios.get(apiUrl).then(showSearchWeather);
  search(city);
}

let searchCity = document.querySelector("#city-form");
searchCity.addEventListener("submit", searchCityValue);

//displays the weather information when city is entered into search field or after current location button is selected
function showSearchWeather(response) {
  let displayCity = document.querySelector("h1");
  displayCity.innerHTML = response.data.name;
  let temperature = Math.round(response.data.main.temp);
  let currentTemperature = document.querySelector("#temperature");
  currentTemperature.innerHTML = temperature;
  document.querySelector("#current-description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
}
//gets current position when that button is clicked
function getPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showSearchWeather);
  console.log(apiUrl);
}

//function showCurrentCity(response) {
//let displayCurrentCity = document.querySelector("h1");
//displayCurrentCity.innerHTML = response.data[0].name;
//}

//below code is redunant
//function showPositionWeather(response) {
//let temperature = Math.round(response.data.main.temp);
// let currentTemperature = document.querySelector("#temperature");
//currentTemperature.innerHTML = temperature;
//let lat = response.data.coord.lat;
//let lon = response.data.coord.lon;
//let apiUrlName = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
// axios.get(apiUrlName).then(showCurrentCity);
//}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(getPosition);
}

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentPosition);

search("Newmarket");
