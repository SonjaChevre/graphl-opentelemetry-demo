require('./tracer');
require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
const cors = require('cors');

// Define the schema
const schema = buildSchema(`
type Query {
  continent(code: ID!): Continent!
  continents(filter: ContinentFilterInput = {}): [Continent!]!
  countries(filter: CountryFilterInput = {}): [Country!]!
  country(code: ID!): Country!
  language(code: ID!): Language!
  languages(filter: LanguageFilterInput = {}): [Language!]!
}

type Mutation {
  default: String
}

type Src { original: String
  large2x: String
  large: String
  medium: String
  small: String
  portrait: String
  landscape: String
  tiny: String 
}

type Photo { 
  id: Int
  width: Int
  height: Int
  url: String
  photographer: String
  photographer_url: String
  photographer_id: Int
  avg_color: String
  liked: Boolean
  alt: String
  src: Src 
}

type Continent {
  code: ID!
  countries: [Country!]!
  name: String!
}

input ContinentFilterInput {
  code: StringQueryOperatorInput
}

type Country {
  capital: String
  code: ID!
  continent: Continent!
  currencies: [String!]!
  currency: String
  emoji: String!
  emojiU: String!
  languages: [Language!]!
  name: String!
  native: String!
  phone: String!
  phones: [String!]!
  states: [State!]!
  photos: [Photo]
  weather: Weather
}

input CountryFilterInput {
  code: StringQueryOperatorInput
  continent: StringQueryOperatorInput
  currency: StringQueryOperatorInput
}

type Language {
  code: ID!
  name: String!
  native: String!
  rtl: Boolean!
}

input LanguageFilterInput {
  code: StringQueryOperatorInput
}

type State {
  code: String
  country: Country!
  name: String!
}

input StringQueryOperatorInput {
  eq: String
  in: [String!]
  ne: String
  nin: [String!]
  regex: String
}

type Weather {
  temperature: Int!
  description: String!
}

`);

const root = {
  continent: async ({ code }) => {
    try {
      const response = await axios.post('https://countries.trevorblades.com/graphql', {
        query: `
          query {
            continent(code: "${code}") {
              code
              name
              countries {
                code
                name
                native
                capital
                currency
                languages {
                  code
                  name
                  native
                }
              }
            }
          }
        `
      });

      return response.data.data.continent;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch continent data');
    }
  },

  continents: async ({ filter }) => {
    try {
      let query = `
        query {
          continents {
            code
            name
            countries {
              code
              name
              native
              capital
              currency
              languages {
                code
                name
                native
              }
            }
          }
        }
      `;
  
      if (filter && filter.code) {
        query = `
          query {
            continent(code: "${filter.code.eq}") {
              code
              name
              countries {
                code
                name
                native
                capital
                currency
                languages {
                  code
                  name
                  native
                }
              }
            }
          }
        `;
      }
  
      const response = await axios.post('https://countries.trevorblades.com/graphql', { query });
  
      return response.data.data.continents;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch continents data');
    }
  },

  country: async ({ code }) => {
    try {
      // Get country data from TrevorBlades API
      const response = await axios.post('https://countries.trevorblades.com/graphql', {
        query: `
          query {
            country(code: "${code}") {
              capital
              code
              continent {
                code
                name
              }
              currencies
              emoji
              emojiU
              languages {
                code
                name
                native
                rtl
              }
              name
              native
              phone
              phones
              states {
                code
                name
              }
            }
          }
        `
      });
  
      // Retrieve photos from Pexels API
      const pexelsResponse = await axios.get(`https://api.pexels.com/v1/search?query=${response.data.data.country.name}&per_page=5&page=1`, {
        headers: {
          Authorization: "3rOF8TRDTo1GrBwhN9HHqAxxCPOhPnEtIfX45liqNY6niTumwwEgju4M"
        }
      });
  
      const photos = pexelsResponse.data.photos;
  
      // Retrieve weather from internal API
      const weatherResponse = await axios.get(`http://localhost:3001/weather/${code}`);
      const weather = weatherResponse.data;
  
      // Combine all data into a single object and return
      const countryData = {
        ...response.data.data.country,
        photos,
        weather
      };
  
      return countryData;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch country data');
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