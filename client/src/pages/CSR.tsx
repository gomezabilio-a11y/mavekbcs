import { Link } from "wouter";
import { Leaf, Heart, Users, BookOpen } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const pillars = [
  {
    icon: Leaf,
    title: "Environmental Responsibility",
    titleKo: "환경적 책임",
    titleJa: "環境への責任",
    description: "We are committed to minimizing our environmental footprint through sustainable office practices, digital-first operations, and supporting clients in their ESG reporting journeys.",
    descriptionKo: "지속 가능한 사무실 관행, 디지털 우선 운영, ESG 보고 여정에서 고객 지원을 통해 환경 발자국을 최소화하기 위해 노력합니다.",
    descriptionJa: "持続可能なオフィス慣行、デジタルファーストの運営、ESGレポートの旅でのクライアントサポートを通じて、環境フットプリントを最小化することに取り組んでいます。",
    color: "var(--navy)",
  },
  {
    icon: Users,
    title: "Community Engagement",
    titleKo: "지역 사회 참여",
    titleJa: "コミュニティエンゲージメント",
    description: "MAVEK BCS actively supports local communities across our four offices in Hong Kong, Japan, Korea, and the Philippines through volunteering, mentorship, and financial literacy programs.",
    descriptionKo: "MAVEK BCS는 자원봉사, 멘토링, 금융 리터러시 프로그램을 통해 홍콩, 일본, 한국, 필리핀 4개 사무소의 지역 사회를 적극적으로 지원합니다.",
    descriptionJa: "MAVEK BCSは、ボランティア活動、メンタリング、金融リテラシープログラムを通じて、香港、日本、韓国、フィリピンの4つのオフィスがある地域コミュニティを積極的に支援しています。",
    color: "var(--navy-mid)",
  },
  {
    icon: BookOpen,
    title: "Education & Development",
    titleKo: "교육 및 개발",
    titleJa: "教育と開発",
    description: "We invest in the next generation of finance professionals through university partnerships, internship programs, and professional development scholarships across Asia-Pacific.",
    descriptionKo: "대학 파트너십, 인턴십 프로그램, 아시아 태평양 전역의 전문 개발 장학금을 통해 차세대 재무 전문가에 투자합니다.",
    descriptionJa: "大学パートナーシップ、インターンシッププログラム、アジア太平洋全域の専門能力開発奨学金を通じて、次世代の財務専門家に投資しています。",
    color: "var(--navy-light)",
  },
  {
    icon: Heart,
    title: "Diversity & Inclusion",
    titleKo: "다양성 및 포용",
    titleJa: "多様性と包括性",
    description: "Our team reflects the diverse markets we serve. We are committed to building an inclusive workplace where every voice is heard and every background is valued.",
    descriptionKo: "우리 팀은 우리가 서비스하는 다양한 시장을 반영합니다. 모든 목소리가 들리고 모든 배경이 존중되는 포용적인 직장을 구축하기 위해 노력합니다.",
    descriptionJa: "私たちのチームは、私たちがサービスを提供する多様な市場を反映しています。すべての声が聞かれ、すべての背景が尊重される包括的な職場を構築することに取り組んでいます。",
    color: "var(--navy)",
  },
];

export default function CSR() {
  const { t, language } = useLanguage();

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
              <Link href="/about" className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-400 no-underline hover:text-gray-200 transition-colors">
                About MAVEK BCS
              </Link>
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("csr.title")}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              {t("csr.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="section-divider mx-auto" />
            <h2
              className="text-3xl font-bold mb-6"
              style={{ color: "var(--navy-dark)" }}
            >
              Our Commitment to Society
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              At MAVEK BCS, we believe that business success and social responsibility go hand in hand. As a financial consulting firm operating across Asia-Pacific, we have both the opportunity and the obligation to contribute positively to the communities and environments in which we operate.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our CSR strategy is built around four pillars: environmental responsibility, community engagement, education and development, and diversity and inclusion. These pillars guide our actions as a firm and inform the advice we give to our clients on their own sustainability journeys.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-off-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="bg-white p-10 border border-gray-100 card-hover">
                <div
                  className="w-12 h-12 flex items-center justify-center mb-6"
                  style={{ backgroundColor: pillar.color }}
                >
                  <pillar.icon size={22} className="text-white" />
                </div>
                <div className="section-divider" />
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {language === "ko" ? pillar.titleKo : language === "ja" ? pillar.titleJa : pillar.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === "ko" ? pillar.descriptionKo : language === "ja" ? pillar.descriptionJa : pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESG Reporting */}
      <section className="section-navy py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-divider" />
              <h2
                className="text-3xl font-bold text-white mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Supporting Client ESG Journeys
              </h2>
              <p className="text-gray-300 leading-relaxed mb-5">
                As ESG reporting requirements expand globally, MAVEK BCS helps organizations build the financial data infrastructure needed to meet disclosure obligations accurately and efficiently.
              </p>
              <p className="text-gray-300 leading-relaxed mb-8">
                Our expertise in SAP Group Reporting and SAP Analytics Cloud enables clients to integrate ESG metrics into their financial reporting processes, ensuring data quality and audit readiness.
              </p>
              <Link href="/insights/esg-reporting-impact" className="btn-gold no-underline">
                Read Our ESG Insights
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { metric: "Carbon Neutral", label: "Operations target by 2026", icon: "🌱" },
                { metric: "50%+", label: "Women in leadership roles", icon: "👥" },
                { metric: "4 Countries", label: "Community programs active", icon: "🌏" },
                { metric: "100+", label: "Students mentored annually", icon: "📚" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 text-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.metric}
                  </div>
                  <div className="text-xs text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
