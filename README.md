# Access Request System

A simple full-stack application to manage access requests. The backend
uses in-memory storage (no database), and the frontend provides UI to
submit and manage requests.

## 🚀 Features

### Backend

-   Store Access Requests in memory.
-   Prevent duplicate pending requests for same `email + resource`.
-   Business rule: User cannot create more than **3 total requests**.
-   CRUD style endpoints:
    -   **POST /requests** --- Create request
    -   **GET /requests?status=** --- List requests (filter + sort)
    -   **PATCH /requests/:id/status** --- Approve/Reject only if
        pending

### Frontend

-   Form to submit new access request.
-   List view of requests with email, resource, status, createdAt.
-   Filters for All / Pending / Approved / Rejected.
-   Approve/Reject actions for pending items.
-   Basic loading/error UI.

## 🧱 Backend Requirements

### Data Model (In-Memory)

  Field       Type
  ----------- ---------------------------------
  id          string (UUID)
  email       string
  resource    string
  reason      string
  status      PENDING \| APPROVED \| REJECTED
  createdAt   ISO timestamp
  updatedAt   ISO timestamp

### API Endpoints

#### POST /requests

Creates a new request.

Validations: - Required: email, resource, reason - Reject if user has
already created **more than 3 requests** - Reject if duplicate pending
request exists for same `email + resource`

#### GET /requests?status=STATUS

Returns requests sorted by creation date (desc).

#### PATCH /requests/:id/status

Updates request status.

Rules: - Only allowed when request is still `PENDING`.

Payload:

``` json
{ "status": "APPROVED" }
```

## 🧱 Frontend Requirements

### Create Request Form

Client-side validation required.

### Requests List

Displays: - Email - Resource - Status - CreatedAt

### Filter Controls

All \| Pending \| Approved \| Rejected

### Request Actions

Approve/Reject buttons only for pending items.

### UI State Requirements

-   Show loading indicator.
-   Show error messages.

## ▶️ Running the Project

### Backend

    cd api
    npm install
    npm run dev

### Frontend

    cd frontend
    npm install
    npm run dev
