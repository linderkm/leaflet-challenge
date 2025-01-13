// Get data from USGS GeoJson feed
// Calling on the endpoint that returns all earthquake data from the past seven days
const weeklyEndpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const dailyEndpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


// create map object
var map = L.map("map",{
    center: [39.7392, -104.9903], //using coordinates of Denver, Colorado as map center on page load
    zoom: 5 
}); // (1)

//create tile layer and assign it to map object
var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map); // (1)


// function to convert depth value from geoJSON into color code to suply to Leaflet marker builder
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

d3.json(weeklyEndpoint).then(function(response) {

    let features = response.features;

    for (i = 0; i < features.length; i++) {
        let coordinates = features[i].geometry.coordinates.slice(0,2).reverse();
        let depth = features[i].geometry.coordinates[2];
        let magnitude = features[i].properties.mag;
        let place = features[i].properties.place;

        L.circle(coordinates, {
            color: "black",
            fillColor: depthToColor(depth),
            fillOpacity: 0.9,
            radius: magnitude * 10000
        }).addTo(map).bindPopup(`Location: ${place}</b><br>Magnitude: ${magnitude}</b><br>Depth: ${depth}m`); //(2)
    };
});


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
}).addTo(map); //(3)




// potential source for basemap option control: https://github.com/consbio/Leaflet.Basemaps



