import { Link } from "wouter";
import { ArrowRight, CheckSquare, FileText, TrendingUp, Link as LinkIcon, Receipt, Shield, BarChart2, Home } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOLUTION_CATEGORIES } from "@/lib/siteData";

const iconMap: Record<string, React.ReactNode> = {
  CheckSquare: <CheckSquare size={24} />,
  FileText: <FileText size={24} />,
  TrendingUp: <TrendingUp size={24} />,
  Link: <LinkIcon size={24} />,
  Receipt: <Receipt size={24} />,
  Shield: <Shield size={24} />,
  BarChart2: <BarChart2 size={24} />,
  Home: <Home size={24} />,
};

export default function Solutions() {
  const { language } = useLanguage();

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)" }} />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="section-divider" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {language === "ko" ? "솔루션" : language === "ja" ? "ソリューション" : "Solutions"}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              {language === "ko"
                ? "SAP, Oracle 및 Blackline의 선도적인 플랫폼을 활용한 8가지 기술 카테고리에 걸친 16개의 전문 솔루션."
                : language === "ja"
                ? "SAP、Oracle、BlacklineのリーディングプラットフォームをベースにしたSAP、Oracle、Blacklineの8つのテクノロジーカテゴリにわたる16の専門ソリューション。"
                : "Sixteen specialized solutions across eight technology categories, built on leading platforms from SAP, Oracle, and Blackline."}
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SOLUTION_CATEGORIES.map((cat) => {
              const catName = language === "ko" ? cat.nameKo : language === "ja" ? cat.nameJa : cat.name;
              const catDesc = language === "ko" ? cat.descriptionKo : language === "ja" ? cat.descriptionJa : cat.description;
              return (
                <div key={cat.slug} className="border border-gray-100 p-8 card-hover group">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-12 h-12 flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: "var(--navy)" }}>
                      {iconMap[cat.icon] || <CheckSquare size={24} />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2" style={{ color: "var(--navy-dark)" }}>{catName}</h2>
                      <p className="text-sm text-gray-500 leading-relaxed">{catDesc}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    {cat.solutions.map((sol) => {
                      const solName = language === "ko" ? sol.nameKo : language === "ja" ? sol.nameJa : sol.name;
                      return (
                        <Link
                          key={sol.slug}
                          href={`/solutions/${cat.slug}/${sol.slug}`}
                          className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors no-underline group/item"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="text-xs font-bold px-1.5 py-0.5 text-white"
                              style={{ backgroundColor: sol.vendor === "SAP" ? "var(--navy)" : sol.vendor === "Oracle" ? "var(--navy-mid)" : "#1a1a2e" }}
                            >
                              {sol.vendor.slice(0, 3)}
                            </span>
                            <span className="text-sm font-medium text-gray-700 group-hover/item:text-[var(--navy)] transition-colors">{solName}</span>
                          </div>
                          <ArrowRight size={14} className="text-gray-400 group-hover/item:text-[var(--navy)] transition-colors shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href={`/solutions/${cat.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold no-underline group-hover:gap-3 transition-all"
                    style={{ color: "var(--navy)" }}
                  >
                    {language === "ko" ? "카테고리 보기" : language === "ja" ? "カテゴリを見る" : "View Category"}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy py-16">
        <div className="container text-center">
          <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {language === "ko" ? "어떤 솔루션이 귀사에 적합한지 확인하세요" : language === "ja" ? "どのソリューションが最適かを確認する" : "Find the Right Solution for Your Organization"}
          </h3>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto text-sm">
            {language === "ko" ? "전문 컨설턴트가 귀사의 요구에 맞는 솔루션을 안내해 드립니다." : language === "ja" ? "専門コンサルタントが貴社のニーズに合ったソリューションをご案内します。" : "Our specialists will guide you to the right solution for your specific needs."}
          </p>
          <Link href="/contact" className="btn-gold no-underline">
            {language === "ko" ? "전문가에게 문의" : language === "ja" ? "専門家に相談" : "Speak with an Expert"}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
