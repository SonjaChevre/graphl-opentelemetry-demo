import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_DEALS = gql`
  query GetDeals($code: ID!) {
    getDeal(code: $code) {
      country {
        name
        code
      }
      price
      days
    }
  }
`;

function Deals() {
  const [selectedCountry, setSelectedCountry] = useState('CH');
  const { loading, error, data } = useQuery(GET_DEALS, {
    variables: { code: selectedCountry },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <nav>
        <ul>
          <li>
            <a href="#" onClick={() => setSelectedCountry('CH')}>
              Switzerland
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setSelectedCountry('IT')}>
              Italy
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setSelectedCountry('NL')}>
              Netherlands
            </a>
          </li>
        </ul>
      </nav>
      <h1>Deal for {data.getDeal.country.name}</h1>
      <p>Price: {data.getDeal.price}</p>
      <p>Duration: {data.getDeal.days} days</p>
      <p><a href="">BOOK NOW</a></p>
    </div>
  );
}

export default Deals;
