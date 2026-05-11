import { Link } from "wouter";
import { ArrowRight, MapPin, Users, Award, Globe } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const offices = [
  {
    city: "Hong Kong",
    cityKo: "홍콩",
    cityJa: "香港",
    address: "Central, Hong Kong SAR",
    description: "Our Asia-Pacific headquarters, serving clients across Greater China and Southeast Asia.",
    descriptionKo: "아시아 태평양 본사로, 중화권 및 동남아시아 전역의 고객을 지원합니다.",
    descriptionJa: "アジア太平洋本社として、中国圏および東南アジア全域のクライアントにサービスを提供しています。",
  },
  {
    city: "Japan",
    cityKo: "일본",
    cityJa: "日本",
    address: "Tokyo, Japan",
    description: "Serving Japan's leading corporations with deep expertise in SAP and Oracle implementations.",
    descriptionKo: "SAP 및 Oracle 구현에 대한 깊은 전문성으로 일본 주요 기업을 지원합니다.",
    descriptionJa: "SAPとOracleの実装における深い専門知識で日本の主要企業にサービスを提供しています。",
  },
  {
    city: "Korea",
    cityKo: "한국",
    cityJa: "韓国",
    address: "Seoul, South Korea",
    description: "Supporting Korea's dynamic corporate sector with financial technology transformation.",
    descriptionKo: "재무 기술 혁신으로 한국의 역동적인 기업 부문을 지원합니다.",
    descriptionJa: "財務テクノロジー変革で韓国のダイナミックな企業セクターをサポートしています。",
  },
  {
    city: "Philippines",
    cityKo: "필리핀",
    cityJa: "フィリピン",
    address: "Makati, Philippines",
    description: "Delivering financial consulting services to the Philippines' growing business community.",
    descriptionKo: "필리핀의 성장하는 비즈니스 커뮤니티에 재무 컨설팅 서비스를 제공합니다.",
    descriptionJa: "フィリピンの成長するビジネスコミュニティに財務コンサルティングサービスを提供しています。",
  },
];

const values = [
  {
    icon: Award,
    title: "Excellence",
    titleKo: "탁월함",
    titleJa: "卓越性",
    description: "We hold ourselves to the highest standards in every engagement, delivering solutions that exceed expectations.",
    descriptionKo: "모든 업무에서 최고 수준을 유지하며 기대를 뛰어넘는 솔루션을 제공합니다.",
    descriptionJa: "すべての業務において最高水準を維持し、期待を超えるソリューションを提供します。",
  },
  {
    icon: Users,
    title: "Partnership",
    titleKo: "파트너십",
    titleJa: "パートナーシップ",
    description: "We build long-term relationships with our clients, acting as trusted advisors throughout their transformation journey.",
    descriptionKo: "고객과 장기적인 관계를 구축하며 변혁 여정 전반에 걸쳐 신뢰할 수 있는 조언자 역할을 합니다.",
    descriptionJa: "クライアントと長期的な関係を構築し、変革の旅全体を通じて信頼できるアドバイザーとして機能します。",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    titleKo: "글로벌 관점",
    titleJa: "グローバルな視点",
    description: "Our multi-regional presence gives us unique insight into the challenges and opportunities facing global organizations.",
    descriptionKo: "다지역 존재감은 글로벌 조직이 직면한 도전과 기회에 대한 독특한 통찰력을 제공합니다.",
    descriptionJa: "複数地域での存在感が、グローバル組織が直面する課題と機会に関する独自の洞察を提供します。",
  },
];

export default function About() {
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
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-400">
                About Us
              </span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("about.title")}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="bg-white py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-divider" />
              <h2
                className="text-3xl font-bold mb-6"
                style={{ color: "var(--navy-dark)" }}
              >
                Who We Are
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                {t("about.description")}
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                Founded by finance and technology professionals with decades of combined experience, MAVEK BCS brings together deep functional knowledge and technical expertise to solve the most complex financial transformation challenges.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We specialize exclusively in financial technology — SAP, Oracle, and Blackline — which means our clients benefit from focused expertise rather than generalist consulting. Every member of our team has hands-on implementation experience with the platforms we recommend.
              </p>
              <Link href="/contact" className="btn-outline-navy no-underline">
                Get in Touch
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-6">
              {values.map((val) => (
                <div key={val.title} className="flex gap-5 p-6 border border-gray-100 card-hover">
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--navy)" }}
                  >
                    <val.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: "var(--navy)" }}>
                      {language === "ko" ? val.titleKo : language === "ja" ? val.titleJa : val.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {language === "ko" ? val.descriptionKo : language === "ja" ? val.descriptionJa : val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="section-off-white py-24">
        <div className="container">
          <div className="section-divider" />
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--navy-dark)" }}
          >
            {t("about.offices")}
          </h2>
          <p className="text-gray-500 mb-12 text-sm">
            Strategically located across Asia-Pacific to serve our global clients
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office) => (
              <div key={office.city} className="bg-white p-8 border border-gray-100 card-hover">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={16} style={{ color: "var(--gold)" }} />
                  <h4 className="font-bold" style={{ color: "var(--navy)" }}>
                    {language === "ko" ? office.cityKo : language === "ja" ? office.cityJa : office.city}
                  </h4>
                </div>
                <p className="text-xs text-gray-400 mb-3 font-medium">{office.address}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {language === "ko" ? office.descriptionKo : language === "ja" ? office.descriptionJa : office.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSR Link */}
      <section className="section-navy py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("csr.title")}
              </h3>
              <p className="text-gray-400 text-sm">{t("csr.subtitle")}</p>
            </div>
            <Link href="/about/csr" className="btn-gold no-underline shrink-0">
              Learn More
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
