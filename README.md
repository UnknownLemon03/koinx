# Crypto Stats API & Worker

A microservice-based Node.js application for tracking cryptocurrency statistics like real-time prices and standard deviation, using Kafka, MongoDB, and Redis. Includes a REST API and a Kafka consumer worker.

## Project Structure

```
.
├── api-server         # Express API service
├── worker-server      # Kafka consumer service
├── docker-compose.yml # Docker-based orchestration
└── README.md
```

## Features

* REST API for real-time price and historical deviation
* Kafka producer/consumer setup for background processing
* Redis caching
* MongoDB storage
* Fully containerized with Docker

## Setup

### Option 1: Run Using Docker Compose (Recommended)

#### Start the stack (with local `docker-compose.yml`)

```bash
docker compose up --build
```

This will:

* Start the `api-server`
* Start the `worker-server`
* Launch Kafka, Redis, and MongoDB containers

### Option 1B: Run Docker Compose Directly from GitHub (No clone needed)

If you don’t want to clone the repository, you can run the whole stack directly using the raw `docker-compose.yml` URL:

```bash
docker compose -f <(curl -s https://raw.githubusercontent.com/UnknownLemon03/koinx/main/docker-compose.yml) up
```

Or to run in detached/background mode:

```bash
docker compose -f <(curl -s https://raw.githubusercontent.com/UnknownLemon03/koinx/main/docker-compose.yml) up -d
```

## Option 2: Run Locally with Node.js

#### Prerequisites

* Node.js (v18 or higher)
* MongoDB, Redis, Kafka (either via Docker or local install)

#### Setup Steps

#### 1. Copy `.env.example` in both `api-server/` and `worker-server/` as `.env`

#### 2. Update each `.env` file with proper values:

* `MONGO_URI`
* `REDIS_URL`
* `KAFKA_BROKER`
* etc.

#### 3. Install dependencies:

```bash
cd api-server
npm install

cd ../worker-server
npm install
```

#### 4. Start dev servers:

```bash
cd api-server
npm run dev
```

```bash
cd worker-server
npm run dev
```

## API Endpoints

| Method | Endpoint              | Description                                                |
| ------ | --------------------- | ---------------------------------------------------------- |
| GET    | `/hello`              | Health check endpoint                                      |
| GET    | `/stats?coin=btc`     | Fetches real-time price data for the specified coin        |
| GET    | `/deviation?coin=btc` | Computes std. deviation over last 100 entries for the coin |

---

## Technologies Used

* **Node.js**, **Express.js**
* **Kafka** (for messaging)
* **MongoDB** (for persistent storage)
* **Redis** (for caching)
* **Docker Compose** (for orchestration)

