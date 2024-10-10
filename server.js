import axios from "axios";
import fs from "fs";
import { configDotenv } from "dotenv";
configDotenv();

// Replace with your CDS API URL and API key
const API_URL = "https://cds.climate.copernicus.eu/api/v2";
const API_KEY = `${process.env.CDS_UID}:${process.env.CDS_PAT}`;

async function fetchTemperatureData() {
  try {
    // Define the parameters for the CDS request
    const params = {
      product_type: "reanalysis",
      variable: "2m_temperature",
      year: "2024",
      month: "10",
      day: "09",
      time: ["00:00", "06:00", "12:00", "18:00"],
      format: "netcdf",
      area: [90, -180, -90, 180], // Global coverage
    };

    const response = await axios.post(`${API_URL}/tasks`, params, {
      headers: {
        Authorization: `Basic ${Buffer.from(API_KEY).toString("base64")}`,
      },
      responseType: "stream",
    });

    // Save the data to a .nc file
    const writer = fs.createWriteStream("download.nc");
    response.data.pipe(writer);

    writer.on("finish", () => {
      console.log("Data downloaded successfully as download.nc");
    });
  } catch (error) {
    console.error("Error fetching temperature data:", error.message);
  }
}

fetchTemperatureData();
