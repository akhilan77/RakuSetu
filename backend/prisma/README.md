# RaktSetu Database Schema & Operations

This directory contains the Prisma schema, database migrations, and seed scripts for the RaktSetu real-time blood donation ecosystem.

## Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma   # Production Prisma schema file
│   ├── seed.ts         # Seeding script with geocoded mock data
│   ├── README.md       # This file (Database documentation)
│   └── migrations/     # Generated and customized SQL migrations
```

---

## Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    User ||--o| DonorProfile : "has profile (1:1)"
    User ||--oN UserRole : "has roles (1:N)"
    User ||--oN RefreshToken : "has tokens (1:N)"
    User ||--oN AuditLog : "acts in logs (1:N)"
    User ||--oN NotificationLog : "receives (1:N)"
    User ||--oN BloodRequest : "requests (1:N)"
    User ||--oN Match : "notified as donor (1:N)"
    User ||--oN Donation : "donates (1:N)"

    Institution ||--oN BloodRequest : "hosts (1:N)"
    Institution ||--oN Donation : "verifies (1:N)"
    Institution }|--oN User : "has staff (N:M)"

    BloodRequest ||--oN Match : "triggers (1:N)"
    BloodRequest ||--oN Donation : "fulfills (1:N)"

    Match ||--oN Donation : "results in (1:N)"
```

---

## Model Explanations

1. **User**: Represents core user identity (phone number-first, optional email, name) and tracks system access/status dates. Supports cascade deletion of child resources.
2. **UserRole**: Handles application Role-Based Access Control (RBAC). Placed in a separate `1:N` table to allow a user to hold multiple roles (e.g. `DONOR`, `COORDINATOR`, `ADMIN`) without relying on Postgres scalar arrays in Prisma.
3. **RefreshToken**: Handles secure stateless JWT authentication refresh operations. Relates `1:N` to the `User`.
4. **DonorProfile**: Extends user profiles with blood group, donor status, eligibility, physical stats, and physical coordinates. Contains both standard `Float` latitude/longitude coordinates (for quick JSON/frontend usage) and a PostGIS `geography(Point, 4326)` column with a GiST index for fast spatial radius lookups.
5. **Institution**: Represents hospitals, clinics, or blood banks that create emergency blood requests or house staff. Stores manual blood inventories and coordinates.
6. **BloodRequest**: Represents an emergency request for blood. It tracks the recipient, the hosting institution, blood groups, urgency tiers, request status, and has spatial coordinates for mapping nearby donors.
7. **Match**: Tracks the wave-dispatch notification loop between a `BloodRequest` and candidate `User` donors.
8. **Donation**: Tracks donation status (self-reported or verified by an institution), certificates, and dates.
9. **NotificationLog**: Historical log of pushes and SMS alerts sent to users, documenting failures, gateway responses, and retries.
10. **AuditLog**: Immutable log tracking security actions, modifications, user IPs, and user agents for audit trails.

---

## Operations & Commands

### 1. Migrations

To generate a new migration after modifying `schema.prisma`:
```bash
npx prisma migrate dev --create-only --name <migration_name>
```

Edit the generated `migration.sql` to include custom PostGIS extensions or database parameters, then apply using:
```bash
npx prisma migrate dev
```

### 2. Database Seeding

To clear old records and populate Vellore pilot mock data:
```bash
npx prisma db seed
```

### 3. Database Verification

To check database tables and extensions, run the following queries:

```sql
-- Check if PostGIS extension is installed
SELECT PostGIS_Version();

-- Verify registered geography columns and their SRIDs (should return 4326)
SELECT f_table_name, f_geography_column, type, srid FROM geography_columns;

-- Inspect spatial indexes (should show USING gist (location) for tables)
SELECT indexname, indexdef FROM pg_indexes WHERE indexdef LIKE '%gist%';
```
