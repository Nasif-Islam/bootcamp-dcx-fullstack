# Sprint 1 — Backend API

## Goals

Build the core backend API for bikes, bookings, and user authentication.

## Tasks

### 1. Data Models & Types

- [x] Define TypeScript interfaces for Bike, Booking, User
- [x] Create in-memory data storage (arrays/Maps)
- [x] Add sample bike data (6+ bikes with different types)

### 2. Bikes API (Feature 2.1: View Available Bikes)

- [x] GET /api/bikes - List all bikes with availability status
- [x] GET /api/bikes/:id - Get single bike details
- [x] GET /api/bikes/:id/availability - Check availability for time range
- [x] Add filtering by bike type (mountain, road, city, electric)

### 3. Bookings API (Features 2.2, 2.3, 2.4, 2.5)

- [x] POST /api/bookings - Create a booking
  - [x] Validate start/end date/time
  - [x] Check for double booking conflicts
  - [x] Return confirmation with booking details
- [x] GET /api/bookings - List user's bookings
  - [x] Filter by userId query param
  - [x] Include bike details in response
- [x] DELETE /api/bookings/:id - Cancel a booking
  - [x] Update status to 'cancelled'
  - [x] Make time slot available again

### 4. Users API (Feature 2.6: Simple Registration/Login)

- [x] POST /api/users/register - Register new user
  - [x] Validate email and password
  - [x] Store user with hashed password (basic)
  - [x] Return user ID
- [x] POST /api/users/login - Login user
  - [x] Validate credentials
  - [x] Return user ID (mock token)
- [x] GET /api/users/:id - Get user profile

### 5. Testing

- [ ] Write tests for Bikes API endpoints
- [ ] Write tests for Bookings API endpoints
- [ ] Write tests for Users API endpoints
- [ ] Test availability conflict prevention

## API Response Format

```json
{
  "success": true,
  "data": { ... },
  "error": "Error message if success is false"
}
```

## Acceptance Criteria

- All endpoints return proper JSON responses
- Booking conflicts are prevented (no double bookings)
- User registration and login work correctly
- All tests pass (15+ test cases)
- API follows RESTful conventions
