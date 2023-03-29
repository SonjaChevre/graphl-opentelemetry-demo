package main

import (
	"log"
	"net/http"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
)

// DummyPlugin starts a new span, prints a message and sets an attribute
func DummyPlugin(rw http.ResponseWriter, r *http.Request) {
	_, span := otel.Tracer("GoPlugin").Start(r.Context(), "DummyPlugin")
	defer span.End()
	log.Println("DummyPlugin called")
	span.SetAttributes(attribute.String("tyk.go_plugin", "just_testing"))
}

func main() {}
