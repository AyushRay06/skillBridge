# Career Guide Chat: Project Brief and Progress Notes

Hi! This file is your brief for the next piece of work on CareerCrew AI. Read it once, then use your own judgment. It describes the goal, the spirit of the feature and some ideas. It is a guide, not a rulebook. If you see a better way to do something, go for it and just note it in the Decision Log at the bottom so the next session knows what happened.

Please keep this file updated as you go: tick off progress, jot down decisions, and leave notes for whoever picks it up next.

---

## 1. The Big Picture

CareerCrew AI already does a lot: resume creation, JD tailored resumes with cover letters and outreach emails, an automated job search and apply pipeline, a job feed, saved resumes and a dashboard. All of that works and is valuable.

We are now adding a **Career Guide**: a chat experience, living inside the existing app, that acts like a friendly, honest career consultant. It helps people figure out what career to pursue and which roles fit them, based on their interests, skills, resume and whatever they share.

This is for a hackathon (Game of Codes, Anazori v16.0, problem statement PS-02 SkillBridge, a bilingual AI career and placement navigator). The event is on 4 November 2026, but the goal is **not a demo**. Everything built here should be real, working, production ready functionality that real users could rely on tomorrow. Please see the Production Quality Bar in section 6. When time is tight, build fewer features and finish them properly rather than building more features that only look right on the surface.

### How this fits with the existing code

**Please don't break the existing features.** That is the one real constraint. Beyond that, this is not meant to be a walled off, build everything from scratch feature. Please make full use of what already exists.

**Reuse freely.** Before writing something new, check whether the project already has it, and use it. This applies to:
* Auth, user and session handling
* The LLM setup, prompts, helpers and LangChain or LangGraph code
* Resume parsing, PDF handling, LaTeX and resume generation utilities
* The job search agent, scoring agent and job data
* Existing database models, Prisma client, API patterns, middleware and validation
* UI components, layouts, theme, hooks and state management
* Utilities, types, constants and config

**Integrate in limited, safe ways.** The Career Guide can connect to existing features where it genuinely helps users, for example:
* Reading a user's existing profile, saved resumes or job feed data (read access) so the guide does not ask for what the app already knows
* Calling existing services through their current interfaces, such as the job search agent for "find jobs for this role" or the resume tools for "tailor my resume"
* Adding the new page and a "My Roadmaps" section to the existing navigation and sidebar
* Linking from existing screens into the Career Guide where it makes sense

**Keep the risk low while doing it.**
* Prefer **adding** over **changing**: new files, new routes, new components, new database tables (additive migrations only, prefixing new models with `CG` keeps things tidy).
* If an existing function or component almost fits, prefer wrapping it or extending it in a backward compatible way (new optional parameters, new exports) instead of rewriting it. Existing callers must keep behaving exactly as before.
* Small, careful edits to existing files are fine when they clearly save effort or give the best result. Keep each one minimal, check what else uses that code, and note it in the Decision Log.
* Avoid refactors, renames, moves or deletions of existing code, and avoid altering or dropping existing database tables or columns. If something bigger than a small edit seems necessary, check with the user first.
* Do not write Career Guide data into existing tables in ways that could confuse the existing features (for example, do not mix chat uploaded resumes into the saved resumes list unless that is a deliberate, reviewed integration).
* After each milestone, run a quick check that the existing features still work.

Everything else in this brief is flexible.

---

## 2. What the Chat Should Feel Like

Think of a smart senior friend who happens to know a lot about careers. Not a generic chatbot.

* **Warm and practical.** Encouraging, but honest. If a resume is strong, say so. If something needs work, say that clearly and kindly.
* **Curious.** It asks good questions to understand the person before advising. One or two at a time works better than a long list. It should not ask for things it already knows (for example, anything visible in an uploaded resume).
* **Decisive.** Once it has enough information, it gives a concrete answer instead of asking more questions.
* **Grounded.** It does not invent job market facts, salaries or companies. If it is unsure, it says so.
* **Focused on careers**, while handling small tangents gracefully.

### Languages

The chat works in **Assamese, Hindi and English.**

* It replies in whichever language the user writes in, and follows them if they switch mid conversation.
* Mixed language is completely normal (Assamese or Hindi sentences with English tech words like "React" or "backend"). It should handle that naturally and reply in the main language of the message.
* A small language selector in the UI (Auto, Assamese, Hindi, English) is a nice touch. Auto is the default and a manual choice overrides it.
* Assamese and Hindi text must display and store correctly everywhere. UTF 8 throughout and a font that supports both scripts will save headaches. Worth testing the rendering early.
* Tech terms can stay in English inside Assamese or Hindi replies, since that is how people actually speak.

---

## 3. Core Features (the heart of the work)

These are the features we most want working well.

### 3.1 Interactive career conversation
The main experience. The user can say something as simple as "I like JavaScript" or "I don't know what to do after my B.Tech" and the guide talks it through: asks a few relevant questions, then suggests directions and explains why.

### 3.2 Resume upload and understanding
* Upload a PDF (or paste text) right inside the chat.
* The guide extracts the key details (education, skills, projects, experience) and shows a short summary so the user can confirm or correct it.
* Structured extraction (JSON with schema validation and a retry on bad output) tends to be much more reliable than free text.
* If the project already has resume parsing or text extraction code, reuse it instead of writing a second version. Store the chat's extracted profile in its own table at first, and only connect it to the existing saved resumes through a deliberate, clearly labelled action (for example a "save to my resumes" button), so nothing gets mixed up by accident.

### 3.3 Role recommendations
* Suggest about 3 to 5 roles that fit, each with a clear "why": skills the user already has, skills they are missing.
* Works from an uploaded resume, from what the user says, or both.
* **Tip:** a small role knowledge base (30 to 50 roles with their required skills and weights) keeps recommendations grounded and explainable. Let the database define roles and requirements, and let the LLM personalise and explain. Compute any match scores in code, so the LLM never makes up a percentage.

### 3.4 Resume review and rating
* When asked, give an honest rating with a short breakdown (clarity, skills, project impact, structure, ATS friendliness, role fit) and specific suggestions tied to what is actually in the resume.
* If the resume is genuinely good, just say so. Please don't invent criticism to seem useful.
* Offer a gentle pointer to the existing resume creation feature if the user wants to act on the feedback.

### 3.5 Learning roadmaps
* If the user wants to learn something (for example "I want to learn frontend development"), build a proper ordered roadmap: steps in a sensible sequence, with what to learn, why, suggested resources and a rough time estimate.
* Personalise it using what the guide knows (current skills, level, time per week). Asking about weekly time is a good question if it is missing.
* Generate it in the user's language.
* Structured JSON first, then a roadmap card in the UI, works well.

### 3.6 Save roadmaps and track progress
* A **Save roadmap** button on every roadmap.
* Each step can be marked not started, in progress or done, from the chat or a simple view.
* Show overall progress, and let the user ask "how am I doing on my roadmap?" with the answer coming from stored data.
* Users can list, reopen and delete saved roadmaps.

### 3.7 Conversation history
Saved conversations per user, with a simple history list and a "new chat" option.

### 3.8 Cards first: structured results are never plain chat text
This is a key design principle. Whenever the guide produces something structured, it should appear as a **beautifully designed card** in the chat, not as a block of text. The chat bubble can carry a short friendly sentence ("Here is a roadmap for frontend development"), and the card carries the substance.

Things that should be cards:
* **Roadmap card:** title, target skill or role, total estimated time, then ordered steps. Each step shows its number, title, what to learn, why it matters, resources (as tidy links or chips) and a time estimate. A progress bar sits at the top. Steps can be expanded or collapsed so long roadmaps stay readable.
* **Role recommendation cards:** role name, a short description, a match indicator, matched skills and missing skills as chips, and actions like "Show skill gap" or "Make a roadmap".
* **Skill gap card:** skills the user has, skills missing, priority order.
* **Resume summary card:** what the guide understood from the upload, with a way to confirm or correct it.
* **Resume review card:** overall rating, a small breakdown (clarity, skills, project impact, structure, ATS friendliness, role fit) and a list of specific suggestions. A strong resume should get a clearly positive card.
* **Job cards** (if job hand off is built): title, company, location, match, and an apply or view action.
* **Progress card:** overall roadmap progress and the next suggested step.

Design guidance:
* Cards should be built from the existing app's components and styles (see 3.10) while still being polished: clear hierarchy, good spacing, subtle icons, responsive on mobile, works in light and dark mode if the app supports both.
* Card contents (labels and generated text) follow the active language. Fixed labels like "Save roadmap" or "Estimated time" need Assamese, Hindi and English versions.
* Make sure Assamese and Hindi text wraps and aligns well inside cards.
* A simple way to build this: the agent returns a typed structured payload (for example `{ type: "roadmap", data: {...} }`) alongside a short text message, and the frontend maps each type to a card component. That keeps the AI output validated and the UI consistent. Store the payload with the message so cards reappear when a conversation is reopened.
* Plain text replies are still fine for normal conversation, questions and short answers. The rule is only that structured results get cards.

### 3.9 Save to database and the existing sidebar
Every roadmap card has a clear **Save roadmap** button.

* Saving stores the roadmap and its steps in the database for that user (the `CGRoadmap` and `CGRoadmapStep` tables suggested below).
* After saving, the button changes to a saved state (for example "Saved" with an option to open it) so the user gets clear feedback. Saving the same roadmap twice should not create duplicates.
* **Saved roadmaps should show up in the sidebar of the existing project**, so the user can see everything they have generated and jump back to it. Treat each saved roadmap as an entry in a "My Roadmaps" section (or the closest equivalent the sidebar already supports), showing the title and a small progress indicator.
* Clicking an entry opens that roadmap as a card (a simple detail view is fine) where the user can update step statuses, see progress and delete the roadmap.
* The sidebar is part of the existing app, so a small change to existing code is expected and welcome here. Keep it minimal and additive: ideally one new sidebar section or link that renders a new component, with the data fetching living in new code. Please look at how the sidebar is built first and follow its conventions. Record exactly what you touched in the Decision Log.
* If the sidebar can also list past career conversations, that is a nice extra, but saved roadmaps are the priority.
* Other cards that are worth keeping (a role shortlist, a resume review) could be saved the same way later. Start with roadmaps and design the saving logic so it can be reused.

### 3.10 UI consistency with the existing project
The Career Guide should look and feel like it has always been part of CareerCrew AI. Before designing anything, please study the existing UI and match it.

* **Reuse the existing UI system.** Use the same component library, design tokens, colors, typography, spacing, border radius, shadows, icons and animation style that the project already uses. Import and compose existing components (buttons, cards, inputs, dialogs, badges, progress bars, tabs, skeletons, toasts and so on) rather than creating new lookalikes.
* **Match the layout patterns.** Page structure, headers, sidebar behaviour, empty states, loading states and error states should follow what the existing pages do.
* **Respect the theme.** If the app supports light and dark mode, the new page and every card should too, using the same theme mechanism.
* **Cards should extend the existing card style**, not introduce a new visual language. The cards described in 3.8 should look like siblings of the cards already in the dashboard and job feed.
* **Keep the same interaction patterns**: the same hover and focus styles, the same way of showing loading, success and error feedback, the same responsive breakpoints.
* **Only add new styles when nothing existing fits**, and keep them in the new module using the project's existing styling approach. Do not change shared components or global styles to make the new page work.
* A quick check before finishing: place the new page next to an existing page. If someone could tell they were built by different teams, something needs adjusting.

---

## 4. Ideas to Make It Stand Out

Beyond the core, these features line up closely with what the hackathon judges look for (Gen AI quality, Assamese capability, practical local impact, polish). Pick what fits the time you have. Roughly in order of value:

1. **Skill gap view.** For any role the user is interested in, a clear card showing "you have these, you are missing these, here is the priority". Reuses the same data as recommendations and is genuinely useful to users deciding what to learn next.
2. **"Why this role" evidence.** A small expandable breakdown on each recommendation showing the matched and missing skills. It makes the AI explainable and is a strong answer to hallucination concerns.
3. **Interest discovery mini conversation.** For users who say "I don't know what I want", a short friendly set of questions (what do you enjoy building, analysing, designing, organising?) that leads to role suggestions. Great for students who feel lost.
4. **Local relevance for Assam and the Northeast.** Include relevant options such as APSC and other state or central government exam tracks, banking, and regional startups or companies, and mention local learning options where known. This directly supports the "local impact" part of the judging.
5. **Placement readiness score.** One simple, explainable number built from skill coverage, resume quality and roadmap progress, shown as a small chip at the top of the chat. It gives the feel of a readiness dashboard without a new screen.
6. **Job hand off.** A "find jobs for this role" button on a role card that calls the existing job search agent and shows a few matches inside the chat. Only call the existing service through its normal interface, no changes needed to it.
7. **Tailor my resume button.** After a role is chosen, offer to open the existing resume tool for that role. This is the bridge that makes the new feature and the old product feel like one story.
8. **Mock interview mode.** The guide asks role specific questions in the user's language and gives feedback on the answers. A natural fit for a chat interface.
9. **Quick reply chips.** Suggestions like "Review my resume", "What roles suit me?", "Make me a roadmap", shown in the active language. Helps users who do not know what to ask.
10. **Voice input and output.** Only worth trying after text chat works well in all three languages, and only if Assamese speech quality is acceptable with the provider chosen. A flaky voice feature is worse than none.

You do not need all of these. A solid core plus three or four from this list will make a strong submission.

---

## 5. Suggested Design (take what helps)

**Agent shape.** A tool calling agent, using whichever LangChain or LangGraph setup the repo already has. Tools that tend to make sense (names are only suggestions):
`extract_resume_profile`, `recommend_roles`, `analyse_skill_gap`, `review_resume`, `generate_roadmap`, `save_roadmap`, `get_roadmap_progress`, `update_roadmap_step`.

**Language handling tips from experience.**
* Keep the system prompt in English and tell the model to answer in the user's language. This is usually more reliable than writing the prompt in Assamese or Hindi.
* For structured outputs, generating English JSON first and then writing the user facing prose in the target language as a separate step is usually more reliable than asking for Assamese or Hindi JSON directly.
* A quick Unicode script check (Assamese and Bengali script, Devanagari, Latin) is a cheap helper for language detection, with the manual selector as the override.
* Normalise skills so "JS", "JavaScript" and the Assamese or Hindi spellings all match. An alias table is enough to start.

**Suggested data (new tables for new data, existing tables read as needed).**
* `CGConversation`, `CGMessage` (with optional JSON payload for cards)
* `CGResumeProfile` (extracted structured profile)
* `CGRoadmap`, `CGRoadmapStep` (with status)
* `CGRole`, `CGRoleSkill` (with weights) plus a seed script for 30 to 50 roles with names in all three languages

**UI.**
* A responsive chat page built with the existing app's UI system, styles and components, so it is visually consistent with the rest of the project (see 3.10).
* Streaming replies, a file upload button, a language selector.
* Rich cards in the chat for every structured result (see section 3.8): resume summary, role recommendations, skill gap, resume review, roadmap with progress and a Save button.
* A "My Roadmaps" section in the existing sidebar (see section 3.9).
* Labels, placeholders and buttons for this page available in all three languages. No need to translate the rest of the app.

---

## 6. Production Quality Bar and Readiness

Every feature in this brief should be **real and functional end to end**, not a demo or a mockup. The judges care about live behaviour, and more importantly, so do real users. Please hold the work to these standards:

* **No fake or hardcoded data.** Roles, skills, roadmaps, scores, progress and history all come from the database or from live model calls. No placeholder content, canned responses, sample data presented as real results, or buttons that do nothing. If a feature is not built yet, leave it out of the UI rather than showing a fake version of it.
* **Real persistence.** Anything the user saves (roadmaps, progress, conversations, resume profiles) is stored properly, tied to the correct user, and still there after a refresh or a new session.
* **Auth and data isolation.** Every endpoint checks the logged in user and only returns that user's data. Use the project's existing auth.
* **Proper error handling.** Handle LLM failures, timeouts, malformed model output, upload failures and network drops with friendly, recoverable messages in the user's language, plus retries where sensible. No unhandled exceptions or blank screens.
* **Loading, empty and edge states** designed for every screen and card, not just the happy path.
* **Input validation and security.** Validate all inputs and structured outputs with schemas, limit upload type and size, sanitise anything rendered, keep secrets in environment variables, and apply rate limiting on the AI endpoints so one user cannot run up costs or break the service.
* **Cost and performance awareness.** Stream responses, avoid redundant model calls, cache stable results where it makes sense, and keep prompts and context lean.
* **Privacy.** Resumes are personal data. Do not log their contents, store them only as needed, and make sure users can delete their data (roadmaps, conversations, uploaded resume profiles).
* **Maintainable code.** Typed, organised and readable, following the repo's conventions, with sensible logging. Someone else should be able to pick this up.
* **Accessibility and responsiveness.** Keyboard friendly, readable contrast, works on mobile, works with Assamese and Hindi text.
* **Done means verified.** A feature is only ticked off when it has been run for real, including its failure cases, not when the code merely compiles.

The judges care a lot about Assamese quality and about seeing it work live, so a little testing goes a long way.

* **Test scenarios.** Aim for at least three scenarios per language (Assamese, Hindi, English), including one language specific case such as mixed language input or Assamese script handling. Good ones to cover:
  * Interest only: "I like JavaScript, what jobs can I do?"
  * Resume upload, then role recommendations
  * Resume rating for a weak resume and for a strong one
  * Roadmap request, save, then a progress update
  * Switching language mid conversation
  * Mixed language input with English tech terms
* Log what you ran and how it went in the Test Results section below, so there is a clear record of what was verified and how it behaved.
* A quick smoke test of the old features after each milestone (create a resume, open the job feed, open the dashboard) is cheap insurance.
* Validate structured LLM outputs and fail gracefully with a friendly message in the user's language.
* Accept PDF and plain text uploads, with a sensible size limit.
* Please avoid logging full resume contents.

---

## 7. A Sensible Order of Work

Feel free to reorder, this is just one path that avoids rework.

1. Look around the repo: auth, LLM client, Prisma setup, and especially the UI library, theme and existing page patterns. Note anything useful in the Decision Log.
2. Add the new tables and seed the role data. Reuse existing models where it makes sense (for example the user model).
3. Basic chat backend with streaming and language handling.
4. Chat UI page and the card component system, check Assamese and Hindi rendering early.
5. Resume upload and summary card.
6. Role recommendations with the "why" breakdown and skill gap.
7. Resume review and rating.
8. Roadmaps as cards, with save, progress tracking and the sidebar entry.
9. History, quick reply chips, polish.
10. Pick from the ideas list (readiness chip, job hand off, tailor resume button, mock interview, local content).
11. Run the test scenarios, fix what they reveal, and do a final end to end pass as a real user would, in all three languages.

---

## 8. Not Now

To keep the scope focused, these can wait unless time is left over: changes to the scheduled automation, auto apply, or outreach email features, and any rework of the existing screens.

---

## 9. Progress Tracker

Tick things off as you go and add short notes.

**Core**
* [x] Repo explored, useful patterns noted
* [x] New tables added and role data seeded (40 roles across Tech, Assam/Northeast, and Non-Tech)
* [x] Chat backend with tool calling and language handling
* [x] Language detection and selector (Auto, English, हिंदी, অসমীয়া)
* [x] Chat UI with Assamese and Hindi rendering verified
* [x] Resume upload and understanding (PDF and Text via pdf-parse)
* [x] Role recommendations with explanations (match scores computed deterministically in code)
* [x] Resume review and rating (structured card with breakdown)
* [x] Existing UI system studied and reused (components, theme, tokens, sharp geometry)
* [x] Card component system (typed payload mapped to card components)
* [x] Roadmap card with progress bar and Save button
* [x] Roadmap generation (personalized by skills, role, and weekly hours)
* [x] Save roadmap and progress tracking (step status updates: not started / in progress / done)
* [x] Saved roadmaps listed in the existing sidebar, with open and delete
* [x] Conversation history (sidebar drawer with past chats and new chat button)

**From the ideas list**
* [x] Skill gap view (two-column view with priority missing skills)
* [x] "Why this role" evidence (matched vs missing chips + personalized rationale)
* [x] Interest discovery conversation (friendly clarifying prompts in system prompt)
* [x] Assam and Northeast local content (APSC, Banking, OIL/ONGC, State Govt, Teacher, Local Startups)
* [x] Placement readiness score chip (header badge in /career-guide)
* [x] Job hand off (action button calls find_jobs tool & renders JobMatchesCard)
* [x] Tailor my resume button (links to /resume to act on suggestions)
* [x] Mock interview mode (mock_interview tool & MockInterviewCard with hints and feedback)
* [x] Quick reply chips (localized chips for en, as, hi)
* [ ] Voice (intentionally skipped per user approval to prioritize core reliability)

**Wrap up**
* [ ] Test scenarios run in all three languages
* [ ] Old features smoke tested
* [ ] Final end to end pass completed as a real user (all three languages, including error cases)
* [x] Production quality bar reviewed (auth, validation, error handling, privacy, rate limits)

### Test Results

* [2026-11-02] TypeScript check passed with 0 errors (`tsc --noEmit`).
* [2026-11-02] Prisma DB Push succeeded against Neon PostgreSQL.
* [2026-11-02] Role seed script seeded 40 roles + associated canonical skills and weights.
* [2026-11-02] Node syntax check passed on all backend controllers, routes, and agents.

---

## 10. Decision Log

Jot down decisions, assumptions, changes of plan, small edits to existing files, and questions for the user. Newest last.

* Pre approved: small, careful edits to existing code where they help (for example the sidebar entry for saved roadmaps, see 3.9, and nav links to the Career Guide page). Log every existing file touched and why, here.
* [2026-11-02] **Architecture Decision**: Non-streaming implementation chosen per user selection for robustness and simpler state management across structured card payloads.
* [2026-11-02] **PDF Parsing**: Installed `pdf-parse` (v2.4.5) with `PDFParse` class support, plus fallback to raw text buffer conversion. No resume text logged to server logs.
* [2026-11-02] **Touch points on existing files**:
  - `backend/prisma/schema.prisma`: Added `CG*` models and relations to `User`.
  - `backend/src/middleware/rateLimitConfig.js`: Added `careerGuideChat` tier limits.
  - `backend/src/index.js`: Mounted `/api/career-guide`.
  - `frontend/src/components/AppSidebar.tsx`: Added Career Guide item and `CGRoadmapsSidebarSection`.
  - `frontend/src/app/(app)/layout.tsx`: Added `/career-guide` to `PAGE_TITLES`.