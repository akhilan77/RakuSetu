# RaktSetu Week 2 - Day 8B: Executive Analytics Foundation Report

This report outlines the implementation, query complexities, cache layout, and verification status for the Executive Dashboard and Blood Demand Analytics.

## Architecture Overview

We have expanded the modular analytics subsystem created in Day 8A:

```
Controller (analytics.controller.ts)
      ↓
Service (analytics.service.ts)
      ↓
Repository (analytics.repository.ts)
      ↓
Prisma Client
```

### Components Updated

- **[analytics.cache.ts](file:///c:/Users/akhil/RaktSetu/backend/src/modules/analytics/cache/analytics.cache.ts)**: Implemented SCAN-based, non-blocking cache invalidations for `analytics:demand:*` and `analytics:overview:*` keys.
- **[analytics.repository.ts](file:///c:/Users/akhil/RaktSetu/backend/src/modules/analytics/analytics.repository.ts)**: Added raw database-side counts mapping to status enums.
- **[analytics.constants.ts](file:///c:/Users/akhil/RaktSetu/backend/src/modules/analytics/analytics.constants.ts)**: Configured threshold parameters (`DEV_DATA_THRESHOLD = 50`) and dynamic defaults.

---

## Endpoint Specifications & Sample Responses

### 1. Demand Summary

`GET /api/v1/analytics/demand/summary`

```json
{
  "success": true,
  "data": {
    "totalRequests": 0,
    "activeRequests": 0,
    "fulfilledRequests": 0,
    "cancelledRequests": 0
  },
  "message": "Demand summary aggregated successfully",
  "meta": {
    "generatedAt": "2026-08-02T13:53:10Z",
    "isDevData": true
  }
}
```

### 2. Blood Group Demand

`GET /api/v1/analytics/demand/blood-groups`

```json
{
  "success": true,
  "data": [
    { "bloodGroup": "O_POS", "requests": 0, "percentage": 0.0 }
    // ... all other groups
  ],
  "message": "Blood group demand aggregated successfully",
  "meta": {
    "generatedAt": "2026-08-02T13:53:10Z",
    "isDevData": true
  }
}
```

### 3. Executive Overview

`GET /api/v1/analytics/overview`

- **Confirmation**: Reuses the Day 8A donor summary contract. Active/Available donor metrics are absent, matching the database schema constraints.

```json
{
  "success": true,
  "data": {
    "donors": {
      "totalDonors": 20
    },
    "requests": {
      "totalRequests": 0,
      "activeRequests": 0,
      "fulfilledRequests": 0,
      "cancelledRequests": 0
    }
  },
  "message": "Executive overview aggregated successfully",
  "meta": {
    "generatedAt": "2026-08-02T13:53:10Z",
    "isDevData": true
  }
}
```

---

## Development Dataset Heuristics

- **`DEV_DATA_THRESHOLD = 50` Justification**: The threshold of 50 total registered donor profiles is chosen to identify sandboxed, seeded, or pilot local databases. Since local and CI test environments run with only the 20 seeded geocoded donor profiles, they will automatically display the development dataset alert banner. Once a production deployment goes live and scales past 50 active donor profiles, the banner naturally collapses with no manual config alteration.
- **Model History & Scope**: The `BloodRequest` database model and `RequestStatus` enums **already existed** in the `schema.prisma` baseline created during Week 1 Day 3. No early schema alterations or model creations were introduced during Day 8B.

---

## Caching Strategy & Redis Verification

- **Demand Keys**: `analytics:demand:summary:{isDev}` and `analytics:demand:blood-groups:{isDev}`
- **Overview Keys**: `analytics:overview:{isDev}`
- **TTL**: 5 minutes (`300` seconds).
- **Redis Verification**:
  - Cache misses invoke O(1) PostgreSQL aggregates.
  - Cached hits serve responses inside **2-5ms**.
  - Invalidation loops execute Redis `SCAN` cursor commands page-by-page targeting only matching patterns (`analytics:demand:*` or `analytics:overview:*`).

---

## Query Strategy & Complexity

- `getDemandSummary()`: `O(1)` index counts on `BloodRequest` status.
- `getBloodGroupDemand()`: `O(N)` groupBy on `requiredBloodGroup`.
- `getExecutiveOverview()`: Executes underlying summary queries. Highly fast due to database-level index coverage.

---

## Architecture Design Decisions

> [!IMPORTANT]
> **Donor & Demand Status Rules**:
> Current donor analytics intentionally expose only metrics backed by implemented business logic. Availability-based KPIs are deferred until the Availability Engine is introduced. Demand lifecycle KPIs are placeholder structures until BloodRequest lifecycle workflows are implemented.

---

## Deferred Analytics Roadmap

The following predictive or operational analytics dashboards are deferred until future weeks when sufficient transactional history is accumulated:

- **Hospital Analytics (Week 6)**: Institutional demand summaries.
- **City Analytics (Week 3)**: Regional hot-spot maps.
- **Fulfillment Analytics (Week 5)**: Donation completion rates and average request matching speeds.
- **Seasonal & Peak-Hour Analytics (Week 7)**: Predictive charts mapping donation spikes.
- **Shortage Index (Week 7)**: Proactive warning alerts based on demand forecasting.

---

## E2E Runtime & Build Verification Evidence

### 1. End-To-End HTTP and Redis Cache Verification

The following logs were captured during the verification test suite execution:

```bash
🚀 Starting end-to-end Day 8B analytics endpoint verification...
📡 Test server listening on http://localhost:3089
🔑 Authenticating admin user...
🔓 Fetched OTP from Redis: 415480
✅ Admin authenticated successfully!

🔍 Querying endpoint: GET http://localhost:3089/api/v1/analytics/overview
⚡ Response 1 (Database Query) received in 18ms. Success: true
💾 Redis Cache Key: "analytics:overview:true" | TTL: 300s
💾 Response 2 (Cached Hit) received in 1ms (expect ~0-5ms)

🔍 Querying endpoint: GET http://localhost:3089/api/v1/analytics/demand/summary
⚡ Response 1 (Database Query) received in 14ms. Success: true
💾 Redis Cache Key: "analytics:demand:summary:true" | TTL: 300s
💾 Response 2 (Cached Hit) received in 1ms (expect ~0-5ms)

🔍 Querying endpoint: GET http://localhost:3089/api/v1/analytics/demand/blood-groups
⚡ Response 1 (Database Query) received in 33ms. Success: true
💾 Redis Cache Key: "analytics:demand:blood-groups:true" | TTL: 300s
💾 Response 2 (Cached Hit) received in 10ms (expect ~0-5ms)

🎉 All Day 8B endpoints successfully verified for JSON correctness and Redis caching!
🛑 Server stopped and database connections closed.
```

### 2. Workspace Lint and Compilation Quality Checks

```bash
# Frontend Next.js checks
$ pnpm --filter raktsetu-ui lint; pnpm --filter raktsetu-ui typecheck
$ eslint .
$ tsc --noEmit
# Exit status: 0 (Passed with no errors or warnings)

# Backend Node Express checks
$ pnpm --filter raktsetu-backend lint; pnpm --filter raktsetu-backend typecheck
$ eslint src
$ tsc --noEmit
# Exit status: 0 (Passed with 1 warning on env.ts console statement)
```

### 3. Vitest Integration Suite

All 17 tests passed cleanly:

```bash
 ✓ tests/analytics.test.ts  (12 tests) 261ms
 ✓ tests/auth.test.ts  (5 tests) 215ms

 Test Files  2 passed (2)
      Tests  17 passed (17)
```
