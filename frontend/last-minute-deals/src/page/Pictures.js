import React from 'react';
import { useQuery, gql } from '@apollo/client';

export const GET_PHOTOS = gql`
  query {
    searchPhotos(query: "nature") {
      id
      photographer
      src
      width
      height
    }
  }
`;

function Pictures() {
  const { loading, error, data } = useQuery(GET_PHOTOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      {data.searchPhotos.map(photo => (
        <div key={photo.id}>
          <img src={photo.src} alt={photo.photographer} />
          <p>Photographer: {photo.photographer}</p>
          <p>Width: {photo.width}</p>
          <p>Height: {photo.height}</p>
        </div>
      ))}
    </div>
  );
}

export default Pictures;