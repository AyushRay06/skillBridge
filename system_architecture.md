# System Architecture — CareerCrew AI

---

## 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph Client ["Client Layer"]
        Browser["Browser"]
        NextApp["Next.js 16 App<br/>(React 19, TypeScript)<br/>Tailwind CSS 4, Framer Motion"]
    end

    subgraph Gateway ["API Gateway & Middleware"]
        CORS["CORS Middleware<br/>(Whitelist Origins)"]
        CookieParser["Cookie Parser"]
        PassportInit["Passport.js Init<br/>(Stateless / No Sessions)"]
        AuthMW["JWT Auth Middleware<br/>(protectRoute)"]
        RateLimiter["Rate Limiter<br/>(Upstash Ratelimit)"]
    end

    subgraph BackendAPI ["Express.js 5 API Server"]
        direction TB
        AuthRoutes["/api/auth<br/>signup, login, logout, me"]
        OAuthRoutes["/api/auth<br/>google, github callbacks"]
        ProfileRoutes["/api/profile<br/>get, update, import"]
        ResumeRoutes["/api/resume<br/>create, get, getAll, delete, pdf"]
        ApplyRoutes["/api/apply<br/>one-click, get, getAll, delete, pdf"]
        AutopilotRoutes["/api/autopilot<br/>schedules CRUD, trigger, jobs"]
        InngestEndpoint["/api/inngest<br/>Inngest Serve Handler"]
    end

    subgraph AILayer ["AI / Agent Layer (LangGraph)"]
        OneClickGraph["One-Click Apply Graph<br/>(5-node pipeline)"]
        AutopilotGraph["Autopilot Graph<br/>(5-node pipeline)"]
        FlashModel["Gemini Flash Lite<br/>(Fast: parsing, scoring)"]
        ProModel["Gemini Flash Lite<br/>(Quality: resume, cover letter)"]
    end

    subgraph DataLayer ["Data Layer"]
        Prisma["Prisma ORM Client"]
        PostgreSQL[("PostgreSQL<br/>(Neon Serverless)")]
        Redis[("Upstash Redis<br/>(Rate Limiting)")]
    end

    subgraph ExternalServices ["External Services"]
        Google["Google OAuth 2.0"]
        GitHub["GitHub OAuth 2.0"]
        InngestCloud["Inngest Cloud<br/>(Cron & Event Queue)"]
        JSearch["JSearch API<br/>(RapidAPI)"]
        Remotive["Remotive API<br/>(Free, Remote Jobs)"]
        LaTeXOnline["LaTeX.ytotech.com<br/>(PDF Compilation)"]
    end

    subgraph Deployment ["Deployment"]
        VercelFE["Vercel<br/>(Frontend)"]
        VercelBE["Vercel Serverless<br/>(Backend API)"]
        Docker["Docker<br/>(node:18-alpine)"]
    end

    Browser --> NextApp
    NextApp -- "REST + JWT Cookie" --> CORS
    CORS --> CookieParser --> PassportInit
    PassportInit --> AuthMW
    AuthMW --> RateLimiter

    RateLimiter --> AuthRoutes
    RateLimiter --> OAuthRoutes
    RateLimiter --> ProfileRoutes
    RateLimiter --> ResumeRoutes
    RateLimiter --> ApplyRoutes
    RateLimiter --> AutopilotRoutes
    RateLimiter --> InngestEndpoint

    OAuthRoutes --> Google
    OAuthRoutes --> GitHub

    ResumeRoutes --> OneClickGraph
    ApplyRoutes --> OneClickGraph
    AutopilotRoutes --> InngestCloud
    InngestCloud -- "HTTP POST" --> InngestEndpoint
    InngestEndpoint --> AutopilotGraph

    OneClickGraph --> FlashModel
    OneClickGraph --> ProModel
    AutopilotGraph --> FlashModel
    AutopilotGraph --> ProModel
    AutopilotGraph --> JSearch
    AutopilotGraph --> Remotive

    ResumeRoutes -- "LaTeX to PDF" --> LaTeXOnline
    ApplyRoutes -- "LaTeX to PDF" --> LaTeXOnline

    AuthRoutes --> Prisma
    ProfileRoutes --> Prisma
    ResumeRoutes --> Prisma
    ApplyRoutes --> Prisma
    AutopilotRoutes --> Prisma
    InngestEndpoint --> Prisma

    Prisma --> PostgreSQL
    RateLimiter --> Redis

    NextApp -.-> VercelFE
    BackendAPI -.-> VercelBE
    BackendAPI -.-> Docker
```

---

## 2. Backend API — Route & Controller Detail

```mermaid
flowchart LR
    subgraph AuthModule ["Auth Module"]
        direction TB
        A1["POST /api/auth/signup"]
        A2["POST /api/auth/login"]
        A3["POST /api/auth/logout"]
        A4["GET /api/auth/me"]
        A5["PUT /api/auth/updateProfile"]
        A6["GET /api/auth/google"]
        A7["GET /api/auth/google/callback"]
        A8["GET /api/auth/github"]
        A9["GET /api/auth/github/callback"]
    end

    subgraph ProfileModule ["Profile Module"]
        direction TB
        P1["GET /api/profile"]
        P2["POST /api/profile"]
        P3["POST /api/profile/import/:resumeId"]
    end

    subgraph ResumeModule ["Resume Module"]
        direction TB
        R1["POST /api/resume/create"]
        R2["GET /api/resume/all"]
        R3["GET /api/resume/:id"]
        R4["GET /api/resume/:id/pdf"]
        R5["DELETE /api/resume/:id"]
    end

    subgraph ApplyModule ["Apply Module"]
        direction TB
        AP1["POST /api/apply/one-click"]
        AP2["GET /api/apply/all"]
        AP3["GET /api/apply/:id"]
        AP4["GET /api/apply/:id/pdf"]
        AP5["DELETE /api/apply/:id"]
    end

    subgraph AutopilotModule ["Autopilot Module"]
        direction TB
        AU1["POST /api/autopilot/schedules"]
        AU2["GET /api/autopilot/schedules"]
        AU3["GET /api/autopilot/schedules/:id"]
        AU4["PATCH /api/autopilot/schedules/:id"]
        AU5["PATCH /api/autopilot/schedules/:id/toggle"]
        AU6["DELETE /api/autopilot/schedules/:id"]
        AU7["POST /api/autopilot/schedules/:id/run"]
        AU8["POST /api/autopilot/schedules/:id/run-now"]
        AU9["GET /api/autopilot/jobs"]
        AU10["DELETE /api/autopilot/jobs/:id"]
    end

    subgraph Middleware ["Middleware Stack"]
        MW1["authLimiter<br/>(5 req / 15 min / IP)"]
        MW2["resumeCreationLimiter<br/>(2 req / 24 hr / user)"]
        MW3["protectRoute<br/>(JWT cookie verify)"]
    end

    MW1 --> A1 & A2
    MW3 --> A3 & A4 & A5
    MW3 --> P1 & P2 & P3
    MW3 --> R2 & R3 & R4 & R5
    MW2 --> R1
    MW3 --> AP1 & AP2 & AP3 & AP4 & AP5
    MW3 --> AU1 & AU2 & AU3 & AU4 & AU5 & AU6 & AU7 & AU8 & AU9 & AU10
```

---

## 3. One-Click Apply — LangGraph Pipeline

```mermaid
flowchart LR
    START(("START"))
    
    subgraph Pipeline ["One-Click Apply Pipeline (LangGraph StateGraph)"]
        direction LR
        N1["parseJob<br/>───────────<br/>Extracts role, company,<br/>requirements, tech stack<br/>from raw JD text"]
        N2["scoreMatch<br/>───────────<br/>Compares user profile<br/>skills vs job requirements<br/>Returns score + gaps"]
        N3["tailorResume<br/>───────────<br/>Generates LaTeX resume<br/>tailored to this job<br/>using template + profile"]
        N4["generateCoverLetter<br/>───────────<br/>Writes personalized<br/>cover letter matching<br/>job requirements"]
        N5["draftColdEmail<br/>───────────<br/>Creates subject + body<br/>for outreach email<br/>with recipient placeholder"]
    end
    
    END1(("END"))

    START --> N1 --> N2 --> N3 --> N4 --> N5 --> END1

    subgraph State ["Pipeline State"]
        direction TB
        S_IN["Inputs:<br/>jobDescription, userProfile,<br/>latexTemplate"]
        S_OUT["Outputs:<br/>parsedJob, matchResult,<br/>tailoredResume, coverLetter,<br/>coldEmail, errors"]
    end

    subgraph Models ["LLM Calls"]
        Flash["Gemini Flash Lite<br/>(temp 0.3)<br/>parseJob, scoreMatch,<br/>draftColdEmail"]
        Pro["Gemini Flash Lite<br/>(temp 0.4)<br/>tailorResume,<br/>generateCoverLetter"]
    end

    N1 & N2 & N5 -.-> Flash
    N3 & N4 -.-> Pro
```

---

## 4. Job Autopilot — LangGraph Pipeline + Inngest Orchestration

```mermaid
flowchart TB
    subgraph Trigger ["Trigger Layer"]
        Cron["Inngest Cron Poller<br/>(*/15 * * * *)<br/>Checks all active schedules"]
        Manual["Manual Trigger<br/>POST /api/autopilot/<br/>schedules/:id/run"]
        Direct["Direct Run<br/>POST /api/autopilot/<br/>schedules/:id/run-now"]
    end

    subgraph InngestSteps ["Inngest Function Steps (with retries)"]
        direction TB
        Step1["Step 1: load-data<br/>─────────────────<br/>Fetch JobSchedule + UserProfile<br/>from PostgreSQL via Prisma"]
        Step2["Step 2: run-autopilot-pipeline<br/>─────────────────<br/>Invoke LangGraph autopilotGraph"]
        Step3["Step 3: update-schedule-history<br/>─────────────────<br/>Update lastRunAt, lastRunStatus,<br/>totalRuns, totalApplied"]
    end

    subgraph AutopilotPipeline ["Autopilot LangGraph Pipeline"]
        direction LR
        AN1["buildSearchQuery<br/>──────────<br/>LLM generates optimized<br/>search query strings<br/>from targetRoles + locations"]
        AN2["searchJobs<br/>──────────<br/>Parallel search:<br/>JSearch API (RapidAPI)<br/>+ Remotive API<br/>Dedup by title+company"]
        AN3["filterAndRank<br/>──────────<br/>LLM scores each job<br/>against user profile<br/>Filter by minMatchScore<br/>Cap at maxApplications"]
        AN4["batchApply<br/>──────────<br/>For each qualified job:<br/>Run oneClickApplyGraph<br/>Save Application + DiscoveredJob"]
        AN5["generateReport<br/>──────────<br/>Human-readable summary<br/>of the entire run"]
    end

    subgraph ExternalAPIs ["External Job APIs"]
        JSearch2["JSearch / RapidAPI<br/>(Google Jobs, LinkedIn,<br/>Indeed, Glassdoor)"]
        Remotive2["Remotive API<br/>(Remote-only jobs)"]
    end

    Cron -- "autopilot/run.requested event" --> Step1
    Manual -- "autopilot/run.requested event" --> Step1
    Direct -- "Bypass Inngest" --> Step2

    Step1 --> Step2 --> Step3

    Step2 --> AN1 --> AN2 --> AN3 --> AN4 --> AN5

    AN2 --> JSearch2
    AN2 --> Remotive2
    AN4 -. "Runs One-Click Apply<br/>for each qualified job" .-> OneClick["One-Click Apply Graph<br/>(See Diagram 3)"]
```

---

## 5. Authentication & Security Flow

```mermaid
sequenceDiagram
    participant B as Browser
    participant FE as Next.js Frontend
    participant BE as Express.js Backend
    participant P as Passport.js
    participant G as Google / GitHub
    participant DB as PostgreSQL
    participant R as Upstash Redis

    Note over B,R: Local Auth Flow (Email + Password)
    B->>FE: Fill signup/login form
    FE->>BE: POST /api/auth/signup or /login
    BE->>R: authLimiter check (5/15min/IP)
    R-->>BE: Allow or 429
    BE->>DB: Find or create user (bcrypt hash)
    DB-->>BE: User record
    BE->>BE: Sign JWT (userId, JWT_SECRET)
    BE-->>FE: Set-Cookie: jwt=... (httpOnly, secure, sameSite)
    FE-->>B: Redirect to /dashboard

    Note over B,R: OAuth Flow (Google / GitHub)
    B->>FE: Click "Sign in with Google"
    FE->>BE: GET /api/auth/google
    BE->>P: passport.authenticate("google")
    P->>G: Redirect to consent screen
    G-->>P: Authorization code callback
    P->>BE: findOrCreateOAuthUser()
    BE->>DB: Upsert user (provider, providerId, avatar)
    DB-->>BE: User record
    BE->>BE: Sign JWT cookie
    BE-->>B: Redirect to FRONTEND_URL/dashboard

    Note over B,R: Protected Route Access
    B->>FE: Navigate to /apply
    FE->>BE: GET /api/apply/all (with cookie)
    BE->>BE: protectRoute: verify JWT from cookie
    BE->>DB: Lookup user by decoded userId
    DB-->>BE: User exists
    BE-->>FE: 200 + data

    Note over B,R: Rate Limiting
    B->>FE: Create resume
    FE->>BE: POST /api/resume/create (with cookie)
    BE->>BE: protectRoute: verify JWT
    BE->>R: resumeCreationLimiter (2/24hr/user)
    R-->>BE: Allow or 429
    BE-->>FE: Resume created or rate limit error
```

---

## 6. Deployment Architecture

```mermaid
flowchart TB
    subgraph Internet ["Internet"]
        User["End User"]
    end

    subgraph VercelPlatform ["Vercel Platform"]
        subgraph FrontendDeploy ["Frontend Deployment"]
            VercelEdge["Vercel Edge Network / CDN"]
            NextSSR["Next.js 16 SSR<br/>(Turbopack Build)"]
        end

        subgraph BackendDeploy ["Backend Deployment"]
            VercelFn["Vercel Serverless Function<br/>(@vercel/node)<br/>Express.js 5 Entry: src/index.js"]
        end
    end

    subgraph ManagedServices ["Managed Services"]
        NeonDB[("Neon PostgreSQL<br/>(Serverless, Auto-scale)")]
        UpstashRedis[("Upstash Redis<br/>(REST API, Serverless)")]
        InngestSvc["Inngest Cloud<br/>(Event-driven Functions<br/>Cron, Retries, Throttle)"]
    end

    subgraph ThirdParty ["Third-Party APIs"]
        GoogleOAuth["Google OAuth 2.0"]
        GitHubOAuth["GitHub OAuth 2.0"]
        GeminiAPI["Google Gemini API<br/>(Parsing, Scoring, Emails)"]
        HuggingFace["Hugging Face Inference API<br/>(Fine-tuned Mistral 7B)<br/>LaTeX Resume Generation"]
        RapidAPI["RapidAPI / JSearch"]
        RemotiveAPI["Remotive API"]
        LaTeXAPI["LaTeX.ytotech.com"]
    end

    subgraph AltDeploy ["Alternative: Docker"]
        DockerImg["Docker Container<br/>(node:18-alpine)<br/>Port 5000"]
    end

    User --> VercelEdge --> NextSSR
    NextSSR -- "API calls (cookie)" --> VercelFn

    VercelFn --> NeonDB
    VercelFn --> UpstashRedis
    VercelFn <-- "HTTP triggers" --> InngestSvc
    VercelFn --> GoogleOAuth
    VercelFn --> GitHubOAuth
    VercelFn -- "Parsing & Scoring" --> GeminiAPI
    VercelFn -- "Resume Generation" --> HuggingFace
    VercelFn --> RapidAPI
    VercelFn --> RemotiveAPI
    VercelFn --> LaTeXAPI

    DockerImg -.-> NeonDB
    DockerImg -.-> UpstashRedis
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript | SSR, routing, UI |
| **Styling** | Tailwind CSS 4, Framer Motion | Design system, animations |
| **UI Components** | Radix UI, Lucide, Tabler Icons | Accessible component primitives |
| **Backend** | Express.js 5, Node.js | REST API server |
| **AI Framework** | LangChain + LangGraph | Stateful multi-step AI pipelines |
| **LLM** | Google Gemini Flash Lite | Job parsing, resume tailoring, scoring |
| **Database** | PostgreSQL (Neon Serverless) | Primary data store |
| **ORM** | Prisma | Type-safe DB queries + migrations |
| **Cache / Rate Limit** | Upstash Redis | Sliding-window rate limiting |
| **Auth** | Passport.js, JWT (httpOnly cookies) | Local + OAuth (Google, GitHub) |
| **Background Jobs** | Inngest | Cron polling, event-driven functions, retries |
| **Job Search** | JSearch (RapidAPI), Remotive | Multi-source job aggregation |
| **PDF Compilation** | LaTeX.ytotech.com | Server-side LaTeX to PDF |
| **Deployment** | Vercel (FE + BE), Docker alt | Serverless hosting |
| **Validation** | Zod | Runtime schema validation |

---

## Key Design Decisions

1. **Stateless Auth**: JWT stored in httpOnly, secure, sameSite cookies. No server-side sessions. Passport.js used only for OAuth handshake, not session management.

2. **LangGraph Pipelines**: Both the One-Click Apply and Autopilot flows are modeled as linear `StateGraph` DAGs. Each node is a pure function that reads from and writes to an `Annotation`-based state. This makes the AI logic testable and composable.

3. **Inngest for Background Jobs**: Rather than registering a dynamic cron per user, a single poller runs every 15 minutes and checks which schedules are due. This avoids the complexity of managing per-user cron registrations. Each triggered run is retried up to 3 times and throttled to 2 concurrent runs per minute.

4. **Dual Job Sources**: JSearch (via RapidAPI) aggregates Google Jobs, LinkedIn, Indeed, and Glassdoor. Remotive supplements with remote-only positions. Results are deduplicated by `title + company`.

5. **Rate Limiting with Fail-Open**: Upstash Redis-backed sliding window limiter. If Redis is unreachable, requests are allowed through (fail-open) to avoid blocking users due to infrastructure issues.

6. **LaTeX PDF Pipeline**: Resume LaTeX code is stored in the database. PDF compilation is offloaded to an external API (`latex.ytotech.com`) to avoid needing a local TeX installation on serverless infrastructure.

---

## 7. Data Flow Diagram — Level 0 (Context Diagram)

```mermaid
flowchart LR
    User(["👤 User"])
    
    System(("0.0\nCareerCrew AI\nSystem"))

    Google(["Google / GitHub\nOAuth Provider"])
    Gemini(["Google Gemini\n(Parsing & Scoring)"])
    Mistral(["Mistral 7B\n(Hugging Face)\nResume Generation"])
    JobAPIs(["JSearch &\nRemotive APIs"])
    LaTeX(["LaTeX API\n(PDF Compiler)"])
    Inngest(["Inngest Cloud\n(Scheduler)"])

    User -- "Signup / Login Credentials" --> System
    User -- "Profile Data\n(Skills, Experience, Education)" --> System
    User -- "Job Description URL / Text" --> System
    User -- "Autopilot Preferences\n(Roles, Locations, Frequency)" --> System
    System -- "JWT Auth Cookie" --> User
    System -- "Tailored Resume (PDF)" --> User
    System -- "Cover Letter & Cold Email" --> User
    System -- "Match Score & Gap Analysis" --> User
    System -- "Autopilot Run Report" --> User
    System -- "Application History" --> User

    Google -- "OAuth Token + Profile" --> System
    System -- "Auth Code" --> Google

    System -- "Job Text / Profile" --> Gemini
    Gemini -- "Parsed Job / Scores" --> System

    System -- "Profile + Job Context" --> Mistral
    Mistral -- "LaTeX Resume Code" --> System

    System -- "Search Queries" --> JobAPIs
    JobAPIs -- "Job Listings" --> System

    System -- "LaTeX Source" --> LaTeX
    LaTeX -- "Compiled PDF" --> System

    Inngest -- "Cron Trigger Event" --> System
    System -- "Schedule Config" --> Inngest
```

---

## 8. Data Flow Diagram — Level 1 (Detailed)

```mermaid
flowchart TB
    User(["👤 User"])
    Google(["Google / GitHub\nOAuth Provider"])
    GeminiExt(["Google Gemini API\n(Parsing & Scoring)"])
    MistralExt(["Fine-tuned Mistral 7B\n(Hugging Face Inference)"])
    JobAPIExt(["JSearch &\nRemotive APIs"])
    LaTeXExt(["LaTeX API"])
    InngestExt(["Inngest Cloud"])

    P1(("1.0\nAuthentication"))
    P2(("1.1\nProfile\nManagement"))
    P3(("1.2\nOne-Click\nApply"))
    P4(("1.3\nResume Generation\n(Fine-tuned Mistral 7B)"))
    P5(("1.4\nJob Autopilot"))
    P6(("1.5\nPDF\nCompilation"))

    D1[("D1: Users")]
    D2[("D2: Profiles")]
    D3[("D3: Applications")]
    D4[("D4: Resumes")]
    D5[("D5: Autopilot\nSchedules")]
    D6[("D6: Discovered\nJobs")]

    %% ── Authentication (P1) ──
    User -- "Email + Password\nor OAuth Click" --> P1
    Google -- "OAuth Token +\nUser Info" --> P1
    P1 -- "Auth Code\nRequest" --> Google
    P1 -- "JWT Cookie" --> User
    P1 -- "Create / Lookup\nUser Record" --> D1
    D1 -- "User Record" --> P1

    %% ── Profile Management (P2) ──
    User -- "Skills, Experience,\nEducation, Links" --> P2
    P2 -- "Profile Confirmation" --> User
    P2 -- "Store / Update\nProfile" --> D2
    D2 -- "Profile Data" --> P2
    D4 -- "Existing Resume\nData" --> P2
    P2 -- "Import Resume\nto Profile" --> D2

    %% ── One-Click Apply (P3) ──
    User -- "Job Description\nText / URL" --> P3
    D2 -- "User Profile" --> P3
    P3 -- "Job Text" --> GeminiExt
    GeminiExt -- "Parsed Job &\nMatch Score" --> P3
    P3 -- "Profile + Parsed\nJob Context" --> P4
    P4 -- "Tailored LaTeX\nResume" --> P3
    P3 -- "Cover Letter &\nCold Email" --> User
    P3 -- "Match Score &\nGap Analysis" --> User
    P3 -- "Save Application\nRecord" --> D3
    P3 -- "Save Resume" --> D4

    %% ── Resume Generation (P4) ──
    P4 -- "Profile + Job\nContext Prompt" --> MistralExt
    MistralExt -- "Generated LaTeX\nCode" --> P4
    P4 -- "LaTeX Source" --> P6
    P6 -- "Compiled PDF" --> P4
    P4 -- "Store LaTeX &\nPDF Reference" --> D4

    %% ── Job Autopilot (P5) ──
    User -- "Target Roles,\nLocations, Frequency" --> P5
    InngestExt -- "Cron Trigger\nEvent" --> P5
    P5 -- "Schedule Config" --> InngestExt
    D5 -- "Active Schedule\nConfig" --> P5
    D2 -- "User Profile" --> P5
    P5 -- "Search Queries" --> JobAPIExt
    JobAPIExt -- "Job Listings" --> P5
    P5 -- "Jobs for Scoring" --> GeminiExt
    GeminiExt -- "Ranked &\nFiltered Jobs" --> P5
    P5 -- "Qualified Jobs" --> P3
    P3 -- "Application\nResults" --> P5
    P5 -- "Store Discovered\nJobs" --> D6
    P5 -- "Update Run\nHistory" --> D5
    P5 -- "Autopilot Run\nReport" --> User

    %% ── PDF Compilation (P6) ──
    P6 -- "LaTeX Source\nCode" --> LaTeXExt
    LaTeXExt -- "Compiled PDF\nBinary" --> P6
    User -- "Download PDF\nRequest" --> P6
    P6 -- "Resume PDF" --> User
```
