import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50, // number of virtual users
  duration: '15m', // duration of the test
};

export default function () {
  // Define the GraphQL queries to send
  let queries = [
    `query {
      getCountries {
        name
        code
        capital
      }
    }`,
    `query {
      getCountry(code: "US") {
        name
        code
        capital
        photos {
          title
          src
        }
      }
    }`,
    `query {
      getDeal(code: "GB") {
        price
        days
        country {
          name
          code
        }
      }
    }`,
    `query {
      getRandomDeal {
        price
        days
        country {
          name
          code
          capital
          currency
        }
      }
    }`
  ];

  // Select a random query
  let query = queries[Math.floor(Math.random() * queries.length)];

  // Send the GraphQL query to the endpoint
  let response = http.post(
    'http://tyk-gateway:8080/country/',
    JSON.stringify({ query: query }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  // Check if the response is valid
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response is not empty': (r) => r.body.length > 0,
  });

  // Wait for 1 second before sending the next request
  sleep(1);
}
