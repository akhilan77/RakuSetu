# RaktSetu Week 2 - Day 8C: Donor Registration API & Real-Time Analytics Pipeline

This report details the design, implementation, and verification evidence for the Donor Registration APIs and real-time healthcare analytics cache pipeline.

## API Architecture

We have implemented the new donor registration module inside the existing modular layout:

```
Controller (donor.controller.ts)
      ↓
Service (donor.service.ts)
      ↓
Repository (donor.repository.ts)
      ↓
Prisma + PostGIS Raw Queries
```

### Endpoints Implemented

- `POST /api/v1/donors`: Creates a donor profile for the authenticated user, updates user name, recalculates eligibility, updates PostGIS point location, invalidates caches, and returns the dynamic donor rank in the city.
- `GET /api/v1/donors/me`: Returns the authenticated donor profile including user email, name, and phone.
- `PATCH /api/v1/donors/me`: Updates editable donor profile fields, recalculating eligibility and invalidating caches if relevant inputs change.

---

## Database Unique Constraint Enforcement

The database ensures that each user has exactly one donor profile via the unique constraint in [schema.prisma](file:///c:/Users/akhil/RaktSetu/backend/prisma/schema.prisma):

```prisma
model DonorProfile {
  id     String @id @default(uuid())
  userId String @unique
  ...
}
```

If a user tries to call `POST /donors` a second time, the repository throws a unique constraint exception (Prisma code `P2002`), which the service catches and translates into a standardized `409 Conflict` response:

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "User already has a registered donor profile",
    "details": {}
  }
}
```

---

## Eligibility Rules & Analytics Mapping

For Day 8C, input parameters are limited to DOB and Weight:

- **Eligible**: Age between 18 and 65, and Weight $\ge 50$ kg.
- **Temporarily Deferred**: Age $< 18$, Age $> 65$, or Weight $< 50$ kg.

> [!NOTE]
> Medical eligibility based on the 12-question health screening is intentionally deferred until the Donor Registration Wizard (Day 11+) when those inputs become available. The eligibility engine has been designed to be extended without changing API contracts. The general analytics eligibility dashboard (`/analytics/donors/eligibility`) will show `0` counts for `PERMANENTLY_DEFERRED` and generic `DEFERRED` categories until the health screening wizard is introduced.

---

## PostGIS Geography Storage

Locations are persisted as geographical `POINT(longitude latitude)` within the PostGIS geography coordinate system (SRID 4326).
Coordinates are saved to the database via raw PostGIS SQL execution inside the repository:

```sql
UPDATE "DonorProfile" SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE id = $3
```

This is verified on runtime. When checking the database for the registered test profile, the coordinate precision is fully preserved:
`locationText: "POINT(79.1304 12.9272)"`

---

## Real-Time Analytics Cache Invalidation Flow

Upon successful donor profile creation or update:

1. The database commits the changes.
2. The controller signals cache eviction:
   - `analyticsCacheService.invalidateDonorAnalytics()` (deletes keys matching `analytics:donors:*`)
   - `analyticsCacheService.invalidateOverviewAnalytics()` (deletes keys matching `analytics:overview:*`)
3. Demand analytics caches (`analytics:demand:*`) are left untouched.
4. Subsequent calls to `/analytics/donors/summary` or `/analytics/overview` trigger a cache miss, load the fresh counts, and update the dashboard instantly without waiting for the 5-minute TTL.

---

## Sample Request & Response

### Request (`POST /api/v1/donors`)

```json
{
  "fullName": "Jane Registered",
  "dob": "2001-08-02",
  "gender": "FEMALE",
  "weight": 62.5,
  "bloodGroup": "O_POS",
  "city": "Vellore",
  "district": "Vellore District",
  "state": "Tamil Nadu",
  "latitude": 12.9272,
  "longitude": 79.1304,
  "locationConsent": true,
  "notificationConsent": true
}
```

### Response (`201 Created`)

```json
{
  "success": true,
  "data": {
    "donorId": "e1bbcd87-0b1a-4d26-a05e-8557b772c91a",
    "eligibility": "ELIGIBLE",
    "donorNumberInCity": 21
  },
  "message": "Donor profile registered successfully"
}
```

---

## E2E Runtime Verification Evidence

### 1. E2E Integration Pipeline Execution Logs

The E2E test script output verifies the registration flow, PostGIS coordinates storage, selective cache evictions, and real-time dashboard updates:

```bash
🚀 Starting E2E Day 8C donor registration and real-time analytics verification...
📡 Test server listening on http://localhost:3091
🔑 Registering user with ADMIN role & Authenticating...
✅ User authenticated successfully!

⚡ Warming up analytics caches...
📊 Initial donor count before registration: 20
💾 Cache key "analytics:donors:summary:true" exists: true

📝 Submitting donor registration POST /api/v1/donors ...
✅ Registration Response:
{
  "success": true,
  "data": {
    "donorId": "c5e71944-7f4e-4bd4-8fcc-54450536e7d4",
    "eligibility": "ELIGIBLE",
    "donorNumberInCity": 21
  },
  "message": "Donor profile registered successfully"
}
🗺️ PostGIS Geography location: POINT(79.1304 12.9272)

🔍 Verifying cache key deletions in Redis...
💾 Cache key "analytics:donors:summary:true" exists after registration: false

🔄 Querying analytics summary immediately (bypassing 5m cache TTL)...
📊 Updated donor count after registration: 21
✅ Real-time pipeline works perfectly! Count incremented instantly.

👥 Attempting duplicate donor registration...
👥 Duplicate registration status code: 409

🎉 Day 8C E2E Healthcare Analytics Pipeline is fully verified!
🛑 Server stopped and connections closed.
```

### 2. Authentication System Regression Check Evidence

The following E2E output verifies that existing OTP logic, profile retrieval, refresh token rotation, and protected analytics endpoints authenticate and authorize without regression:

```bash
🚀 Running regression tests for authentication system...
📡 Test server listening on http://localhost:3093
1. Initiating OTP request...
🔑 OTP retrieved: 479901
2. Verifying OTP...
✅ OTP Verification passed, access token retrieved.
3. Fetching /auth/me profile...
✅ Profile retrieved: Name="Jane Registered", Phone="+919999999999"
4. Performing refresh token rotation...
✅ Refresh token rotated successfully.
5. Querying protected analytics endpoint with rotated token...
✅ Protected analytics query succeeded (Total Donors = 20).

🎉 Auth regression tests passed completely! No regressions found.
🛑 Server stopped and connections closed.
```

### 3. Tests and Quality Checks Result

All 23 integration and unit tests run and pass successfully:

```bash
 ✓ tests/analytics.test.ts  (12 tests) 607ms
 ✓ tests/donors.test.ts  (6 tests) 1317ms
 ✓ tests/auth.test.ts  (5 tests) 258ms

 Test Files  3 passed (3)
      Tests  23 passed (23)
```

---

## Dependencies for Day 9 (RBAC)

- Role assignment middleware (`requireRole`) will need to query `UserRole` mappings during authorization checks.
- Donor profile ownership constraints must align with the audit logs system to log all access modifications properly.
