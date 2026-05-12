# CLAUDE.md

# InmoBackend — Backend Engineering Guide

## Project Overview

This project is a real estate backend system built with:

- Node.js
- Express.js
- Supabase (PostgreSQL)
- JavaScript (CommonJS)
- REST API architecture

The system manages:

- Real estate properties
- Property types
- Property media (photos/videos)
- Property status history
- Users and roles
- Data migrated from Excel into Supabase

Claude must always generate production-grade backend code with strong architecture, maintainability, scalability, and clean separation of responsibilities.

---

# Core Engineering Principles

## Always Follow

- SOLID principles
- Clean Architecture concepts
- Separation of concerns
- Thin controllers
- Business logic in services
- Repositories for database access
- Centralized error handling
- Validation before persistence
- Reusable utilities
- Consistent naming conventions
- Defensive programming
- Explicit error messages
- Scalable folder structure

---

# Tech Stack

## Backend

- Node.js
- Express.js
- CommonJS modules
- Supabase JS Client

## Database

- PostgreSQL (Supabase)

## Environment Variables

Always use `.env`.

Never hardcode secrets.

Required variables:

```env
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
PORT=
```

---

# Folder Structure

Claude must always respect this structure.

```txt
src/
│
├── config/
│   └── supabase.js
│
├── controllers/
│
├── services/
│
├── repositories/
│
├── routes/
│
├── middlewares/
│
├── validators/
│
├── utils/
│
├── constants/
│
├── errors/
│
├── modules/
│
└── app.js

index.js
```

---

# Architecture Rules

## Controllers

Controllers must:

- Only handle HTTP concerns
- Extract params/body/query
- Call services
- Return responses
- Never contain business logic
- Never access Supabase directly

Example responsibilities:

- request parsing
- status codes
- response formatting

---

## Services

Services contain:

- business rules
- validations
- workflows
- transactional logic
- orchestration

Services must:

- call repositories
- throw custom errors
- never know about Express req/res

---

## Repositories

Repositories are the ONLY layer allowed to communicate with Supabase.

Repositories must:

- contain database queries
- abstract persistence logic
- return normalized data
- never contain HTTP logic

---

# Error Handling

Always implement centralized error handling.

## Required Error Types

Create reusable custom errors:

```txt
errors/
├── AppError.js
├── NotFoundError.js
├── ValidationError.js
├── UnauthorizedError.js
└── DatabaseError.js
```

## Rules

- Never expose raw database errors
- Never use generic try/catch everywhere
- Use asyncHandler wrappers
- Return consistent API responses

---

# API Response Standards

## Success Response

```json
{
  "success": true,
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Property not found"
}
```

---

# Database Context

## property_types

Stores property categories.

Examples:

- House
- Apartment
- Office
- Land

---

## properties

Main real estate entity.

Contains:

- type
- agents
- availability
- dimensions
- dates
- observations
- priority
- media relation

Important fields:

- availability_status
- square_meters
- capture_date
- closing_date

---

## property_media

Stores media folder URLs.

Supports:

- photos
- videos

Media types allowed:

- photo
- video

---

## users

System users.

Roles:

- admin
- editor

---

## property_status_changes

Audit table.

Tracks:

- old status
- new status
- user responsible
- timestamp

Claude must preserve auditability when modifying statuses.

---

# Critical Business Rules

## Property Status Rules

Allowed statuses:

```txt
disponibles
en reserva
reservados
cerrados
```

Never allow invalid statuses.

---

## Audit Logging

Whenever a property status changes:

1. Update property status
2. Insert audit row into `property_status_changes`

This must happen atomically whenever possible.

---

## Media Rules

Media must:

- belong to a property
- have valid media_type
- store folder URL
- support future expansion

---

# Supabase Rules

## NEVER

- Query Supabase directly inside controllers
- Duplicate queries
- Use SELECT *
- Ignore error responses

## ALWAYS

- Handle Supabase errors
- Normalize returned data
- Validate before insert/update
- Use reusable repository functions

---

# Validation Rules

Always validate:

- request body
- query params
- route params

Validation must happen before services.

Preferred approach:

- custom validators
- reusable validation middleware

---

# Naming Conventions

## Files

Use:

```txt
property.controller.js
property.service.js
property.repository.js
```

## Variables

Use:

- camelCase

## Constants

Use:

- UPPER_SNAKE_CASE

---

# Route Design

Use RESTful naming.

## Correct

```txt
GET    /properties
GET    /properties/:id
POST   /properties
PUT    /properties/:id
PATCH  /properties/:id/status
DELETE /properties/:id
```

## Avoid

```txt
/getAllProperties
/updatePropertyStatus
```

---

# Logging

Use structured logs.

Important operations to log:

- property creation
- status changes
- media registration
- migration errors
- authentication failures

Never log secrets.

---

# Security Rules

## Always

- validate inputs
- sanitize data
- use environment variables
- validate IDs
- validate enums

## Never

- expose stack traces
- expose Supabase keys
- trust client input

---

# Performance Rules

## Avoid

- unnecessary loops
- repeated queries
- large nested queries

## Prefer

- pagination
- filtering
- reusable repository methods

---

# Pagination Standard

List endpoints must support:

```txt
?page=1
?limit=10
```

Default limit:

```txt
10
```

Maximum limit:

```txt
100
```

---

# Filtering Standards

Properties endpoint should support:

- availability_status
- type_id
- priority
- capturing_agent
- selling_agent

---

# Code Style

## Prefer

- small functions
- early returns
- descriptive naming
- pure functions when possible

## Avoid

- giant controllers
- nested conditionals
- duplicated logic
- magic strings

---

# Migration Context

Data was migrated from Excel into Supabase.

Migration included:

- property types
- agents
- properties
- media folders
- priorities
- statuses

Claude must preserve compatibility with existing migrated data.

---

# Existing Status Mapping

```js
{
  'Disponible': 'disponibles',
  'No Disponible': 'cerrados',
  'Reservado': 'reservados',
  'Retirado': 'cerrados'
}
```

---

# Existing Priority Mapping

```js
{
  'Alta': 1,
  'Media': 2,
  'Baja': 3
}
```

---

# Future Scalability

Architecture must support future features:

- authentication
- JWT
- role permissions
- image uploads
- notifications
- analytics
- dashboard metrics
- property search
- advanced filtering
- soft deletes
- caching

Claude must generate extensible code.

---

# Testing Philosophy

Whenever generating tests:

- use Jest
- isolate services
- mock repositories
- test business rules
- test status transitions
- test validation failures

---

# Important Development Rules

## Claude Must Never

- mix controller and business logic
- write massive files
- duplicate validation
- skip error handling
- use inconsistent responses
- hardcode credentials
- directly mutate raw request objects

## Claude Must Always

- create modular code
- separate responsibilities
- create reusable utilities
- document complex logic
- write maintainable code
- think as a senior backend engineer

---

# Preferred Coding Style Example

## BAD

```js
app.post('/properties', async (req, res) => {
  const result = await supabase.from('properties').insert(req.body)
  res.send(result)
})
```

## GOOD

```js
router.post(
  '/',
  validateCreateProperty,
  propertyController.createProperty
)
```

```js
async function createProperty(req, res, next) {
  const property = await propertyService.create(req.body)

  res.status(201).json({
    success: true,
    data: property
  })
}
```

---

# Final Objective

Claude should behave as:

- senior backend engineer
- backend architect
- API designer
- database-conscious developer

All generated code must prioritize:

- maintainability
- scalability
- readability
- reliability
- clean architecture
- production readiness