require('./tracer');
require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
const cors = require('cors');

// Define the schema
const schema = buildSchema(`


  type Country {
    name: String
    code: ID!
    capital: String
    currency: String
  }

  type Deal {
    price: Float
    days: Int
    country: Country
  }

  type Query {
    getCountries: [Country]
    getCountry(code: ID!): Country
    getDeal(code: ID!): Deal
    getRandomDeal: Deal
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
      capital: country.capital
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
  
      return {
        name: country.name,
        code: country.code,
        capital: country.capital,
        currency: country.currency
      };
    } catch (error) {
      console.error(`Error: ${error.message}`);
      if (error.response) {
        console.error(`GraphQL Error: ${error.response.data.errors[0].message}`);
      }
      return null;
    }
  },

  getDeal: async ({ code }) => {
    try {
      const country = await root.getCountry({ code }); // call getCountry resolver
  
      const price = Math.floor(Math.random() * (4000 - 10 + 1) + 10);
      const days = Math.floor(Math.random() * (14 - 2 + 1) + 2);
  
      return {
        price,
        days,
        country
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