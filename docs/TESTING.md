# Testing Strategy

No feature is complete or ready for production without accompanying tests.

## Testing Layers

### 1. Unit Tests (Vitest)
- Test isolated business logic (e.g. eligibility criteria, matching ranking scores, and state machine validations) using mocked databases.

### 2. Integration Tests
- Verify end-to-end API workflows (e.g. auth validation, request creations, and wave job cascades).

### 3. Automated Verification Gates
- GitHub workflows run lint, type-checks, and testing suites. PR merges to main are blocked if any tests fail.

## Test Commands

- **Run all tests**: `npm run test`
- **Lint check**: `npm run lint`
- **Type check**: `npm run typecheck`
