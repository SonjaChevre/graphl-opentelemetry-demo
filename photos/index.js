require('./tracer');
const express = require('express');
const app = express();
const path = require('path');

// Define mock data for photos
const photos = [
  {
    id: 3573351,
    country: "CH",
    src: "/pictures/ch-01.jpeg",
    title: "Lake Geneva",
  },
  {
    id: 3573352,
    country: "CH",
    src: "/pictures/ch-02.jpeg",
    title: "Lucerne",
  },
  {
    id: 3573353,
    country: "CH",
    src: "/pictures/ch-03.jpeg",
    title: "Zurich",
  }, 
  {
    id: 3573354,
    country: "UK",
    src: "/pictures/uk-01.jpeg",
    title: "Lake Geneva",
  },
  {
    id: 3573355,
    country: "UK",
    src: "/pictures/uk-02.jpeg",
    title: "Lucerne",
  },
  {
    id: 3573356,
    country: "UK",
    src: "/pictures/uk-03.jpeg",
    title: "Zurich",
  },
  {
    id: 3573394,
    country: "NL",
    src: "/pictures/nl-01.jpeg",
    title: "Lake Geneva",
  },
  {
    id: 3572355,
    country: "NL",
    src: "/pictures/nl-02.jpeg",
    title: "Lucerne",
  },
  {
    id: 3573356,
    country: "NL",
    src: "/pictures/nl-03.jpeg",
    title: "Zurich",
  }
];



// Serve static files from the "pictures" subfolder
app.use('/pictures', express.static(path.join(__dirname, 'pictures')));

// Define the API endpoint
app.get('/pictures/:countryCode', (req, res) => {
  const { countryCode } = req.params;

  // Check if the country code is valid
  if (!['UK', 'CH', 'NL'].includes(countryCode)) {
    return res.status(400).json({ error: `No pictures available for country code ${countryCode}` });
  }

  // Filter the photos by country code
  const filteredPhotos = photos.filter(photo => photo.country === countryCode);

  // Return the filtered photos
  res.json({ photos: filteredPhotos });
});

// Start the server
app.listen(3001, () => {
  console.log('Server started on port 3001');
});
