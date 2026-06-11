/**
 * Article selection logic for industry and solution pages
 * 
 * Rules:
 * - Get all articles with matching tags (exact match)
 * - If >= 3 matching articles: randomly select 3
 * - If < 3 matching articles: show all matching + random articles to reach 3 total
 */

export interface Article {
  id?: number;
  slug: string;
  title: string;
  titleKo?: string | null;
  titleJa?: string | null;
  excerpt?: string | null;
  excerptKo?: string | null;
  excerptJa?: string | null;
  category?: string | null;
  tags?: string[] | null;
  imageUrl?: string | null;
  readTimeMinutes?: number;
  publishedAt?: Date;
  featured?: boolean;
  createdAt?: Date;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get related articles for an industry/solution page
 * 
 * @param allArticles - All available articles
 * @param targetSlug - Industry or solution slug to match
 * @param count - Number of articles to return (default: 3)
 * @returns Array of selected articles
 */
export function getRelatedArticles(
  allArticles: Article[],
  targetSlug: string,
  count: number = 3
): Article[] {
  // Parse tags and find exact matches
  const matchingArticles = allArticles.filter((article) => {
    if (!article.tags) return false;
    
    const tags = Array.isArray(article.tags)
      ? article.tags
      : typeof article.tags === "string"
        ? JSON.parse(article.tags)
        : [];
    
    return tags.some((tag: string) => tag.toLowerCase() === targetSlug.toLowerCase());
  });

  // If we have enough matching articles, randomly select from them
  if (matchingArticles.length >= count) {
    return shuffleArray(matchingArticles).slice(0, count);
  }

  // Otherwise, combine matching articles with random articles
  const remainingCount = count - matchingArticles.length;
  const nonMatchingArticles = allArticles.filter(
    (article) => !matchingArticles.includes(article)
  );
  
  const randomArticles = shuffleArray(nonMatchingArticles).slice(0, remainingCount);
  
  return [...matchingArticles, ...randomArticles];
}
