# RaktSetu · 8-WEEK DAILY BUILD PLAN

## Real-Time Blood Donation & Blood Bank Ecosystem — Pilot-Ready MVP

**Akhilan & Karthikeyan · Skill-aligned task split · Pilot-city launch · Next.js 15 PWA frontend**

---

## Why this split

Akhilan is a final-year CS student at VIT — strong fundamentals, fast learner, but this is his first production system. Karthikeyan is an experienced fullstack developer with UI/UX depth. The realistic split:

* **Akhilan owns:** Data store, backend API, geo search (PostGIS), wave-dispatch engine, notification pipeline, eligibility/matching logic, test coverage. *(Highest learning curve, highest supervision — every backend PR reviewed by Karthikeyan.)*
* **Karthikeyan owns:** Entire frontend (Next.js 15 PWA + shadcn/ui), all UI/UX design decisions, Docker/Compose builds, CI/CD, production deploy, monitoring.
* **Both pair on:** Week 1 setup, the Week 5 wave-dispatch integration (the make-or-break week), weekly Friday integration check, pilot launch.

**Mentorship rule baked into the plan:** one shared TypeScript language across the whole stack (Node backend, Next.js frontend) so Karthikeyan can meaningfully review every line Akhilan writes. No solo merges to `main` after CI exists.

---

## Stack rationale (single-language TypeScript, PWA-first)

* **PWA, not native apps:** Two people, 8 weeks. A Next.js 15 installable PWA (manifest + service worker + web push) ships to Android/iOS/desktop from one codebase. Native apps deferred to v1.1 once the emergency loop is proven.
* **Node 20 + Express + Prisma (not FastAPI/Django):** Keeps backend in TypeScript so the senior dev can review the student's code without context-switching. Prisma gives typed queries + migrations; raw SQL escape hatch used only for PostGIS.
* **PostgreSQL 16 + PostGIS:** Radius search ("O− donors within 10 km") is *the* core query. PostGIS `ST_DWithin` on a `geography` column with a GiST index — not Haversine math in app code.
* **Redis 7 + BullMQ:** Wave dispatch is inherently queue-driven — delayed jobs implement "Wave 2 fires in 5 minutes unless someone accepts." Same pattern as any production job system, gentle for a student to learn.
* **shadcn/ui + Tailwind:** Radix-based accessible components (Dialog, Sheet, InputOTP, Form) copy-pasted into the repo. Karthikeyan's UI/UX skills go into the emergency flow, not into rebuilding a button.
* **Auth.js v5 Credentials → backend OTP:** Backend remains source of truth for JWT. MSG91 sends OTP SMS (India DLT-registered templates required — started Week 1 because approval takes days).
* **FCM web push + MSG91 SMS fallback:** Emergency notifications must arrive. Push first; undelivered after 90 s → SMS. Both logged with delivery receipts.
* **Google Maps Platform:** Geocoding, static maps, and navigation deep links (`google.navigation:` / universal links) — no in-app turn-by-turn needed for MVP.

---

## MVP scope reduction (so 8 weeks is realistic)

The PRD's full v1.0 is too much for two people in 8 weeks. Cut to pilot scope:

* **KEEP for MVP:** OTP auth · Donor registration + verification tiers 0–1 · Live availability + eligibility engine · PostGIS donor search with compatibility expansion · One-tap emergency request · Wave-based dispatch (rules-ranked) · FCM push + SMS fallback · Accept → contact reveal → navigation · Post-accept in-app chat · Donation logging + PDF certificates with QR verify · Hospital mini-portal (verify requests + simple inventory) · Admin console · DPDP basics (consent, export, delete)
* **DEFER to v1.1:** Native apps · Masked proxy calls (MVP reveals number only post-accept — proxy calling via Exotel in v1.1) · Blood bank component/expiry module · ML ranking (rules formula ships first; model needs real response data anyway) · AI chat assistant · Demand prediction · e-RaktKosh integration · DigiLocker ID verification · Multi-language · NGO camp module

**Rationale:** the emergency loop (request → waves → accept → arrive → donate) is the product. Everything else is decoration until that loop works flawlessly in one pilot city.

---

## Differentiators vs existing donor-directory apps (baked into the daily plan)

* **FR-EMG-01 — Wave dispatch, never broadcast (Week 5, Days 21–25):** ranked batches of 10 with timed escalation. Directory apps blast everyone → notification fatigue → dead platform.
* **FR-DON-04 — Live availability engine (Week 3, Day 11):** eligibility countdown + snooze + inactivity decay. Directory apps show donors who donated last week.
* **FR-EMG-03 — Inventory-first flow (Week 7, Day 33):** hospital stock checked before donors are disturbed. Directory apps can't see stock at all.
* **FR-PRV-01 — Zero phone-number exposure pre-accept (Week 6):** contact revealed only after mutual match. Directory apps print raw numbers publicly.
* **FR-DON-06 — Verified-donation certificates with public QR verify URL (Week 7, Day 32):** trust artifact directory apps don't have.
* **FR-DAT-01 — Stale-profile decay + OTP revalidation (Week 3, Day 14):** the #1 complaint about existing apps is dead data; this platform garbage-collects itself.

---

## Stack at a glance

| Layer | Technology | Owner |
|---|---|---|
| Backend API | Node.js 20 + Express + TypeScript + zod | Akhilan |
| ORM / Migrations | Prisma (raw SQL for PostGIS queries) | Akhilan |
| Database | PostgreSQL 16 + PostGIS (GiST geo index) | Akhilan |
| Cache / Queue | Redis 7 + BullMQ (delayed jobs = waves) | Akhilan |
| Object Storage | MinIO (certificates, verification docs) | Akhilan |
| Auth (backend) | OTP via MSG91 → JWT (jose) + RBAC | Akhilan |
| Push / SMS | FCM (web push) + MSG91 SMS fallback | Akhilan |
| Geo / Maps APIs | Google Maps Platform (geocode, deep links) | Akhilan |
| PDF Certificates | pdfkit + QR (qrcode) | Akhilan |
| Frontend Framework | Next.js 15 (App Router) + React 18 + TypeScript | Karthikeyan |
| UI Components | shadcn/ui (Radix + Tailwind) | Karthikeyan |
| Frontend Auth | Auth.js v5 Credentials → backend /auth/verify-otp | Karthikeyan |
| Data Fetching | TanStack Query (polling for live request state) | Karthikeyan |
| Forms / Validation | react-hook-form + zod (schemas shared with backend) | Karthikeyan |
| PWA | next-pwa / custom SW · manifest · web push · offline queue | Karthikeyan |
| Icons / Font / Toasts | lucide-react · Inter via next/font · sonner | Karthikeyan |
| Charts (admin) | Recharts | Karthikeyan |
| Containers | Docker Compose (dev) → compose-prod + Caddy | Karthikeyan |
| CI / CD | GitHub Actions (lint, typecheck, vitest, build) | Karthikeyan |
| Monitoring | Sentry (both SDKs) + UptimeRobot + pg_dump cron | Karthikeyan |
| Hosting | Hetzner/DO VPS (Mumbai) + Caddy SSL + Cloudflare | Karthikeyan |

---

# MONTH 1 — Foundation, Donors & Requests · Weeks 1–4

**End goal:** Verified donors registered, searchable by blood group + radius with live availability. Emergency requests creatable. No dispatch yet.

## WEEK 1 — Shared setup & data store

*Both pair daily this week. Also: apply for MSG91 DLT template approval Day 1 — it takes days and Week 5 depends on it.*

| Day | Akhilan — Backend / Data / Logic | Karthikeyan — Frontend / UX / Deploy | Done When |
|---|---|---|---|
| **Day 1** | • Install Node 20 LTS, Docker Desktop, VS Code, git • Create GitHub repo: `backend/ frontend/ infra/` + README + .gitignore (Node, .env, .next/) • `docker run hello-world` • **Submit MSG91 signup + DLT OTP/alert template registration (approval takes 2–5 days)** | • Verify Node 20 · clone repo • `npx create-next-app@latest raktsetu-ui --typescript --tailwind --app --src-dir --eslint` • Verify dev server at :3000 • Sketch the 3 core flows on paper: donor onboarding, emergency request, donor accept (UX is his call) | • Both run hello-world • Next.js loads • DLT registration submitted |
| **Day 2** | • Write `docker-compose.yml`: `postgis/postgis:16` (5432), `redis:7-alpine` (6379), `minio/minio` (9000/9001) • `docker compose up -d` → 3 green • `.env.example`: DATABASE_URL, REDIS_URL, JWT_SECRET, MSG91_KEY, FCM creds, MINIO creds • .env in .gitignore | • Inter via next/font · `npm i lucide-react` • `npx shadcn@latest init` (Slate, CSS vars) + add: button card input label dialog sheet form toast sonner badge input-otp progress • Theme tokens: primary **red-600** (blood context), success emerald, warning amber • Scaffold routes: `app/(auth)/login`, `app/(app)/{home,request,search,requests/[id],profile,history}`, `app/(portal)/hospital`, `app/(admin)` | • compose ps 3 green • Theme renders • Routes scaffolded |
| **Day 3** | • `prisma init` · write schema: **User, DonorProfile, Institution, BloodRequest, Match, Donation, NotificationLog, AuditLog** (org-free, but every row keyed to user/institution) • DonorProfile gets `location geography(Point,4326)` via raw SQL migration + GiST index • `prisma migrate dev` · verify tables in psql | • Build app shell: **mobile-first bottom tab bar** (Home · Search · SOS center button · History · Profile) + desktop sidebar at `md:` • SOS button: oversized, red, center-docked — the emergency entry point • `(auth)` layout minimal, no shell | • 8 tables in Postgres • GiST index confirmed via `\d` • Shell renders both breakpoints |
| **Day 4** | • Enable postgis extension in migration • Seed script: 1 admin, 1 hospital institution, 20 fake donors scattered around pilot city with real-ish coordinates + varied blood groups • Verify: raw `ST_DWithin` query returns nearby donors | • Build LoginForm: phone input (+91 mask) → 'Send OTP' → shadcn **InputOTP** 6-digit screen with 60 s resend cooldown (UI only, console.log submit) • Home placeholder: availability card, eligibility ring, stats — all '—' | • Seed inserts 20 geo-scattered donors • Radius SQL query works • OTP UI flows |
| **Day 5** | • Shared zod schema package `packages/shared` (BloodGroup enum, compatibility matrix constant, request/donor DTOs) — imported by both apps • SCHEMA.md with mermaid ER diagram • Pre-commit: eslint + prettier • Tag `v0.0.1-data-store-ready` | • Review schema with Akhilan — confirm every field the UI needs exists (esp. Match timestamps for the tracking stepper) • STRUCTURE.md · scripts: lint/format/typecheck • Pre-commit hooks • Tag `v0.0.1-frontend-skeleton` | • Schema reviewed • Shared package imported by both • Tags pushed |

## WEEK 2 — OTP auth + API skeleton + donor registration

| Day | Akhilan | Karthikeyan | Done When |
|---|---|---|---|
| **Day 6** | • Express app: `/health` → {status, db_ok, redis_ok} • CORS allow :3000 • Error middleware (zod errors → 422, unknown → 500 + log) • Add backend + worker services to compose (hot reload via tsx watch) | • Auth.js v5: `npm i next-auth@beta` • CredentialsProvider whose `authorize()` POSTs phone+otp to backend `/auth/verify-otp`, returns JWT + user • JWT session strategy · typed fetch wrapper `lib/api.ts` attaching Bearer token | • /health green from browser • /api/auth/providers responds |
| **Day 7** | • `POST /auth/request-otp`: generate 6-digit, store in Redis `otp:{phone}` EX 300, send via MSG91 (dev mode: log to console) • Rate limit: 3 OTP/phone/hour, 10/IP/hour • `POST /auth/verify-otp` → JWT (8 h) + refresh token • `GET /auth/me` | • Wire login E2E: phone → OTP → `signIn('credentials')` → `/home` • sonner toast on wrong OTP with attempts-left • `middleware.ts` protects `(app)`, `(portal)`, `(admin)` routes • 'Remember me' → 30 d session | • Real login works with console OTP • Middleware redirects correctly • Rate limit returns 429 |
| **Day 8** | • RBAC: roles `donor · recipient · hospital_staff · coordinator · admin` (user can hold several) • `requireRole()` middleware • Every mutating endpoint writes AuditLog {userId, action, entity, ts} | • Role-aware navigation (hospital_staff sees portal link, admin sees admin) • Profile page skeleton: identity card, roles, consent toggles (location, notifications) — consent state persisted Day 10 | • Viewer-role gets 403 on admin route • Audit rows written |
| **Day 9** | • BullMQ: queue `dispatch`, worker process, first dummy job (sleep 3 s, log) • Worker as separate compose service • Repeatable-job scaffold (used later for decay + revalidation crons) | • Build **donor registration wizard** (the UX centerpiece of onboarding): Step 1 basics (name, DOB, sex, weight) → Step 2 blood group (8 big selectable chips + 'not sure' option) → Step 3 health questionnaire (12 yes/no, one per screen, thumb-reachable) → Step 4 location consent + GPS capture | • Worker picks up job • Wizard navigates all steps with validation |
| **Day 10** | • `POST /donors` (creates DonorProfile, geocodes/stores point, computes initial eligibility from questionnaire: age 18–65, weight ≥ 50 kg, deferral answers) • `GET /donors/me` · `PATCH /donors/me` • Consent records persisted per DPDP | • Wire wizard → API, optimistic success screen ('You're donor #21 in Vellore') • Home now shows real availability card + blood group • Tag `v0.1.0-auth-donors` | • Registration E2E creates geo-located donor • Ineligible answers set correct deferral • Tag pushed |

## WEEK 3 — Availability engine + geo search + verification

| Day | Akhilan | Karthikeyan | Done When |
|---|---|---|---|
| **Day 11** | • **FR-DON-04 availability engine**: states `AVAILABLE / UNAVAILABLE / SNOOZED(until) / INELIGIBLE(auto) / UNCONFIRMED(auto)` • Transition rules in one pure function + unit tests • Eligibility countdown: last donation + 90 d (male) / 120 d (female), configurable • `PATCH /donors/me/availability` | • Availability UI on Home: large switch + snooze picker (1 w / 2 w / 1 mo / custom date) • Eligibility countdown ring (SVG, days remaining) — grays out switch while INELIGIBLE with explainer • Status chip color system used everywhere | • State machine tests green • Toggle + snooze persist • Countdown accurate for seeded donors |
| **Day 12** | • **Geo search**: `GET /donors/search?bg=&lat=&lng=&radiusKm=` — raw SQL `ST_DWithin` + GiST, filters AVAILABLE + eligible only • **Compatibility expansion** from shared matrix (request B− → return B−, O−) with exact-match ranked first (protect O−) • Return **fuzzed** coordinates (~1 km jitter) + distance band ('2–3 km'), never exact location | • Search page: blood group chip selector, radius slider (5–50 km), results as donor cards (initials avatar, blood group, distance band, verification badges, availability chip) • Empty state: 'No available donors — widen radius or raise a request' with CTA to SOS | • Search returns correct compat-expanded set • Exact-group sorts first • Only fuzzed coords in payload (checked in network tab) |
| **Day 13** | • **Verification tiers**: Tier 0 = OTP phone (default) · Tier 1 = document upload (MinIO presigned PUT) for blood-group proof, admin approves → Tier badge on profile • `POST /donors/me/documents` · admin review endpoint | • VerificationBadge component (shield icons: gray/blue/green with tooltip explaining what was verified) • Upload flow in Profile (camera/file, preview, submit) • Map view toggle on search results: Google static/embed map, clustered fuzzed markers | • Upload → admin approve → badge upgrades • Map shows fuzzed cluster, not exact pins |
| **Day 14** | • **FR-DAT-01 data hygiene crons** (BullMQ repeatable): nightly stale-decay — no activity 60 d → UNCONFIRMED + re-verification push queued; monthly OTP revalidation prompt • Dedup guard on phone + device fingerprint at registration | • Re-verification prompt UX: one-tap 'Still available?' notification → deep link → single confirm button (make renewal effortless — this is why data stays fresh) • Profile completeness meter nudging Tier 1 | • Cron flips a stale seed donor to UNCONFIRMED • One-tap reconfirm restores AVAILABLE |
| **Day 15** | • Vitest: compatibility matrix (all 8×8 cases), eligibility calculator edge cases, search filter correctness • Bruno/Postman collection for all endpoints • Tag `v0.1.0-search-ready` | • Loading skeletons, error toasts on all data screens • Mobile pass at 375 px · large-touch check on availability + search • Tag `v0.1.0-ui-week3` | • Tests green (matrix 100% covered) • UX clean on phone • Tags pushed |

## WEEK 4 — Emergency requests + institution directory · Month 1 gate

| Day | Akhilan | Karthikeyan | Done When |
|---|---|---|---|
| **Day 16** | • BloodRequest endpoints: `POST /requests` (bg, units, hospital/institution or free-text location, urgency CRITICAL/URGENT/PLANNED, patient note) • **State machine**: `CREATED → SEARCHING → MATCHED → FULFILLED / EXPIRED / CANCELLED` as pure function + tests • AuditLog every transition | • **SOS flow** (the flagship UX): tap SOS → 3 inputs max (blood group, units stepper, hospital picker w/ search) → urgency → confirm. Target: raise a request in under 60 s, one-handed, under stress • Oversized controls, no optional fields on this path | • Request created < 60 s in usability self-test • Invalid transitions rejected • Audit trail complete |
| **Day 17** | • Institution directory: import pilot-city hospital + blood bank list (public e-RaktKosh directory CSV) into Institution table with coordinates • `GET /institutions/nearby?lat=&lng=&type=` (PostGIS again) | • Nearby hospitals/blood banks screen: list + map, each card with 'Call' (tel:) and 'Directions' (Google Maps deep link) • Works logged-out too (public route) — emergency info shouldn't need an account | • 30+ pilot-city institutions seeded with coords • Deep links open dialer + Maps |
| **Day 18** | • Anti-abuse: request rate limit (3 open/account), duplicate detection (same bg + institution + overlapping window → warn/merge), coordinator review flag on suspicious patterns | • Live request tracking screen (recipient): vertical stepper of states with timestamps, 'donors notified / responded / accepted' counters (mock until Week 5), cancel button with reason dialog | • Duplicate request warns • Tracking stepper renders all states from fixture data |
| **Day 19** | • `GET /requests/me` history + detail · close/cancel flows with reason enum (fulfilled-elsewhere, patient-recovered, etc.) — reasons feed future analytics • Request expiry job: auto-EXPIRED after urgency-based TTL (6 h critical / 24 h urgent / 7 d planned) | • History screen: request cards with outcome chips • Closure dialog (reason select + optional note) • Recipient home: active request pinned to top with live status chip | • Expiry job flips stale request • Closure reasons persisted |
| **Day 20** | • **Month-1 bug bash (both)**: full pass as donor, recipient, admin; attempt auth bypasses, direct-ID access to others' requests/profiles → must 403 • Fix criticals same day • Tag `v0.2.0-month1-complete` | • Same bash from UX side: cross-browser (Chrome/Firefox/Safari), 375 px pass on every screen, empty/error states everywhere • Tag `v0.2.0-month1-frontend` | • Zero cross-user data leaks • Every screen has empty+error state • Tags pushed |

---

# MONTH 2 — Dispatch, Match Lifecycle & Pilot Launch · Weeks 5–8

**End goal:** Full emergency loop live in production for one pilot city: request → waves → accept → navigate → donate → certificate. Hospital mini-portal + admin console. Pilot partner onboarded.

## WEEK 5 — Wave dispatch + notifications (the make-or-break week — pair daily)

| Day | Akhilan | Karthikeyan | Done When |
|---|---|---|---|
| **Day 21** | • FCM Admin SDK: `POST /devices` registers push token per user/device • `sendPush(userId, payload)` service with delivery-receipt logging to NotificationLog • Topic-free, direct-token sends only | • Web push in PWA: permission prompt (asked in context — after donor registration, not on first visit), service worker `push` + `notificationclick` handlers deep-linking to the request • In-app notification inbox screen | • Push arrives on locked Android phone • Tap opens the right request • Receipts logged |
| **Day 22** | • **Ranking formula (rules, ML later)**: `score = w1·exactMatch + w2·proximity + w3·eligibilityMargin + w4·reliability + w5·verificationTier` — pure function + tests, weights in config • `rankDonors(requestId)` returns ordered candidate list | • **Donor-side request card**: full-screen actionable notification view — blood group (huge), hospital, distance band, urgency, patient note • Two buttons only: **Accept** / **Can't this time** (decline reasons: too far, unwell, busy — feeds reliability fairly) | • Ranking deterministic + tested • Accept/decline round-trips to API |
| **Day 23** | • **FR-EMG-01 wave engine** (BullMQ delayed jobs): Wave 1 = top 10 → if no accept in 5 min, Wave 2 = next 15 + radius +5 km → if 10 min, Wave 3 + `ESCALATED` flag • First accept **cancels pending wave jobs** + expires other donors' pending cards • Match rows: `NOTIFIED → RESPONDED → ACCEPTED` timestamps | • Recipient live tracking goes real: TanStack Query 5 s polling while SEARCHING — animated counters (notified/responded/accepted), wave indicator ('Wave 2 · searching wider') • On accept: celebratory state + donor first-name/initial + ETA card | • Full wave cascade observable in logs • Accept cancels remaining jobs • Tracking updates < 5 s |
| **Day 24** | • **SMS fallback**: push undelivered after 90 s → MSG91 SMS (DLT template) with short link • Quiet-hours + fatigue cap: max 4 emergency pings/donor/month unless CRITICAL, config-backed • All sends in NotificationLog with channel + status | • **Post-accept contact + navigation**: contact card reveals recipient phone to donor (and vice-versa) *only now* — before this, zero personal data crossed • 'Navigate' button → Google Maps deep link to hospital • Recipient sees 'Donor en route' | • SMS lands on real phone • Fatigue cap blocks 5th ping • No phone number in any pre-accept payload (verified) |
| **Day 25** | • E2E: seed 20 donors → raise request → Wave 1 push → decline all → Wave 2 fires at 5 min → accept → jobs cancelled → contact revealed • Chaos: restart worker mid-wave, jobs resume (BullMQ persistence) • Tag `v0.3.0-dispatch-ready` | • Same E2E from 3 physical phones (donor × 2, recipient × 1) • Fix every UX hitch found (notification copy, button sizes, state confusion) • Tag `v0.3.0-dispatch-ui` | • Full loop works across real devices • Worker restart loses nothing • Tags pushed |

## WEEK 6 — Match lifecycle, chat, reliability, escalation

| Day | Akhilan | Karthikeyan | Done When |
|---|---|---|---|
| **Day 26** | • Extend Match machine: `ACCEPTED → ARRIVED → DONATED / NO_SHOW / WITHDRAWN` with transition endpoints + who-may-transition rules (donor marks arrived; recipient or hospital confirms donated) • Withdrawal re-opens dispatch (resume next wave) | • Donor journey screens per state: en-route (with 'I've arrived' button), arrived (waiting confirm), donated (celebration + certificate teaser) • Recipient mirror states • Withdraw flow with confirm dialog ('This restarts the donor search') | • Every transition enforced server-side • Withdraw resumes waves • Both sides see consistent state |
| **Day 27** | • **Post-accept in-app chat**: REST + 3 s polling (Socket.io deferred — polling is fine at pilot scale), messages scoped to Match, closed when Match closes • Basic content guard: strip phone/UPI patterns pre-accept contexts (defense in depth) | • Chat UI inside the match screen: bubbles + **quick-reply chips** ('On my way', 'ETA 20 min', 'Which ward?', 'Reached gate') — most donors won't type while traveling • Unread badge on tab | • Chat round-trips between two phones • Quick replies one-tap • Chat locks on match close |
| **Day 28** | • **Reliability score** nightly job: acceptRate, showUpRate, cancellations, profile freshness → 0–100 stored on DonorProfile, feeds ranking w4 • NO_SHOW applies cooldown (excluded from waves 14 d) with appeal flag | • Donor profile: reliability shown as supportive framing ('Trusted responder' tiers, not a shaming number) • Milestone badges UI (First Donation, 3 Lives, 5 Lives…) • History timeline | • Score recomputes nightly on seeds • No-show cooldown excludes donor from next dispatch |
| **Day 29** | • **Escalation path**: Wave 3 exhausted → request flagged to coordinator queue `GET /coordinator/queue` · assign/handle/resolve endpoints • Emergency broadcast endpoint (coordinator-triggered, opted-in donors only, city-wide, hard-capped) | • Coordinator mini-console (desktop web): escalated request list sorted by urgency+age, assign-to-me, resolution notes, broadcast button with are-you-sure + reach estimate | • Exhausted request appears in queue < 1 min • Broadcast reaches only opted-in donors |
| **Day 30** | • Load test: 50 concurrent requests × 20-donor pool — queue depth, slow query log; add indexes (bg+status, geography GiST verified, Match request_id) • Tag `v0.4.0-lifecycle` | • Full-flow demo recording (screen capture) for pilot-partner pitch • Polish pass on all Match screens • Tag `v0.4.0-lifecycle-ui` | • P95 dispatch enqueue < 15 s under load • Demo video cut • Tags pushed |

## WEEK 7 — Donations, certificates, hospital portal, admin, privacy

| Day | Akhilan | Karthikeyan | Done When |
|---|---|---|---|
| **Day 31** | • Donation logging: hospital-confirmed (via portal, sets `verified=true`) vs donor self-report (`verified=false` chip) • Completion auto-starts eligibility countdown + flips availability to INELIGIBLE | • Donation history screen: entries with verified/self-reported chips • Countdown ring on Home now driven by real donation data • 'Log a past donation' flow (date + place) for onboarding old donors | • Confirmed donation starts countdown • Self-report clearly distinguished |
| **Day 32** | • **FR-DON-06 certificates**: pdfkit certificate (name, date, institution, blood group) + QR → public `GET /verify/{donationId}` JSON+page • Store in MinIO, presigned download URL | • Certificate UI: preview, download, native share sheet (Web Share API) • Public verify page (no auth): green verified card with donation facts — employers/colleges can check it | • PDF renders in Adobe + Chrome + phone • QR scan → verify page confirms |
| **Day 33** | • **Hospital mini-portal APIs**: institution staff onboarding (admin-approved), verify/attach patient requests (**FR-EMG-03**: verified requests get badge + ranking boost), simple inventory (units per blood group, manual update) surfaced on request creation: 'City Blood Bank shows 2 units of B− — call before notifying donors' | • Hospital portal (desktop): request verification queue, inventory grid (8 groups × unit stepper, single Save), audit trail view • Inventory hint card injected into recipient SOS flow when stock exists nearby | • Staff verifies a request → badge visible to donors • Stock hint appears before dispatch |
| **Day 34** | • Admin console APIs: user search/block, fraud review queue (flagged requests, dedup hits), request monitor (live board), NotificationLog viewer • Metrics endpoint: requests today, fulfillment rate, median time-to-accept | • Admin pages: DataTables with block/unblock, fraud queue with approve/reject, live request board, metrics cards + Recharts sparkline (median time-to-accept trend — the north-star number) | • Admin blocks a user → sessions revoked • Metrics match DB reality |
| **Day 35** | • **DPDP pass**: consent records audited, `GET /me/export` (JSON bundle), `DELETE /me` (soft-delete + PII scrub, retain anonymized audit) • Grep-level check: no exact coords or phone in any pre-accept response • Tag `v0.5.0-portal-privacy` | • Settings: consent management toggles, 'Download my data', delete-account flow (typed confirm + cooling-off notice) • Privacy explainer screen in plain language ('When is my number shared? Only after you accept.') • Tag `v0.5.0-ui` | • Export bundle complete • Deletion scrubs PII, keeps stats • Privacy claims match observed payloads |

## WEEK 8 — Hardening, production deploy, pilot launch

| Day | Akhilan | Karthikeyan | Done When |
|---|---|---|---|
| **Day 36** | • Security audit: OWASP top-10 pass, helmet, rate limits on every mutating route, `npm audit` clean, JWT expiry/refresh checked • **Offline emergency queue**: `POST /requests` accepts client-generated UUID (idempotent) so queued offline requests don't duplicate on sync | • PWA hardening: manifest + icons + install prompt, offline shell caching **institution directory + emergency numbers** (usable with zero signal), background sync queues an offline SOS → sends on reconnect • Lighthouse: Perf > 85, A11y > 90, PWA installable | • Offline SOS queues and sends exactly once on reconnect • Installs to home screen • Lighthouse targets hit |
| **Day 37** | • Vitest sweep: state machines, ranking, compat matrix, eligibility, wave cancellation — CI-gating suite green • Structured logging (pino JSON) across API + worker | • Dockerfiles: backend, worker (node:20-alpine multi-stage), frontend (Next standalone, < 250 MB) • `docker-compose.prod.yml`: healthchecks, restart policies, Caddy service (app./api. domains) • GitHub Actions: lint + typecheck + vitest + build; branch protection on main | • CI green + gating • Prod compose runs locally • Solo merges now impossible |
| **Day 38** | • Backup cron: nightly pg_dump → MinIO `backups/`, 30 d retention · test restore locally • Runbook: deploy, rollback, restore, rotate JWT secret, block abusive user, resume stuck queue | • VPS (Mumbai region) + domain + Cloudflare DNS · UFW 22/80/443, key-only SSH • Deploy prod compose, Caddy auto-SSL • securityheaders.com fixes via Caddy headers (HSTS, CSP with Next 15 nonces, XFO) | • App live on real domain, green padlock • Restore drill passed • Headers grade A |
| **Day 39** | • Sentry backend SDK · chaos on prod: kill worker mid-wave, restart Redis → dispatch resumes, no orphan matches • Real-SMS + real-push E2E on production with 3 phones | • Sentry Next.js wizard (client+server) · UptimeRobot on app + api /health, SMS alert on 2-min downtime • Full E2E on prod from the same 3 phones · fix launch blockers | • Test errors land in Sentry (both) • Prod E2E clean incl. real SMS • Uptime monitor live |
| **Day 40** | • **Pilot launch prep**: seed pilot-city institutions verified, coordinator account for NGO partner, fatigue caps + quiet hours confirmed in prod config • 12-week→8-week retrospective doc: shipped/slipped/next • Tag `v1.0.0-pilot` | • Pilot kit: 2-page onboarding PDF (screenshots), 5-min demo script rehearsed 3×, QR posters for the partner blood-camp/college drive • v1.1 backlog board (masked calls, native apps, blood-bank module, ML ranking, e-RaktKosh) • Tag `v1.0.0-pilot` | • NGO/college partner onboarded with coordinator access • Demo runs cleanly 3× • v1.0.0 tagged 🎉 |

---

## 8-WEEK SUMMARY

| Month | Phase | Week Range | Milestone |
|---|---|---|---|
| **Month 1** | Foundation, Donors & Requests | Weeks 1–4 | OTP auth · geo-located verified donors with live availability + eligibility engine · PostGIS compat-expanded search · one-tap emergency requests with state machine · institution directory · data-hygiene crons. Tag `v0.2.0`. |
| **Month 2** | Dispatch, Lifecycle & Launch | Weeks 5–8 | Wave dispatch (FR-EMG-01) with push + SMS fallback · full match lifecycle with chat + reliability · certificates with QR verify · hospital mini-portal with inventory-first hints (FR-EMG-03) · admin console · DPDP compliance · production deploy + monitoring · **pilot city live with NGO partner**. Tag `v1.0.0-pilot`. |

---

## Rules for staying on schedule

* **Never start a week until the previous week's tag is pushed.** Week 5 dispatch WILL fail if Week 3's availability engine is incomplete.
* **Demo to each other every Friday.** If you can't demo it, it's not done.
* **Cut scope before cutting quality.** Defer the hospital portal before shipping a flaky dispatch loop — the emergency path is sacred.
* **Karthikeyan reviews every Akhilan PR** (mentorship + safety). Akhilan reviews Karthikeyan's for learning. Solo merges to main forbidden once CI exists (Day 37).
* **One bug-bash day per week (Friday afternoon).** Don't carry tech debt past 5 days.
* **Real phones every week from Week 5.** Push notifications and PWA behavior lie in the browser devtools; only physical devices tell the truth.
* **Pilot pull > feature push from Week 8.** Build what the NGO partner and first donors ask for, not what looks impressive.

---

## Tech-stack split summary

**Akhilan:** Node.js 20 · Express · TypeScript · zod · Prisma · PostgreSQL 16 + PostGIS · Redis 7 · BullMQ · MinIO · MSG91 (OTP + SMS) · FCM Admin SDK · Google Maps APIs · pdfkit + qrcode · pino · Vitest

**Karthikeyan:** Next.js 15 (App Router) · React 18 · TypeScript · Tailwind CSS · shadcn/ui · Auth.js v5 · TanStack Query · react-hook-form + zod · PWA (service worker, web push, background sync) · lucide-react · sonner · Recharts · Docker + Compose · GitHub Actions · Caddy · Sentry · UptimeRobot · Cloudflare

**Both:** git · GitHub · GitHub Container Registry · Bruno/Postman · runbook · pilot onboarding kit

---

**END OF PLAN**
