// Bonus: External Jobs in India for React/Node.js
// Server-side fetch from public APIs with relaxed filters + fallback list.

const API1 =
  process.env.JOBS_API_1 || "https://www.arbeitnow.com/api/job-board-api";
const API2 =
  process.env.JOBS_API_2 || "https://www.themuse.com/api/public/jobs";

// Helper: safe fetch with timeout
async function safeFetchJson(url) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function includesIndia(location) {
  if (typeof location !== "string") return false;
  return /india/i.test(location) || /remote/i.test(location);
}

function matchKeywords(text, q) {
  if (typeof text !== "string") return false;
  const re = q ? new RegExp(q, "i") : /(react|node\.?js?)/i;
  return re.test(text);
}

export async function listJobs(req, res) {
  const q = (req.query.q || "").trim(); // optional: /jobs?q=react
  const results = [];
  const debugSamples = [];

  // API1: Arbeitnow
  const data1 = await safeFetchJson(API1);
  const raw1 = Array.isArray(data1?.data) ? data1.data : [];
  for (const j of raw1) {
    const title = j.title || "";
    const company = j.company_name || j.company || "";
    const location = j.location || "";
    const desc = j.description || "";
    const applyUrl = j.url || j.apply_url || "#";

    // Relaxed filters: keep if India/Remote OR title/desc/location match React/Node (or custom q)
    if (
      includesIndia(location) ||
      matchKeywords(title, q) ||
      matchKeywords(desc, q) ||
      matchKeywords(location, q)
    ) {
      results.push({
        source: "Arbeitnow",
        title,
        company,
        location,
        applyUrl,
      });
    } else if (debugSamples.length < 10) {
      debugSamples.push({
        source: "Arbeitnow (debug)",
        title,
        company,
        location,
        applyUrl,
      });
    }
  }

  // API2: The Muse — try first 3 pages for better coverage
  for (let p = 1; p <= 3; p++) {
    const muse = await safeFetchJson(`${API2}?page=${p}`);
    const raw2 = Array.isArray(muse?.results) ? muse.results : [];
    for (const j of raw2) {
      const title = j.name || "";
      const company = j.company?.name || "";
      const locations = (j.locations || []).map((l) => l.name).join(", ");
      const applyUrl = j.refs?.landing_page || "#";

      if (
        includesIndia(locations) ||
        matchKeywords(title, q) ||
        matchKeywords(locations, q)
      ) {
        results.push({
          source: "The Muse",
          title,
          company,
          location: locations,
          applyUrl,
        });
      } else if (debugSamples.length < 10) {
        debugSamples.push({
          source: "The Muse (debug)",
          title,
          company,
          location: locations,
          applyUrl,
        });
      }
    }
  }

  // Fallback so the page never looks empty
  const viewItems = results.length > 0 ? results : debugSamples;

  res.render("jobs/index", {
    title: "External Jobs (India) - React/Node.js",
    jobs: viewItems,
  });
}
