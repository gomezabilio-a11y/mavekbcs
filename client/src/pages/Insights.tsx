import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Clock, Search } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { INSIGHTS, INSIGHT_CATEGORIES } from "@/lib/siteData";

export default function Insights() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = INSIGHTS.filter((insight) => {
    const matchesCategory = activeCategory === "All" || insight.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = INSIGHTS.filter((i) => i.featured).slice(0, 3);

  return (
    <Layout>
      {/* Hero */}
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

      {/* Featured */}
      {featured.length > 0 && (
        <section className="section-off-white py-16">
          <div className="container">
            <div className="section-divider" />
            <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--navy-dark)" }}>
              {language === "ko" ? "주요 인사이트" : language === "ja" ? "注目のインサイト" : "Featured Insights"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((insight) => (
                <Link
                  key={insight.slug}
                  href={`/insights/${insight.slug}`}
                  className="flex flex-col bg-white border border-gray-100 card-hover no-underline group"
                >
                  {insight.thumbnailUrl && (
                    <div className="h-44 overflow-hidden relative" style={{ backgroundColor: "var(--navy)" }}>
                      <img
                        src={insight.thumbnailUrl}
                        alt={insight.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity"
                      />
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
                      {language === "ko" ? insight.titleKo : language === "ja" ? insight.titleJa : insight.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{language === "ko" && insight.excerptKo ? insight.excerptKo : language === "ja" && insight.excerptJa ? insight.excerptJa : insight.excerpt}</p>
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
          <p className="text-xs text-gray-400 mb-6">
            {filtered.length} {language === "ko" ? "개 인사이트" : language === "ja" ? "件のインサイト" : "insights"}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((insight) => (
              <Link
                key={insight.slug}
                href={`/insights/${insight.slug}`}
                className="flex flex-col border border-gray-100 card-hover no-underline group"
              >
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
                    {language === "ko" ? insight.titleKo : language === "ja" ? insight.titleJa : insight.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{language === "ko" && insight.excerptKo ? insight.excerptKo : language === "ja" && insight.excerptJa ? insight.excerptJa : insight.excerpt}</p>
                </div>
                <div className="px-6 pb-5 flex flex-wrap gap-1">
                  {insight.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
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
