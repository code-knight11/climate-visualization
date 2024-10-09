import L from "leaflet";
import { addressPoints } from "./address-points";
import "./leaflet-heat";
import "leaflet-velocity";

// heatConfig()

var map = L.map("map").setView([38.690003, -100.809859], 5);

// var osm = L.tileLayer(
//   "https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=a02EpMnbbgHAvRWD6pxM",
//   {
//     attribution:
//       '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
//   }
// ).addTo(map);

var osm = L.tileLayer("https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=a02EpMnbbgHAvRWD6pxM", {
  attribution:
    '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
});
osm.addTo(map);

var baseLayers = {
  OSM: osm,
};

const layerControl = L.control.layers(baseLayers).addTo(map);

const mapAddPoints = addressPoints.map(function (p) {
  return [p[0], p[1]];
});
var heat = L.heatLayer(mapAddPoints).addTo(map);

fetch("wind-global.json")
  .then((response) => response.json())
  .then((data) => {
    // var velocityLayer = L.velocityLayer({
    //   displayValues: true,
    //   displayOptions: {
    //     velocityType: "GBR Wind",
    //     position: "bottomleft",
    //     emptyString: "No wind data",
    //     showCardinal: true,
    //   },
    //   data: data,
    //   maxVelocity: 10,
    // });

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

// layerControl.addOverlay(velocityLayer, "Wind - Global");
