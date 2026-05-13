import { Link } from "wouter";
import { ArrowRight, MapPin, Users, Award, Globe } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const offices = [
  {
    city: "Hong Kong",
    cityKo: "홍콩",
    cityJa: "香港",
    address: "3F, 28 Stanley Street, Central, Hong Kong",
    addressKo: "홍콩 센트럴 스탠리 스트리트 28, 3층",
    addressJa: "香港 中環 士丹利街 28号 3階",
    description: "Our Asia-Pacific headquarters, serving clients across Greater China and Southeast Asia.",
    descriptionKo: "아시아 태평양 본사로, 중화권 및 동남아시아 전역의 고객을 지원합니다.",
    descriptionJa: "アジア太平洋本社として、中国圏および東南アジア全域のクライアントにサービスを提供しています。",
  },
  {
    city: "Japan",
    cityKo: "일본",
    cityJa: "日本",
    address: "1F Midosuji Front Tower, 1-13-22 Sonezakishinchi, Kita-gu, Osaka-shi, Osaka, Japan",
    addressKo: "일본 오사카부 오사카시 기타구 소네자키신치 1-13-22 미도스지 프론트 타워 1층",
    addressJa: "大阪府大阪市北区曽根崎新地 1-13-22 御堂筋フロントタワー 1F",
    description: "Serving Japan's leading corporations with deep expertise in SAP and Oracle implementations.",
    descriptionKo: "SAP 및 Oracle 구현에 대한 깊은 전문성으로 일본 주요 기업을 지원합니다.",
    descriptionJa: "SAPとOracleの実装における深い専門知識で日本の主要企業にサービスを提供しています。",
  },
  {
    city: "Korea",
    cityKo: "한국",
    cityJa: "韓国",
    address: "26F Northeast Asia Trade Tower, 165 Convensia-daero, Yeonsu-gu, Incheon, Republic of Korea",
    addressKo: "대한민국 인천광역시 연수구 컨벤시아대로 165 동북아트레이드타워(NEATT) 26층",
    addressJa: "大韓民国 仁川広域市 延寿区 コンベンシア大路 165 東北アジア貿易タワー(NEATT) 26階",
    description: "Supporting Korea's dynamic corporate sector with financial technology transformation.",
    descriptionKo: "재무 기술 혁신으로 한국의 역동적인 기업 부문을 지원합니다.",
    descriptionJa: "財務テクノロジー変革で韓国のダイナミックな企業セクターをサポートしています。",
  },
  {
    city: "Philippines",
    cityKo: "필리핀",
    cityJa: "フィリピン",
    address: "Taguig, Metro Manila, Philippines",
    addressKo: "Taguig, Metro Manila, Philippines",
    addressJa: "Taguig, Metro Manila, Philippines",
    description: "Back office operations supporting MAVEK BCS global delivery.",
    descriptionKo: "MAVEK BCS 글로벌 딜리버리를 지원하는 백오피스 운영 센터입니다.",
    descriptionJa: "MAVEK BCSのグローバルデリバリーを支えるバックオフィス拠点です。",
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
                {language === "ko"
                  ? "재무와 기술 분야에서 수십 년간 축적된 베테랑 전문가들의 통찰력을 바탕으로 설립된 MAVEK BCS는, 심도 있는 기능적 지식과 독보적인 기술 전문성을 결합하여 기업이 직면한 가장 까다로운 재무 혁신 과제들을 명쾌하게 해결합니다."
                  : language === "ja"
                  ? "財務とテクノロジーの分野で数十年の経験を積んだスペシャリストたちによって設立されたMAVEK BCSは、深い業務知識（Functional Knowledge）と卓越した技術的専門性（Technical Expertise）を融合させ、企業が直面する極めて困難な財務変革（Financial Transformation）の課題を解決へと導きます。"
                  : "Founded by finance and technology professionals with decades of combined experience, MAVEK BCS brings together deep functional knowledge and technical expertise to solve the most complex financial transformation challenges."}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {language === "ko"
                  ? "우리는 일반적인 컨설팅을 지양하고, SAP, Oracle, BlackLine과 같은 재무 기술 분야에만 역량을 집중하는 전략적 특화 모델을 지향합니다. 이를 통해 고객사는 범용 컨설팅으로는 경험할 수 없는 고도로 집중된 전문 지식의 혜택을 누릴 수 있습니다. MAVEK BCS의 모든 팀원은 우리가 제안하는 플랫폼에 대해 직접적인 구축 및 운영 경험을 보유하고 있으며, 실전에서 검증된 최적의 솔루션만을 고객에게 전달합니다."
                  : language === "ja"
                  ? "当社は一般的なコンサルティングとは一線を画し、SAP、Oracle、BlackLineといった財務テクノロジー分野に特化した戦略的モデルを追求しています。これにより、お客様は汎用的なコンサルティングでは得られない、高度に特化した専門知識の恩恵を享受することが可能です。MAVEK BCSの全てのチームメンバーは、当社が推奨するプラットフォームにおいて直接的な導入・運用経験を有しており、実戦で検証された最適なソリューションのみを皆様にお届けいたします。"
                  : "We specialize exclusively in financial technology — SAP, Oracle, and Blackline — which means our clients benefit from focused expertise rather than generalist consulting. Every member of our team has hands-on implementation experience with the platforms we recommend."}
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
                <p className="text-xs text-gray-400 mb-3 font-medium">{language === "ko" ? (office.addressKo || office.address) : language === "ja" ? (office.addressJa || office.address) : office.address}</p>
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
