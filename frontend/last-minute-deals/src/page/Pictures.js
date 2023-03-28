import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_PHOTOS = gql`
  query GetPhotos($code: ID!) {
    getCountry(code: $code) {
      name
      code
      photos {
        src
        country
      }
    }
  }
`;

function Pictures() {
  const [selectedCountry, setSelectedCountry] = useState('CH');
  const { loading, error, data } = useQuery(GET_PHOTOS, {
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
            <a href="#" onClick={() => setSelectedCountry('UK')}>
              United Kingdom
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setSelectedCountry('NL')}>
              Netherlands
            </a>
          </li>
        </ul>
      </nav>
      <h1>Photos from {data.getCountry.name}</h1>
      {data.getCountry.photos.map(photo => (
        <div key={photo.src}>
          <img src={`http://localhost:3001${photo.src}`} alt={photo.country} />
          <p>Country: {data.getCountry.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Pictures;
