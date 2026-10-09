# FixMyCampus — Phase 1: Shared Backend Foundation

## 1. Purpose

Phase 1 is the **shared backend foundation** that both developers must agree on and build before splitting into separate backend tasks.

Authentication is **already implemented** using ASP.NET Core Identity.

> **Do NOT modify the existing authentication implementation during Phase 1.**

---

# 2. Phase 1 Goals

By the end of Phase 1, the backend must have:

- [ ] `Campus` entity
- [ ] `Building` entity
- [ ] `Ticket` entity
- [ ] `TicketHistory` entity
- [ ] `TicketStatus` enum
- [ ] Entity Framework relationships
- [ ] Updated `ApplicationDbContext`
- [ ] Database migration
- [ ] Database created successfully
- [ ] Seed data
- [ ] Existing Identity integration preserved

---

# 3. Final Domain Structure

The main relationship is:

```text
Campus
   │
   │ 1
   │
   └────────── * Building
                    │
                    │ 1
                    │
                    └────────── * Ticket
                                    │
                                    │ 1
                                    │
                                    └────────── * TicketHistory
```

Identity connects to the ticket system:

```text
ApplicationUser
      │
      ├────────── * Ticket
      │              │
      │              └── Reporter
      │
      └────────── * TicketHistory
                     │
                     └── ChangedByUser
```

---

# 4. Project Structure

After Phase 1, the backend should contain:

```text
FixMyCampus.Api/
│
├── Controllers/
│
├── Models/
│   ├── Campus.cs
│   ├── Building.cs
│   ├── Ticket.cs
│   └── TicketHistory.cs
│
├── Enums/
│   └── TicketStatus.cs
│
├── Data/
│   ├── ApplicationDbContext.cs
│   └── SeedData.cs
│
├── DTOs/
│
├── Services/
│
├── Program.cs
│
└── ...
```

The existing authentication files remain unchanged unless a relationship to Identity is required.

---

# 5. Step 1 — TicketStatus

Create:

```text
Enums/TicketStatus.cs
```

Use exactly four statuses:

```csharp
namespace FixMyCampus.Api.Enums;

public enum TicketStatus
{
    New,
    Assigned,
    InProgress,
    Resolved
}
```

## Status Workflow

The status order is:

```text
New
 ↓
Assigned
 ↓
InProgress
 ↓
Resolved
```

This workflow will be enforced by the backend in a later phase.

---

# 6. Step 2 — Campus Entity

Create:

```text
Models/Campus.cs
```

```csharp
namespace FixMyCampus.Api.Models;

public class Campus
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Location { get; set; } = null!;

    public ICollection<Building> Buildings { get; set; }
        = new List<Building>();
}
```

## Campus Responsibilities

A campus contains multiple buildings.

Relationship:

```text
Campus 1 ───────── * Building
```

---

# 7. Step 3 — Building Entity

Create:

```text
Models/Building.cs
```

```csharp
namespace FixMyCampus.Api.Models;

public class Building
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int CampusId { get; set; }

    public Campus Campus { get; set; } = null!;

    public ICollection<Ticket> Tickets { get; set; }
        = new List<Ticket>();
}
```

## Building Responsibilities

Each building belongs to exactly one campus.

Each building can contain multiple tickets.

```text
Campus
   │
   └── Building
          │
          └── Tickets
```

---

# 8. Step 4 — Ticket Entity

Create:

```text
Models/Ticket.cs
```

```csharp
using FixMyCampus.Api.Enums;

namespace FixMyCampus.Api.Models;

public class Ticket
{
    public int Id { get; set; }

    public string Category { get; set; } = null!;

    public int BuildingId { get; set; }

    public Building Building { get; set; } = null!;

    public string Room { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string ReporterId { get; set; } = null!;

    public ApplicationUser Reporter { get; set; } = null!;

    public string? TechnicianName { get; set; }

    public TicketStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<TicketHistory> History { get; set; }
        = new List<TicketHistory>();
}
```

---

# 9. Ticket Fields

| Property         | Type              | Purpose                       |
| ---------------- | ----------------- | ----------------------------- |
| `Id`             | `int`             | Ticket identifier             |
| `Category`       | `string`          | Type of campus issue          |
| `BuildingId`     | `int`             | Building containing the issue |
| `Building`       | `Building`        | Building navigation property  |
| `Room`           | `string`          | Room/location                 |
| `Description`    | `string`          | Issue description             |
| `ReporterId`     | `string`          | Identity user who reported    |
| `Reporter`       | `ApplicationUser` | Reporter navigation property  |
| `TechnicianName` | `string?`         | Assigned technician           |
| `Status`         | `TicketStatus`    | Current ticket state          |
| `CreatedAt`      | `DateTime`        | Creation timestamp            |
| `History`        | Collection        | Status history                |

---

# 10. Important Ticket Rules

The frontend must NOT control these fields:

```text
ReporterId
Status
CreatedAt
```

The server will determine them.

When a reporter creates a ticket:

```text
Authenticated User
        ↓
ReporterId = current user
        ↓
Status = New
        ↓
CreatedAt = current UTC time
```

---

# 11. Step 5 — TicketHistory Entity

Create:

```text
Models/TicketHistory.cs
```

```csharp
using FixMyCampus.Api.Enums;

namespace FixMyCampus.Api.Models;

public class TicketHistory
{
    public int Id { get; set; }

    public int TicketId { get; set; }

    public Ticket Ticket { get; set; } = null!;

    public TicketStatus? FromStatus { get; set; }

    public TicketStatus ToStatus { get; set; }

    public string ChangedByUserId { get; set; } = null!;

    public ApplicationUser ChangedByUser { get; set; } = null!;

    public DateTime ChangedAt { get; set; }
}
```

---

# 12. TicketHistory Purpose

`TicketHistory` records every status change.

Example:

```text
Ticket #1

New
 ↓
Assigned
 ↓
InProgress
 ↓
Resolved
```

Database history:

```text
History #1
FromStatus: null
ToStatus: New

History #2
FromStatus: New
ToStatus: Assigned

History #3
FromStatus: Assigned
ToStatus: InProgress

History #4
FromStatus: InProgress
ToStatus: Resolved
```

For the MVP, the important history records are the status transitions performed after ticket creation.

---

# 13. Identity Integration

Authentication already exists.

Use the existing:

```text
ApplicationUser
```

Do NOT create:

```text
User.cs
```

Do NOT create another users table.

The relationship is:

```text
ApplicationUser
      │
      ├── ReporterId → Ticket
      │
      └── ChangedByUserId → TicketHistory
```

The exact `ApplicationUser` implementation must match the existing authentication code.

---

# 14. Step 6 — ApplicationDbContext

Open the existing:

```text
Data/ApplicationDbContext.cs
```

Add the domain `DbSet`s:

```csharp
public DbSet<Campus> Campuses => Set<Campus>();

public DbSet<Building> Buildings => Set<Building>();

public DbSet<Ticket> Tickets => Set<Ticket>();

public DbSet<TicketHistory> TicketHistories => Set<TicketHistory>();
```

Do NOT remove the existing Identity configuration.

---

# 15. EF Core Relationships

Configure the following relationships.

## Campus → Building

```text
Campus 1 ─────── * Building
```

A building belongs to one campus.

---

## Building → Ticket

```text
Building 1 ─────── * Ticket
```

A ticket belongs to one building.

---

## Ticket → TicketHistory

```text
Ticket 1 ─────── * TicketHistory
```

A ticket can have multiple history records.

---

## User → Ticket

```text
ApplicationUser 1 ─────── * Ticket
```

A user can report multiple tickets.

---

## User → TicketHistory

```text
ApplicationUser 1 ─────── * TicketHistory
```

A user can perform multiple status changes.

---

# 16. Relationship Diagram

```text
                       ┌──────────────────┐
                       │  ApplicationUser │
                       └────────┬─────────┘
                                │
                    ┌───────────┴────────────┐
                    │                        │
                    ▼                        ▼
              ┌──────────┐             ┌───────────────┐
              │  Ticket  │             │ TicketHistory │
              └────┬─────┘             └───────────────┘
                   │
                   │
                   ▼
             ┌──────────┐
             │ Building │
             └────┬─────┘
                  │
                  ▼
             ┌─────────┐
             │ Campus  │
             └─────────┘
```

---

# 17. Step 7 — Migration

After the models and relationships are correctly configured:

```bash
dotnet ef migrations add AddFixMyCampusDomain
```

Then:

```bash
dotnet ef database update
```

If your solution has separate API and Persistence projects, use the appropriate project/startup-project arguments for your existing solution structure.

---

# 18. Database Tables

After migration, the application domain should contain:

```text
Campuses
Buildings
Tickets
TicketHistories
```

ASP.NET Core Identity tables will also exist.

The important point is:

> Identity tables are managed by Identity. The FixMyCampus domain consists of the four tables above.

---

# 19. Expected Database Structure

## Campuses

```text
Campuses
--------------------------------
Id              PK
Name
Location
```

## Buildings

```text
Buildings
--------------------------------
Id              PK
Name
CampusId        FK → Campuses.Id
```

## Tickets

```text
Tickets
--------------------------------
Id              PK
Category
BuildingId      FK → Buildings.Id
Room
Description
ReporterId      FK → Identity User
TechnicianName
Status
CreatedAt
```

## TicketHistories

```text
TicketHistories
--------------------------------
Id              PK
TicketId        FK → Tickets.Id
FromStatus
ToStatus
ChangedByUserId FK → Identity User
ChangedAt
```

---

# 20. Step 8 — Seed Data

Create:

```text
Data/SeedData.cs
```

Seed enough data for development and demonstration.

Example:

```text
Campus
└── Main Campus
    │
    ├── Engineering Building
    ├── Science Building
    ├── Administration Building
    └── Library
```

Example database:

```text
Main Campus
│
├── Engineering Building
│   ├── Room 101
│   ├── Room 204
│   └── Room 305
│
├── Science Building
│   ├── Room 101
│   └── Room 202
│
├── Administration Building
│   └── Room 105
│
└── Library
    ├── Ground Floor
    └── First Floor
```

You do not need to create individual rooms as database records.

`Room` remains a property of the ticket.

---

# 21. Seed Data Rules

Seed:

- At least 1 campus
- At least 3 buildings
- Useful building names

Do not seed unnecessary:

- Users
- Technicians
- Tickets

unless needed for development/demo testing.

Your existing authentication/Identity seed should remain responsible for roles/admin users.

---

# 22. Developer Responsibilities During Phase 1

Both developers should work together on the foundation.

### Developer 1

Take the lead on:

```text
Campus
Building
DbContext
Database configuration
Migration
Seed data
```

### Developer 2

Review and help with:

```text
Ticket
TicketHistory
TicketStatus
Identity relationships
EF Core relationships
Database verification
```

Do not split the database work into two independent versions.

There must be **one agreed database model**.

---

# 23. Git Strategy

Before Phase 1:

```bash
git pull
```

Create a shared foundation branch:

```bash
git checkout -b feature/backend-foundation
```

Both developers should coordinate changes to the foundation.

After the database foundation is stable:

```text
feature/backend-foundation
              │
              ├── feature/backend-reporter
              │
              └── feature/backend-admin
```

Then each developer can work independently.

---

# 24. Phase 1 Testing Checklist

Before moving to Phase 2, verify:

### Build

```bash
dotnet build
```

Must succeed.

### Migration

```bash
dotnet ef migrations add AddFixMyCampusDomain
```

Must succeed.

### Database

```bash
dotnet ef database update
```

Must succeed.

### Application

```bash
dotnet run
```

Must start without database/EF errors.

### Database verification

Confirm:

```text
[✓] Campuses
[✓] Buildings
[✓] Tickets
[✓] TicketHistories
[✓] Identity tables
```

---

# 25. Phase 1 Definition of Done

Phase 1 is complete only when:

```text
[✓] Authentication still works
[✓] Application builds
[✓] Campus entity exists
[✓] Building entity exists
[✓] Ticket entity exists
[✓] TicketHistory entity exists
[✓] TicketStatus exists
[✓] EF relationships work
[✓] Migration succeeds
[✓] Database update succeeds
[✓] Seed data exists
[✓] No duplicate User entity/table was created
[✓] No authentication code was unnecessarily changed
```

---

# 26. STOP HERE

Do **not** start:

```text
Controllers
DTOs
Admin endpoints
Reporter endpoints
Status workflow service
```

until the Phase 1 database foundation is working.

After Phase 1 is confirmed, the backend splits into:

```text
                  Phase 2
                     │
          ┌──────────┴──────────┐
          │                     │
    Developer 1           Developer 2
          │                     │
    Reporter Side          Admin Side
          │                     │
    Campus API             Admin Tickets
    Building API           Assignment
    Create Ticket          Status Workflow
    Campus Feed            Ticket History
    My Tickets
    Ticket Details
```

**Next step:** verify your existing `ApplicationUser` and `ApplicationDbContext` before creating the migration. This prevents us from breaking the authentication system that is already working.
