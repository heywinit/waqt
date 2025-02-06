# Build stage
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache gcc musl-dev

# Set working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=1 GOOS=linux go build -a -o waqt-api ./cmd/server

# Final stage
FROM alpine:latest

# Install runtime dependencies
RUN apk --no-cache add ca-certificates tzdata postgresql-client

# Set working directory
WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/waqt-api .
COPY --from=builder /app/migrations ./migrations

# Copy config files
COPY .env.example .env

# Expose port
EXPOSE 8080

# Set environment variables
ENV GO_ENV=production

# Create non-root user
RUN adduser -D -g '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Command to run the application
CMD ["./waqt-api"] 