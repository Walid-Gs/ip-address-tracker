"use strict";

// selecting Dom elements:
const map = document.querySelector("#map");
const ipField = document.querySelector("#ip-value");
const locationField = document.querySelector("#location-value");
const timezoneField = document.querySelector("#timezone-value");
const ispField = document.querySelector("#isp-value");
//
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");

// some global variables:
let myMap;
let myIcon;

// function rendering the map:
function renderMap() {
  myMap = L.map("map");

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(myMap);
  //   adding the marker:
  myIcon = L.icon({
    iconUrl: "/images/icon-location.svg",
  });
}
renderMap();

// var marker = L.marker([latitude, longitude]).addTo(myMap);
// creating the function that render the information :
function renderInfo(data) {
  // filling the fields with the crrect real time data:
  ipField.textContent = data.ip;
  locationField.textContent = `${data.location.city}, ${data.location.country} ${data.location.geonameId}`;
  timezoneField.textContent = `UTC${data.location.timezone}`;
  ispField.textContent = data.isp;
}

// asynchrounous function to work with ipfy api :
// apikey: at_ZdYObDl7yEZizBOGZJNl8Dpf6uO8n

//creatng the asynchrounous function that fetch info about ip address:
async function geolocateIp(ipAddress = "") {
  try {
    //fetching the data:
    const apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=at_ZdYObDl7yEZizBOGZJNl8Dpf6uO8n&ipAddress=${ipAddress}`;
    const response = await fetch(apiUrl);

    // handling errors:
    if (!response.ok) throw new Error("Something went wrong ❌❌❌");

    //getting the data:
    const ipData = await response.json();
    console.log(ipData);
    //rendring the informations:
    renderInfo(ipData);

    // rendring the position on the map :
    myMap.setView([ipData.location.lat, ipData.location.lng], 15);
    const marker = L.marker([ipData.location.lat, ipData.location.lng], {
      icon: myIcon,
    }).addTo(myMap);
  } catch (err) {
    console.error(err);
  }
}
geolocateIp();

// handling the search button event:
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const ipAddress = searchInput.value;
  geolocateIp(ipAddress);
  searchInput.value = "";
});
searchInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    const ipAddress = searchInput.value;
    geolocateIp(ipAddress);
    searchInput.value = "";
  }
});
