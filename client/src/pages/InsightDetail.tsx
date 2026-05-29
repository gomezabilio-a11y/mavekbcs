import { Link } from "wouter";
import { ArrowRight, ChevronRight, Clock, Tag } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOLUTION_CATEGORIES, INDUSTRIES } from "@/lib/siteData";
import { useHreflang, getHreflangLinks } from "@/hooks/useHreflang";
import { trpc } from "@/lib/trpc";

interface InsightDetailProps {
  params: { slug: string };
}

export default function InsightDetail({ params }: InsightDetailProps) {
  const { language } = useLanguage();
  const { slug } = params;

  const basePath = `/insights/${slug}`;
  useHreflang(getHreflangLinks(basePath));

  const { data: insight, isLoading, error } = trpc.blog.getInsight.useQuery({ slug });
  const { data: allInsights = [] } = trpc.blog.listInsights.useQuery();

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !insight) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link href="/insights" className="btn-outline-navy no-underline">Back to Insights</Link>
        </div>
      </Layout>
    );
  }

  const title = language === "ko" && insight.titleKo ? insight.titleKo
    : language === "ja" && insight.titleJa ? insight.titleJa
    : insight.title;

  const excerpt = language === "ko" && insight.excerptKo ? insight.excerptKo
    : language === "ja" && insight.excerptJa ? insight.excerptJa
    : insight.excerpt ?? "";

  const content = language === "ko" && insight.contentKo ? insight.contentKo
    : language === "ja" && insight.contentJa ? insight.contentJa
    : insight.content ?? "";

  const tags: string[] = Array.isArray(insight.tags) ? insight.tags as string[] : [];
  const relatedIndustrySlugs: string[] = Array.isArray(insight.relatedIndustries) ? insight.relatedIndustries as string[] : [];
  const relatedSolutionSlugs: string[] = Array.isArray(insight.relatedSolutions) ? insight.relatedSolutions as string[] : [];

  const related = allInsights
    .filter((i) => i.category === insight.category && i.slug !== slug)
    .slice(0, 3);

  const relatedIndustries = INDUSTRIES.filter((ind) => relatedIndustrySlugs.includes(ind.slug));

  const relatedSolutions = SOLUTION_CATEGORIES.flatMap((cat) =>
    cat.solutions
      .filter((s) => relatedSolutionSlugs.includes(s.slug))
      .map((s) => ({ ...s, categorySlug: cat.slug }))
  );

  const renderContent = (text: string) => {
    if (text.trim().startsWith("<")) {
      return (
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }
    return (
      <div className="prose max-w-none">
        {text.split("\n\n").map((para, idx) => {
          if (para.startsWith("**") && para.endsWith("**") && para.indexOf("**", 2) === para.length - 2) {
            const heading = para.slice(2, -2);
            return <h3 key={idx} className="text-xl font-bold mt-8 mb-4" style={{ color: "var(--navy-dark)" }}>{heading}</h3>;
          }
          if (para.startsWith("- ")) {
            const items = para.split("\n").filter((l) => l.startsWith("- "));
            return (
              <ul key={idx} className="space-y-2 my-4">
                {items.map((item, i) => {
                  const itemContent = item.slice(2);
                  const parts = itemContent.split("**");
                  return (
                    <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: "var(--gold)" }} />
                      <span>{parts.map((p, pi) => pi % 2 === 1 ? <strong key={pi}>{p}</strong> : p)}</span>
                    </li>
                  );
                })}
              </ul>
            );
          }
          const parts = para.split("**");
          return (
            <p key={idx} className="text-gray-600 leading-relaxed mb-4 text-base">
              {parts.map((part, pi) => pi % 2 === 1 ? <strong key={pi} className="font-semibold text-gray-800">{part}</strong> : part)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)" }} />
        <div className="container relative z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/insights" className="no-underline hover:text-white transition-colors">Insights</Link>
            <ChevronRight size={12} />
            <span className="text-gray-300">{insight.category}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-5xl">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5" style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}>
                  {insight.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={10} /> {insight.readTimeMinutes ?? 5} {language === "ko" ? "분 읽기" : language === "ja" ? "分で読める" : "min read"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {title}
              </h1>
              <p className="text-gray-300 leading-relaxed text-lg">{excerpt}</p>
            </div>
            {insight.imageUrl && (
              <div className="hidden lg:block">
                <img src={insight.imageUrl} alt={title} className="w-full h-64 object-cover rounded shadow-2xl" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3">
              {content ? renderContent(content) : (
                <p className="text-gray-400 italic">No content available for this article.</p>
              )}
              {tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={14} className="text-gray-400" />
                    {tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {relatedIndustries.length > 0 && (
                <div>
                  <div className="section-divider" />
                  <h4 className="text-sm font-bold mb-4" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? "관련 산업" : language === "ja" ? "関連業界" : "Related Industries"}
                  </h4>
                  <div className="space-y-2">
                    {relatedIndustries.map((ind) => (
                      <Link key={ind.slug} href={`/industries/${ind.slug}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-[var(--navy)] transition-colors no-underline">
                        <span>{ind.icon}</span>
                        <span>{language === "ko" ? ind.nameKo : language === "ja" ? ind.nameJa : ind.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {relatedSolutions.length > 0 && (
                <div>
                  <div className="section-divider" />
                  <h4 className="text-sm font-bold mb-4" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? "관련 솔루션" : language === "ja" ? "関連ソリューション" : "Related Solutions"}
                  </h4>
                  <div className="space-y-2">
                    {relatedSolutions.map((sol) => (
                      <Link key={sol.slug} href={`/solutions/${sol.categorySlug}/${sol.slug}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-[var(--navy)] transition-colors no-underline">
                        <span className="text-xs font-bold px-1.5 py-0.5 text-white" style={{ backgroundColor: sol.vendor === "SAP" ? "var(--navy)" : sol.vendor === "Oracle" ? "var(--navy-mid)" : "#1a1a2e" }}>
                          {sol.vendor.slice(0, 3)}
                        </span>
                        <span className="line-clamp-1">{language === "ko" ? sol.nameKo : language === "ja" ? sol.nameJa : sol.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-5" style={{ backgroundColor: "var(--navy-dark)" }}>
                <h4 className="text-white font-bold text-sm mb-2">
                  {language === "ko" ? "전문가와 상담" : language === "ja" ? "専門家に相談" : "Talk to an Expert"}
                </h4>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                  {language === "ko" ? "이 주제에 대해 더 알고 싶으신가요?" : language === "ja" ? "このトピックについてもっと知りたいですか？" : "Want to explore this topic for your organization?"}
                </p>
                <Link href="/contact" className="btn-gold no-underline text-xs w-full justify-center">
                  {language === "ko" ? "문의하기" : language === "ja" ? "お問い合わせ" : "Get in Touch"}
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-off-white py-16">
          <div className="container">
            <div className="section-divider" />
            <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--navy-dark)" }}>
              {language === "ko" ? "관련 인사이트" : language === "ja" ? "関連インサイト" : "More in This Category"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => {
                const relTitle = language === "ko" && rel.titleKo ? rel.titleKo
                  : language === "ja" && rel.titleJa ? rel.titleJa
                  : rel.title;
                const relExcerpt = language === "ko" && rel.excerptKo ? rel.excerptKo
                  : language === "ja" && rel.excerptJa ? rel.excerptJa
                  : rel.excerpt ?? "";
                return (
                  <Link key={rel.slug} href={`/insights/${rel.slug}`} className="bg-white border border-gray-100 card-hover no-underline group overflow-hidden">
                    {rel.imageUrl && (
                      <img src={rel.imageUrl} alt={relTitle} className="w-full h-36 object-cover" />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> {rel.readTimeMinutes ?? 5} min
                        </span>
                      </div>
                      <h4 className="text-sm font-bold mb-2 group-hover:text-[var(--navy)] transition-colors" style={{ color: "var(--navy-dark)" }}>
                        {relTitle}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{relExcerpt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
