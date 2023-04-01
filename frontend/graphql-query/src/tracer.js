import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { Resource } from '@opentelemetry/resources';
import { OTLPTraceExporter  } from "@opentelemetry/exporter-trace-otlp-http";
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';

const { getWebAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-web');


const collectorOptions = {
    url: "http://localhost:4318/v1/traces", 
    headers: {
    "Content-Type": "application/json", 
    'Access-Control-Allow-Headers': '*',
    'X-CSRF': '1',
  },
    concurrencyLimit: 10,
  };


// Trace provider (Main aplication trace)
const provider = new WebTracerProvider({
    resource: new Resource({
      "service.name": "graphql-query",
    }
    )});

// Exporter (opentelemetry collector hidden behind bff proxy)
const exporter = new OTLPTraceExporter (collectorOptions);

// Instrumentation configurations for frontend
const fetchInstrumentation = new FetchInstrumentation({
    // ignoreUrls : ["https://some-ignored-url.com"]
  });
  
  fetchInstrumentation.setTracerProvider(provider);
  
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  
  provider.register({
    contextManager: new ZoneContextManager(),
  });
  



  registerInstrumentations({
    instrumentations: [
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: [
           /.+/g, //Regex to match your backend urls. This should be updated.
        ]
      }),
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [
           /.+/g, //Regex to match your backend urls. This should be updated.
        ]
      }),
    ],
  });

  
const contextManager = new ZoneContextManager();

provider.register({
  contextManager,
  propagator: new CompositePropagator({
    propagators: [
      new W3CBaggagePropagator(),
      new W3CTraceContextPropagator(),
    ],
  }),
});