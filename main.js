import L from "leaflet";
import { addressPoints } from "./address-points";
import "./leaflet-heat";
import "leaflet-velocity";

// heatConfig()

var map = L.map("map").setView([50.5, 30.5], 5);

// var osm = L.tileLayer(
//   "https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=a02EpMnbbgHAvRWD6pxM",
//   {
//     attribution:
//       '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
//   }
// ).addTo(map);

var osm = L.tileLayer(
  "https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=a02EpMnbbgHAvRWD6pxM",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
  }
);
osm.addTo(map);

var baseLayers = {
  OSM: osm,
};

const layerControl = L.control.layers(baseLayers).addTo(map);

const mapAddPoints = addressPoints.map(function (p) {
  return [p[0], p[1]];
});
// var heat = L.heatLayer(mapAddPoints).addTo(map);

fetch("global_weather_data.json")
  .then((response) => response.json())
  .then((ecmwfData) => {
    const heatData = ecmwfData.map((data) => {
      const lat = parseFloat(data.location.split("°N")[0]);
      const lng = parseFloat(data.location.split(", ")[1].split("°E")[0]);
      const intensity = data.temperature_2m;
      return [lat, lng, intensity];
    });
    console.log(heatData);

    L.heatLayer(
      heatData
      //   {
      //   radius: 25, // Radius of heatmap points
      //   blur: 15, // Blur factor for smoothness
      //   maxZoom: 5, // Maximum zoom level for intensity
      //   gradient: {
      //     // Temperature color gradient
      //     0.4: "blue",
      //     0.6: "cyan",
      //     0.7: "lime",
      //     0.8: "yellow",
      //     1.0: "red",
      //   },
      // }
    ).addTo(map);
    // L.heatLayer([
    //   [50.5, 30.5,1 ], // lat, lng, intensity
    //   // [50.6, 30.4, 0.5],
    // ], {radius: 50,blur:40,maxZoom:5}).addTo(map);
  });

fetch("wind-global.json")
  .then((response) => response.json())
  .then((data) => {
    var velocityLayer = L.velocityLayer({
      displayValues: true,
      displayOptions: {
        velocityType: "Global Wind",
        position: "bottomleft",
        emptyString: "No wind data",
      },
      data: data,
      maxVelocity: 20,
    });

    layerControl.addOverlay(velocityLayer, "Wind - Global");
  })
  .catch((error) => console.error("Error loading wind data:", error));

// fetch("global_weather_data.json")
//   .then((repsonse) => response.json())
//   .then((data) => {
//     const deckData = data.map((data) => {
//       const lat = parseFloat(data.location.split("°N")[0]);
//       const lng = parseFloat(data.location.split(", ")[1].split("°E")[0]);
//       const intensity = data.temperature_2m;
//       return { position: [lng, lat], weight: intensity };
//     });

//     const deckgl = new Deck({
//       initialViewState: {
//         longitude: 0,
//         latitude: 0,
//         zoom: 2,
//         pitch: 0,
//         bearing: 0,
//       },
//       layers: [
//         new HeatmapLayer({
//           id: "heatmapLayer",
//           data: deckData,
//           getPosition: (d) => d.position, // Position of each point (lng, lat)
//           getWeight: (d) => d.weight, // Temperature intensity
//           radiusPixels: 50, // Radius of heat points
//           intensity: 1, // Adjust to control heat spread
//           threshold: 0.05, // Minimum intensity to show
//           aggregation: "MEAN", // Aggregation method (mean, sum, etc.)
//         }),
//       ],
//       container: "map", // ID of the container where the map is rendered
//     });
//   });

// layerControl.addOverlay(velocityLayer, "Wind - Global");
