require('./tracer');
const express = require('express');
const app = express();
const path = require('path');
  

// Define the API endpoint
app.get('/weather/:countryCode', (req, res) => {
  const { countryCode } = req.params;

  if (['IT', 'FR'].includes(countryCode)) {
    return res.status(400).json({ error: `No weather information available for country code ${countryCode}` });
  }

  if (['DE'].includes(countryCode)) {
    
  }

  // Generate random temperature between -5 and 32
  const temperature = Math.floor(Math.random() * (32 - (-5) + 1) + (-5));

  // Generate random weather description
  const weatherDescriptions = ['snow', 'rain', 'sunny'];
  const description = weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)];

  // Construct the weather JSON object
  const randomWeather = {
    temperature: temperature,
    description: description
  };

  // Return the weather
  res.json({ weather: randomWeather });
});

// Start the server
app.listen(3001, () => {
  console.log('Server started on port 3001');
});
