// create map object
let map = L.map("map",{
    center: [40.7608, -111.8910], //using coordinates of Salt Lake City, Utah as map center on page load
    zoom: 5 
}); // Module 15; Lesson 1; Activity 1; logic.js

//create tile layer and assign it to map object
let tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map); // Module 15; Lesson 1; Activity 1; logic.js

