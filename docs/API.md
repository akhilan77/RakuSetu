# API Documentation

## Base URL
`/api/v1`

## Endpoints

### 1. Authentication
* `POST /auth/request-otp`
  - Body: `{ phone: string }`
  - Action: Initiates OTP creation via MSG91, throttled by rate limiters.
* `POST /auth/verify-otp`
  - Body: `{ phone: string, otp: string }`
  - Returns: `{ token: string, user: User }`
* `GET /auth/me`
  - Returns: `{ user: User }`

### 2. Donor Profile
* `POST /donors`
  - Body: Registration payload with survey answers.
* `GET /donors/me`
  - Returns: `{ profile: DonorProfile }`
* `PATCH /donors/me/availability`
  - Body: `{ status: AvailabilityEnum, snoozeUntil?: Date }`

### 3. Geolocation & Search
* `GET /donors/search`
  - Query Parameters: `bg` (Blood Group), `lat`, `lng`, `radiusKm`
  - Returns: List of compatible donors within range, containing only fuzzed coordinates and distance bands.

### 4. Emergency Requests
* `POST /requests`
  - Body: Urgency, blood group, units required, hospital identifier, patient note.
  - Returns: `{ request: BloodRequest }`
* `GET /requests/:id`
  - Returns request details and real-time dispatch wave counters.
* `POST /requests/:id/close`
  - Body: `{ reason: ClosureReasonEnum }`

### 5. Matches & Lifecycle
* `POST /matches/:id/accept`
  - Action: Updates match status to ACCEPTED, cancels remaining dispatch jobs for this wave, and unlocks recipient contact info.
* `POST /matches/:id/status`
  - Body: `{ status: MatchStatusEnum }`
