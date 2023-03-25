/*tracing.js*/
const opentelemetry = require("@opentelemetry/sdk-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { GraphQLInstrumentation } = require('@opentelemetry/instrumentation-graphql');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node'); 


// Receiving service
const { context, propagation, trace } = require('@opentelemetry/api');

// Assume "input" is an object with 'traceparent' & 'tracestate' keys
const input = {};

// Extracts the 'traceparent' and 'tracestate' data into a context object.
//
// You can then treat this context as the active context for your
// traces.
let activeContext = propagation.extract(context.active(), input);


const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "http://localhost:4318/v1/traces",
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {},
  }),
  instrumentations: [
      new GraphQLInstrumentation({
        // allowAttributes: true,
        // depth: 2,
        // mergeItems: true,
      }),
      new HttpInstrumentation(),
      new ExpressInstrumentation()
      ],
  resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'graphql-service',
      }),
});
sdk.start();