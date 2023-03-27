# GraphQL & OpenTelemetry

Demo application for GraphQL and OpenTelemetry


## Run it

Start the containers (OTel collector, Jaeger):

```
docker compose up
```

Jaeger UI: http://localhost:16686/


Start the graphql server:

```
cd ./graphql-server
node server-express.js 
```

GraphQL server running on http://localhost:4000/graphql


Start the react app (front-end):

```
cd ./frontend/last-minute-deals
npm start
```

The app runs on: http://localhost:3000/





## Todo

* Dockerize the react app (see https://jsramblings.com/dockerizing-a-react-app/) so that everything can be started from Docker
* Add prometheus and grafana for monitoring
* Add Tyk


