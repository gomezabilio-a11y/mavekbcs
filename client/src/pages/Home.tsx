import { Link } from "wouter";
import { ArrowRight, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { INDUSTRIES, SOLUTION_CATEGORIES, INSIGHTS } from "@/lib/siteData";
import { useHreflang, getHreflangLinks } from "@/hooks/useHreflang";
import { getLocalizedPath } from "@/lib/urlHelpers";

const featuredInsights = INSIGHTS.filter((i) => i.featured).slice(0, 3);
const featuredIndustries = INDUSTRIES.slice(0, 6);

const stats = [
  {
    value: "15+",
    labelEn: "Avg. Consultant Experience (Years)",
    labelKo: "컨설턴트 평균 경력 (Years)",
    labelJa: "コンサルタント平均経験年数",
  },
  {
    value: "200+",
    labelEn: "Combined Consultant Project History",
    labelKo: "컨설턴트 누적 프로젝트 실적",
    labelJa: "コンサルタント累計プロジェクト実績",
  },
  {
    value: "4",
    labelEn: "Global Strategic Offices",
    labelKo: "글로벌 오피스 네트워크",
    labelJa: "グローバル拠点数",
  },
  {
    value: "12",
    labelEn: "Core Industries Served",
    labelKo: "전문 산업 분야",
    labelJa: "対応業界数",
  },
];

const vendors = ["SAP", "Oracle", "Blackline"];

export default function Home() {
  const { t, language } = useLanguage();
  useHreflang(getHreflangLinks(""));

  return (
    <Layout>
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{ backgroundColor: "var(--navy-dark)" }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg, transparent, transparent 60px, rgba(255,255,255,0.3) 60px, rgba(255,255,255,0.3) 61px
            ), repeating-linear-gradient(
              90deg, transparent, transparent 60px, rgba(255,255,255,0.3) 60px, rgba(255,255,255,0.3) 61px
            )`,
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20"
          style={{
            background: "radial-gradient(ellipse at 80% 50%, oklch(0.45 0.12 255) 0%, transparent 70%)",
          }}
        />

        <div className="container relative z-10 py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px" style={{ backgroundColor: "var(--gold)" }} />
              <span
                className="text-xs font-semibold tracking-[0.25em] uppercase"
                style={{ color: "var(--gold)" }}
              >
                {t("hero.tagline")}
              </span>
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-white mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("hero.headline")}
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-2xl">
              {t("hero.subheadline")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href={getLocalizedPath("/solutions", language)} className="btn-gold no-underline">
                {t("hero.cta.explore")}
                <ArrowRight size={15} />
              </Link>
              <Link href={getLocalizedPath("/contact", language)} className="btn-outline-white no-underline">
                {t("hero.cta.contact")}
              </Link>
            </div>

            {/* Technology Platforms */}
            <div className="mt-16">
              <p className="text-xs text-gray-500 tracking-wider uppercase mb-3">
                {language === "ko"
                  ? "지원 기술 플랫폼"
                  : language === "ja"
                  ? "対応テクノロジープラットフォーム"
                  : "Technology Platforms We Support"}
              </p>
              <div className="flex items-center gap-6 mb-3">
                {vendors.map((v) => (
                  <span
                    key={v}
                    className="text-sm font-bold text-gray-400 tracking-wide"
                  >
                    {v}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                {language === "ko"
                  ? "MAVEK BCS의 컨설턴트들은 다음의 글로벌 재무 플랫폼에 대해 직접적인 구축 및 운영 경험을 보유하고 있습니다."
                  : language === "ja"
                  ? "MAVEK BCSのコンサルタントは、以下のグローバル財務プラットフォームにおいて直接的な導入・運用経験を有しています。"
                  : "Our consultants bring hands-on implementation and operational experience across leading global financial platforms."}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: "linear-gradient(to bottom, transparent, white)",
          }}
        />
      </section>

      {/* ─── Stats ────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map((stat) => (
              <div key={stat.labelEn} className="py-10 px-6 text-center">
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: "var(--navy)", fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 tracking-wide uppercase font-medium">
                  {language === "ko"
                    ? stat.labelKo
                    : language === "ja"
                    ? stat.labelJa
                    : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Value Proposition ────────────────────────────────────── */}
      <section className="section-off-white py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-divider" />
              <h2
                className="text-4xl font-bold mb-6 leading-tight"
                style={{ color: "var(--navy-dark)" }}
              >
                {t("home.section.title")}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t("home.section.p1")}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {t("home.section.p2")}
              </p>
              <Link href={getLocalizedPath("/about", language)} className="btn-outline-navy no-underline">
                {t("home.section.cta")}
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: t("home.fc.title"), desc: t("home.fc.desc") },
                { title: t("home.pa.title"), desc: t("home.pa.desc") },
                { title: t("home.tc.title"), desc: t("home.tc.desc") },
                { title: t("home.tm.title"), desc: t("home.tm.desc") },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white p-6 border border-gray-100 card-hover"
                >
                  <div className="w-8 h-0.5 mb-4" style={{ backgroundColor: "var(--gold)" }} />
                  <h4 className="text-sm font-bold mb-2" style={{ color: "var(--navy)" }}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Industries ───────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-divider" />
              <h2
                className="text-4xl font-bold"
                style={{ color: "var(--navy-dark)" }}
              >
                {t("industries.title")}
              </h2>
              <p className="text-gray-500 mt-3 text-sm">{t("industries.subtitle")}</p>
            </div>
            <Link
              href={getLocalizedPath("/industries", language)}
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide no-underline transition-colors"
              style={{ color: "var(--navy)" }}
            >
              View All
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredIndustries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group flex flex-col items-center text-center p-6 border border-gray-100 hover:border-[var(--navy)] transition-all duration-300 no-underline card-hover"
              >
                <span className="text-3xl mb-3">{ind.icon}</span>
                <span
                  className="text-xs font-semibold leading-tight"
                  style={{ color: "var(--navy)" }}
                >
                  {language === "ko" ? ind.nameKo : language === "ja" ? ind.nameJa : ind.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {INDUSTRIES.slice(6).map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group flex flex-col items-center text-center p-6 border border-gray-100 hover:border-[var(--navy)] transition-all duration-300 no-underline card-hover"
              >
                <span className="text-3xl mb-3">{ind.icon}</span>
                <span
                  className="text-xs font-semibold leading-tight"
                  style={{ color: "var(--navy)" }}
                >
                  {language === "ko" ? ind.nameKo : language === "ja" ? ind.nameJa : ind.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Solutions ────────────────────────────────────────────── */}
      <section className="section-navy py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-divider" />
              <h2
                className="text-4xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("solutions.title")}
              </h2>
              <p className="text-gray-400 mt-3 text-sm">{t("solutions.subtitle")}</p>
            </div>
            <Link
              href={getLocalizedPath("/solutions", language)}
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide no-underline transition-colors text-gray-400 hover:text-white"
            >
              View All
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SOLUTION_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/solutions/${cat.slug}`}
                className="group p-6 border no-underline transition-all duration-300 card-hover"
                style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <div className="w-6 h-0.5 mb-4" style={{ backgroundColor: "var(--gold)" }} />
                <h4 className="text-sm font-bold text-white mb-2">
                  {language === "ko" ? cat.nameKo : language === "ja" ? cat.nameJa : cat.name}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                  {language === "ko" ? cat.descriptionKo : language === "ja" ? cat.descriptionJa : cat.description}
                </p>
                <div className="text-xs text-gray-500">
                  {cat.solutions.length} solution{cat.solutions.length !== 1 ? "s" : ""}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Insights ────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-divider" />
              <h2
                className="text-4xl font-bold"
                style={{ color: "var(--navy-dark)" }}
              >
                {t("insights.title")}
              </h2>
              <p className="text-gray-500 mt-3 text-sm">{t("insights.subtitle")}</p>
            </div>
            <Link
              href={getLocalizedPath("/insights", language)}
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide no-underline transition-colors"
              style={{ color: "var(--navy)" }}
            >
              All Insights
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredInsights.map((insight, idx) => (
              <Link
                key={insight.slug}
                href={getLocalizedPath(`/insights/${insight.slug}`, language)}
                className="group no-underline card-hover"
              >
                <div
                  className="h-48 mb-5 flex items-end p-6 relative overflow-hidden"
                  style={{
                    backgroundColor: idx === 0 ? "var(--navy)" : idx === 1 ? "var(--navy-mid)" : "var(--navy-light)",
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-10"
                    style={{
                      background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)",
                    }}
                  />
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-2 py-1"
                    style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}
                  >
                    {insight.category}
                  </span>
                </div>
                <div>
                  <h3
                    className="text-lg font-bold mb-3 leading-snug group-hover:text-[var(--navy)] transition-colors"
                    style={{ color: "var(--navy-dark)", fontFamily: "'Playfair Display', serif" }}
                  >
                    {language === "ko" ? insight.titleKo : language === "ja" ? insight.titleJa : insight.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {language === "ko" && insight.excerptKo ? insight.excerptKo : language === "ja" && insight.excerptJa ? insight.excerptJa : insight.excerpt}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--navy)" }}>
                    {t("insights.readMore")}
                    <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ backgroundColor: "var(--navy)" }}
      >
        <div className="container text-center">
          <div className="section-divider mx-auto" />
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("home.bottom.title")}
          </h2>
          <p className="text-gray-300 mb-10 max-w-xl mx-auto">
            {t("home.bottom.body")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={getLocalizedPath("/contact", language)} className="btn-gold no-underline">
              {t("hero.cta.contact")}
              <ArrowRight size={14} />
            </Link>
            <Link href={getLocalizedPath("/solutions", language)} className="btn-outline-white no-underline">
              {t("hero.cta.explore")}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
