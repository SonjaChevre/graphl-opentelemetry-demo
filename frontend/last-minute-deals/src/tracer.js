import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';

const setupTracer = () => {
    const provider = new WebTracerProvider();

    provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    
    provider.register({
      // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
      contextManager: new ZoneContextManager(),
    });
    
    // Registering instrumentations
    registerInstrumentations({
      instrumentations: [
        new DocumentLoadInstrumentation(),
        new UserInteractionInstrumentation(),
        new XMLHttpRequestInstrumentation(),
        new FetchInstrumentation()
      ],
    });
    
}


setupTracer();

