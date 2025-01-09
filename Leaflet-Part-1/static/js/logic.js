// Get data from USGS GeoJson feed
// Calling on the endpoint that returns all earthquake data from the past seven days
const weeklyEndpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const dailyEndpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


// create map object
var map = L.map("map",{
    center: [40.7608, -111.8910], //using coordinates of Salt Lake City, Utah as map center on page load
    zoom: 5 
}); // Module 15; Lesson 1; Activity 1; logic.js

//create tile layer and assign it to map object
var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map); // Module 15; Lesson 1; Activity 1; logic.js






d3.json(dailyEndpoint).then(function(response) {
    // console.log(response.features);

    let features = response.features;


    for (i = 0; i < features.length; i++) {
        let coordinates = features[i].geometry.coordinates.slice(0,2).reverse();
        console.log(coordinates);
        let depth = features[i].geometry.coordinates[2];
        let magnitude = features[i].properties.mag;
        let place = features[i].properties.place;


        L.marker(coordinates).addTo(map).bindPopup(`Magnitude: ${magnitude}`); 
            //https://leafletjs.com/index.html




    };

});
