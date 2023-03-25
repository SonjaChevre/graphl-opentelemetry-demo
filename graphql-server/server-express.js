require('./tracer');
require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
const cors = require('cors');


// Define our GraphQL schema
const schema = buildSchema(`
  type Photo {
    id: ID!
    photographer: String
    src: String
    width: Int
    height: Int
  }

  type Query {
    searchPhotos(query: String!): [Photo]
  }
`);

// Define the root resolver for our GraphQL API
const root = {
  searchPhotos: async ({ query }) => {
    const response = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=10`, {
      headers: {
        Authorization: process.env.AUTH_TOKEN,
      },
    });

    return response.data.photos.map((photo) => ({
      id: photo.id,
      photographer: photo.photographer,
      src: photo.src.medium,
      width: photo.width,
      height: photo.height,
    }));
  },
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