# RaktSetu · 8-WEEK DAILY BUILD PLAN

## Real-Time Blood Donation & Blood Bank Ecosystem — Pilot-Ready MVP

**Akhilan & Karthikeyan · Skill-aligned task split · Pilot-city launch · Next.js 15 PWA frontend**

---

## Why this split

* **Akhilan owns:** Data store, backend API, geo search (PostGIS), wave-dispatch engine, notification pipeline, eligibility/matching logic, test coverage.
* **Karthikeyan owns:** Entire frontend (Next.js 15 PWA + shadcn/ui), all UI/UX design decisions, Docker/Compose builds, CI/CD, production deploy, monitoring.
* **Both pair on:** Week 1 setup, the Week 5 wave-dispatch integration (the make-or-break week), weekly Friday integration check, pilot launch.

---

## Stack rationale (single-language TypeScript, PWA-first)

* **PWA, not native apps:** Next.js 15 installable PWA (manifest + service worker + web push) ships to Android/iOS/desktop from one codebase.
* **Node 20 + Express + Prisma (not FastAPI/Django):** Keeps backend in TypeScript for seamless cross-reviews. Prisma handles typed queries and migrations.
* **PostgreSQL 16 + PostGIS:** Geolocation queries using `ST_DWithin` on GiST indexes.
* **Redis 7 + BullMQ:** Wave dispatch queue for timed batch notifications.
* **shadcn/ui + Tailwind:** Radix-based UI components.
* **Auth.js v5 Credentials → backend OTP:** MSG91 sends SMS OTP; JWT handles sessions.
* **FCM web push + MSG91 SMS fallback:** Multi-channel notification delivery.
* **Google Maps Platform:** Geocoding and navigation deep links.

---

## MVP scope reduction (so 8 weeks is realistic)

* **KEEP for MVP:** OTP auth · Donor registration + verification tiers 0–1 · Live availability + eligibility engine · PostGIS donor search with compatibility expansion · One-tap emergency request · Wave-based dispatch (rules-ranked) · FCM push + SMS fallback · Accept → contact reveal → navigation · Post-accept in-app chat · Donation logging + PDF certificates with QR verify · Hospital mini-portal (verify requests + simple inventory) · Admin console · DPDP basics (consent, export, delete)
* **DEFER to v1.1:** Native apps · Masked proxy calls · Blood bank component/expiry module · ML ranking · AI chat assistant · Demand prediction · e-RaktKosh integration · DigiLocker ID verification · Multi-language · NGO camp module

---

# MONTH 1 — Foundation, Donors & Requests · Weeks 1–4

## WEEK 1 — Shared setup & data store
- **Day 1**: Submit MSG91 templates. Sketched user flows.
- **Day 2**: Setup Docker Compose (PostGIS, Redis, MinIO) + environment variables. Initialize theme tokens.
- **Day 3**: Prisma initialization and schema sync (User, DonorProfile, Institution, BloodRequest, Match, Donation, NotificationLog, AuditLog). Mobile-first navigation layout.
- **Day 4**: Seed script with geography mock data. Login layout and home page design.
- **Day 5**: Shared Zod schemas setup in `packages/shared`. Set up git pre-commit hooks.

## WEEK 2 — OTP auth + API skeleton + donor registration
- **Day 6**: Express health endpoint and central error handler. Next-auth integration.
- **Day 7**: E2E OTP endpoints using Redis. Session validation middleware.
- **Day 8**: RBAC filters (donor, recipient, hospital_staff, admin) and Audit logs. Persisted consent triggers.
- **Day 9**: Queue jobs configuration. Onboarding Wizard components.
- **Day 10**: Create Donor API and persist profile configurations. E2E tests for onboarding.

## WEEK 3 — Availability engine + geo search + verification
- **Day 11**: Availability engine state manager. Frontend availability panel.
- **Day 12**: Geo search and PostGIS queries. Compatibility matching logic.
- **Day 13**: Profile verification tiers (Tier 0 to Tier 2). Camera and document upload components.
- **Day 14**: Inactivity decay crons. Profiling completion metrics.
- **Day 15**: Unit tests coverage for search and eligibility engines. Loading states.

## WEEK 4 — Emergency requests + institution directory · Month 1 gate
- **Day 16**: Create Emergency Request APIs and state machine transitions. Emergency SOS flow.
- **Day 17**: Hospital and blood bank index from e-RaktKosh CSV. Detail directory layout.
- **Day 18**: Request rate limits. Emergency tracking stepper components.
- **Day 19**: Request closure reasons and auto-expiration cron loops. History screens.
- **Day 20**: Security audits for Direct Object Reference vulnerabilities. Bug scrubbing session.

---

# MONTH 2 — Dispatch, Match Lifecycle & Pilot Launch · Weeks 5–8

## WEEK 5 — Wave dispatch + notifications
- **Day 21**: FCM push setup. Service worker configurations.
- **Day 22**: Matching score rules engines. Actionable notification cards.
- **Day 23**: Wave queue cascade timers. Live matching dashboard.
- **Day 24**: SMS gateways failover. Navigation map integrations.
- **Day 25**: Chaos recovery testing. Final E2E checks with multi-device testbed.

## WEEK 6 — Match lifecycle, chat, reliability, escalation
- **Day 26**: Match lifecycle progress steps. Match state mirrors.
- **Day 27**: Match chats implementation with sanitizers. Quick replies.
- **Day 28**: Donor reliability metrics scoring calculations. Profiles milestone badges.
- **Day 29**: Exhausted request alerts and coordination queues. Broadcasters.
- **Day 30**: Stress testing and indexing alignments. Polish.

## WEEK 7 — Donations, certificates, hospital portal, admin, privacy
- **Day 31**: Donation audits logger. Donation logs timeline views.
- **Day 32**: PDFKit dynamic certificates. Public QR validation routes.
- **Day 33**: Hospital Portal updates. Verification badges trigger logic.
- **Day 34**: Admin stats graphs and users review dashboards. Session validation controls.
- **Day 35**: PII data masking checks. Settings dashboard.

## WEEK 8 — Hardening, production deploy, pilot launch
- **Day 36**: Rate limiters hardening. PWA offline cache maps profiles.
- **Day 37**: Production multi-stage Docker build files. Branch protection constraints.
- **Day 38**: DB backup jobs automation. Live domain SSL bindings.
- **Day 39**: Crash recovery checks. Final multi-phone production tests.
- **Day 40**: Finalize pilot city seed data configurations. Release documentation.
