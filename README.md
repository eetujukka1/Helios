# Helios

> **Active Development** — Helios is in early development. Expect breaking changes, incomplete features, and rough edges. Contributions and feedback are welcome.

A web crawling management tool for running scrapes through rotating proxies across configured target domains.

## Features

- Manage **targets** (domains to crawl) and **proxies**
- Track crawled pages, HTTP responses, and collected files
- Dashboard UI for monitoring and configuration
- Per-user target and proxy assignments

## Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, TypeScript, Radix UI |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Prisma ORM) |
| Infrastructure | Docker Compose, Nginx |