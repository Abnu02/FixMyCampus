# FixMyCampus --- MVP Architecture, API & Data Model

## 1. Project Overview

FixMyCampus is a campus issue reporting and maintenance tracking system.

The MVP supports two roles:

-   **Reporter** --- student or staff member who reports campus
    problems.
-   **Admin** --- manages tickets, assigns technicians, and moves
    tickets through the required workflow.

The official FixMyCampus workflow is:

``` text
New → Assigned → In Progress → Resolved
```

The server must reject skipped or backward status transitions with HTTP
`400 Bad Request`.

The system uses:

-   **Frontend:** Angular
-   **Backend:** ASP.NET Core Web API
-   **Authentication:** ASP.NET Core Identity
-   **Data Access:** Entity Framework Core
-   **Database:** Relational database
-   **Communication:** REST API + JSON

------------------------------------------------------------------------

# 2. Architecture

``` text
┌─────────────────────────────────────────────────────────────┐
│                    ANGULAR FRONTEND                         │
│                                                             │
│ Login │ Campus Feed │ Create Ticket │ My Tickets            │
│                                                             │
│                 Admin Dashboard                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP / JSON
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 ASP.NET CORE WEB API                        │
│                                                             │
│ Controllers                                                 │
│      │                                                      │
│      ▼                                                      │
│ DTOs + Validation                                           │
│      │                                                      │
│      ▼                                                      │
│ Application Services                                        │
│   ├── Ticket Service                                        │
│   ├── Status Workflow Service                               │
│   └── Campus/Building Service                               │
│      │                                                      │
│      ▼                                                      │
│ Entity Framework Core                                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    RELATIONAL DATABASE                       │
│                                                             │
│ ASP.NET Identity                                            │
│ ├── AspNetUsers                                             │
│ ├── AspNetRoles                                             │
│ └── AspNetUserRoles                                         │
│                                                             │
│ Application Tables                                          │
│ ├── Campuses                                                │
│ ├── Buildings                                               │
│ ├── Tickets                                                 │
│ └── TicketHistories                                         │
└─────────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 3. User Authentication

ASP.NET Core Identity is responsible for authentication and
authorization.

We do **not** create a custom `Users` table.

## Roles

``` text
Reporter
Admin
```

## ApplicationUser

``` csharp
public class ApplicationUser : IdentityUser
{
}
```

Identity provides tables such as:

``` text
AspNetUsers
AspNetRoles
AspNetUserRoles
AspNetUserClaims
AspNetUserLogins
AspNetUserTokens
```

The application references the Identity user using `ReporterId` and
`ChangedByUserId`.

------------------------------------------------------------------------

# 4. Location Model

FixMyCampus has a clear location hierarchy:

``` text
Campus
   │
   └── Building
          │
          └── Ticket
```

This means a ticket belongs to a building, and the building belongs to a
campus.

## Campus

``` text
Campus
----------------
Id
Name
Location
```

Example:

``` json
{
  "id": 1,
  "name": "Main Campus",
  "location": "Addis Ababa"
}
```

## Building

``` text
Building
----------------
Id
Name
CampusId
```

Example:

``` json
{
  "id": 1,
  "name": "Block A",
  "campusId": 1
}
```

## Why Campus and Building are separate

A university can have multiple campuses.

Each campus can contain multiple buildings.

``` text
Main Campus
├── Block A
├── Block B
└── Block C

Science Campus
├── Science Block 1
└── Science Block 2
```

This also allows the campus feed to filter tickets by building while
preserving the larger campus structure.

------------------------------------------------------------------------

# 5. Database Schema

For the application domain, use four tables:

``` text
Campuses
Buildings
Tickets
TicketHistories
```

ASP.NET Core Identity tables are managed separately by Identity.

This satisfies the hackathon's small schema target while giving us a
proper location hierarchy.

------------------------------------------------------------------------

## 5.1 Campuses

  Column     Type     Key   Required
  ---------- -------- ----- ----------
  Id         int      PK    Yes
  Name       string         Yes
  Location   string         Yes

------------------------------------------------------------------------

## 5.2 Buildings

  Column     Type     Key   Required
  ---------- -------- ----- ----------
  Id         int      PK    Yes
  Name       string         Yes
  CampusId   int      FK    Yes

Relationship:

``` text
Campus 1 ───────── * Building
```

------------------------------------------------------------------------

## 5.3 Tickets

  Column           Type       Key   Required
  ---------------- ---------- ----- ----------
  Id               int        PK    Yes
  Category         string           Yes
  BuildingId       int        FK    Yes
  Room             string           Yes
  Description      string           Yes
  ReporterId       string     FK    Yes
  TechnicianName   string           No
  Status           enum             Yes
  CreatedAt        DateTime         Yes

Relationship:

``` text
Building 1 ───────── * Ticket
ApplicationUser 1 ── * Ticket
```

------------------------------------------------------------------------

## 5.4 TicketHistories

  Column            Type       Key   Required
  ----------------- ---------- ----- ----------
  Id                int        PK    Yes
  TicketId          int        FK    Yes
  FromStatus        enum             No
  ToStatus          enum             Yes
  ChangedByUserId   string     FK    Yes
  ChangedAt         DateTime         Yes

Relationship:

``` text
Ticket 1 ───────── * TicketHistory
ApplicationUser 1 ─ * TicketHistory
```

------------------------------------------------------------------------

# 6. Entity Relationship Diagram

``` text
┌──────────────────┐
│     Campus       │
├──────────────────┤
│ Id PK            │
│ Name             │
│ Location         │
└────────┬─────────┘
         │ 1
         │
         │ *
┌────────▼─────────┐
│    Building      │
├──────────────────┤
│ Id PK            │
│ Name             │
│ CampusId FK      │
└────────┬─────────┘
         │ 1
         │
         │ *
┌────────▼─────────┐
│      Ticket      │
├──────────────────┤
│ Id PK            │
│ Category         │
│ BuildingId FK    │
│ Room             │
│ Description      │
│ ReporterId FK    │──────────────┐
│ TechnicianName   │              │
│ Status           │              │
│ CreatedAt        │              │
└────────┬─────────┘              │
         │ 1                      │
         │                        │
         │ *                      │
┌────────▼────────────┐           │
│   TicketHistory     │           │
├─────────────────────┤           │
│ Id PK               │           │
│ TicketId FK         │           │
│ FromStatus          │           │
│ ToStatus            │           │
│ ChangedByUserId FK  │───────────┘
│ ChangedAt           │
└─────────────────────┘

        ASP.NET CORE IDENTITY
        ┌──────────────────┐
        │ ApplicationUser  │
        ├──────────────────┤
        │ Id PK            │
        │ Email            │
        │ PasswordHash     │
        │ ...              │
        └──────────────────┘
```

------------------------------------------------------------------------

# 7. Class Diagram

The following Mermaid class diagram can be pasted into any
Mermaid-compatible Markdown viewer.

``` mermaid
classDiagram

    class ApplicationUser {
        +string Id
        +string UserName
        +string Email
    }

    class Campus {
        +int Id
        +string Name
        +string Location
        +ICollection~Building~ Buildings
    }

    class Building {
        +int Id
        +string Name
        +int CampusId
        +Campus Campus
        +ICollection~Ticket~ Tickets
    }

    class Ticket {
        +int Id
        +string Category
        +int BuildingId
        +string Room
        +string Description
        +string ReporterId
        +string TechnicianName
        +TicketStatus Status
        +DateTime CreatedAt
        +Building Building
        +ApplicationUser Reporter
        +ICollection~TicketHistory~ History
    }

    class TicketHistory {
        +int Id
        +int TicketId
        +TicketStatus? FromStatus
        +TicketStatus ToStatus
        +string ChangedByUserId
        +DateTime ChangedAt
        +Ticket Ticket
        +ApplicationUser ChangedByUser
    }

    class TicketStatus {
        <<enumeration>>
        New
        Assigned
        InProgress
        Resolved
    }

    Campus "1" --> "*" Building : contains
    Building "1" --> "*" Ticket : contains
    ApplicationUser "1" --> "*" Ticket : reports
    Ticket "1" --> "*" TicketHistory : has history
    ApplicationUser "1" --> "*" TicketHistory : changes
    Ticket --> TicketStatus : has
```

------------------------------------------------------------------------

# 8. Ticket Workflow

The server must enforce this exact lifecycle:

``` text
┌─────────┐
│   NEW   │
└────┬────┘
     │ Assign technician
     ▼
┌──────────┐
│ ASSIGNED │
└────┬─────┘
     │ Start work
     ▼
┌─────────────┐
│ IN PROGRESS │
└──────┬──────┘
       │ Resolve
       ▼
┌──────────┐
│ RESOLVED │
└──────────┘
```

## Valid transitions

``` text
New → Assigned
Assigned → InProgress
InProgress → Resolved
```

## Invalid transitions

``` text
New → InProgress
New → Resolved

Assigned → New
Assigned → Resolved

InProgress → New
InProgress → Assigned

Resolved → New
Resolved → Assigned
Resolved → InProgress
```

All invalid transitions return:

``` http
400 Bad Request
```

------------------------------------------------------------------------

# 9. API Base URL

``` text
/api/v1
```

------------------------------------------------------------------------

# 10. Authentication Endpoints

## Register

``` http
POST /api/v1/auth/register
```

### Request

``` json
{
  "email": "student@campus.edu",
  "password": "Password123!"
}
```

### Response --- 201

``` json
{
  "message": "User registered successfully."
}
```

Normal registration should create a Reporter. Admin accounts can be
seeded.

------------------------------------------------------------------------

## Login

``` http
POST /api/v1/auth/login
```

### Request

``` json
{
  "email": "student@campus.edu",
  "password": "Password123!"
}
```

### Response --- 200

``` json
{
  "userId": "identity-user-id",
  "email": "student@campus.edu",
  "role": "Reporter"
}
```

------------------------------------------------------------------------

## Current User

``` http
GET /api/v1/auth/me
```

### Response

``` json
{
  "userId": "identity-user-id",
  "email": "student@campus.edu",
  "role": "Reporter"
}
```

------------------------------------------------------------------------

# 11. Campus Endpoints

## Get Campuses

``` http
GET /api/v1/campuses
```

### Response

``` json
[
  {
    "id": 1,
    "name": "Main Campus",
    "location": "Addis Ababa"
  }
]
```

------------------------------------------------------------------------

## Get Campus

``` http
GET /api/v1/campuses/{id}
```

Example:

``` http
GET /api/v1/campuses/1
```

### Response

``` json
{
  "id": 1,
  "name": "Main Campus",
  "location": "Addis Ababa"
}
```

------------------------------------------------------------------------

# 12. Building Endpoints

## Get Buildings

``` http
GET /api/v1/buildings
```

Optional campus filter:

``` http
GET /api/v1/buildings?campusId=1
```

### Response

``` json
[
  {
    "id": 1,
    "name": "Block A",
    "campusId": 1
  },
  {
    "id": 2,
    "name": "Block B",
    "campusId": 1
  }
]
```

------------------------------------------------------------------------

## Get Building

``` http
GET /api/v1/buildings/{id}
```

Example:

``` http
GET /api/v1/buildings/1
```

------------------------------------------------------------------------

# 13. Ticket Endpoints

## Create Ticket

``` http
POST /api/v1/tickets
```

**Role:** Reporter

### Request

``` json
{
  "category": "Electrical",
  "buildingId": 1,
  "room": "204",
  "description": "Power outlet is not working."
}
```

The server gets the `ReporterId` from the authenticated Identity user.

The frontend must not be trusted to supply the reporter ID.

### Response --- 201 Created

``` json
{
  "id": 1,
  "category": "Electrical",
  "buildingId": 1,
  "buildingName": "Block A",
  "campusName": "Main Campus",
  "room": "204",
  "description": "Power outlet is not working.",
  "technicianName": null,
  "status": "New",
  "createdAt": "2026-10-05T10:30:00Z"
}
```

------------------------------------------------------------------------

# 14. Campus Feed

``` http
GET /api/v1/tickets
```

### Filter by building

``` http
GET /api/v1/tickets?buildingId=1
```

### Filter by status

``` http
GET /api/v1/tickets?status=New
```

### Filter by both

``` http
GET /api/v1/tickets?buildingId=1&status=New
```

### Response

``` json
[
  {
    "id": 1,
    "category": "Electrical",
    "buildingId": 1,
    "buildingName": "Block A",
    "campusName": "Main Campus",
    "room": "204",
    "status": "New",
    "createdAt": "2026-10-05T10:30:00Z"
  }
]
```

------------------------------------------------------------------------

# 15. Ticket Details

``` http
GET /api/v1/tickets/{id}
```

Example:

``` http
GET /api/v1/tickets/1
```

### Response

``` json
{
  "id": 1,
  "category": "Electrical",
  "buildingId": 1,
  "buildingName": "Block A",
  "campusName": "Main Campus",
  "room": "204",
  "description": "Power outlet is not working.",
  "technicianName": "Abebe",
  "status": "InProgress",
  "createdAt": "2026-10-05T10:30:00Z",
  "history": [
    {
      "fromStatus": null,
      "toStatus": "New",
      "changedAt": "2026-10-05T10:30:00Z"
    },
    {
      "fromStatus": "New",
      "toStatus": "Assigned",
      "changedAt": "2026-10-05T10:45:00Z"
    },
    {
      "fromStatus": "Assigned",
      "toStatus": "InProgress",
      "changedAt": "2026-10-05T11:10:00Z"
    }
  ]
}
```

------------------------------------------------------------------------

# 16. My Tickets

``` http
GET /api/v1/tickets/my
```

**Role:** Reporter

### Response

``` json
[
  {
    "id": 1,
    "category": "Electrical",
    "buildingName": "Block A",
    "room": "204",
    "status": "InProgress",
    "createdAt": "2026-10-05T10:30:00Z"
  }
]
```

------------------------------------------------------------------------

# 17. Admin Ticket Dashboard

``` http
GET /api/v1/admin/tickets
```

**Role:** Admin

### Filters

``` http
GET /api/v1/admin/tickets?status=New
```

``` http
GET /api/v1/admin/tickets?buildingId=1
```

``` http
GET /api/v1/admin/tickets?buildingId=1&status=New
```

### Response

``` json
[
  {
    "id": 1,
    "category": "Electrical",
    "buildingName": "Block A",
    "room": "204",
    "status": "New",
    "technicianName": null,
    "createdAt": "2026-10-05T10:30:00Z"
  }
]
```

------------------------------------------------------------------------

# 18. Assign Technician

``` http
PATCH /api/v1/admin/tickets/{id}/assign
```

**Role:** Admin

### Request

``` json
{
  "technicianName": "Abebe"
}
```

### Server logic

``` text
1. Find ticket
2. Verify ticket exists
3. Verify status = New
4. Verify technician name is provided
5. Save technician name
6. Change status New → Assigned
7. Create TicketHistory
8. Save transaction
```

### Response

``` json
{
  "id": 1,
  "technicianName": "Abebe",
  "status": "Assigned"
}
```

------------------------------------------------------------------------

# 19. Move Ticket Status

``` http
PATCH /api/v1/admin/tickets/{id}/status
```

**Role:** Admin

### Request

``` json
{
  "status": "InProgress"
}
```

### Valid example

``` text
Assigned → InProgress
```

### Response

``` json
{
  "id": 1,
  "status": "InProgress"
}
```

------------------------------------------------------------------------

# 20. Illegal Status Example

Current status:

``` text
New
```

Request:

``` http
PATCH /api/v1/admin/tickets/1/status
```

``` json
{
  "status": "Resolved"
}
```

Response:

``` http
400 Bad Request
```

``` json
{
  "message": "Invalid status transition. Ticket must move from New to Assigned first."
}
```

------------------------------------------------------------------------

# 21. HTTP Status Codes

  Code   Meaning
  ------ ---------------------------------------------
  200    Successful request
  201    Resource created
  400    Invalid request / invalid status transition
  401    Not authenticated
  403    Authenticated but not authorized
  404    Resource not found

------------------------------------------------------------------------

# 22. Complete Endpoint List

  -------------------------------------------------------------------------------------------
  Method            Endpoint                              Role              Purpose
  ----------------- ------------------------------------- ----------------- -----------------
  POST              `/api/v1/auth/register`               Public            Register Reporter

  POST              `/api/v1/auth/login`                  Public            Login

  GET               `/api/v1/auth/me`                     Authenticated     Current user

  GET               `/api/v1/campuses`                    Authenticated     List campuses

  GET               `/api/v1/campuses/{id}`               Authenticated     Campus details

  GET               `/api/v1/buildings`                   Authenticated     List/filter
                                                                            buildings

  GET               `/api/v1/buildings/{id}`              Authenticated     Building details

  POST              `/api/v1/tickets`                     Reporter          Create ticket

  GET               `/api/v1/tickets`                     Authenticated     Campus feed

  GET               `/api/v1/tickets/{id}`                Authenticated     Ticket details

  GET               `/api/v1/tickets/my`                  Reporter          My tickets

  GET               `/api/v1/admin/tickets`               Admin             Admin ticket
                                                                            dashboard

  PATCH             `/api/v1/admin/tickets/{id}/assign`   Admin             Assign technician

  PATCH             `/api/v1/admin/tickets/{id}/status`   Admin             Move status
  -------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 23. DTOs

We should not expose EF Core entities directly.

## CreateTicketRequest

``` csharp
public class CreateTicketRequest
{
    public string Category { get; set; } = null!;
    public int BuildingId { get; set; }
    public string Room { get; set; } = null!;
    public string Description { get; set; } = null!;
}
```

## AssignTechnicianRequest

``` csharp
public class AssignTechnicianRequest
{
    public string TechnicianName { get; set; } = null!;
}
```

## UpdateTicketStatusRequest

``` csharp
public class UpdateTicketStatusRequest
{
    public TicketStatus Status { get; set; }
}
```

------------------------------------------------------------------------

# 24. Service Responsibilities

## TicketService

Responsible for:

``` text
Create ticket
Get campus feed
Get ticket details
Get reporter's tickets
Get admin tickets
Assign technician
```

## StatusWorkflowService

Responsible for:

``` text
Validate status transitions
Create status history
Reject illegal transitions
```

The controller should **not** contain these business rules.

------------------------------------------------------------------------

# 25. Recommended Backend Structure

``` text
FixMyCampus.Api
│
├── Controllers
│   ├── AuthController.cs
│   ├── CampusesController.cs
│   ├── BuildingsController.cs
│   ├── TicketsController.cs
│   └── AdminTicketsController.cs
│
├── Models
│   ├── ApplicationUser.cs
│   ├── Campus.cs
│   ├── Building.cs
│   ├── Ticket.cs
│   └── TicketHistory.cs
│
├── DTOs
│   ├── Auth
│   │   ├── RegisterRequest.cs
│   │   ├── LoginRequest.cs
│   │   └── UserResponse.cs
│   │
│   ├── Campus
│   │   ├── CampusResponse.cs
│   │   └── BuildingResponse.cs
│   │
│   └── Ticket
│       ├── CreateTicketRequest.cs
│       ├── AssignTechnicianRequest.cs
│       ├── UpdateTicketStatusRequest.cs
│       ├── TicketListResponse.cs
│       └── TicketDetailsResponse.cs
│
├── Services
│   ├── ITicketService.cs
│   ├── TicketService.cs
│   ├── IStatusWorkflowService.cs
│   └── StatusWorkflowService.cs
│
├── Data
│   ├── ApplicationDbContext.cs
│   └── SeedData.cs
│
├── Enums
│   └── TicketStatus.cs
│
└── Program.cs
```

------------------------------------------------------------------------

# 26. MVP Demo Flow

The final demo should follow this exact sequence:

``` text
1. Login as Reporter
        ↓
2. Select Campus
        ↓
3. Select Building
        ↓
4. Create ticket
        ↓
5. Ticket appears as NEW
        ↓
6. Open Campus Feed
        ↓
7. Filter by Building
        ↓
8. Login as Admin
        ↓
9. Open Admin Dashboard
        ↓
10. Assign technician
        ↓
11. NEW → ASSIGNED
        ↓
12. ASSIGNED → IN PROGRESS
        ↓
13. IN PROGRESS → RESOLVED
        ↓
14. Open ticket details
        ↓
15. Show timestamped history
        ↓
16. Demonstrate illegal skip
        ↓
17. NEW → RESOLVED
        ↓
18. API returns 400
```

This directly demonstrates the required FixMyCampus journey and the
server-side hard rule. The hackathon's scoring specifically identifies
the complete `ticket filed → assigned → in progress → resolved` flow and
illegal-skip rejection as the key functional test.

------------------------------------------------------------------------

# 27. Scope Control

### Included in MVP

-   ASP.NET Core Identity
-   Reporter/Admin roles
-   Campus
-   Building
-   Ticket
-   Ticket history
-   Campus feed
-   Building filter
-   Status filter
-   My tickets
-   Admin dashboard
-   Technician assignment
-   Server-side status workflow
-   Timestamped history
-   Angular validation
-   API error handling

### Not required initially

-   Chat
-   Notifications
-   Maps
-   Payment
-   SMS
-   Technician accounts
-   Complex scheduling
-   Mobile application

### Optional after core MVP

The official challenge suggests extras such as urgency levels, building
dropdowns, reporter confirmation after resolution, and admin counts by
building. These should only be attempted after the core workflow is
stable.

------------------------------------------------------------------------

# 28. Final Domain Model

``` text
                         ┌─────────────────────┐
                         │   ApplicationUser   │
                         │  ASP.NET Identity   │
                         └─────────┬───────────┘
                                   │
                        reports    │
                                   ▼
┌───────────────┐       ┌─────────────────────┐
│    Campus     │ 1   * │      Building       │
├───────────────┤───────├─────────────────────┤
│ Id            │       │ Id                  │
│ Name          │       │ Name                │
│ Location      │       │ CampusId            │
└───────────────┘       └──────────┬──────────┘
                                   │
                                   │ 1
                                   │
                                   │ *
                                   ▼
                         ┌─────────────────────┐
                         │       Ticket        │
                         ├─────────────────────┤
                         │ Id                  │
                         │ Category            │
                         │ BuildingId          │
                         │ Room                │
                         │ Description         │
                         │ ReporterId          │
                         │ TechnicianName      │
                         │ Status              │
                         │ CreatedAt           │
                         └──────────┬──────────┘
                                    │
                                    │ 1
                                    │
                                    │ *
                                    ▼
                         ┌─────────────────────┐
                         │   TicketHistory     │
                         ├─────────────────────┤
                         │ Id                  │
                         │ TicketId            │
                         │ FromStatus          │
                         │ ToStatus            │
                         │ ChangedByUserId     │
                         │ ChangedAt           │
                         └─────────────────────┘
```

## 29. Implementation Order

Build in this order:

``` text
1. Create ASP.NET Core Web API
          ↓
2. Install/configure Identity
          ↓
3. Create ApplicationUser
          ↓
4. Create Campus
          ↓
5. Create Building
          ↓
6. Create Ticket
          ↓
7. Create TicketHistory
          ↓
8. Create TicketStatus enum
          ↓
9. Configure EF Core relationships
          ↓
10. Create migration
          ↓
11. Seed Admin + Reporter + Campus + Buildings
          ↓
12. Build authentication endpoints
          ↓
13. Build ticket endpoints
          ↓
14. Build status workflow service
          ↓
15. Test API with Swagger/Postman
          ↓
16. Build Angular
          ↓
17. Connect Angular to API
          ↓
18. Test complete demo flow
```

------------------------------------------------------------------------

## Hackathon Alignment

This design follows the source requirements for FixMyCampus:
Reporter/Admin authentication, ticket creation with
category/building/room/description, campus feed filtering, ticket
history, reporter's tickets, admin dashboard, technician assignment, and
server-side forward-only status validation.
fileciteturn0file0L97-L121

It also follows the mandated Angular, ASP.NET Core Web API, EF Core
relational database, DTO, controller/service, HTTP-status-code, and
authorization requirements. fileciteturn0file0L171-L201
