// Get data from USGS GeoJson feed
// Calling on the endpoint that returns all earthquake data from the past dayd
const endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php"


// create map object
var map = L.map("map",{
    center: [40.7608, -111.8910], //using coordinates of Salt Lake City, Utah as map center on page load
    zoom: 5 
}); // Module 15; Lesson 1; Activity 1; logic.js

//create tile layer and assign it to map object
var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map); // Module 15; Lesson 1; Activity 1; logic.js





