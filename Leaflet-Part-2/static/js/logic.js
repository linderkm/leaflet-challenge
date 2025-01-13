// USGS earquake data endpoints.
const weeklyEndpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const dailyEndpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

//Create Leaflet geoJSON object using data stored in local boundaries.js file.
//This object will later be used as a map layer
const faultLines = L.geoJSON(geoJSON); //https://leafletjs.com/examples/geojson/

// function that outputs a hex color code based on integer input.
// This function is used when creating earthquake markers inside of createQuakesLayerGroup().
function depthToColor (depth) {
    let color = "";

    if (depth < 10) {
        color = "#22fc00"
    } else if (depth > 10 && depth < 30) {
        color = "#9bfe23"
    } else if (depth > 30 && depth < 50) {
        color = "#fefe2b"
    } else if (depth > 50 && depth < 70) {
        color = "#fece2b"
    } else if (depth > 70 && depth < 90) {
        color = "#fe913c"
    } else if (depth > 90){
        color = "#ff0303"
    } else {
        color = "#22fc00"
    };

    return color;
};


// This function makes a call to a USGS endpoint, and compiles the returned geoJSON data into a Leaflet layer group.
function createQuakesLayerGroup() {

    // initialize Leaflet layer group
    var earthquakeLayer = new L.layerGroup(); //Module 15; Lesson 3; Activity 2; logic.js

    // Make call to USGS endpoint, store promise for later parsing.
    const quakesPromise = fetch(weeklyEndpoint); //https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Promises

    //pass data promise into .then() method to check response status. 
    // If there are no status issues, the response is converted into a json object.
    quakesPromise
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })//https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Promises
    //the json object is 
    .then((data) => {
        //isolate desired earthquake data in features element of json object
        let features = data.features;
        
        //iterate over features dictionary to examine each earthquake record in response data
        for (i=0; i < features.length; i++) {
            let coordinates = features[i].geometry.coordinates.slice(0,2).reverse();
            let depth = features[i].geometry.coordinates[2];
            let magnitude = features[i].properties.mag;
            let place = features[i].properties.place;

            // Create Leaflet circle marker object, using coord, depth, mag, and place.
            // Bind a popup to the circle object, using the same datapoints.
            let marker = L.circle(coordinates, {
                color: "black",
                fillColor: depthToColor(depth),
                fillOpacity: 0.9,
                radius: magnitude * 15000
                }).bindPopup(`Location: ${place}</b><br>Magnitude: ${magnitude}</b><br>Depth: ${depth}m`);
            
            //add the circle marker to the earquakeLayer layer group object.
            marker.addTo(earthquakeLayer); //Module 15; Lesson 3; Activity 2; logic.js
        };
    })
    //log error if 
    .catch((error)=> {
        console.error(`Could not get data: ${error}`);
    });//https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Promises

    //return layer group 
    return earthquakeLayer;
};


//Store populated layer group in variable.
//quakes will be used below in layer controls. 
const quakes = createQuakesLayerGroup();




// //create street tile layer
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}); // (1)

// //create topo tile layer
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}); // (1)


// base maps reference for layer control
let baseMaps = {
    Street: street,
    Topography: topo
  };//https://leafletjs.com/examples/layers-control/
  
// map overlays reference for layer control
let overlayMaps = {
    Earthquakes: quakes,
    Faultlines: faultLines
};//https://leafletjs.com/examples/layers-control/
  

// create map object, using 'topo' tile layer and 'faultLines' geoJSON as default
var map = L.map("map",{
    center: [39.7392, -104.9903], //using coordinates of Denver, Colorado as map center on page load
    zoom: 4,
    layers: [topo, quakes, faultLines] //showing topo map, and both earthquakes and faultlines on page load
}); // (1)


//Initialize layer control
L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);//https://leafletjs.com/examples/layers-control/


// add legend to map using Leaflet.legend plug-in
const legend = L.control.Legend({
    position: "bottomleft",
    title: "Depth (meters)",
    collapsed: false,
    symbolWidth: 30,
    symbolHeight: 48,
    opacity: 1,
    column: 1,
    legends: [{
        label: "-10m - 10m",
        type: "rectangle",
        fillColor: "#22fc00",
        weight: 1
    },{
        label: "10m - 30m",
        type: "rectangle",
        fillColor: "#9bfe23",
        weight: 1  
    },{
        label: "30m - 50m",
        type: "rectangle",
        fillColor: "#fefe2b",
        weight: 1  
    },{
        label: "50m - 70m",
        type: "rectangle",
        fillColor: "#fece2b",
        weight: 1 
    },{
        label: "70m - 90m",
        type: "rectangle",
        fillColor: "#fe913c",
        weight: 1 
    },{
        label: "+90m",
        type: "rectangle",
        fillColor: "#ff0303",
        weight: 1 
    }]
}).addTo(map); //https://github.com/ptma/Leaflet.Legend
