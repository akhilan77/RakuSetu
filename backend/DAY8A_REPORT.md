# RaktSetu Week 2 - Day 8A: Donor Analytics Foundation Report

This report outlines the technical implementation, query execution strategies, caching mechanisms, and validation status for the read-only Donor Analytics module.

## Architecture Overview

The Donor Analytics engine is built as a modular module inside the backend, adhering to RaktSetu's design guidelines:

```
Controller (analytics.controller.ts)
      ↓
Service (analytics.service.ts)
      ↓
Repository (analytics.repository.ts)
      ↓
Prisma Client
```

### Components Created

- **[analytics.cache.ts](file:///c:/Users/akhil/RaktSetu/backend/src/modules/analytics/cache/analytics.cache.ts)**: Handles Redis TTL caches (5-minute expiration) and provides non-blocking cursor-based invalidations via Redis `SCAN`.
- **[analytics.repository.ts](file:///c:/Users/akhil/RaktSetu/backend/src/modules/analytics/analytics.repository.ts)**: Implements aggregate queries using Prisma `groupBy` and count metrics.
- **[analytics.service.ts](file:///c:/Users/akhil/RaktSetu/backend/src/modules/analytics/analytics.service.ts)**: Coordinates calls between routing controllers and caching layers.
- **[analytics.controller.ts](file:///c:/Users/akhil/RaktSetu/backend/src/modules/analytics/analytics.controller.ts)**: Validates input, constructs response wrappers, and injects sandbox/development dataset metadata indicators.
- **[analytics.routes.ts](file:///c:/Users/akhil/RaktSetu/backend/src/modules/analytics/analytics.routes.ts)**: Exposes endpoints protected by JWT and role authentication.
- **[analytics.constants.ts](file:///c:/Users/akhil/RaktSetu/backend/src/modules/analytics/analytics.constants.ts)**: Centralizes configuration and message strings.

---

## Endpoint Specifications & Sample Responses

### 1. Donor Summary

`GET /api/v1/analytics/donors/summary`

- **Description**: Returns the raw count of all registered donor profiles.
- **Sample JSON**:

```json
{
  "success": true,
  "data": {
    "totalDonors": 20
  },
  "message": "Donor summary aggregated successfully",
  "meta": {
    "generatedAt": "2026-08-02T10:19:53Z",
    "isDevData": true
  }
}
```

### 2. Blood Group Distribution

`GET /api/v1/analytics/donors/blood-groups`

- **Description**: Returns aggregate counts and percentages for all blood groups.
- **Sample JSON**:

```json
{
  "success": true,
  "data": [
    { "bloodGroup": "O_POS", "count": 5, "percentage": 25.0 },
    { "bloodGroup": "O_NEG", "count": 2, "percentage": 10.0 },
    { "bloodGroup": "A_POS", "count": 4, "percentage": 20.0 },
    { "bloodGroup": "A_NEG", "count": 2, "percentage": 10.0 },
    { "bloodGroup": "B_POS", "count": 3, "percentage": 15.0 },
    { "bloodGroup": "B_NEG", "count": 1, "percentage": 5.0 },
    { "bloodGroup": "AB_POS", "count": 2, "percentage": 10.0 },
    { "bloodGroup": "AB_NEG", "count": 1, "percentage": 5.0 }
  ],
  "message": "Blood group distribution aggregated successfully",
  "meta": {
    "generatedAt": "2026-08-02T10:19:53Z",
    "isDevData": true
  }
}
```

### 3. Eligibility Analytics

`GET /api/v1/analytics/donors/eligibility`

- **Description**: Returns counts and percentages for eligible vs deferred donors.
- **Sample JSON**:

```json
{
  "success": true,
  "data": [
    { "status": "Eligible", "count": 15, "percentage": 75.0 },
    { "status": "Deferred", "count": 5, "percentage": 25.0 }
  ],
  "message": "Eligibility summary aggregated successfully",
  "meta": {
    "generatedAt": "2026-08-02T10:19:53Z",
    "isDevData": true
  }
}
```

### 4. Geographic Distribution

`GET /api/v1/analytics/donors/geography`

- **Description**: Groups and counts donor profiles by city, district, and state.
- **Sample JSON**:

```json
{
  "success": true,
  "data": [
    {
      "city": "Vellore",
      "district": "Vellore District",
      "state": "Tamil Nadu",
      "count": 20
    }
  ],
  "message": "Geographic distribution aggregated successfully",
  "meta": {
    "generatedAt": "2026-08-02T10:19:53Z",
    "isDevData": true
  }
}
```

### 5. Donor Retention

`GET /api/v1/analytics/donors/retention`

- **Description**: Returns repeat donation performance metrics and retention rate.
- **Sample JSON**:

```json
{
  "success": true,
  "data": {
    "firstTimeDonors": 0,
    "repeatDonors": 0,
    "averageDonations": 0,
    "retentionRate": 0
  },
  "message": "Retention statistics aggregated successfully",
  "meta": {
    "generatedAt": "2026-08-02T10:19:53Z",
    "isDevData": true
  }
}
```

### 6. Monthly Donation Trends

`GET /api/v1/analytics/donors/monthly`

- **Description**: Returns a 12-month timeline of total donations and unique active donors.
- **Sample JSON**:

```json
{
  "success": true,
  "data": [
    { "month": "2026-07", "donationCount": 0, "uniqueDonors": 0 }
    // ... 12 months timeline entries
  ],
  "message": "Monthly donation trends aggregated successfully",
  "meta": {
    "generatedAt": "2026-08-02T10:19:53Z",
    "isDevData": true
  }
}
```

---

## Caching Strategy

- **Key Convention**: `analytics:donors:{endpoint}:{isDevMode}`
- **TTL**: 5 minutes (`300` seconds).
- **Example Redis Key**: `analytics:donors:summary:true`
- **Example Redis Value**:
  ```json
  { "totalDonors": 20 }
  ```
- **Non-Blocking Invalidation**: `invalidateDonorAnalytics` uses a cursor-based `SCAN` matching `analytics:donors:*`. Surrounding application caches are left completely untouched, and no blocking `KEYS` command is issued. The scanning loop properly processes cursor positions page-by-page until the cursor returns to `'0'`.

---

## Query Strategy & Performance Considerations

- **Index-Backed Grouping**: Added database indexes to `city`, `district`, and `state` columns in `DonorProfile` via database migration `add_geography_indexes` to ensure aggregate queries scale linearly as data size grows.
- **Complexity Analysis**:
  - `getDonorSummary()`: `O(1)` index-only count.
  - `getBloodGroupDistribution()`: `O(N)` grouping (optimizable via indexes on `bloodGroup`).
  - `getEligibilitySummary()`: `O(1)` index range scan on `nextEligibleAt`.
  - `getGeographicDistribution()`: `O(log N)` index-backed groupings.
  - `getRetentionStats()`: `O(N)` database aggregation on `Donation` records.
  - `getMonthlyDonationTrends()`: `O(N)` scan on `Donation` matching the last 12 months.

---

## Future Dependency Matrix

| Endpoint        | Target Module                  | Future Core Feature               | Current Status                                                    |
| --------------- | ------------------------------ | --------------------------------- | ----------------------------------------------------------------- |
| `/summary`      | Donor Onboarding (Day 10)      | Live count of profiles            | Operational                                                       |
| `/blood-groups` | Donor Onboarding (Day 10)      | Group mixes                       | Operational                                                       |
| `/eligibility`  | Availability Engine (Week 4)   | Age, Weight, questionnaire checks | Real query, empty-safe (bases on `nextEligibleAt` column)         |
| `/geography`    | Geocoded Registration (Week 3) | Map pins, GIS coverage            | Operational (seeding Vellore records)                             |
| `/retention`    | Donation Recording (Week 5)    | Return rate metrics               | Real query, empty-safe (evaluates to 0 until donations exist)     |
| `/monthly`      | Donation Recording (Week 5)    | Chronological bar/line metrics    | Real query, empty-safe (returns empty list until donations exist) |

---

## Verification Status

### Unit & Integration Tests (Vitest)

```bash
 ✓ tests/analytics.test.ts  (8 tests) 65ms
 ✓ tests/auth.test.ts  (5 tests) 129ms
```

### Build & Compilation Checks

- **ESLint**: Clean pass (0 errors).
- **TypeScript**: Clean pass (`tsc --noEmit` exits with 0 on both backend and frontend).
- **Production Build**: Compiles successfully.
