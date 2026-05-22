# express-pulse 🫀

[![npm version](https://img.shields.io/npm/v/express-pulse.svg)](https://www.npmjs.com/package/express-pulse)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

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
Quick Start
Initialize the middleware and pass in your active database or cache clients.

TypeScript
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
Expected Output
When a load balancer, Kubernetes readiness probe, or monitoring tool hits GET /health, it receives:

JSON
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
Available Built-In Monitors
Currently supports zero-dependency adapters for:

MongoDB (MongoMonitor): Supports both the native mongodb driver and mongoose instances.

Redis (RedisMonitor): Supports standard redis and ioredis clients.

Writing Custom Monitors
Because express-pulse is built using the Strategy Pattern, you can easily monitor anything by implementing the PulseMonitor interface.

TypeScript
import { PulseMonitor, ServiceHealth } from 'express-pulse';

class StripeApiMonitor implements PulseMonitor {
    async check(): Promise<ServiceHealth> {
        const start = performance.now();
        try {
            await fetch('[https://api.stripe.com/health](https://api.stripe.com/health)');
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
License
ISC


Once you have that fully pasted and saved, open your terminal and run:

1. `npm login`
2. `npm publish`

Your package will be officially live right after that!