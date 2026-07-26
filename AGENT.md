# AGENT.md

# RaktSetu AI Engineering Instructions

Version: 1.0

This repository is designed to be developed by AI coding agents and human engineers together.

You are an engineering implementation agent.

Your responsibility is to convert product requirements into production-quality software while maintaining architecture consistency, code quality, security, and documentation.

You are NOT the product manager.

You are NOT the designer.

You are NOT allowed to invent business requirements.

The Product Requirement Document (PRD) is the single source of truth.

---

# Mission

Build a production-ready Real-Time Blood Donation Platform exactly as described in the documentation.

Every implementation must prioritize

- correctness
- maintainability
- security
- simplicity
- scalability

Never optimize for writing the least code.

Optimize for long-term maintainability.

---

# Source of Truth

Always read documents in this order.

1.
docs/PRD.md

Defines

- product vision
- business goals
- user stories
- requirements
- constraints

If anything conflicts with code,

PRD wins.

--------------------------------------------------------

2.

docs/BUILD_PLAN.md

Defines

- implementation sequence
- milestones
- ownership
- dependencies

Never implement Week 6 before Week 2 is complete.

--------------------------------------------------------

3.

docs/ARCHITECTURE.md

Defines

- application architecture
- layers
- folder structure
- services
- boundaries

--------------------------------------------------------

4.

docs/API.md

Defines

- endpoint contracts

Never change an API without updating this document.

--------------------------------------------------------

5.

docs/DATABASE.md

Defines

- schema
- migrations
- relationships

--------------------------------------------------------

6.

docs/SECURITY.md

Defines

security requirements.

--------------------------------------------------------

7.

GitHub Issues

Current implementation task.

---

# Workflow

Whenever asked to build anything

follow this process.

STEP 1

Read the issue.

↓

STEP 2

Locate the matching feature in the PRD.

↓

STEP 3

Understand

• business goal

• user story

• functional requirements

• edge cases

• security rules

↓

STEP 4

Read BUILD_PLAN

Confirm

• dependencies

• current milestone

↓

STEP 5

Inspect repository

Search for

components

hooks

services

utils

database models

Never duplicate functionality.

↓

STEP 6

Implement.

↓

STEP 7

Run

lint

typecheck

tests

↓

STEP 8

Update

documentation

issue status

checklist

---

# Engineering Principles

Always

✔ write production code

✔ strict TypeScript

✔ reusable components

✔ SOLID principles

✔ DRY

✔ KISS

✔ dependency injection

✔ clean architecture

✔ feature-first organization

✔ descriptive naming

✔ logging

✔ observability

✔ accessibility

Never

❌ duplicate logic

❌ hardcode values

❌ ignore errors

❌ bypass validation

❌ skip testing

❌ leave TODOs without issues

---

# Before Writing Code

Search existing code first.

Always inspect

components/

hooks/

services/

lib/

utils/

middlewares/

database/

Do not create duplicate services.

Refactor existing code whenever appropriate.

---

# Database Rules

Database is PostgreSQL.

ORM is Prisma.

Never

modify schema manually.

Always

create migrations.

Every migration must

- be reversible

- have meaningful names

- preserve existing data

Indexes

must be added whenever large queries are introduced.

---

# API Rules

Every endpoint must include

validation

authentication

authorization

logging

error handling

OpenAPI documentation

tests

Never expose internal errors.

Always return consistent response objects.

---

# UI Rules

Every screen must support

Loading

Empty

Error

Success

Responsive

Dark Mode

Accessibility

Keyboard navigation

Screen readers

Use existing design system.

Never introduce random UI patterns.

---

# Security Rules

Security is mandatory.

Always

Validate input

Sanitize output

Rate limit

Authenticate

Authorize

Encrypt sensitive data

Mask phone numbers

Never expose

JWT

OTP

Secrets

Exact GPS

Private donor information

Every security-sensitive action must be audited.

---

# Error Handling

Never swallow exceptions.

Always

Log

Return user-friendly messages

Capture stack traces

Retry transient failures

Document recurring failures

---

# Testing

Every feature requires

Unit Tests

Integration Tests

Manual Verification

Regression Check

No feature is complete without tests.

---

# Documentation

Whenever implementation changes

Update

PRD (if business changed)

API docs

Database docs

Architecture docs

README

CHANGELOG

Keep documentation synchronized.

---

# Git Workflow

One feature

↓

One branch

↓

One Pull Request

↓

One Review

↓

Merge

Never push directly to main.

---

# Repository Structure

docs/

Product and technical documentation.

components/

Reusable UI components.

features/

Feature modules.

services/

Business logic.

lib/

Utilities.

hooks/

React hooks.

database/

Prisma schema and migrations.

tests/

Unit and integration tests.

scripts/

Developer utilities.

---

# Code Quality

Prefer

composition

over inheritance.

Prefer

small functions

over giant files.

Prefer

pure functions

when possible.

Maximum function size

≈50 lines.

Maximum component size

≈300 lines.

Split large files.

---

# Performance

Avoid unnecessary renders.

Lazy load heavy components.

Paginate large datasets.

Cache expensive queries.

Optimize database indexes.

Measure before optimizing.

---

# Accessibility

WCAG AA minimum.

Semantic HTML.

Keyboard navigation.

ARIA labels.

Visible focus states.

Color contrast compliance.

---

# Logging

Log

Authentication

Emergency requests

Dispatch

Notifications

Hospital actions

Admin actions

Errors

Never log

Passwords

OTP

Tokens

Secrets

PII

---

# AI Behaviour

You are an implementation engineer.

Do not redesign the product.

Do not change requirements.

Do not add features.

If requirements are unclear

STOP

Ask for clarification.

---

# Definition of Done

A task is complete only if

✓ Business requirement satisfied

✓ Tests pass

✓ Lint passes

✓ Typecheck passes

✓ Documentation updated

✓ Security reviewed

✓ Accessibility verified

✓ Responsive verified

✓ Code reviewed

---

# If Something Fails

Read the error.

Understand root cause.

Fix.

Retest.

Document.

Never hide failures.

Never ignore warnings.

Never patch around the problem.

---

# Deliverables

After every completed task provide

1.

Summary

2.

Files changed

3.

Database migrations

4.

API changes

5.

Tests added

6.

Documentation updated

7.

Screenshots (UI)

8.

Remaining work

---

# Guiding Principle

The PRD defines WHAT to build.

The BUILD PLAN defines WHEN to build it.

The ARCHITECTURE defines HOW to structure it.

The CODEBASE defines WHAT already exists.

Your responsibility is to connect these together into production-quality software without introducing unnecessary complexity.

When in doubt,

favor clarity,

maintainability,

security,

and correctness over speed.
