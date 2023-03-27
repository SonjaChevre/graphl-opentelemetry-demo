require('./tracer');
const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the "pictures" subfolder
app.use('/pictures', express.static(path.join(__dirname, 'pictures')));

// Define the API endpoint
app.get('/pictures/:countryCode', (req, res) => {
  const { countryCode } = req.params;

  // Check if the country code is valid
  if (!['uk', 'ch', 'nl'].includes(countryCode)) {
    return res.status(400).json({ error: `No pictures available for country code ${countryCode}` });
  }

  // Return the pictures for the given country code
  const pictures = [
    `/pictures/${countryCode}-01.jpeg`,
    `/pictures/${countryCode}-02.jpeg`,
    `/pictures/${countryCode}-03.jpeg`
  ];
  res.json({ pictures });
});

// Start the server
app.listen(3001, () => {
  console.log('Server started on port 3001');
});
