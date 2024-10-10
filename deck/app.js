import { Deck, HeatmapLayer } from '@deck.gl/core';
import { MapboxLayer } from '@deck.gl/mapbox';
import mapboxgl from 'mapbox-gl';

// Set up the Mapbox token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

// Create the base Mapbox map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-122.4, 37.8], // Starting position [lng, lat]
  zoom: 10, // Starting zoom level
});

// Sample heatmap data (latitude, longitude, and intensity)
const sampleData = [
  { position: [-122.4, 37.8], weight: 0.5 },
  { position: [-122.45, 37.85], weight: 0.7 },
  { position: [-122.35, 37.78], weight: 0.9 },
  { position: [-122.5, 37.75], weight: 0.3 }
];

// Define the HeatmapLayer with custom shaders
const heatmapLayer = new HeatmapLayer({
  id: 'heatmap',
  data: sampleData,
  getPosition: d => d.position,
  getWeight: d => d.weight,
  radiusPixels: 60,

  // Custom shaders for heatmap
  getShaders: () => ({
    vs: `
      attribute vec3 positions;
      varying vec2 vUV;
      void main(void) {
        gl_Position = vec4(positions, 1.0);
        vUV = positions.xy * 0.5 + 0.5;
      }
    `,
    fs: `
      precision highp float;
      varying vec2 vUV;
      uniform float intensity;

      void main(void) {
        float heat = intensity * smoothstep(0.0, 1.0, distance(vUV, vec2(0.5)));
        gl_FragColor = vec4(heat, 0.0, 1.0 - heat, 1.0); // Color interpolation
      }
    `
  }),

  // Custom uniform for shader
  updateTriggers: {
    intensity: 1
  },

  intensity: 1.0
});

// Initialize deck.gl and add the layer
const deck = new Deck({
  canvas: 'map',
  width: '100%',
  height: '100%',
  mapbox: map,
  initialViewState: {
    longitude: -122.4,
    latitude: 37.8,
    zoom: 10,
    pitch: 30,
    bearing: 0
  },
  layers: [heatmapLayer]
});

// Add deck.gl layer to the Mapbox map
map.on('load', () => {
  map.addLayer(new MapboxLayer({ id: 'heatmap', deck }));
});
