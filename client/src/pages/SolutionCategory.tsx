import { Link } from "wouter";
import { ArrowRight, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOLUTION_CATEGORIES } from "@/lib/siteData";

interface SolutionCategoryProps {
  params: { category: string };
}

export default function SolutionCategory({ params }: SolutionCategoryProps) {
  const { language } = useLanguage();
  const category = SOLUTION_CATEGORIES.find((c) => c.slug === params.category);

  if (!category) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link href="/solutions" className="btn-outline-navy no-underline">Back to Solutions</Link>
        </div>
      </Layout>
    );
  }

  const catName = language === "ko" ? category.nameKo : language === "ja" ? category.nameJa : category.name;
  const catDesc = language === "ko" ? category.descriptionKo : language === "ja" ? category.descriptionJa : category.description;

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)" }} />
        <div className="container relative z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/solutions" className="no-underline hover:text-white transition-colors">Solutions</Link>
            <ChevronRight size={12} />
            <span className="text-gray-300">{catName}</span>
          </div>
          <div className="max-w-3xl">
            <div className="section-divider" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {catName}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">{catDesc}</p>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="section-divider" />
          <h2 className="text-3xl font-bold mb-10" style={{ color: "var(--navy-dark)" }}>
            {language === "ko" ? "솔루션" : language === "ja" ? "ソリューション" : "Solutions in this Category"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.solutions.map((sol) => {
              const solName = language === "ko" ? sol.nameKo : language === "ja" ? sol.nameJa : sol.name;
              const solDesc = language === "ko" ? sol.shortDescriptionKo : language === "ja" ? sol.shortDescriptionJa : sol.shortDescription;
              return (
                <Link
                  key={sol.slug}
                  href={`/solutions/${category.slug}/${sol.slug}`}
                  className="flex flex-col p-8 border border-gray-100 card-hover no-underline group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-xs font-bold px-2 py-1 text-white"
                      style={{ backgroundColor: sol.vendor === "SAP" ? "var(--navy)" : sol.vendor === "Oracle" ? "var(--navy-mid)" : "#1a1a2e" }}
                    >
                      {sol.vendor}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-[var(--navy)] transition-colors" style={{ color: "var(--navy-dark)" }}>
                    {solName}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{solDesc}</p>
                  <div className="flex items-center gap-2 mt-5 text-sm font-semibold" style={{ color: "var(--navy)" }}>
                    {language === "ko" ? "자세히 보기" : language === "ja" ? "詳細を見る" : "Learn More"}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy py-16">
        <div className="container text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            {language === "ko" ? `${catName} 솔루션에 대해 논의하시겠습니까?` : language === "ja" ? `${catName}ソリューションについて話し合いますか？` : `Ready to discuss ${catName} solutions?`}
          </h3>
          <Link href="/contact" className="btn-gold no-underline">
            {language === "ko" ? "전문가에게 문의" : language === "ja" ? "専門家に相談" : "Speak with an Expert"}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
