let earthquake_json = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function createMap(quakes){
    let map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
    
    let baseMaps = {
            "Map": map
            };

    let overlayMaps = {
            "Earthquakes": quakes
        };

    let myMap = L.map("map", {
        center: [0, 0],
        zoom: 2,
        layers: [map, quakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let limits = ["-10", "10", "30", "50", "70", "90"];
        let colors = ["#98EE00", "#D4EE00", "#EECC00", "#EE9C00", "#EA822C", "#EA2C2C"];
        // Add legend title
        div.innerHTML += '<b>Magnitude</b><br>';
        for (let i = 0; i < limits.length; i++) {
            div.innerHTML +=
                '<i style="background-color:' + colors[i] + '"></i> ' +
                limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
        }
        return div;
    };

  legend.addTo(myMap);
}


function color(info){
    if (info <= 10){
        return "Green";
    }
    else if(info > 10 && info <= 30){
        return "GreenYellow";
    }
    else if(info > 30 && info <= 50){
        return "Yellow";
    }
    else if(info > 50 && info <= 70){
        return 'Orange';
    }
    else if(info > 70 && info <= 90){
        return "OrangeRed";
    }
    else{
        return "Red";
    }
}

function radius(magnitude){
    if (magnitude > 0){
        return magnitude*50000;
    }
    else{
        return 0.0001;
    }
}

function features(response){
    let temp = response.features;
    let quakeMarkers = [];
        for (let index = 0; index < temp.length; index++) {
            let one_quake = temp[index];
            let quakeMarker = L.circle([one_quake.geometry.coordinates[1], one_quake.geometry.coordinates[0]],{
                color: "black",
                fillColor: color(one_quake.geometry.coordinates[2]),
                fillOpacity: 1.0,
                radius: radius(one_quake.properties.mag)
            })
            .bindPopup(`<h1>${one_quake.properties.place}</h1> <hr> <h3>Magnitude: ${one_quake.properties.mag} | Depth: ${one_quake.geometry.coordinates[2]}</h3>`);
            quakeMarkers.push(quakeMarker);
        }
        let quakes = L.layerGroup(quakeMarkers)
        createMap(quakes);
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(features);
