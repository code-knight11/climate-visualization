fetch("global_weather_data.json")
  .then((repsonse) => response.json())
  .then((data) => {
    const deckData = data.map((data) => {
      const lat = parseFloat(data.location.split("°N")[0]);
      const lng = parseFloat(data.location.split(", ")[1].split("°E")[0]);
      const intensity = data.temperature_2m;
      return { position: [lng, lat], weight: intensity };
    });

    const deckgl = new Deck({
      initialViewState: {
        longitude: 0,
        latitude: 0,
        zoom: 2,
        pitch: 0,
        bearing: 0,
      },
      layers: [
        new HeatmapLayer({
          id: "heatmapLayer",
          data: deckData,
          getPosition: (d) => d.position, // Position of each point (lng, lat)
          getWeight: (d) => d.weight, // Temperature intensity
          radiusPixels: 50, // Radius of heat points
          intensity: 1, // Adjust to control heat spread
          threshold: 0.05, // Minimum intensity to show
          aggregation: "MEAN", // Aggregation method (mean, sum, etc.)
        }),
      ],
      container: "map", // ID of the container where the map is rendered
    });
  });
