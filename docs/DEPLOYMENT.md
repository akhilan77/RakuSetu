# Deployment Blueprint

RaktSetu targets hosting architectures built on virtual private servers (VPS) and containers.

## Production Blueprint

```mermaid
graph LR
    User -->|Internet| Caddy[Caddy SSL Gateway]
    Caddy -->|Reverse Proxy| NextJS[Next.js PWA Standalone]
    Caddy -->|Reverse Proxy| API[Express API Node]
    API -->|Async Jobs| Worker[BullMQ Worker Instance]
    API & Worker -->|Read/Write| DB[(PostgreSql + PostGIS)]
    API & Worker -->|Job Data| Redis[(Redis Cache)]
    API & Worker -->|Files| MinIO[(MinIO Object Store)]
```

## Infrastructure Settings

### 1. Containers (Docker Compose)
- Split into services: `frontend` (Next.js), `backend` (Express app), `worker` (BullMQ workers), `postgis`, `redis`, and `minio`.

### 2. Reverse Proxy (Caddy)
- Automates Let's Encrypt SSL/TLS setups.
- Handles HSTS and Content Security Policies.

### 3. Backups
- Automatic nightly database dumps mapped and pushed directly to object storage.
- 30-day retention policies enforced.
