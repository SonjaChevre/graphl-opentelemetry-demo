require('./tracer');
require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
const cors = require('cors');


// Define the schema
const schema = buildSchema(`
  type Photo {
    id: ID!
    photographer: String
    src: String
    width: Int
    height: Int
  }

  type Country {
    name: String
    code: String
    photos: [Photo]
  }

  type Query {
    getCountries: [Country]
  }
`);

// Define the root resolver
const root = {
  getCountries: async () => {
    const response = await axios.post('https://countries.trevorblades.com/graphql', {
      query: `
        query {
          countries {
            name
            code
          }
        }
      `
    });

    const countries = response.data.data.countries;

    return countries.map(async country => ({
      name: country.name,
      code: country.code,
      photos: async () => {
        const pexelsResponse = await axios.get(`https://api.pexels.com/v1/search?query=${country.name}&per_page=10&page=1`, {
          headers: {
            Authorization: process.env.AUTH_TOKEN
          }
        });

        return pexelsResponse.data.photos.map(photo => ({
          id: photo.id,
          photographer: photo.photographer,
          src: photo.src.medium,
          width: photo.width,
          height: photo.height
        }));
      }
    }));
  }
};



// Create an Express app
const app = express();
app.use(cors());

// Add a GraphQL API endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
);

// Start the server
app.listen(4000, () => {
  console.log('GraphQL server running on http://localhost:4000/graphql');
});


