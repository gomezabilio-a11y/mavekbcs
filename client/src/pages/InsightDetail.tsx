import { Link } from "wouter";
import { ArrowRight, ChevronRight, Clock, Tag } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { INSIGHTS, SOLUTION_CATEGORIES, INDUSTRIES } from "@/lib/siteData";

interface InsightDetailProps {
  params: { slug: string };
}

// Full article body content keyed by slug
const articleContent: Record<string, string> = {
  "what-is-advanced-financial-closing-afc": `SAP Advanced Financial Closing (AFC) is a cloud-based solution designed to automate, streamline, and accelerate the financial close process for organizations of all sizes. Unlike traditional close management tools that rely on spreadsheets and email chains, AFC provides a centralized, intelligent platform that orchestrates the entire close cycle from task assignment through completion.

**Core Capabilities**

At its heart, AFC provides a hierarchical task management framework that mirrors the actual structure of a financial close. Close managers can define task templates that are reused across periods, assign responsibilities to individuals or teams, set dependencies between tasks, and monitor real-time completion status from a single dashboard.

The solution integrates natively with SAP S/4HANA and can connect to non-SAP systems through standard APIs, making it suitable for organizations with heterogeneous ERP landscapes. This connectivity means that automated tasks — such as running depreciation, posting accruals, or triggering intercompany reconciliations — can be executed directly from within the close workflow.

**Intelligent Automation**

What distinguishes AFC from earlier generation tools is its use of machine learning to identify close bottlenecks and suggest process improvements. The system tracks historical close performance, flags tasks that are running behind schedule, and can predict close completion dates based on current progress.

**Implementation Considerations**

Organizations implementing AFC typically see close cycle reductions of 20-30% within the first year. The key success factors are thorough process documentation before implementation, strong change management to drive user adoption, and a phased rollout that starts with the most manual and error-prone close activities.

**Conclusion**

For finance leaders looking to modernize their close process, AFC represents a mature, proven solution that delivers measurable results. Its integration with the broader SAP ecosystem makes it particularly compelling for organizations already running SAP S/4HANA.`,

  "group-reporting-explained": `SAP Group Reporting is SAP's modern financial consolidation and reporting solution, designed to replace legacy tools like SAP BCS (Business Consolidation System) and third-party consolidation applications. It enables finance teams to perform real-time consolidation directly within SAP S/4HANA, eliminating the data extraction and loading cycles that characterize traditional consolidation approaches.

**Architecture and Integration**

Unlike standalone consolidation tools, Group Reporting is embedded within the SAP S/4HANA platform. This means that legal entity financial data flows directly into the consolidation layer without the need for intermediate staging or transformation. The result is a significant reduction in close cycle time and improved data quality.

**Multi-GAAP Support**

One of Group Reporting's key strengths is its ability to support multiple accounting standards simultaneously. Organizations can maintain parallel ledgers for IFRS, US GAAP, and local statutory requirements, with automated translation between standards based on configurable mapping rules.

**Intercompany Elimination**

The solution automates intercompany elimination — one of the most time-consuming aspects of group consolidation. It matches intercompany transactions across entities, identifies discrepancies, and generates elimination entries automatically, with exception-based workflows for unmatched items.

**Reporting and Analytics**

Group Reporting integrates with SAP Analytics Cloud for management reporting and analysis, enabling finance teams to drill from consolidated group financials down to individual entity transactions. This transparency is increasingly important for audit purposes and regulatory compliance.`,

  "why-financial-close-is-still-broken": `Despite decades of ERP investment and countless finance transformation initiatives, the financial close process remains one of the most painful and inefficient activities in corporate finance. Understanding why requires looking at both the structural and behavioral factors that perpetuate the problem.

**The Spreadsheet Problem**

The most pervasive issue is the continued reliance on spreadsheets for close management, reconciliation, and reporting. Despite the availability of purpose-built tools, most finance teams still use Excel as their primary close management tool. The reasons are understandable — spreadsheets are flexible, familiar, and free — but the consequences are severe: version control nightmares, formula errors, limited auditability, and no real-time visibility.

**Siloed Systems**

Most organizations have multiple ERP systems, often the result of acquisitions or regional implementations. Each system has its own close calendar, its own data structures, and its own reporting formats. Consolidating data across these systems requires manual extraction, transformation, and loading — a process that is both time-consuming and error-prone.

**Cultural Resistance**

Finance teams are often resistant to process change. The close process has been done the same way for years, and the people who execute it have built their careers around mastering its complexity. Automation threatens this expertise, creating organizational resistance that technology alone cannot overcome.

**The Path Forward**

The organizations that have successfully transformed their close process share several characteristics: strong executive sponsorship, a willingness to invest in change management alongside technology, and a phased approach that delivers quick wins while building toward a comprehensive solution.`,
};

// Generate generic content for articles without specific content
function generateGenericContent(insight: typeof INSIGHTS[0], language: string): string {
  return `${insight.excerpt}

This insight explores the key dimensions of ${insight.title.toLowerCase()}, drawing on MAVEK BCS's experience delivering finance transformation programs across multiple industries and geographies.

**Key Themes**

${insight.tags.map(tag => `- **${tag}**: Understanding the role of ${tag.toLowerCase()} in modern finance operations`).join('\n')}

**Industry Relevance**

The topics covered in this insight are particularly relevant for organizations in ${insight.relatedIndustries.join(', ')} industries, where the challenges described are most acute.

**MAVEK BCS Perspective**

Our consultants bring deep expertise in implementing the solutions and processes described here. We have helped organizations across multiple industries navigate these challenges and achieve measurable improvements in finance performance.

**Getting Started**

If you would like to discuss how these concepts apply to your organization, please contact our team. We offer complimentary initial consultations to help you understand the opportunity and build a business case for change.`;
}

export default function InsightDetail({ params }: InsightDetailProps) {
  const { language } = useLanguage();
  const { slug } = params;

  const insight = INSIGHTS.find((i) => i.slug === slug);

  if (!insight) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link href="/insights" className="btn-outline-navy no-underline">Back to Insights</Link>
        </div>
      </Layout>
    );
  }

  const title = language === "ko" ? insight.titleKo : language === "ja" ? insight.titleJa : insight.title;
  const content = articleContent[slug] || generateGenericContent(insight, language);

  // Related insights (same category, exclude current)
  const related = INSIGHTS.filter((i) => i.category === insight.category && i.slug !== slug).slice(0, 3);

  // Related industries
  const relatedIndustries = INDUSTRIES.filter((ind) => insight.relatedIndustries.includes(ind.slug));

  // Related solutions
  const relatedSolutions = SOLUTION_CATEGORIES.flatMap((cat) =>
    cat.solutions.filter((s) => insight.relatedSolutions.includes(s.slug)).map((s) => ({ ...s, categorySlug: cat.slug }))
  );

  // Format content as paragraphs with bold support
  const renderContent = (text: string) => {
    return text.split('\n\n').map((para, idx) => {
      if (para.startsWith('**') && para.endsWith('**') && para.indexOf('**', 2) === para.length - 2) {
        // Heading
        const heading = para.slice(2, -2);
        return <h3 key={idx} className="text-xl font-bold mt-8 mb-4" style={{ color: "var(--navy-dark)" }}>{heading}</h3>;
      }
      if (para.startsWith('- ')) {
        // List
        const items = para.split('\n').filter(l => l.startsWith('- '));
        return (
          <ul key={idx} className="space-y-2 my-4">
            {items.map((item, i) => {
              const content = item.slice(2);
              const parts = content.split('**');
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
      // Regular paragraph with inline bold
      const parts = para.split('**');
      return (
        <p key={idx} className="text-gray-600 leading-relaxed mb-4 text-base">
          {parts.map((part, pi) => pi % 2 === 1 ? <strong key={pi} className="font-semibold text-gray-800">{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)" }} />
        <div className="container relative z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/insights" className="no-underline hover:text-white transition-colors">Insights</Link>
            <ChevronRight size={12} />
            <span className="text-gray-300">{insight.category}</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5" style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}>
                {insight.category}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={10} /> {insight.readTimeMinutes} {language === "ko" ? "분 읽기" : language === "ja" ? "分で読める" : "min read"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {title}
            </h1>
            <p className="text-gray-300 leading-relaxed text-lg">{insight.excerpt}</p>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose max-w-none">
                {renderContent(content)}
              </div>

              {/* Tags */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={14} className="text-gray-400" />
                  {insight.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Related Industries */}
              {relatedIndustries.length > 0 && (
                <div>
                  <div className="section-divider" />
                  <h4 className="text-sm font-bold mb-4" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? "관련 산업" : language === "ja" ? "関連業界" : "Related Industries"}
                  </h4>
                  <div className="space-y-2">
                    {relatedIndustries.map((ind) => (
                      <Link
                        key={ind.slug}
                        href={`/industries/${ind.slug}`}
                        className="flex items-center gap-2 text-xs text-gray-600 hover:text-[var(--navy)] transition-colors no-underline"
                      >
                        <span>{ind.icon}</span>
                        <span>{language === "ko" ? ind.nameKo : language === "ja" ? ind.nameJa : ind.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Solutions */}
              {relatedSolutions.length > 0 && (
                <div>
                  <div className="section-divider" />
                  <h4 className="text-sm font-bold mb-4" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? "관련 솔루션" : language === "ja" ? "関連ソリューション" : "Related Solutions"}
                  </h4>
                  <div className="space-y-2">
                    {relatedSolutions.map((sol) => (
                      <Link
                        key={sol.slug}
                        href={`/solutions/${sol.categorySlug}/${sol.slug}`}
                        className="flex items-center gap-2 text-xs text-gray-600 hover:text-[var(--navy)] transition-colors no-underline"
                      >
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 text-white"
                          style={{ backgroundColor: sol.vendor === "SAP" ? "var(--navy)" : sol.vendor === "Oracle" ? "var(--navy-mid)" : "#1a1a2e" }}
                        >
                          {sol.vendor.slice(0, 3)}
                        </span>
                        <span className="line-clamp-1">{language === "ko" ? sol.nameKo : language === "ja" ? sol.nameJa : sol.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
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

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="section-off-white py-16">
          <div className="container">
            <div className="section-divider" />
            <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--navy-dark)" }}>
              {language === "ko" ? "관련 인사이트" : language === "ja" ? "関連インサイト" : "More in This Category"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/insights/${rel.slug}`} className="p-6 bg-white border border-gray-100 card-hover no-underline group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {rel.readTimeMinutes} min
                    </span>
                  </div>
                  <h4 className="text-sm font-bold mb-2 group-hover:text-[var(--navy)] transition-colors" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? rel.titleKo : language === "ja" ? rel.titleJa : rel.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
