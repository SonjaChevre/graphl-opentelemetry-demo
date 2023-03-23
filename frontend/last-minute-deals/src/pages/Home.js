import React from 'react';
import { useQuery, gql } from '@apollo/client';



const GET_COUNTRY = gql`
query {
  
  books {
    id
    name
    authors {
      id
      name
    }
  }
}

`;


function DisplayBooks() {
  const { loading, error, data } = useQuery(GET_COUNTRY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return data.books.map(({ id, name}) => (
    <div key="{id}">
      <h3>{name}</h3>
    </div>
  ));
}

function Home() {
  return (
      <div>
        <h2>Books</h2>
        <br/>
        <DisplayBooks />
      </div>
  );
}

export default DisplayBooks;
