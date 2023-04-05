# GraphQL & OpenTelemetry

Demo application for GraphQL and OpenTelemetry

## Add domain alias in your host file

```
127.0.0.1       tyk-gateway
127.0.0.1       graphql-server
```

## Build Tyk POC version

Tyk version TBD add link to branch
Tag docker container as tyk-opentelemetry

```
docker build --platform linux/amd64 . -t tyk-otel
```

## Add Tyk Dashboard license

in .env:
```
TYK_DASHBOARD_LICENSE=""
```


## Run it

Start the demo:

```
docker compose up
```

Observability stack:
- Jaeger: http://localhost:16686/
- Prometheus: http://localhost:9090/

API stack:
- Tyk Gateway runs on: http://localhost:8080/
- Tyk Dashboard runs on: http://localhost:3010/

Application: 
- GraphQL server running on http://localhost:4000/graphql
- Weather REST API runs on http://localhost:3001/, example: http://localhost:3001/weather/uk
- The react runs on: http://localhost:3000/

## Run load test with K6

```
docker compose run  k6 run /scripts/load.js
```


