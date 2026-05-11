import { Link } from "wouter";
import { ArrowRight, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { INDUSTRIES, SOLUTION_CATEGORIES, INSIGHTS } from "@/lib/siteData";

const featuredInsights = INSIGHTS.filter((i) => i.featured).slice(0, 3);
const featuredIndustries = INDUSTRIES.slice(0, 6);

const stats = [
  { value: "20+", label: "Years of Experience" },
  { value: "200+", label: "Implementations Delivered" },
  { value: "4", label: "Global Offices" },
  { value: "12", label: "Industries Served" },
];

const vendors = ["SAP", "Oracle", "Blackline"];

export default function Home() {
  const { t, language } = useLanguage();

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
              <Link href="/solutions" className="btn-gold no-underline">
                {t("hero.cta.explore")}
                <ArrowRight size={15} />
              </Link>
              <Link href="/contact" className="btn-outline-white no-underline">
                {t("hero.cta.contact")}
              </Link>
            </div>

            {/* Vendor logos */}
            <div className="mt-16 flex items-center gap-6">
              <span className="text-xs text-gray-500 tracking-wider uppercase">
                Certified Partner:
              </span>
              {vendors.map((v) => (
                <span
                  key={v}
                  className="text-sm font-bold text-gray-400 tracking-wide"
                >
                  {v}
                </span>
              ))}
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
              <div key={stat.label} className="py-10 px-6 text-center">
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: "var(--navy)", fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 tracking-wide uppercase font-medium">
                  {stat.label}
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
                Specialized Financial Technology for Complex Organizations
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                MAVEK BCS partners with global enterprises to implement, optimize, and transform their financial technology ecosystems. Our deep expertise in SAP, Oracle, and Blackline platforms enables us to deliver measurable results across every stage of the financial close, planning, and compliance lifecycle.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                With offices in Hong Kong, Japan, Korea, and the Philippines, we bring both global perspective and local market knowledge to every engagement.
              </p>
              <Link href="/about" className="btn-outline-navy no-underline">
                Learn About MAVEK BCS
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Financial Close", desc: "Accelerate your close cycle with intelligent automation and real-time visibility." },
                { title: "Planning & Analytics", desc: "Drive better decisions with integrated planning, budgeting, and forecasting." },
                { title: "Tax & Compliance", desc: "Navigate global tax complexity with automated compliance solutions." },
                { title: "Treasury Management", desc: "Optimize cash, manage risk, and streamline bank connectivity." },
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
              href="/industries"
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
              href="/solutions"
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
              href="/insights"
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
                href={`/insights/${insight.slug}`}
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
                    {insight.excerpt}
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
            Ready to Transform Your Finance Function?
          </h2>
          <p className="text-gray-300 mb-10 max-w-xl mx-auto">
            Speak with our experts to discover how MAVEK BCS can help your organization achieve financial excellence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-gold no-underline">
              {t("hero.cta.contact")}
              <ArrowRight size={14} />
            </Link>
            <Link href="/solutions" className="btn-outline-white no-underline">
              {t("hero.cta.explore")}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
