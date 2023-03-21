import React from 'react';
import { useQuery, gql } from '@apollo/client';



const GET_COUNTRY = gql`
  
 query GetCountries {
  countries {
    name
capital
emoji
  }
}
`;


function DisplayCountry() {
  const { loading, error, data } = useQuery(GET_COUNTRY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return data.countries.map(({ name, capital, emoji }) => (
    <div key="{code}">
      <h3>{emoji} {name}</h3>
      <p>
      <b>Capital: </b>
      {capital}
      </p>
      <br />
    </div>
  ));
}

function Home() {
  return (
      <div>
        <h2>Last-Minute Deals 🏖️</h2>
        <br/>
        <DisplayCountry />
      </div>
  );
}

export default Home;
