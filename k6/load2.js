import http from "k6/http";
import { check, sleep } from "k6";
import { randomIntBetween, randomItem } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

export let options = {
  vus: 10, // Number of virtual users
  duration: "20m", // Duration of the test
  thresholds: {
    http_req_duration: ["p(95)<5000"], // 95% of requests must complete within 5 seconds
  },
};

const baseUrl = "http://tyk-gateway:8080/countries/";

export function setup() {
  // Generate an array of random queries to use during the test
  const queries = generateRandomQueries(100);
  return { queries };
}

export default function (data) {
  // Select a random query from the array generated during setup
  const query = randomItem(data.queries);
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = http.post(baseUrl, JSON.stringify({ query: query }), params);
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
  sleep(1);
}

export function teardown(data) {
  // Cleanup logic goes here
}

function generateRandomQueries(count) {
  const queries = [];
  for (let i = 0; i < count; i++) {
    const query = generateRandomQuery();
    queries.push(query);
  }
  return queries;
}

function generateRandomQuery() {
  const queryType = randomItem(["continent", "country", "language"]);
  switch (queryType) {
    case "continent":
      return `query { continent(code: "${generateRandomId()}") { name } }`;
    case "country":
      return `query { country(code: "${generateRandomId()}") { name } }`;
    case "language":
      return `query { language(code: "${generateRandomId()}") { name } }`;
    default:
      throw new Error(`Unknown query type: ${queryType}`);
  }
}

function generateRandomId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 3; i++) {
    id += chars.charAt(randomIntBetween(0, chars.length - 1));
  }
  return id;
}
