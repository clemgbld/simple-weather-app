"use strict";
import mist from "./img/mist.jpg";
import night from "./img/night.jpg";
import rain from "./img/rain.jpg";
import goodWeather from "./img/good-weather.jpg";
import thunderstorm from "./img/thunderstorm.jpg";
import snow from "./img/snow.jpg";

// general
const dataDivEl = document.querySelector(".w-container");
const inputEl = document.querySelector(".city");
const html = document.documentElement;

// get the coordinates of the user
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// render a spinner when the content load
const renderSpinner = function () {
  dataDivEl.innerHTML = '<div class="loading"></div>';
};

// change the background of all the page depending on the weather
const changeBackground = function (titleColor, inputTextColor, backgroundImg) {
  document.querySelector("h1").style.color = titleColor;
  inputEl.style.color = inputTextColor;
  html.style.background = backgroundImg;
  return (html.style.backgroundSize = "cover");
};

// load the data of the current weather in the current data
const loadData = function (jsonData) {
  console.log(jsonData);
  document.querySelector(
    ".w-container"
  ).innerHTML = ` <div class="country-info"><p class="city-form">${
    jsonData.name
  }</p><p class="country">${jsonData.sys.country}</p></div>
  <p class="temp">${Math.round(jsonData.main.temp - 273.15)}&deg;C</p>
  <img class="icon-img" src="http://openweathermap.org/img/wn/${
    jsonData.weather[0].icon
  }@2x.png" alt="weather-icon">
  <p class="w-comment">${jsonData.weather[0].description}</p>`;
};

// abstarc the diffrent scenario for the weather
const weatherScenario = function (jsonData) {
  // thunderstorm
  if (/thunderstorm/gi.test(jsonData.weather[0].description)) {
    return changeBackground("#fff", "#fff", `url(${thunderstorm})`);
  }

  // Mist
  if (/mist|smoke|smog/gi.test(jsonData.weather[0].description)) {
    return changeBackground("#1864ab", "#333", `url(${mist})`);
  }
  // Snow
  if (/snow/gi.test(jsonData.weather[0].description)) {
    return changeBackground("#1864ab", "#333", `url(${snow})`);
  }
  // rain
  if (/rain/gi.test(jsonData.weather[0].description)) {
    return changeBackground("#fff", "#fff", `url(${rain})`);
  }
  // night
  if (jsonData.weather[0].icon.slice(-1) === "n") {
    return changeBackground("#1864ab", "#fff", `url(${night})`);
  }
  // sunny or normal weather
  changeBackground("#1864ab", "#333", `url(${goodWeather})`);
};

// make the call to the api
const weather = async function (e) {
  try {
    e.preventDefault();
    renderSpinner();
    const inputVal = inputEl.value;
    inputEl.value = "";
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=639eac1105dafe58e01fb14958187de7`
    );
    if (!res.ok) {
      console.log(res);
      throw new Error("Wrong city name");
    }

    const data = await res.json();

    loadData(data);

    console.log("log");

    return weatherScenario(data);
  } catch (err) {
    console.log(err);
    document.querySelector(
      ".w-container"
    ).innerHTML = ` <p class="city-form">${err}</p>
    <p class="temp">?&deg;C</p>
    <ion-icon class=icon name="sad-outline"></ion-icon>
    `;
  }
};

// trigger the api call and the other functions when the btn is clicked
document.querySelector(".btn").addEventListener("click", weather);

const weatherInit = async function () {
  try {
    renderSpinner();
    // Geolocation;
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Openweather
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=639eac1105dafe58e01fb14958187de7`
    );
    if (!res.ok) {
      console.log(res);
      throw new Error("couldn't access your location");
    }

    const data = await res.json();

    loadData(data);

    return weatherScenario(data);
  } catch (err) {
    console.log(err);
    document.querySelector(
      ".w-container"
    ).innerHTML = ` <p class="city-form">${err}</p>
      <p class="temp">?&deg;C</p>
      <ion-icon class=icon name="sad-outline"></ion-icon>
      `;
  }
};

weatherInit();
import "regenerator-runtime/runtime";
