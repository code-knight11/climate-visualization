# import openmeteo_requests
# import requests_cache
# import pandas as pd
# from retry_requests import retry

# # Use a JSON cache backend instead of SQLite
# cache_session = requests_cache.CachedSession(
#     cache_name='.cache', 
#     backend='filesystem',         # Specify JSON backend for caching
#     expire_after=3600
# )

# # Setup retry on errors
# retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
# openmeteo = openmeteo_requests.Client(session=retry_session)

# # Set API parameters
# url = "https://api.open-meteo.com/v1/forecast"
# params = {
#     "latitude": 52.52,
#     "longitude": 13.41,
#     "hourly": "temperature_2m",
#     "models": "ecmwf_ifs025"
# }

# # Make the API request
# responses = openmeteo.weather_api(url, params=params)
# print(responses)

# # Process the first location. Add a for-loop for multiple locations or models if needed
# response = responses[0]
# print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
# print(f"Elevation {response.Elevation()} m asl")
# print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
# print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

# # Process hourly data. The order of variables must match the requested variables
# hourly = response.Hourly()
# hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()

# hourly_data = {
#     "date": pd.date_range(
#         start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
#         end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
#         freq=pd.Timedelta(seconds=hourly.Interval()),
#         inclusive="left"
#     )
# }
# hourly_data["temperature_2m"] = hourly_temperature_2m

# # Create a DataFrame
# hourly_dataframe = pd.DataFrame(data=hourly_data)
# print(hourly_dataframe)

# # Save the dataframe to a JSON file
# hourly_dataframe.to_json("hourly_weather_data.json", orient="records", date_format="iso")

import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry

# Use a JSON cache backend instead of SQLite
cache_session = requests_cache.CachedSession(
    cache_name='.cache', 
    backend='filesystem',  # Specify filesystem backend for caching
    expire_after=3600
)

# Setup retry on errors
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

# List of global coordinates (latitude, longitude)
# For global coverage, you'd want to define a grid. Here's a simplified example.
global_coordinates = [
    {"latitude": -90, "longitude": 0},    # South Pole
    {"latitude": 0, "longitude": 0},      # Equator (Prime Meridian)
    {"latitude": 52.52, "longitude": 13.41},  # Berlin
    {"latitude": 37.77, "longitude": -122.42}, # San Francisco
    {"latitude": 90, "longitude": 0}      # North Pole
]

# Placeholder to store results for all locations
global_weather_data = []
url = "https://api.open-meteo.com/v1/forecast"

# Loop through each coordinate and fetch weather data
for location in global_coordinates:
    params = {
        "latitude": location["latitude"],
        "longitude": location["longitude"],
        "hourly": "temperature_2m",
        "models": "ecmwf_ifs025"
    }
    
    # Make the API request
    responses = openmeteo.weather_api(url, params=params)
    
    # Process first location response
    response = responses[0]
    
    # Process hourly data for this location
    hourly = response.Hourly()
    hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
    
    hourly_data = {
        "location": f"{response.Latitude()}°N, {response.Longitude()}°E",
        "date": pd.date_range(
            start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
            end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
            freq=pd.Timedelta(seconds=hourly.Interval()),
            inclusive="left"
        ),
        "temperature_2m": hourly_temperature_2m
    }
    
    # Append to global weather data
    global_weather_data.append(hourly_data)

# Convert global weather data to a DataFrame
global_weather_df = pd.concat([
    pd.DataFrame(data={
        "location": data["location"],
        "date": data["date"],
        "temperature_2m": data["temperature_2m"]
    }) for data in global_weather_data
], ignore_index=True)

print(global_weather_df)

# Save the global weather dataframe to a JSON file
global_weather_df.to_json("global_weather_data.json", orient="records", date_format="iso")
