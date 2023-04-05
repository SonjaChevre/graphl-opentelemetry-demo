import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import client from "./client.js";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QUERIES = [
  {
    name: 'getCountries',
    query: gql`
    {
      getCountries {
        code
        name
      }
    }
    `
  },
  {
    name: 'getCountry (code: "CH")',
    query: gql`
    { country (code: "CH") {
      code
      name
      capital
      weather {
        temperature
      }
    }`
    }
    ,
    {
      name: 'getCountry (code: "IT")',
      query: gql`
      { country (code: "IT") {
        code
        name
        capital
        weather {
          temperature
        }
      }`
      }
];

function QueryButton({ queryIndex, activeIndex, onClick }) {
  const { name } = QUERIES[queryIndex];
  const isActive = queryIndex === activeIndex;

  return (
    <button className={isActive ? 'active' : ''} onClick={() => onClick(queryIndex)}>
      {name}
    </button>
  );
}

function App() {
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const { loading, error, data } = useQuery(QUERIES[activeQueryIndex].query, {fetchPolicy: "no-cache"});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const activeQuery = QUERIES[activeQueryIndex];

  return (
    <div>
      <h1>GraphQL queries</h1>

      <div className="buttons">
        {QUERIES.map((_, index) => (
          <QueryButton key={index} queryIndex={index} activeIndex={activeQueryIndex} onClick={setActiveQueryIndex} />
        ))}
      </div>

      <div className="details">
        <div className="query">
          <h2>Query:</h2>
          <SyntaxHighlighter language="graphql" style={materialDark}>
            {activeQuery.query.loc.source.body}
          </SyntaxHighlighter>
        </div>

        <div className="response">
          <h2>Response:</h2>
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

export default App;
