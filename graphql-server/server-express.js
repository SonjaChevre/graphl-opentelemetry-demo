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
    country: ID
    src: String
    title: String
  }

  type Country {
    name: String
    code: ID!
    capital: String
    currency: String
    photos: [Photo]
  }

  type Query {
    getCountries: [Country]
    getCountry(code: ID!): Country
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
            capital
            currency
          }
        }
      `
    });

    const countries = response.data.data.countries;

    return countries.map(async country => ({
      name: country.name,
      code: country.code,
      currency: country.currency,
      capital: country.capital,
      photos: async () => {
        const photoResponse = await axios.get(`http://host.docker.internal:3001/pictures/${country.code}`);

        return photoResponse.data.photos.map(photo => ({
          id: photo.id,
          country: photo.country,
          src: photo.src,
          title: photo.title
        }));
      }
    }));
  },
  getCountry: async ({ code }) => {
    try {
      const response = await axios.post('https://countries.trevorblades.com/graphql', {
        query: `
          query($code: ID!) {
            country(code: $code) {
              name
              code
              capital
              currency
            }
          }
        `,
        variables: {
          code
        }
      });
  
      const country = response.data.data.country;
  
      const photoResponse = await axios.get(`http://host.docker.internal:3001/pictures/${code}`);
      const photos = photoResponse.data.photos.map(photo => ({
        id: photo.id,
        country: photo.country,
        src: photo.src,
        title: photo.title
      }));
  
      return {
        name: country.name,
        code: country.code,
        capital: country.capital,
        currency: country.currency,
        photos
      };
    } catch (error) {
      console.error(`Error: ${error.message}`);
      if (error.response) {
        console.error(`GraphQL Error: ${error.response.data.errors[0].message}`);
      }
      return null;
    }
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
