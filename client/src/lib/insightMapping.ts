/**
 * insightMapping.ts
 *
 * Defines automatic mappings from article category / tags
 * to solution slugs and industry slugs.
 *
 * Rules (applied in order):
 *  1. Category → solutions / industries (broad match)
 *  2. Tag keywords → solutions / industries (fine-grained match)
 *
 * Usage:
 *   import { getRelatedSolutions, getRelatedIndustries } from "@/lib/insightMapping";
 *   const solutions = getRelatedSolutions(article.category, article.tags);
 *   const industries = getRelatedIndustries(article.category, article.tags);
 */

// ── Category → solution slugs ───────────────────────────────────────────────
const CATEGORY_TO_SOLUTIONS: Record<string, string[]> = {
  "Financial Close": ["sap-afc", "sap-group-reporting", "oracle-fccs", "oracle-arcs", "blackline"],
  "Planning & Budgeting": ["sap-analytics-cloud", "oracle-pbcs"],
  "Tax & Compliance": ["sap-drc"],
  "Treasury": ["sap-trm", "sap-cash-management", "sap-mbc"],
  "Financial Supply Chain": ["sap-fscm"],
  "Billing & Revenue": ["sap-brim"],
  "Risk & Compliance": ["sap-grc"],
  "Lease Management": ["sap-re-fx"],
  "Finance Transformation": ["sap-afc", "sap-analytics-cloud", "blackline"],
  "Technology": ["sap-analytics-cloud", "sap-afc"],
  "Industry Focus": [],
  "Industry Trends": [],
};

// ── Category → industry slugs ────────────────────────────────────────────────
const CATEGORY_TO_INDUSTRIES: Record<string, string[]> = {
  "Financial Close": [],
  "Planning & Budgeting": [],
  "Tax & Compliance": ["pharmaceuticals", "telecommunications", "oil-and-gas", "financial-services"],
  "Treasury": ["oil-and-gas", "semiconductors", "automotive", "financial-services"],
  "Financial Supply Chain": ["automotive", "semiconductors", "electronics-manufacturing"],
  "Billing & Revenue": ["telecommunications", "retail"],
  "Risk & Compliance": ["financial-services", "pharmaceuticals", "oil-and-gas"],
  "Lease Management": ["real-estate", "retail", "telecommunications"],
  "Finance Transformation": [],
  "Technology": [],
  "Industry Focus": [],
  "Industry Trends": [],
};

// ── Tag keyword → solution slugs ─────────────────────────────────────────────
const TAG_TO_SOLUTIONS: Record<string, string[]> = {
  "afc": ["sap-afc"],
  "sap afc": ["sap-afc"],
  "financial close": ["sap-afc", "blackline"],
  "blackline": ["blackline"],
  "group reporting": ["sap-group-reporting"],
  "consolidation": ["sap-group-reporting", "oracle-fccs"],
  "oracle fccs": ["oracle-fccs"],
  "oracle arcs": ["oracle-arcs"],
  "reconciliation": ["blackline", "oracle-arcs"],
  "planning": ["sap-analytics-cloud", "oracle-pbcs"],
  "budgeting": ["sap-analytics-cloud", "oracle-pbcs"],
  "sac": ["sap-analytics-cloud"],
  "analytics cloud": ["sap-analytics-cloud"],
  "e-invoicing": ["sap-drc"],
  "drc": ["sap-drc"],
  "tax": ["sap-drc"],
  "vat": ["sap-drc"],
  "treasury": ["sap-trm"],
  "trm": ["sap-trm"],
  "cash management": ["sap-cash-management"],
  "bank connectivity": ["sap-mbc"],
  "fscm": ["sap-fscm"],
  "credit management": ["sap-fscm"],
  "collections": ["sap-fscm"],
  "dispute": ["sap-fscm"],
  "brim": ["sap-brim"],
  "billing": ["sap-brim"],
  "revenue recognition": ["sap-brim"],
  "grc": ["sap-grc"],
  "audit": ["sap-grc"],
  "compliance": ["sap-grc", "sap-drc"],
  "lease": ["sap-re-fx"],
  "ifrs 16": ["sap-re-fx"],
  "re-fx": ["sap-re-fx"],
};

// ── Tag keyword → industry slugs ─────────────────────────────────────────────
const TAG_TO_INDUSTRIES: Record<string, string[]> = {
  "automotive": ["automotive"],
  "semiconductor": ["semiconductors"],
  "semiconductors": ["semiconductors"],
  "pharma": ["pharmaceuticals"],
  "pharmaceutical": ["pharmaceuticals"],
  "telecom": ["telecommunications"],
  "telecommunications": ["telecommunications"],
  "oil": ["oil-and-gas"],
  "gas": ["oil-and-gas"],
  "energy": ["energy", "oil-and-gas", "renewable-energy"],
  "renewable": ["renewable-energy"],
  "financial services": ["financial-services"],
  "banking": ["financial-services"],
  "real estate": ["real-estate"],
  "retail": ["retail"],
  "utilities": ["utilities"],
  "electronics": ["electronics-manufacturing"],
  "manufacturing": ["automotive", "semiconductors", "electronics-manufacturing"],
  "cfo": [],
  "finance transformation": [],
  "logistics": ["automotive", "electronics-manufacturing"],
  "saas": [],
  "e-commerce": ["retail"],
  "renewable energy": ["renewable-energy"],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function unique(arr: string[]): string[] {
  const seen: Record<string, boolean> = {};
  return arr.filter((x) => {
    if (seen[x]) return false;
    seen[x] = true;
    return true;
  });
}

function matchTags(tags: string[] | null | undefined, map: Record<string, string[]>): string[] {
  if (!tags || tags.length === 0) return [];
  const result: string[] = [];
  
  // Parse tags if they're in JSON format (e.g., '["Semiconductors", "Finance"]')
  let parsedTags: string[] = [];
  if (typeof tags[0] === 'string' && tags[0].startsWith('[')) {
    try {
      parsedTags = JSON.parse(tags[0]);
    } catch {
      parsedTags = tags;
    }
  } else {
    parsedTags = tags;
  }
  
  const lowerTags = parsedTags.map((t) => String(t).toLowerCase());
  for (const [keyword, slugs] of Object.entries(map)) {
    if (lowerTags.some((t) => t.includes(keyword) || keyword.includes(t))) {
      result.push(...slugs);
    }
  }
  return result;
}

export function getRelatedSolutions(
  category: string | null | undefined,
  tags: string[] | null | undefined
): string[] {
  const fromCategory = category ? (CATEGORY_TO_SOLUTIONS[category] ?? []) : [];
  const fromTags = matchTags(tags ?? [], TAG_TO_SOLUTIONS);
  return unique([...fromCategory, ...fromTags]);
}

export function getRelatedIndustries(
  category: string | null | undefined,
  tags: string[] | null | undefined
): string[] {
  const fromCategory = category ? (CATEGORY_TO_INDUSTRIES[category] ?? []) : [];
  const fromTags = matchTags(tags ?? [], TAG_TO_INDUSTRIES);
  return unique([...fromCategory, ...fromTags]);
}

/**
 * Returns true if the given article should appear on the given solution page.
 */
export function articleMatchesSolution(
  solutionSlug: string,
  category: string | null | undefined,
  tags: string[] | null | undefined
): boolean {
  return getRelatedSolutions(category, tags).includes(solutionSlug);
}

/**
 * Returns true if the given article should appear on the given industry page.
 */
export function articleMatchesIndustry(
  industrySlug: string,
  category: string | null | undefined,
  tags: string[] | null | undefined
): boolean {
  return getRelatedIndustries(category, tags).includes(industrySlug);
}

/**
 * Get related articles for an industry page with fallback.
 * If fewer than minCount articles match, include additional articles from related categories.
 */
export function getRelatedArticlesForIndustry(
  allArticles: Array<{ category: string | null; tags: string[] | null }>,
  industrySlug: string,
  minCount: number = 3
): typeof allArticles {
  // First pass: exact matches
  const exactMatches = allArticles.filter((a) =>
    articleMatchesIndustry(industrySlug, a.category, Array.isArray(a.tags) ? (a.tags as string[]) : [])
  );

  if (exactMatches.length >= minCount) {
    return exactMatches.slice(0, minCount);
  }

  // Fallback: include articles from related categories
  const fallbackCategories = ["Industry Focus", "Industry Trends", "Finance Transformation"];
  const fallbackMatches = allArticles.filter(
    (a) =>
      !exactMatches.includes(a) &&
      a.category &&
      fallbackCategories.includes(a.category)
  );

  return [...exactMatches, ...fallbackMatches].slice(0, minCount);
}

/**
 * Get related articles for a solution page with fallback.
 * If fewer than minCount articles match, include additional articles from related categories.
 */
export function getRelatedArticlesForSolution(
  allArticles: Array<{ category: string | null; tags: string[] | null }>,
  solutionSlug: string,
  minCount: number = 3
): typeof allArticles {
  // First pass: exact matches
  const exactMatches = allArticles.filter((a) =>
    articleMatchesSolution(solutionSlug, a.category, Array.isArray(a.tags) ? (a.tags as string[]) : [])
  );

  if (exactMatches.length >= minCount) {
    return exactMatches.slice(0, minCount);
  }

  // Fallback: include articles from related categories
  const fallbackCategories = ["Finance Transformation", "Technology", "Industry Focus"];
  const fallbackMatches = allArticles.filter(
    (a) =>
      !exactMatches.includes(a) &&
      a.category &&
      fallbackCategories.includes(a.category)
  );

  return [...exactMatches, ...fallbackMatches].slice(0, minCount);
}
