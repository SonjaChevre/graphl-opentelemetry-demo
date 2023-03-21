import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { Resource } from '@opentelemetry/resources';
import { OTLPTraceExporter  } from "@opentelemetry/exporter-trace-otlp-http";
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
      "service.name": "frontend",
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
    new FetchInstrumentation()
    ]
});

