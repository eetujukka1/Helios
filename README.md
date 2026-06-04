# Helios

> **Active Development** — Helios is in early development. Expect breaking changes, incomplete features, and rough edges. Contributions and feedback are welcome.

A web crawling management tool for running scrapes through rotating proxies across configured target domains.

## Features

- Manage **targets** (domains to crawl) and **proxies**
- Track crawled pages, HTTP responses, and collected files
- Dashboard UI for monitoring and configuration
- Per-user target and proxy assignments

## Stack

| Layer          | Tech                              |
| -------------- | --------------------------------- |
| Frontend       | React, Vite, TypeScript, Radix UI |
| Backend        | Node.js, Express, TypeScript      |
| Database       | PostgreSQL (Prisma ORM)           |
| Infrastructure | Docker Compose, Nginx             |

## Loader concurrency

Loader processes use BullMQ worker concurrency so one process can handle multiple network-bound page-load jobs at the same time. Set `LOADER_CONCURRENCY` to a positive integer to control the per-process concurrency; when omitted, Helios defaults to `5`.

Start with the default and tune gradually while monitoring backend latency, Redis load, database connections, S3 write throughput, proxy capacity, and target-site behavior. This setting is per loader process, so total queue concurrency is roughly `LOADER_CONCURRENCY` multiplied by the number of running loader replicas.

## Local development environment

Create a local environment file from the example before starting Docker Compose:

```sh
cp .env.example .env
```

The development Compose file starts the application plus local PostgreSQL, Redis, and MinIO services:

```sh
docker compose -f compose.dev.yaml up --build
```

By default, the app is available through Nginx at <http://localhost:8080>, PostgreSQL is exposed on `localhost:5432`, Redis is exposed on `localhost:6379`, the MinIO S3 API is exposed on `localhost:9000`, and the MinIO console is exposed on <http://localhost:9001>. Adjust connection credentials in `.env` if you need to override the defaults.
