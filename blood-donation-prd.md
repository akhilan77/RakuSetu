# Product Requirements Document (PRD)

## RaktSetu — Real-Time Blood Donation & Blood Bank Ecosystem

| | |
|---|---|
| **Document Version** | 2.0 (Rewritten & Expanded) |
| **Date** | July 17, 2026 |
| **Status** | Draft for Review |
| **Document Owner** | Product Team |
| **Reviewers** | Engineering Lead, Healthcare Partnerships, Legal/Compliance |

> **Note on naming:** "RaktSetu" (*Bridge of Blood*) is a working title. Alternatives considered: **LifeDrop**, **RedLink**, **Vital**, **BloodBridge**. Final name pending trademark and app-store availability checks.

---

# 1. Abstract

RaktSetu is a real-time blood donation platform designed to modernize the blood donation ecosystem by connecting donors, recipients, hospitals, blood banks, and volunteers through a reliable, AI-assisted digital service. Unlike existing blood donation apps that operate as static directories with stale contact data, RaktSetu is built around four pillars:

1. **Verified identity** — every donor profile is OTP-revalidated and optionally government-ID verified.
2. **Live availability** — donors carry a real-time availability status driven by eligibility rules, self-reported state, and inactivity decay.
3. **Intelligent matching** — an AI ranking engine selects the smallest set of donors most likely to respond, instead of blasting everyone.
4. **Institutional integration** — hospitals and blood banks participate directly, exposing inventory and coordinating requests, with a planned bridge to India's national **e-RaktKosh** registry.

The platform's core promise: **no patient loses time searching for blood during an emergency.** Target: median time from emergency request to confirmed donor under **5 minutes** in covered cities.

---

# 2. Product Overview

## 2.1 Vision

To become the most trusted, intelligent real-time blood donation ecosystem — the default first action when someone needs blood.

## 2.2 Mission

Provide a secure, AI-driven platform where recipients instantly locate verified, available donors, and where hospitals and blood banks operate as first-class participants rather than afterthoughts.

## 2.3 Positioning Statement

*For patients, families, and hospitals who need blood urgently, RaktSetu is a real-time coordination platform that finds a verified, available, compatible donor in minutes — unlike donor-directory apps whose data is outdated and whose donors never answer.*

## 2.4 Product Information

| Item | Details |
| --- | --- |
| **App Name** | RaktSetu (working title) |
| **Platforms** | Android (primary, India-first), iOS, responsive web portal for hospitals/blood banks |
| **Target Audience** | Blood donors, recipients & attendants, hospitals, blood banks, NGOs, emergency responders |
| **Key Stakeholders** | Product team, healthcare organizations, government blood banks (e-RaktKosh), hospital administrators, NGOs, donor communities |
| **Primary Market** | India (Tier 1–2 cities at launch), designed for international generalization |
| **Success Metrics** | Blood match time, emergency response rate, active donor rate, verification rate, successful request rate |
| **Business Model (initial)** | Free for donors/recipients; institutional SaaS tier for hospitals/blood banks (Phase 2); CSR & NGO partnerships |

---

# 3. Market Insights

Research across existing blood donation apps (app-store reviews, user interviews, NGO feedback) surfaced consistent failure modes:

| # | Pain Point | Detail | Impact |
|---|---|---|---|
| 1 | **Outdated donor data** | Dead phone numbers, old cities, wrong blood groups | Wasted calls, delayed treatment, platform distrust |
| 2 | **Unknown availability** | No signal whether a donor recently donated, is ill, traveling, or unwilling | Recipients contact ineligible donors |
| 3 | **Low response rate** | Users report calling 20–40 donors with zero answers | Hours lost during emergencies |
| 4 | **No emergency workflow** | Apps are directories, not coordination systems — no prioritization, no automated selection, no hospital loop-in | Manual, chaotic search under stress |
| 5 | **Data quality issues** | Duplicates, fake registrations, inactive accounts, self-declared unverified blood groups | Search results are noise |
| 6 | **No hospital integration** | Blood bank inventory invisible; a compatible unit may sit 2 km away while family calls donors | Redundant donor searches |
| 7 | **Technical fragility** | OTP failures, crashes, slow search, broken profile updates | Abandonment at the worst possible moment |

**Key takeaway:** the market does not need another donor list. It needs a *live, verified, coordinated emergency response system*.

---

# 4. Problem Statement

Current blood donation applications operate as static donor directories rather than intelligent healthcare platforms. During a critical emergency, a patient's family must manually search, call, and plead — often contacting donors who are unreachable, ineligible, or unwilling — while nearby blood bank stock remains invisible to them.

**Core problem:** *The time between "we need blood" and "a verified donor or unit is confirmed" is unpredictably long — often hours — because availability, eligibility, and inventory data do not exist in real time anywhere.*

Contributing failures: outdated databases, no live availability, low response rates, manual communication, no donor verification, no hospital connectivity, weak privacy protection (raw phone numbers exposed), and no engagement loop keeping donors active.

---

# 5. Proposed Solution

An AI-assisted, real-time blood donation platform connecting verified donors, hospitals, blood banks, and recipients in one ecosystem:

* **Real-time donor availability** — status engine combining eligibility rules, self-reports, and activity signals
* **Verified profiles** — OTP revalidation cycles, optional government ID, blood-group verification via first donation record
* **AI donor matching** — ranked notification waves instead of broadcast spam
* **Live blood inventory** — hospital and blood bank stock checked *before* donors are disturbed
* **One-tap emergency workflow** — structured request → inventory check → smart donor waves → acceptance → navigation → completion
* **Masked communication** — in-app chat and proxied calls; personal numbers never exposed
* **Continuous data hygiene** — automatic decay, re-verification prompts, duplicate detection

The platform transforms blood donation from a manual search into an automated, intelligent healthcare service — while keeping a human volunteer/NGO escalation path for edge cases.

---

# 6. Goals & Objectives

## 6.1 Primary Objectives

| Objective | Measure |
|---|---|
| Reduce blood search time | Median request-to-confirmed-donor time < 5 min (P90 < 20 min) |
| Improve donor reliability | ≥ 80% of notified donors respond (accept/decline) within 10 min |
| Increase successful donations | ≥ 90% of valid emergency requests fulfilled |
| Improve trust | ≥ 95% of active donor profiles verified |
| Digitize workflows | 100% of participating hospitals updating inventory daily |

## 6.2 Secondary Objectives

Encourage repeat donation (streaks, milestones, certificates) · grow hospital participation · improve inventory visibility · support government initiatives (e-RaktKosh alignment) · build a volunteer/NGO layer for blood camps.

## 6.3 Non-Goals (explicitly out of scope for v1)

* Payment or monetary compensation for blood (illegal in India; strictly prohibited on-platform)
* Home blood collection or logistics/transport of blood units
* Medical advice beyond eligibility FAQs
* Organ/plasma/platelet-specific workflows (platelets/components tracked at inventory level only)
* International expansion features (multi-currency, non-Indian ID systems)

---

# 7. Target Users & Personas

## 7.1 Donor — "Arun, 26, software engineer"

Donated twice in college, willing but forgets, hates spam calls.
**Needs:** 2-minute registration, control over availability, eligibility countdown, recognition, zero phone-number leakage.
**Key user stories:**
* As a donor, I can set myself Available / Unavailable / Snoozed (with auto-resume date) so I'm only contacted when I can help.
* As a donor, I receive an emergency notification with distance, hospital, blood group, and urgency, and can accept or decline in one tap.
* As a donor, my eligibility countdown starts automatically after a recorded donation (90 days whole blood for men, 120 for women, per NBTC norms — configurable).

## 7.2 Recipient / Attendant — "Meera, 41, patient's daughter"

In a hospital corridor at 11 pm, needs 2 units of B− urgently.
**Needs:** one-tap request, live tracking of who has been contacted, blood bank stock nearby, human escalation.
**Key user stories:**
* As a recipient, I create an emergency request in under 60 seconds (blood group, units, hospital, urgency, patient note).
* As a recipient, I see live status: inventory checked → N donors notified → M accepted → donor en route.
* As a recipient, I can escalate to an NGO/volunteer coordinator if no donor accepts within a threshold.

## 7.3 Hospital Staff — "Blood bank officer, 300-bed private hospital"

**Needs:** dashboard for stock, incoming request queue, verified patient requests, emergency broadcast to registered donors.
**Key user stories:**
* As hospital staff, I update component-level inventory (whole blood, PRBC, FFP, platelets) in < 2 minutes daily or via API.
* As hospital staff, I verify a patient-linked request so it earns a "hospital-verified" badge and higher donor trust.

## 7.4 Blood Bank Manager

**Needs:** inventory & expiry dashboard, reservation workflow, shortage alerts, demand forecasts.

## 7.5 NGO / Volunteer Coordinator

**Needs:** camp creation & registration, volunteer assignment, escalated-request queue, awareness campaign tools.

---

# 8. Scope & Release Plan

| Phase | Timeline (indicative) | Scope |
|---|---|---|
| **MVP (v1.0)** | Months 0–4 | Donor & recipient apps (Android + web), OTP auth + Google Sign-In, verified profiles, live availability, emergency request workflow, rule-based donor ranking (AI-ready scoring), masked calls, push + SMS, maps/navigation, donation tracking, basic hospital portal (manual inventory), admin console |
| **v1.5** | Months 5–7 | iOS app, full blood bank module (components, expiry, reservations), AI ranking model v1 (learned from v1.0 response data), NGO/camp module, donor gamification |
| **v2.0** | Months 8–12 | AI demand prediction, AI chat assistant, e-RaktKosh integration, hospital API integrations, multi-language (Hindi, Tamil, Telugu, Bengali + English), disaster mode |
| **Future** | 12+ months | Wearables, voice emergency requests, blockchain certificates, corporate campaigns, national registry integration |

**MVP guiding principle:** the emergency loop (request → match → accept → navigate → complete) must work flawlessly before anything else is added. Rule-based ranking ships first; ML replaces it once real response data exists.

---

# 9. Core Features (Detailed)

## 9.1 Donor Management

* **Registration:** mobile OTP, name, DOB, sex, blood group (self-declared → "unverified" badge until confirmed by a donation record or document upload), city + GPS consent, health questionnaire (12 questions aligned to standard donor screening).
* **Verification tiers:**
  * *Tier 0* — OTP-verified phone (minimum to appear in search)
  * *Tier 1* — Government ID verified (Aadhaar/DigiLocker-based, optional)
  * *Tier 2* — Blood group verified (donation record or lab report)
* **Live availability engine:** status = f(self-reported state, eligibility countdown, last-activity decay). Profiles with no activity for 60 days drop to "Unconfirmed" and are excluded from emergency waves until re-verified via one-tap prompt.
* **Eligibility calculator:** interval rules (whole blood 90/120 days), age 18–65, weight ≥ 50 kg, temporary deferrals (illness, tattoos, travel, pregnancy) captured via questionnaire.
* **Donation history & recognition:** verified donation log, downloadable certificates (PDF with QR verify URL), milestone badges, annual impact summary.
* **Reminders:** eligibility-restored notification, camp invitations, periodic re-verification nudges.

## 9.2 Recipient Module

* Search by blood group (with compatibility expansion — e.g., B− request surfaces B− and O− donors), city, radius, availability, verification tier, rare-group registry.
* Nearby hospitals & blood banks (map + list, stock indicators where integrated).
* **Emergency blood request** (see 9.5).
* Live request tracking screen (state machine visible to recipient).
* Request history and closure flow (fulfilled / cancelled / expired with reason).

## 9.3 Hospital Module (Web Portal)

* Role-based accounts (admin, blood bank officer, front desk) with institutional onboarding & verification (license number, registration docs).
* Manual inventory updates (MVP) → CSV import → API integration (v2.0).
* Request queue: incoming patient requests, verify/approve, attach to inventory or forward to donor matching.
* Emergency broadcast to the hospital's registered donor pool.
* Audit log of all inventory and request actions.

## 9.4 Blood Bank Module

* Component-level inventory: whole blood, PRBC, FFP, platelets, cryoprecipitate — per blood group.
* Unit-level tracking with collection date & expiry; FEFO alerts (first-expiry-first-out).
* Reservation workflow: recipient/hospital reserves a unit, blood bank confirms, hold expires after configurable window.
* Low-stock and expiry-risk alerts; shortage flags feed the demand-prediction model.

## 9.5 Emergency Workflow (Critical Path)

```
One-tap emergency request (blood group, units, hospital, urgency)
        ↓
Inventory check — nearby blood banks & hospital stock queried FIRST
        ↓  (if no stock or stock insufficient)
AI/rules ranking selects Wave 1: top 10 donors
        ↓
Push notifications sent (SMS fallback after 90 s if undelivered)
        ↓
No acceptance in 5 min → Wave 2: next 15 donors (radius +5 km)
        ↓
No acceptance in 10 min → Wave 3 + NGO/volunteer escalation + hospital broadcast
        ↓
Donor accepts → recipient notified → masked call enabled → navigation begins
        ↓
Arrival confirmed → donation completed → recorded → eligibility countdown starts
        ↓
Request closed with outcome; both sides rate the experience
```

**SLAs:** request creation < 60 s · Wave 1 dispatched < 15 s after inventory check · every state change pushed to recipient in real time.

**Anti-abuse:** rate limits on requests per account, hospital-verification badge for authenticity, duplicate-request detection (same patient/blood group/hospital), penalty & review flow for fraudulent requests.

## 9.6 AI Features

### 9.6.1 Donor Matching & Ranking

**MVP (rules-based score):**
`score = w1·compatibility + w2·proximity + w3·availability + w4·eligibility_margin + w5·historical_response_rate + w6·reliability`
* Exact-group match ranked above compatible-group match (preserve O− for true need).
* Reliability score: accept rate, show-up rate, cancellation history, profile freshness.

**v1.5 (learned model):** gradient-boosted ranker trained on v1.0 outcomes (responded? accepted? arrived?), with the rules score as fallback. All model decisions logged for auditability; no protected attributes (religion, caste, etc.) ever collected or used.

### 9.6.2 Blood Demand Prediction (v2.0)

Time-series forecasting per city × blood group using historical donations, hospital demand, seasonality (festivals, accident-prone periods, dengue season), and public events. Output: 7/30-day shortage risk alerts to blood banks and camp planners.

### 9.6.3 AI Chat Assistant (v2.0)

LLM-based assistant, strictly scoped: compatibility questions, eligibility rules, nearby facilities, app FAQs, emergency guidance ("call 108, then create a request"). **Guardrails:** no medical diagnosis, no treatment advice, escalation to human volunteers, all answers grounded in a curated knowledge base.

---

# 10. Functional Requirements

| ID | Requirement | Phase |
|---|---|---|
| FR-01 | Mobile OTP registration & login (retry with cooldown, voice-OTP fallback) | MVP |
| FR-02 | Google Sign-In; Apple Sign-In (iOS release) | MVP / v1.5 |
| FR-03 | Optional government ID verification via DigiLocker | v1.5 |
| FR-04 | Donor availability states: Available / Unavailable / Snoozed(until) / Ineligible(auto) / Unconfirmed(auto) | MVP |
| FR-05 | Search & filter: blood group (+compatibility expansion), radius, availability, verification tier | MVP |
| FR-06 | Rare blood group registry (Bombay phenotype, etc.) with dedicated escalation path | v1.5 |
| FR-07 | Emergency request creation, wave-based dispatch, live state tracking | MVP |
| FR-08 | In-app chat between matched donor & recipient (post-acceptance only) | MVP |
| FR-09 | Masked/proxied phone calls — personal numbers never exposed | MVP |
| FR-10 | Push notifications (FCM/APNs) with SMS fallback for emergency messages | MVP |
| FR-11 | Maps: navigation to hospital/blood bank; optional live donor ETA sharing (consent-gated) | MVP |
| FR-12 | Donation logging: hospital-confirmed or self-reported (self-reports flagged unverified) | MVP |
| FR-13 | Eligibility countdown, certificates (PDF + public QR verify URL), milestones | MVP |
| FR-14 | Hospital portal: onboarding, inventory CRUD, request queue, broadcasts, audit log | MVP (basic) |
| FR-15 | Blood bank module: components, expiry, reservations, alerts | v1.5 |
| FR-16 | Admin console: user moderation, request monitoring, fraud review, content management | MVP |
| FR-17 | NGO module: camps, volunteer assignment, escalated-request queue | v1.5 |
| FR-18 | Multi-language UI (Hindi, Tamil, Telugu, Bengali, English) | v2.0 |
| FR-19 | e-RaktKosh inventory bridge (read first, write where permitted) | v2.0 |
| FR-20 | Data export & account deletion (self-service, DPDP compliance) | MVP |

---

# 11. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Availability | 99.9% uptime for core emergency path; graceful degradation elsewhere |
| NFR-02 | Performance | Search results < 2 s (P95); emergency dispatch pipeline < 15 s |
| NFR-03 | Scale | Design for 1M registered users, 10K concurrent, 500 simultaneous active emergencies per region |
| NFR-04 | Security | TLS 1.3 everywhere; AES-256 at rest; secrets in a managed vault; OWASP MASVS for mobile |
| NFR-05 | Privacy | Data minimization; masked communication by default; location fuzzing in search results (exact location shared only post-acceptance) |
| NFR-06 | Compliance | India **DPDP Act 2023** (consent, purpose limitation, deletion rights); GDPR/HIPAA-inspired safeguards for health data; NBTC donor-eligibility norms encoded in rules engine |
| NFR-07 | Reliability | Notification delivery: multi-channel (push → SMS) with delivery receipts and automatic failover |
| NFR-08 | Offline support | Emergency request queueable offline, auto-sent on reconnect; cached hospital/blood bank directory with phone numbers |
| NFR-09 | Accessibility | WCAG 2.1 AA; large-touch emergency mode; screen-reader support |
| NFR-10 | Observability | Structured logging, tracing on the emergency path, alerting on SLA breaches; full audit trail for all inventory & request mutations |
| NFR-11 | Crash rate | < 0.2% sessions |
| NFR-12 | Data quality | Automated dedup (phone + device + fuzzy identity), stale-profile decay, periodic OTP revalidation |

---

# 12. Data Model (Key Entities)

* **User** (id, phone, auth providers, role[s], language, consent records)
* **DonorProfile** (blood group + verification tier, availability state, eligibility dates, health questionnaire snapshot, reliability score, location [city + fuzzy geo])
* **Institution** (type: hospital/blood bank/NGO, license info, verification status, staff accounts)
* **InventoryItem** (institution, component, blood group, units, collection/expiry dates)
* **BloodRequest** (requester, patient ref, blood group, units, urgency, hospital, state machine, verification badge)
* **Match** (request, donor, wave number, notified/responded/accepted/arrived/donated timestamps)
* **Donation** (donor, request?, institution, date, verified flag, certificate ref)
* **NotificationLog / AuditLog / Rating**

*(Full ERD to follow in the technical design doc.)*

---

# 13. Proposed System Architecture (Indicative)

| Layer | Choice (indicative) | Rationale |
|---|---|---|
| Mobile | React Native (Android-first) or native Kotlin | Speed vs. performance trade-off; RN acceptable for MVP |
| Web portals | React + TypeScript | Hospital/blood bank/admin consoles |
| API | Node.js (NestJS) or Go; REST + WebSocket for live tracking | Real-time state pushes on the emergency path |
| Data | PostgreSQL + PostGIS (geo queries), Redis (availability cache, dispatch queues) | Radius search, hot availability lookups |
| Queue/Jobs | BullMQ / SQS — notification waves, escalation timers, decay jobs | Wave dispatch is inherently queue-driven |
| Notifications | FCM/APNs + SMS gateway (MSG91/Twilio) with delivery receipts | Multi-channel failover |
| Calls | Masked calling via Exotel/Twilio Proxy | Privacy by default |
| Maps | Google Maps Platform / MapmyIndia | Navigation + geocoding, India coverage |
| ML | Offline training pipeline; online scoring service; feature store fed from Match outcomes | Rules → learned ranker migration path |
| Infra | Cloud (AWS/GCP, Mumbai region), IaC, autoscaling; multi-AZ for emergency path | Data residency + availability |

---

# 14. Privacy, Security & Trust

1. **Consent-first:** explicit, granular consent for location, notifications, and health data; recorded and revocable (DPDP requirement).
2. **Masked by default:** no personal phone numbers or exact addresses visible; contact unlocked only after mutual match acceptance, via proxy.
3. **Location fuzzing:** donors shown at neighborhood precision (~1 km) in search; precise location only for accepted navigation, with consent.
4. **Health data handling:** questionnaire and donation records classified as sensitive; encrypted, access-logged, never sold or shared with third parties.
5. **Verification transparency:** badges show *what* was verified (phone / ID / blood group), never raw documents.
6. **Right to disappear:** self-service deletion with defined retention only for legally required audit records.
7. **Abuse prevention:** request rate-limits, fraud review queue, donor block/report, penalty system for no-shows and fake requests on both sides.

---

# 15. Success Metrics & Targets

| Goal | Target (12 months post-launch) |
| --- | --- |
| Median blood match time (request → confirmed donor/unit) | < 5 minutes |
| Emergency donor response rate (responded within 10 min) | > 80% |
| Verified donor profiles (Tier ≥ 1 among active) | > 95% |
| Monthly active donor rate | > 70% of registered |
| Successful blood requests | > 90% |
| Requests resolved by inventory (no donor needed) | > 25% (proves institutional integration value) |
| User satisfaction (app rating) | > 4.7 / 5 |
| Crash rate | < 0.2% |
| Search latency (P95) | < 2 s |
| Stale-profile rate (no activity > 90 days among "available") | < 5% |

**Guardrail metrics:** donor notification fatigue (avg emergency pings per donor per month < 4), false/fraudulent request rate (< 1%), SMS fallback cost per fulfilled request.

---

# 16. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cold-start: few donors → poor match rates → churn | High | High | City-by-city launch with NGO/college partnerships; seed via blood camps; don't launch a city below donor-density threshold |
| Hospitals won't update inventory manually | High | Medium | Make updates < 2 min, offer CSV/API, show hospitals the demand data they gain in return |
| Notification fatigue kills response rates | Medium | High | Wave-based dispatch (never broadcast), per-donor monthly ping caps, quiet hours |
| Fake/fraudulent requests (touts, resale attempts) | Medium | High | Hospital verification badges, rate limits, fraud queue, in-app reporting, zero-tolerance bans |
| Regulatory shift (DPDP rules, health-data norms) | Medium | Medium | Privacy-by-design, DPO appointment, legal review each release |
| SMS/OTP delivery failures at critical moments | Medium | High | Multi-provider SMS failover, voice OTP, WhatsApp channel (v1.5) |
| ML model bias or opaque matching | Low | Medium | Rules fallback, decision logging, no sensitive attributes, periodic fairness review |
| Liability perception (platform "promised" blood) | Medium | High | Clear ToS: platform coordinates, does not guarantee; always surface 108 / blood bank phone numbers as parallel path |

---

# 17. Assumptions & Dependencies

**Assumptions**
* Donors will keep availability current if the burden is one tap and pings are rare.
* Hospitals will participate if the portal saves their staff time versus phone calls.
* Smartphone + data access is sufficient among target donor demographics in launch cities.

**Dependencies**
* SMS gateway & masked-calling provider contracts
* Maps provider licensing (India-compliant)
* DigiLocker API access for ID verification (v1.5)
* e-RaktKosh API/data-sharing agreement (v2.0)
* Hospital onboarding & legal agreements (data-sharing, verification responsibilities)

---

# 18. Open Questions

1. Final app name & branding (trademark search pending).
2. Launch cities — proposed: 2 pilot cities with strong NGO partners before wider rollout. Which two?
3. Should self-reported donations count toward eligibility countdown, or verified only?
4. Monetization timing for the institutional tier — free during pilot for how long?
5. WhatsApp Business as a notification channel in MVP or v1.5?
6. Does the platform need medical-device / health-app classification review in any target jurisdiction?

---

# 19. Glossary

* **e-RaktKosh** — Government of India's centralized blood bank management system.
* **NBTC** — National Blood Transfusion Council; sets donor eligibility norms in India.
* **DPDP Act 2023** — India's Digital Personal Data Protection Act.
* **PRBC / FFP** — Packed Red Blood Cells / Fresh Frozen Plasma (blood components).
* **Wave dispatch** — Notifying donors in ranked batches rather than broadcasting to all.
* **FEFO** — First-Expiry-First-Out inventory rotation.

---

# 20. Conclusion

RaktSetu moves beyond the donor-directory model by treating emergency blood search as a real-time coordination problem: verify identities continuously, know availability at all times, check institutional inventory *before* disturbing donors, and dispatch the right donors in intelligent waves with full privacy protection. The phased plan ships a bulletproof emergency loop first, earns the data needed for genuine AI matching second, and integrates with the national blood ecosystem third — positioning the platform as critical healthcare infrastructure capable of measurably saving lives.
