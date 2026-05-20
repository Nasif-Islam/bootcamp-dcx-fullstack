# Sprint 2 — Frontend UI

## Goals

Build the React UI and connect it to the backend API. Create a responsive design for desktop, tablet, and mobile.

## Tasks

### 1. Types & API Client

- [x] Create TypeScript types matching backend
- [x] Create API client functions (fetch wrappers)
- [x] Add error handling for API calls

### 2. Authentication UI (Feature 2.6)

- [x] Create Login page/component
- [x] Create Registration page/component
- [x] Store user session (localStorage or state)
- [x] Add logout functionality
- [x] Protect routes requiring authentication

### 3. Bike Listing Page (Feature 2.1)

- [x] Create BikeList component
- [x] Create BikeCard component with:
  - [x] Bike image
  - [x] Name and type
  - [x] Price per hour
  - [x] Availability status badge
- [x] Add type filter (All, Mountain, Road, City, Electric)
- [x] Add loading and error states

### 4. Booking Flow (Features 2.2, 2.3)

- [x] Create BookingForm component with:
  - [x] Start date picker
  - [x] Start time picker
  - [x] End date picker
  - [x] End time picker
- [x] Add "Check Availability" button
- [x] Show availability status before booking
- [x] Calculate and display estimated price
- [x] Create "Confirm Booking" action
- [x] Create BookingSuccess confirmation component

### 5. My Bookings Page (Features 2.4, 2.5)

- [x] Create MyBookings component
- [x] Display upcoming bookings section
- [x] Display past/cancelled bookings section
- [x] Show booking details:
  - [x] Bike name and type
  - [x] Start/end date and time
  - [x] Status (confirmed/cancelled)
- [x] Add "Cancel Booking" button for upcoming bookings
- [x] Show cancellation confirmation

### 6. Navigation & Layout

- [x] Create app header with logo
- [x] Add navigation: Browse Bikes | My Bookings | Login/Logout
- [x] Create responsive layout (mobile-first)
- [x] Add footer

### 7. Styling & Polish

- [x] Apply consistent color scheme
- [x] Add hover effects and transitions
- [x] Ensure responsive design (320px - 1920px)
- [ ] Add loading spinners
- [ ] Add toast notifications for actions

### 8. Testing

- [x] Write component tests (6+ test cases)
- [x] Test user flows end-to-end
- [x] Test responsive breakpoints

## Component Structure

```
src/
├── components/
│   ├── BikeCard.tsx
│   ├── BikeList.tsx
│   ├── BookingForm.tsx
│   ├── BookingSuccess.tsx
│   ├── MyBookings.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── api.ts
├── types.ts
├── App.tsx
└── App.css
```

## Acceptance Criteria

- Users can register and login
- Users can browse available bikes with filtering
- Users can view bike details and check availability
- Users can select date/time and book a bike
- Confirmation message shown after booking
- Users can view their bookings list
- Users can cancel upcoming bookings
- UI is responsive (desktop, tablet, mobile)
- All tests pass (6+ test cases)

## Success Criteria (from PRD)

The project is successful if:

1. ✅ Users can view bikes
2. ✅ Users can create bookings
3. ✅ Users can view their bookings
4. ✅ Users can cancel bookings
5. ✅ Correct frontend-backend interaction
6. ✅ Basic understanding of CRUD operations demonstrated
