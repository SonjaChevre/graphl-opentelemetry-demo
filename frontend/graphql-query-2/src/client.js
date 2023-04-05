import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://tyk-gateway:8080/graphql-express/',
  cache: new InMemoryCache()
});

export default client;
