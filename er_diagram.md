# ER Diagram — CareerCrew AI

```mermaid
erDiagram
    User {
        String id PK "cuid()"
        String fullName
        String email UK
        String password "nullable"
        String provider "default: local"
        String providerId "nullable"
        String avatar "nullable"
        DateTime createdAt
        DateTime updatedAt
    }

    Resume {
        String id PK "cuid()"
        String title "default: My Resume"
        String fullName
        String phone "nullable"
        String email
        String github "nullable"
        String linkedin "nullable"
        String portfolio "nullable"
        Json skills
        Json experience "nullable"
        Json projects
        Json education
        Json achievements "nullable"
        Text jobDescription
        Text latexCode "nullable"
        String userId FK
        DateTime createdAt
        DateTime updatedAt
    }

    UserProfile {
        String id PK "cuid()"
        String fullName
        String email
        String phone "nullable"
        String github "nullable"
        String linkedin "nullable"
        String portfolio "nullable"
        Json skills
        Json experience "nullable"
        Json projects
        Json education
        Json achievements "nullable"
        String userId FK "UK, unique"
        DateTime createdAt
        DateTime updatedAt
    }

    Application {
        String id PK "cuid()"
        Text jobDescription
        Json parsedJob "nullable"
        Float matchScore "nullable"
        Json matchAnalysis "nullable"
        Text tailoredResume "nullable"
        Text coverLetter "nullable"
        Json coldEmail "nullable"
        String status "default: processing"
        String userId FK
        DateTime createdAt
        DateTime updatedAt
    }

    JobSchedule {
        String id PK "cuid()"
        String name "default: My Job Search"
        Boolean isActive "default: true"
        String cronExpression
        String timezone "default: Asia/Kolkata"
        Json targetRoles
        Json locations
        String workType "default: any"
        String experienceLevel "default: any"
        Int salaryMin "nullable"
        Int salaryMax "nullable"
        String postAge "default: 24h"
        Int minMatchScore "default: 60"
        Int maxApplications "default: 5"
        DateTime lastRunAt "nullable"
        String lastRunStatus "nullable"
        Int totalRuns "default: 0"
        Int totalApplied "default: 0"
        String userId FK
        DateTime createdAt
        DateTime updatedAt
    }

    DiscoveredJob {
        String id PK "cuid()"
        String title
        String company
        String location "nullable"
        String salary "nullable"
        String url "nullable"
        String source
        DateTime postedAt "nullable"
        Text description
        Float matchScore "nullable"
        Text matchReason "nullable"
        String status "default: discovered"
        String applicationId FK "UK, unique, nullable"
        String scheduleId FK
        DateTime createdAt
    }

    User ||--o{ Resume : "has many"
    User ||--o| UserProfile : "has one"
    User ||--o{ Application : "has many"
    User ||--o{ JobSchedule : "has many"
    JobSchedule ||--o{ DiscoveredJob : "discovers"
    Application ||--o| DiscoveredJob : "sourced from"
```

## Relationship Summary

| Relationship | Type | On Delete | Description |
|---|---|---|---|
| **User → Resume** | One-to-Many | Cascade | A user owns multiple resumes |
| **User → UserProfile** | One-to-One | Cascade | A user has one master profile |
| **User → Application** | One-to-Many | Cascade | A user creates multiple applications |
| **User → JobSchedule** | One-to-Many | Cascade | A user configures multiple autopilot schedules |
| **JobSchedule → DiscoveredJob** | One-to-Many | Cascade | A schedule discovers multiple jobs |
| **Application → DiscoveredJob** | One-to-One (optional) | — | A discovered job may link to the application it generated |

## Status Lifecycles

**Application.status:**
`processing` → `completed` | `failed`

**DiscoveredJob.status:**
`discovered` → `qualified` → `applied` | `skipped` | `below_threshold`

**JobSchedule.lastRunStatus:**
`success` | `partial` | `failed` | `no_matches`
