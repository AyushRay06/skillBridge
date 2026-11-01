import axios from "axios";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Map postAge filter ("24h", "48h", "7d") to JSearch date_posted value
 */
function mapPostAge(postAge) {
  switch (postAge) {
    case "24h": return "today";
    case "48h": return "3days";
    case "7d":  return "week";
    default:    return "week";
  }
}

/**
 * Map postAge to days for Remotive cutoff filtering.
 * Uses a 14-day minimum to avoid returning very stale listings.
 */
function postAgeToDays(postAge) {
  switch (postAge) {
    case "24h": return 1;
    case "48h": return 2;
    case "7d":  return 7;
    default:    return 7;
  }
}

/**
 * Normalize a raw job object into a consistent shape for our pipeline.
 */
function normalizeJob({ title, company, location, salary, url, source, postedAt, description }) {
  return { title, company, location: location || "Unknown", salary: salary || null, url: url || null, source, postedAt: postedAt || null, description: description || "" };
}

// ─────────────────────────────────────────────
// JSearch Adapter (via RapidAPI — free 200 req/mo)
// ─────────────────────────────────────────────

/**
 * Search jobs using JSearch API (aggregates Google Jobs, LinkedIn, Indeed, Glassdoor).
 * This is the PRIMARY source — higher quality, more relevant, recently-posted listings.
 *
 * @param {string} query       - Search query string e.g. "React developer remote"
 * @param {object} filters     - { workType, experienceLevel, postAge }
 * @returns {Promise<Array>}   - Normalized job objects
 */
export async function searchWithJSearch(query, filters = {}) {
  const { workType = "any", postAge = "week" } = filters;
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

  if (!RAPIDAPI_KEY) {
    console.warn("[JSearch] RAPIDAPI_KEY not set — skipping JSearch.");
    return [];
  }

  try {
    const params = {
      query,
      page: "1",
      num_pages: "1",
      date_posted: mapPostAge(postAge),
    };

    if (workType === "remote") params.remote_jobs_only = "true";

    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params,
      headers: {
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
      timeout: 30000,
    });

    const jobs = response.data?.data || [];
    console.log(`[JSearch] Query "${query}" → ${jobs.length} results`);

    return jobs.map((job) =>
      normalizeJob({
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city
          ? `${job.job_city}, ${job.job_country || ""}`.trim()
          : job.job_country || (job.job_is_remote ? "Remote" : "Unknown"),
        salary:
          job.job_min_salary && job.job_max_salary
            ? `${job.job_salary_currency || "$"}${job.job_min_salary}–${job.job_max_salary} ${job.job_salary_period || ""}`.trim()
            : null,
        url: job.job_apply_link || job.job_google_link,
        source: "jsearch",
        postedAt: job.job_posted_at_datetime_utc
          ? new Date(job.job_posted_at_datetime_utc)
          : null,
        description: job.job_description || "",
      })
    );
  } catch (error) {
    // Log detailed error info so we can diagnose API issues
    const status = error.response?.status;
    const msg = error.response?.data?.message || error.message;
    console.error(`[JSearch] FAILED for query "${query}": HTTP ${status || "N/A"} — ${msg}`);
    if (status === 429) {
      console.warn("[JSearch] ⚠️  Rate limit hit (429). Free tier = 200 req/month.");
    } else if (status === 403) {
      console.warn("[JSearch] ⚠️  Auth error (403). Check RAPIDAPI_KEY and subscription.");
    }
    return [];
  }
}

// ─────────────────────────────────────────────
// Remotive Adapter (free, no key — remote-only)
// ─────────────────────────────────────────────

/**
 * Search remote jobs using Remotive's public API.
 * Used as a FALLBACK source when JSearch doesn't return enough results.
 *
 * @param {string} searchTerm  - Role keyword e.g. "React developer"
 * @param {object} filters     - { postAge }
 * @returns {Promise<Array>}   - Normalized job objects
 */
export async function searchWithRemotive(searchTerm, filters = {}) {
  const { postAge = "7d" } = filters;
  // Use 14-day minimum to avoid very stale postings (was 30 days before).
  const rawDays = postAgeToDays(postAge);
  const cutoffDays = Math.max(rawDays, 14);
  const cutoffDate = new Date(Date.now() - cutoffDays * 24 * 60 * 60 * 1000);

  try {
    const response = await axios.get("https://remotive.com/api/remote-jobs", {
      // Fetch only 5 per query — we only need a small fallback supplement
      params: { search: searchTerm, limit: 5 },
      timeout: 10000,
    });

    const jobs = response.data?.jobs || [];

    const filtered = jobs
      .filter((job) => {
        if (!job.publication_date) return true; // include if no date
        return new Date(job.publication_date) >= cutoffDate;
      })
      .map((job) =>
        normalizeJob({
          title: job.title,
          company: job.company_name,
          location: "Remote",
          salary: job.salary || null,
          url: job.url,
          source: "remotive",
          postedAt: job.publication_date ? new Date(job.publication_date) : null,
          description: job.description || job.category || "",
        })
      );

    console.log(`[Remotive] Query "${searchTerm}" → ${filtered.length} results (within ${cutoffDays}d window)`);
    return filtered;
  } catch (error) {
    console.error("[Remotive] Error fetching jobs:", error.message);
    return [];
  }
}

// ─────────────────────────────────────────────
// Combined Search — JSearch primary, Remotive fallback
// ─────────────────────────────────────────────

/**
 * Run JSearch (primary) for all queries. If JSearch returns fewer than
 * MIN_JSEARCH_RESULTS, supplement with Remotive results.
 * Merges, deduplicates, and caps at maxResults.
 *
 * @param {string[]} queries    - Array of search query strings (2-3 recommended)
 * @param {object}  filters     - Schedule filters
 * @param {number}  maxResults  - Hard cap on total returned jobs (default: 15)
 * @returns {Promise<Array>}    - Deduplicated job list, JSearch results first
 */
export async function searchAllSources(queries, filters = {}, maxResults = 15) {
  const { workType } = filters;

  // ── Step 1: JSearch (PRIMARY) ─────────────────────────────────────────────
  // Run sequentially to respect RapidAPI rate limits.
  const jsearchJobs = [];
  for (const query of queries) {
    const results = await searchWithJSearch(query, filters);
    jsearchJobs.push(...results);
  }

  console.log(`[JobSearch] JSearch total: ${jsearchJobs.length} raw results across ${queries.length} queries`);

  // ── Step 2: Remotive (FALLBACK) ───────────────────────────────────────────
  // Only call Remotive if:
  //   a) workType is not "onsite" (Remotive is remote-only), AND
  //   b) JSearch returned fewer than 5 results (likely failed or rate-limited)
  const MIN_JSEARCH_RESULTS = 5;
  const needsRemotiveFallback = workType !== "onsite" && jsearchJobs.length < MIN_JSEARCH_RESULTS;

  let remotiveJobs = [];
  if (needsRemotiveFallback) {
    console.log(`[JobSearch] JSearch returned < ${MIN_JSEARCH_RESULTS} results — activating Remotive fallback...`);
    const remotivePromises = queries.map((q) => searchWithRemotive(q, filters));
    const remotiveResults = await Promise.allSettled(remotivePromises);
    remotiveJobs = remotiveResults
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value);
    console.log(`[JobSearch] Remotive fallback total: ${remotiveJobs.length} raw results`);
  }

  // ── Step 3: Merge (JSearch first for priority), deduplicate, cap ──────────
  const allJobs = [...jsearchJobs, ...remotiveJobs];

  const seen = new Set();
  const deduped = [];
  for (const job of allJobs) {
    const key = `${job.title.toLowerCase().trim()}|${job.company.toLowerCase().trim()}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(job);
    }
  }

  // Apply global cap to keep the pipeline fast and scoring affordable
  const capped = deduped.slice(0, maxResults);

  const jsearchCount = capped.filter((j) => j.source === "jsearch").length;
  const remotiveCount = capped.filter((j) => j.source === "remotive").length;

  console.log(
    `[JobSearch] Final: ${capped.length} jobs (${jsearchCount} JSearch + ${remotiveCount} Remotive) from ${allJobs.length} total (capped at ${maxResults})`
  );

  return capped;
}
