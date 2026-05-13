import { Link } from "wouter";
import { Music, Star, Globe, Users, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const pillars = [
  {
    icon: Music,
    title: "Classical Music & Opera Sponsorship",
    titleKo: "클래식 음악 및 오페라 후원",
    titleJa: "クラシック音楽・オペラのスポンサーシップ",
    vision: "Providing a platform for world-class artists to perform at the highest level.",
    visionKo: "세계적 수준의 예술가들이 최고의 무대에서 공연할 수 있는 플랫폼을 제공합니다.",
    visionJa: "世界クラスのアーティストが最高レベルで演奏できるプラットフォームを提供します。",
    initiatives: ["Quarterly opera in Key cities", "Quarterly ballet in Seoul & Tokyo", "Exclusive VIP events for partners and clients"],
    initiativesKo: ["주요 도시에서의 분기별 오페라 공연", "서울 및 도쿄에서의 분기별 발레 공연", "파트너 및 고객을 위한 독점 VIP 이벤트"],
    initiativesJa: ["主要都市での四半期ごとのオペラ公演", "ソウル・東京での四半期ごとのバレエ公演", "パートナー・クライアント向けの限定VIPイベント"],
    color: "var(--navy)",
  },
  {
    icon: Star,
    title: "Artist Development & Mentorship",
    titleKo: "예술가 육성 및 멘토십",
    titleJa: "アーティスト育成・メンタープログラム",
    vision: "Actively supporting and nurturing emerging talent across Asia-Pacific.",
    visionKo: "아시아 태평양 전역의 신진 예술가들을 적극적으로 지원하고 육성합니다.",
    visionJa: "アジア太平洋全域の新進アーティストを積極的に支援・育成します。",
    initiatives: ["Scholarship programs for musicians", "Ballet mentorship and training", "Internship opportunities with international orchestras", "Annual classical music competition"],
    initiativesKo: ["음악가를 위한 장학 프로그램", "발레 멘토십 및 훈련", "국제 오케스트라 인턴십 기회", "연간 클래식 음악 경연대회"],
    initiativesJa: ["音楽家向け奨学金プログラム", "バレエのメンタリングとトレーニング", "国際オーケストラでのインターンシップ機会", "年次クラシック音楽コンクール"],
    color: "var(--navy-mid)",
  },
  {
    icon: Globe,
    title: "Cultural Exchange Programs",
    titleKo: "문화 교류 프로그램",
    titleJa: "文化交流プログラム",
    vision: "Facilitating exchange between the Asia-Pacific and the global performing arts community.",
    visionKo: "아시아 태평양과 글로벌 공연 예술 커뮤니티 간의 교류를 촉진합니다.",
    visionJa: "アジア太平洋とグローバルな舞台芸術コミュニティとの交流を促進します。",
    initiatives: ["International orchestra residencies in Asia-Pacific", "Cross-border ballet collaborations", "Artist exchange programs with European conservatories"],
    initiativesKo: ["아시아 태평양 국제 오케스트라 레지던시", "국경을 초월한 발레 협업", "유럽 음악원과의 예술가 교류 프로그램"],
    initiativesJa: ["アジア太平洋における国際オーケストラ・レジデンシー", "国境を越えたバレエのコラボレーション", "ヨーロッパの音楽院とのアーティスト交流プログラム"],
    color: "var(--navy-light)",
  },
  {
    icon: Users,
    title: "Community Access to Culture",
    titleKo: "지역 사회의 문화 접근성",
    titleJa: "地域社会への文化アクセス",
    vision: "Ensuring access to performing arts is not limited by economic circumstances.",
    visionKo: "공연 예술에 대한 접근이 경제적 여건에 의해 제한되지 않도록 보장합니다.",
    visionJa: "舞台芸術へのアクセスが経済的な事情によって制限されないよう保証します。",
    initiatives: ["Free classical music performances in schools", "Subsidized tickets for students and young professionals", "Educational outreach programs"],
    initiativesKo: ["학교에서의 무료 클래식 음악 공연", "학생 및 젊은 전문가를 위한 보조 티켓", "교육 아웃리치 프로그램"],
    initiativesJa: ["学校での無料クラシック音楽公演", "学生・若手プロフェッショナル向け補助チケット", "教育アウトリーチプログラム"],
    color: "var(--navy)",
  },
];

export default function CSR() {
  const { t, language } = useLanguage();

  const heroHeadline =
    language === "ko"
      ? "정교함과 열정의 만남: 예술적 탁월함을 향한 여정"
      : language === "ja"
      ? "精緻さと情熱の出会い：芸術的卓越性への旅"
      : "Where Precision Meets Passion: Supporting Artistic Excellence";

  const heroBody1 =
    language === "ko"
      ? "MAVEK BCS는 공연 예술, 특히 클래식 음악, 오페라, 발레를 지원하는 데 깊이 헌신하고 있습니다."
      : language === "ja"
      ? "MAVEK BCSは、舞台芸術、特にクラシック音楽、オペラ、バレエの支援に深くコミットしています。"
      : "MAVEK BCS is deeply committed to supporting the performing arts, particularly classical music, opera, and ballet.";

  const heroBody2 =
    language === "ko"
      ? "우리는 문화적 탁월함이 우리 공동체를 풍요롭게 하고, 예술가들에게 의미 있는 일자리를 제공하며, 사람들이 시대를 초월한 예술적 전통과 교감할 수 있는 공간을 창출한다고 믿습니다."
      : language === "ja"
      ? "文化的な卓越性がコミュニティを豊かにし、アーティストに意義ある雇用を提供し、人々が時代を超えた芸術的伝統とつながる空間を生み出すと私たちは信じています。"
      : "We believe that cultural excellence enriches our communities, provides meaningful employment for artists, and creates spaces where people can connect with timeless artistic traditions.";

  const monthlyHeadline =
    language === "ko"
      ? "문화를 통한 관계의 심화"
      : language === "ja"
      ? "文化を通じた関係の深化"
      : "Cultivating Relationships Through Culture";

  const monthlyBody1 =
    language === "ko"
      ? "매월, 우리는 소중한 파트너, 고객 및 팀원들을 홍콩, 서울, 도쿄, 마닐라의 독점적인 클래식 음악 및 발레 공연에 초대합니다."
      : language === "ja"
      ? "毎月、私たちは大切なパートナー、クライアント、チームメンバーを香港、ソウル、東京、マニラの限定クラシック音楽・バレエ公演にご招待しています。"
      : "Every month, we invite our valued partners, clients, and team members to exclusive classical music and ballet performances in Hong Kong, Seoul, Tokyo, and Manila.";

  const monthlyBody2 =
    language === "ko"
      ? "이러한 이벤트는 예술적 탁월함을 기념하고, 의미 있는 관계를 육성하며, 아시아 태평양 지역의 활기찬 문화 생태계를 지원하는 기회입니다."
      : language === "ja"
      ? "これらのイベントは、芸術的卓越性を称え、意義ある関係を育み、アジア太平洋地域の活気ある文化エコシステムを支援する機会です。"
      : "These events are opportunities to celebrate artistic excellence, foster meaningful relationships, and support the vibrant cultural ecosystems in the Asia-Pacific region.";

  const pillarsHeadline =
    language === "ko"
      ? "MAVEK BCS CSR의 네 가지 기둥"
      : language === "ja"
      ? "MAVEK BCS CSRの4つの柱"
      : "The Four Pillars of MAVEK BCS CSR";

  const visionLabel = language === "ko" ? "비전" : language === "ja" ? "ビジョン" : "Vision";
  const initiativesLabel =
    language === "ko" ? "주요 이니셔티브" : language === "ja" ? "主要イニシアティブ" : "Key Initiatives";

  const ctaHeadline =
    language === "ko"
      ? "우리의 문화적 여정에 함께하세요"
      : language === "ja"
      ? "私たちの文化的な旅にご参加ください"
      : "Join Our Cultural Journey";

  const ctaBody =
    language === "ko"
      ? "MAVEK BCS는 예술적 탁월함에 대한 전략적 헌신을 공유하는 파트너들을 환영합니다. 문화 외교와 예술적 전통의 역량 강화를 통해 더 풍요로운 아시아 태평양을 함께 만들어 나가겠습니다."
      : language === "ja"
      ? "MAVEK BCSは、芸術的卓越性への戦略的なコミットメントを共有するパートナーを歓迎します。文化外交と芸術的伝統のエンパワーメントを通じて、より豊かなアジア太平洋を共に築いていきましょう。"
      : "MAVEK BCS welcomes partners who share our strategic commitment to artistic excellence. Through cultural diplomacy and empowering artistic traditions, let us together build a richer Asia-Pacific.";

  const ctaButton =
    language === "ko"
      ? "파트너십 문의"
      : language === "ja"
      ? "パートナーシップのお問い合わせ"
      : "Explore Partnership";

  return (
    <Layout>
      {/* Hero */}
      <section className="py-28 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)`,
          }}
        />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ backgroundColor: "var(--gold)" }} />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-400">
                {t("csr.title")}
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {heroHeadline}
            </h1>
            <p className="text-base text-gray-300 leading-relaxed mb-4 max-w-2xl">{heroBody1}</p>
            <p className="text-base text-gray-300 leading-relaxed max-w-2xl">{heroBody2}</p>
          </div>
        </div>
      </section>

      {/* Monthly Engagement */}
      <section className="bg-white py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-divider" />
              <h2
                className="text-3xl font-bold mb-6"
                style={{ color: "var(--navy-dark)", fontFamily: "'Playfair Display', serif" }}
              >
                {monthlyHeadline}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5 text-base">{monthlyBody1}</p>
              <p className="text-gray-600 leading-relaxed text-base">{monthlyBody2}</p>
            </div>
            <div
              className="p-10 border-l-4 flex flex-col gap-6"
              style={{ borderColor: "var(--gold)", backgroundColor: "var(--off-white)" }}
            >
              {["Hong Kong", "Seoul", "Tokyo", "Manila"].map((city) => (
                <div key={city} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "var(--gold)" }} />
                  <span className="font-semibold text-sm tracking-wide" style={{ color: "var(--navy)" }}>
                    {city}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: "var(--gold)", opacity: 0.3 }} />
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {language === "ko"
                  ? "아시아 태평양 4개 도시에서 매월 독점 공연 개최"
                  : language === "ja"
                  ? "アジア太平洋4都市で毎月限定公演を開催"
                  : "Monthly exclusive performances across four Asia-Pacific cities"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="section-off-white py-24">
        <div className="container">
          <div className="section-divider" />
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--navy-dark)", fontFamily: "'Playfair Display', serif" }}
          >
            {pillarsHeadline}
          </h2>
          <p className="text-gray-500 mb-14 text-sm">
            {language === "ko"
              ? "예술적 탁월함을 향한 전략적 헌신의 네 가지 차원"
              : language === "ja"
              ? "芸術的卓越性への戦略的コミットメントの4つの次元"
              : "Four dimensions of our strategic commitment to artistic excellence"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar) => {
              const title =
                language === "ko" ? pillar.titleKo : language === "ja" ? pillar.titleJa : pillar.title;
              const vision =
                language === "ko" ? pillar.visionKo : language === "ja" ? pillar.visionJa : pillar.vision;
              const initiatives =
                language === "ko"
                  ? pillar.initiativesKo
                  : language === "ja"
                  ? pillar.initiativesJa
                  : pillar.initiatives;
              return (
                <div
                  key={pillar.title}
                  className="bg-white p-8 border border-gray-100 card-hover flex flex-col gap-5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center shrink-0"
                      style={{ backgroundColor: pillar.color }}
                    >
                      <pillar.icon size={18} className="text-white" />
                    </div>
                    <h3 className="font-bold text-base leading-snug" style={{ color: "var(--navy-dark)" }}>
                      {title}
                    </h3>
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold tracking-widest uppercase mb-2"
                      style={{ color: "var(--gold)" }}
                    >
                      {visionLabel}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">{vision}</p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold tracking-widest uppercase mb-3"
                      style={{ color: "var(--navy)" }}
                    >
                      {initiativesLabel}
                    </p>
                    <ul className="space-y-2">
                      {initiatives.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: "var(--gold)" }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="container">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ backgroundColor: "var(--gold)" }} />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-400">
                {language === "ko" ? "파트너십" : language === "ja" ? "パートナーシップ" : "Partnership"}
              </span>
            </div>
            <h2
              className="text-3xl font-bold text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {ctaHeadline}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-8 text-base">{ctaBody}</p>
            <Link href="/contact" className="btn-outline-navy no-underline inline-flex items-center gap-2">
              {ctaButton}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
