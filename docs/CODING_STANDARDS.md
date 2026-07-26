# Coding Standards

Follow these code style rules to ensure codebase maintainability and readability.

## Guidelines

### 1. Language Rules
- **Strict TypeScript**: Never use `any`. Explicitly type all variables, function arguments, and return types.
- **Zod Schemas**: Validate all internal data schemas and boundaries. Shared schemas live in `packages/shared`.

### 2. Backend Design Patterns
- Keep functions modular and small (under 50 lines).
- Avoid side effects in database operations by using pure services.
- Log critical transactions using structured JSON loggers.

### 3. Frontend / React Rules
- Maintain mobile-first responsive interfaces down to 375px.
- Use compositions over complex logic paths. Keep component lengths under 300 lines.
- Implement explicit loading, empty, success, and error states for interactive UI screens.
