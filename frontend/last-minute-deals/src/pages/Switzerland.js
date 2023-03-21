import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_SWITZERLAND = gql`
query {
    country(code: "CH") {
      name
      native
      capital
      currency
      emoji
      phone
      languages {
        code
        name
      }
      continent {
        name
      }
    }
  }
`;


function DisplaySwitzerlandInfo() {


    const { loading, error, data } = useQuery(GET_SWITZERLAND);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;
  
    return  (
      <div key="{data.country.code}">
        <h3>{data.country.emoji} {data.country.name}</h3>
        <p>
        <b>Capital: </b>
        {data.country.capital}
        </p>
        <br />
      </div>
    );
  }

function Switzerland() {
    return (
        <div>
          <h2>Last-Minute Deals for Switzerland 🏖️</h2>
          <br/>
          <DisplaySwitzerlandInfo />
        </div>
    );
}

export default Switzerland;
