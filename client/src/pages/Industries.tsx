import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { INDUSTRIES } from "@/lib/siteData";

export default function Industries() {
  const { language } = useLanguage();

  return (
    <Layout>
      {/* Hero */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: "var(--navy-dark)" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px
            )`,
          }}
        />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ backgroundColor: "var(--gold)" }} />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-400">
                Industries
              </span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {language === "ko" ? "산업별 전문 서비스" : language === "ja" ? "業界別専門サービス" : "Industry Expertise"}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              {language === "ko"
                ? "MAVEK BCS는 12개 주요 산업 전반에 걸쳐 맞춤형 재무 기술 솔루션을 제공합니다."
                : language === "ja"
                ? "MAVEK BCSは12の主要業界全体にわたってカスタマイズされた財務テクノロジーソリューションを提供しています。"
                : "MAVEK BCS delivers tailored financial technology solutions across 12 major sectors, combining deep industry knowledge with technical implementation expertise."}
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="bg-white py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIES.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group flex gap-6 p-8 border border-gray-100 hover:border-[var(--navy)] transition-all duration-300 no-underline card-hover"
              >
                <div className="text-4xl shrink-0">{ind.icon}</div>
                <div>
                  <h3
                    className="text-lg font-bold mb-2 group-hover:text-[var(--navy)] transition-colors"
                    style={{ color: "var(--navy-dark)", fontFamily: "'Playfair Display', serif" }}
                  >
                    {language === "ko" ? ind.nameKo : language === "ja" ? ind.nameJa : ind.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {language === "ko" ? ind.descriptionKo : language === "ja" ? ind.descriptionJa : ind.description}
                  </p>
                  <div
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--navy)" }}
                  >
                    {language === "ko" ? "자세히 보기" : language === "ja" ? "詳細を見る" : "Learn More"}
                    <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
