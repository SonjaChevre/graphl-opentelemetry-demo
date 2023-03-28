# GraphQL & OpenTelemetry

Demo application for GraphQL and OpenTelemetry


## Build the containers

Photos rest API:

```
cd ./photos 
docker build --tag nodejs-photos .
```

GraphQL server:

```
cd ./graphql-server 
docker build --tag nodejs-graphql .
```



## Run it

Start the containers (OTel collector, Jaeger, nodejs-photos):

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
Photo REST API runs on http://localhost:3001/, example: http://localhost:3001/pictures/UK





## Todo

* Dockerize the react app (see https://jsramblings.com/dockerizing-a-react-app/) so that everything can be started from Docker
* Add prometheus and grafana for monitoring
* Add Tyk


