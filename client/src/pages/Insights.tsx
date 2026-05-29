import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Clock, Search } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { INSIGHT_CATEGORIES } from "@/lib/siteData";
import { useHreflang, getHreflangLinks } from "@/hooks/useHreflang";
import { trpc } from "@/lib/trpc";
import { getLocalizedPath } from "@/lib/urlHelpers";

export default function Insights() {
  const { language } = useLanguage();
  useHreflang(getHreflangLinks("/insights"));
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allInsights = [], isLoading } = trpc.blog.listInsights.useQuery();
  const { data: settings } = trpc.blog.getInsightsSettings.useQuery();

  // Resolve banner and featured articles from settings
  const bannerArticle = settings?.bannerSlug
    ? allInsights.find((a) => a.slug === settings.bannerSlug) ?? null
    : null;

  const featuredArticles = [
    settings?.featured1Slug,
    settings?.featured2Slug,
    settings?.featured3Slug,
  ]
    .filter(Boolean)
    .map((slug) => allInsights.find((a) => a.slug === slug))
    .filter(Boolean) as typeof allInsights;

  // Fallback: if no settings configured, use featured flag
  const fallbackFeatured = allInsights.filter((i) => i.featured).slice(0, 3);
  const showFeatured = featuredArticles.length > 0 ? featuredArticles : fallbackFeatured;

  const filtered = allInsights.filter((insight) => {
    const matchesCategory = activeCategory === "All" || insight.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === "" ||
      (insight.title ?? "").toLowerCase().includes(q) ||
      (insight.excerpt ?? "").toLowerCase().includes(q) ||
      (insight.titleKo ?? "").toLowerCase().includes(q) ||
      (insight.titleJa ?? "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const getTitle = (insight: typeof allInsights[0]) =>
    language === "ko" ? (insight.titleKo ?? insight.title) : language === "ja" ? (insight.titleJa ?? insight.title) : insight.title;

  const getExcerpt = (insight: typeof allInsights[0]) =>
    language === "ko" ? (insight.excerptKo ?? insight.excerpt ?? "") : language === "ja" ? (insight.excerptJa ?? insight.excerpt ?? "") : (insight.excerpt ?? "");

  return (
    <Layout>
      {/* Hero Banner — admin-selected article */}
      {!isLoading && bannerArticle ? (
        <section className="relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)", minHeight: "480px" }}>
          {/* Background thumbnail */}
          {bannerArticle.imageUrl && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${bannerArticle.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.18,
              }}
            />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,15,30,0.97) 40%, rgba(10,15,30,0.55) 100%)" }} />
          <div className="container relative z-10 py-20 md:py-28">
            <div className="max-w-2xl">
              <div className="section-divider" />
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1" style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}>
                  {bannerArticle.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={10} /> {bannerArticle.readTimeMinutes} min
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {getTitle(bannerArticle)}
              </h1>
              <p className="text-base text-gray-300 leading-relaxed mb-8 max-w-xl line-clamp-3">
                {getExcerpt(bannerArticle)}
              </p>
              <Link
                href={getLocalizedPath(`/insights/${bannerArticle.slug}`, language)}
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm no-underline transition-all"
                style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}
              >
                {language === "ko" ? "아티클 읽기" : language === "ja" ? "記事を読む" : "Read Article"}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        /* Default hero when no banner set */
        <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)" }} />
          <div className="container relative z-10">
            <div className="max-w-3xl">
              <div className="section-divider" />
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {language === "ko" ? "인사이트" : language === "ja" ? "インサイト" : "Insights"}
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                {language === "ko"
                  ? "재무 혁신, 기술 트렌드 및 업계 관점에 대한 전문가의 관점."
                  : language === "ja"
                  ? "財務変革、テクノロジートレンド、業界の視点に関する専門家の見解。"
                  : "Expert perspectives on finance transformation, technology trends, and industry developments."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles — 3 slots */}
      {!isLoading && showFeatured.length > 0 && (
        <section className="section-off-white py-16">
          <div className="container">
            <div className="section-divider" />
            <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--navy-dark)" }}>
              {language === "ko" ? "주요 인사이트" : language === "ja" ? "注目のインサイト" : "Featured Insights"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {showFeatured.map((insight) => (
                <Link
                  key={insight.slug}
                  href={getLocalizedPath(`/insights/${insight.slug}`, language)}
                  className="flex flex-col bg-white border border-gray-100 card-hover no-underline group overflow-hidden"
                >
                  {insight.imageUrl ? (
                    <div className="w-full h-44 overflow-hidden">
                      <img
                        src={insight.imageUrl}
                        alt={getTitle(insight)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-44 flex items-center justify-center" style={{ backgroundColor: "var(--navy-dark)", opacity: 0.85 }}>
                      <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1" style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}>
                        {insight.category}
                      </span>
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5" style={{ backgroundColor: "var(--navy-dark)", color: "white" }}>
                        {insight.category}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={10} /> {insight.readTimeMinutes} min
                      </span>
                    </div>
                    <h3 className="text-base font-bold mb-3 group-hover:text-[var(--navy)] transition-colors leading-snug" style={{ color: "var(--navy-dark)" }}>
                      {getTitle(insight)}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{getExcerpt(insight)}</p>
                  </div>
                  <div className="px-6 pb-5 flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--navy)" }}>
                    {language === "ko" ? "읽기" : language === "ja" ? "読む" : "Read Article"}
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Insights with Filters */}
      <section className="bg-white py-16">
        <div className="container">
          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={language === "ko" ? "인사이트 검색..." : language === "ja" ? "インサイトを検索..." : "Search insights..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-[var(--navy)] transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", ...INSIGHT_CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="text-xs px-3 py-1.5 font-medium transition-colors border"
                  style={{
                    backgroundColor: activeCategory === cat ? "var(--navy-dark)" : "transparent",
                    color: activeCategory === cat ? "white" : "var(--navy-dark)",
                    borderColor: activeCategory === cat ? "var(--navy-dark)" : "#e5e7eb",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          {!isLoading && (
            <p className="text-xs text-gray-400 mb-6">
              {filtered.length} {language === "ko" ? "개 인사이트" : language === "ja" ? "件のインサイト" : "insights"}
            </p>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-3 w-1/3" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((insight) => (
                <Link
                  key={insight.slug}
                  href={getLocalizedPath(`/insights/${insight.slug}`, language)}
                  className="flex flex-col border border-gray-100 card-hover no-underline group overflow-hidden"
                >
                  {insight.imageUrl && (
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={insight.imageUrl}
                        alt={getTitle(insight)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5" style={{ backgroundColor: "var(--off-white)", color: "var(--navy-dark)", border: "1px solid #e5e7eb" }}>
                        {insight.category}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={10} /> {insight.readTimeMinutes} min
                      </span>
                    </div>
                    <h3 className="text-sm font-bold mb-2 group-hover:text-[var(--navy)] transition-colors leading-snug" style={{ color: "var(--navy-dark)" }}>
                      {getTitle(insight)}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{getExcerpt(insight)}</p>
                  </div>
                  <div className="px-6 pb-5 flex flex-wrap gap-1">
                    {((insight.tags as string[]) ?? []).slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500">{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium mb-2">
                {language === "ko" ? "결과 없음" : language === "ja" ? "結果なし" : "No results found"}
              </p>
              <p className="text-sm">
                {language === "ko" ? "다른 검색어나 필터를 시도해 보세요." : language === "ja" ? "別の検索語またはフィルターをお試しください。" : "Try a different search term or filter."}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
