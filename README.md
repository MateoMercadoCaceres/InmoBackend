# InmoBackend

REST API for real estate property management built with Node.js, Express, and Supabase (PostgreSQL).

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Database:** PostgreSQL via Supabase
- **Language:** JavaScript (CommonJS)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=9382
```

> Use the **service role key** (not the anon key) — it bypasses Row Level Security for server-side operations.

### 3. Start the server

```bash
npm start
```

Server runs at `http://localhost:9382`
Swagger UI available at `http://localhost:9382/api-docs`

---

## Base URL

```
http://localhost:9382/api
```

All endpoints are prefixed with `/api`.

---

## Response Format

Every response follows a consistent envelope:

### Success
```json
{
  "success": true,
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

---

## Pagination

List endpoints support pagination via query params:

| Param | Default | Max | Description |
|-------|---------|-----|-------------|
| `page` | `1` | — | Page number |
| `limit` | `10` | `100` | Results per page |

Paginated responses include a `meta` object inside `data`:

```json
{
  "success": true,
  "data": {
    "data": [...],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 42
    }
  }
}
```

---

## Endpoints

### Properties

#### `GET /api/properties`

List properties with optional filters and pagination.

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Results per page (default: 10, max: 100) |
| `availability_status` | string | Filter by status |
| `type_id` | integer | Filter by property type |
| `priority` | integer | Filter by priority (1, 2, 3) |
| `capturing_agent` | string | Filter by capturing agent |
| `selling_agent` | string | Filter by selling agent |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "type_id": 2,
        "user_id": 1,
        "captor": "Juan Pérez",
        "description": "Casa en zona norte",
        "availability_status": "disponibles",
        "square_meters": 120.5,
        "capturing_agent": "Agente A",
        "selling_agent": "Agente B",
        "observations": "Excelente ubicación",
        "capture_date": "2024-01-15",
        "closing_date": null,
        "priority": 1,
        "ad_image_available": false,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 42
    }
  }
}
```

---

#### `GET /api/properties/:id`

Get a single property by ID.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "type_id": 2,
    "user_id": 1,
    "captor": "Juan Pérez",
    "description": "Casa en zona norte",
    "availability_status": "disponibles",
    "square_meters": 120.5,
    "capturing_agent": "Agente A",
    "selling_agent": "Agente B",
    "observations": "Excelente ubicación",
    "capture_date": "2024-01-15",
    "closing_date": null,
    "priority": 1,
    "ad_image_available": false,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Response `404`:**
```json
{
  "success": false,
  "message": "Property 99 not found"
}
```

---

#### `POST /api/properties`

Create a new property.

**Request body:**
```json
{
  "type_id": 2,
  "user_id": 1,
  "captor": "Juan Pérez",
  "description": "Casa en zona norte",
  "availability_status": "disponibles",
  "square_meters": 120.5,
  "capturing_agent": "Agente A",
  "selling_agent": "Agente B",
  "observations": "Excelente ubicación",
  "capture_date": "2024-01-15",
  "closing_date": null,
  "priority": 1,
  "ad_image_available": false
}
```

**Required fields:** `type_id`, `captor`, `description`, `availability_status`

**Response `201`:**
```json
{
  "success": true,
  "data": { ...property }
}
```

---

#### `PUT /api/properties/:id`

Update a property by ID.

**Request body:** same shape as `POST /api/properties` (all fields optional on update)

**Response `200`:**
```json
{
  "success": true,
  "data": { ...updatedProperty }
}
```

---

#### `PATCH /api/properties/:id/status`

Update property availability status. Automatically records an audit entry in `property_status_changes`.

**Request body:**
```json
{
  "status": "reservados",
  "user_id": 1
}
```

**Allowed statuses:** `disponibles` · `en reserva` · `reservados` · `cerrados`

**Response `200`:**
```json
{
  "success": true,
  "data": { ...updatedProperty }
}
```

**Response `400`:**
```json
{
  "success": false,
  "message": "status must be one of: disponibles, en reserva, reservados, cerrados"
}
```

---

#### `DELETE /api/properties/:id`

Delete a property by ID.

**Response `204`:** No content

---

### Media

#### `GET /api/media/property/:propertyId`

Get all media items for a property.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "property_id": 5,
      "media_type": "photo",
      "media_folder_url": "https://drive.google.com/drive/folders/abc123"
    }
  ]
}
```

---

#### `POST /api/media`

Add a media item to a property.

**Request body:**
```json
{
  "property_id": 5,
  "media_type": "photo",
  "media_folder_url": "https://drive.google.com/drive/folders/abc123"
}
```

**Required fields:** `property_id`, `media_type`, `media_folder_url`

**Allowed media types:** `photo` · `video`

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "property_id": 5,
    "media_type": "photo",
    "media_folder_url": "https://drive.google.com/drive/folders/abc123"
  }
}
```

---

#### `DELETE /api/media/:id`

Delete a media item by ID.

**Response `204`:** No content

---

### Users

#### `GET /api/users`

List all users.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "María García",
      "email": "maria@inmobiliaria.com",
      "role": "admin"
    }
  ]
}
```

---

#### `GET /api/users/:id`

Get a single user by ID.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "María García",
    "email": "maria@inmobiliaria.com",
    "role": "admin"
  }
}
```

---

#### `POST /api/users`

Create a new user.

**Request body:**
```json
{
  "name": "María García",
  "email": "maria@inmobiliaria.com",
  "role": "admin"
}
```

**Required fields:** `name`, `email`, `role`

**Allowed roles:** `admin` · `editor`

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "María García",
    "email": "maria@inmobiliaria.com",
    "role": "admin"
  }
}
```

**Response `400` (duplicate email):**
```json
{
  "success": false,
  "message": "User with email maria@inmobiliaria.com already exists"
}
```

---

## Data Models

### Property

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-generated |
| `type_id` | integer | FK → `property_types.id` |
| `user_id` | integer | FK → `users.id` |
| `captor` | string | Person who captured the listing |
| `description` | string | Property description |
| `availability_status` | string | `disponibles` · `en reserva` · `reservados` · `cerrados` |
| `square_meters` | number | |
| `capturing_agent` | string | |
| `selling_agent` | string | |
| `observations` | string | |
| `capture_date` | date | `YYYY-MM-DD` |
| `closing_date` | date | `YYYY-MM-DD` |
| `priority` | integer | `1` (Alta) · `2` (Media) · `3` (Baja) |
| `ad_image_available` | boolean | Default `false` |
| `created_at` | timestamp | Auto-generated |

### Media

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-generated |
| `property_id` | integer | FK → `properties.id` |
| `media_type` | string | `photo` · `video` |
| `media_folder_url` | string | URL to the media folder |

### User

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-generated |
| `name` | string | |
| `email` | string | Unique |
| `role` | string | `admin` · `editor` |

### Property Status Change (audit)

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-generated |
| `property_id` | integer | FK → `properties.id` |
| `user_id` | integer | FK → `users.id` |
| `old_status` | string | |
| `new_status` | string | |
| `changed_at` | timestamp | Auto-generated |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `204` | Deleted (no content) |
| `400` | Validation error |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Project Structure

```
src/
├── config/
│   ├── supabase.js         Supabase client
│   └── swagger.js          OpenAPI spec
├── constants/
│   ├── mediaTypes.js
│   ├── pagination.js
│   └── propertyStatuses.js
├── controllers/
│   ├── media.controller.js
│   ├── property.controller.js
│   └── user.controller.js
├── errors/
│   ├── AppError.js
│   ├── DatabaseError.js
│   ├── NotFoundError.js
│   ├── UnauthorizedError.js
│   └── ValidationError.js
├── middlewares/
│   ├── auth.js
│   ├── errorHandler.js
│   └── notFound.js
├── repositories/
│   ├── media.repository.js
│   ├── property.repository.js
│   ├── status.repository.js
│   └── user.repository.js
├── routes/
│   ├── index.js
│   ├── media.routes.js
│   ├── property.routes.js
│   └── user.routes.js
├── services/
│   ├── media.service.js
│   ├── property.service.js
│   └── user.service.js
├── utils/
│   ├── asyncHandler.js
│   ├── pagination.js
│   └── response.js
├── validators/
│   ├── media.validator.js
│   ├── property.validator.js
│   └── user.validator.js
└── app.js

index.js
```
