# Security Specifications

RaktSetu implements strict security gates to safeguard sensitive donor healthcare information and coordinates.

## Core Rules

### 1. Authentication & Authorization
- **JWT (JSON Web Tokens)**: Cryptographically signed tokens handle session persistence.
- **RBAC (Role Based Access Control)**: Enforces access restrictions for donors, recipients, hospital staff, and administrators.
- **OTP Validation**: 6-digit OTP verification loops secure registration and credential flows.

### 2. Privacy & Data Masking
- **Location Fuzzing**: Donor searches return coordinates randomized to neighborhood levels (~1 km radius). Real locations are only shared post-match acceptance.
- **Contact Masking**: Actual phone numbers are hidden by default, accessible only upon mutual match confirmation.

### 3. Rate Limiting & Verification
- **OTP Limits**: Maximum 3 OTP requests per phone number per hour.
- **Request Throttling**: Limit maximum active requests per user account to prevent spam.

### 4. Regulatory Compliance
- **DPDP Act 2023**: Requires dynamic, revocable user consents for tracking location, notifications, and health survey inputs.
- **Audit Trails**: Logs all write-level and security-sensitive database transactions.
