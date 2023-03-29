import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ApolloProvider, ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import "./tracer.js";
import './index.css';



// Create an ApolloClient instance that connects to our GraphQL server
const client = new ApolloClient({
  uri: 'http://tyk-gateway:8080/country/',
  cache: new InMemoryCache(),
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
     <BrowserRouter>
    <App />
    </BrowserRouter>
  </ApolloProvider>,
);