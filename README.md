# express-pulse 🫀

[![NPM Version](https://img.shields.io/npm/v/express-pulse?style=flat-square&color=cb3837)](https://www.npmjs.com/package/express-pulse)
[![NPM Downloads](https://img.shields.io/npm/dw/express-pulse?style=flat-square&color=33a9dc)](https://www.npmjs.com/package/express-pulse)
[![Dependencies](https://img.shields.io/badge/dependencies-0--none-brightgreen?style=flat-square)](https://www.npmjs.com/package/express-pulse)
[![Bundle Size](https://img.shields.io/npm/unpacked-size/express-pulse?style=flat-square&color=44cc11)](https://bundlephobia.com/package/express-pulse)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/express-pulse?style=flat-square&color=yellow)](https://github.com/your-username/express-pulse/blob/main/LICENSE)

A lightweight, highly concurrent infrastructure monitoring middleware for Express.js. 

`express-pulse` provides a plug-and-play `/health` endpoint that pings your underlying databases and caches simultaneously, returning a load-balancer-friendly JSON report. It is built with zero dependency bloat—you bring your own database drivers, and we handle the monitoring.

## Features
* **Zero Dependency Bloat:** We don't install heavy database drivers. You pass in your existing instances.
* **Concurrent Execution:** Pings all services simultaneously using `Promise.all` for zero-bottleneck monitoring.
* **Failsafe Design:** If a database goes down, your server doesn't crash. The endpoint safely reports a `down` status.
* **Extensible Architecture:** Easily write your own monitors for custom third-party APIs or SQL databases.

## Installation

```bash
npm install express-pulse
```

## Quick Start

Initialize the middleware and pass in your active database or cache clients. 

```typescript
import express from 'express';
import { MongoClient } from 'mongodb';
import { expressPulse, MongoMonitor, RedisMonitor } from 'express-pulse';

const app = express();

// 1. Initialize your databases (Native or Mongoose)
const mongoClient = new MongoClient('mongodb://localhost:27017');
mongoClient.connect();

// 2. Attach the middleware
app.use(expressPulse({
    endpoint: '/health', // Optional: defaults to '/health'
    monitors: [
        new MongoMonitor('Primary-DB', mongoClient),
        // new RedisMonitor('Cache', redisClient)
    ]
}));

app.listen(3000, () => console.log('Server is running...'));
```

## Expected Output

When a load balancer, Kubernetes readiness probe, or monitoring tool hits `GET /health`, it receives:

```json
{
  "status": "ok",
  "timestamp": "2026-05-22T12:39:25.108Z",
  "services": [
    {
      "name": "Primary-DB",
      "status": "up",
      "latency": 54
    }
  ]
}
```
## Available Built-In Monitors

`express-pulse` includes zero-dependency adapters for the industry's most popular infrastructure. Just pass your existing, initialized client into the constructor.

**NoSQL & Caches:**
* `MongoMonitor` (Supports Native MongoDB & Mongoose)
* `RedisMonitor` (Supports Redis & ioredis)

**Relational Databases (SQL):**
* `PostgresMonitor` (pg)
* `MysqlMonitor` (mysql2)
* `MssqlMonitor` (mssql)

**Message Brokers & Event Streams:**
* `RabbitMqMonitor` (amqplib - safely uses channels)
* `KafkaMonitor` (kafkajs - cluster metadata ping)

**Search Engines & Cloud:**
* `ElasticsearchMonitor` (@elastic/elasticsearch)
* `S3Monitor` (AWS S3 / Cloud Storage via `HEAD` requests)

**External Services:**
* `HttpMonitor` (Generic REST API monitor via native `fetch`)

## Writing Custom Monitors

Because `express-pulse` is built using the Strategy Pattern, you can easily monitor anything by implementing the `PulseMonitor` interface.

```typescript
import { PulseMonitor, ServiceHealth } from 'express-pulse';

class StripeApiMonitor implements PulseMonitor {
    async check(): Promise<ServiceHealth> {
        const start = performance.now();
        try {
            await fetch('https://api.stripe.com/health');
            return { name: 'Stripe-API', status: 'up', latency: Math.round(performance.now() - start) };
        } catch (error) {
            return { name: 'Stripe-API', status: 'down', latency: 0 };
        }
    }
}

// Add it to your array!
app.use(expressPulse({
    monitors: [new StripeApiMonitor()]
}));
```

## License
MIT