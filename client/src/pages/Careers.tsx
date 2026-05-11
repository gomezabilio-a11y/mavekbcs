import { Link } from "wouter";
import { ArrowRight, Briefcase, Globe, TrendingUp, Users } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const openings = [
  { id: 1, title: "SAP AFC Senior Consultant", location: "Seoul / Tokyo", type: "Full-time", category: "Consulting" },
  { id: 2, title: "Oracle EPM Implementation Lead", location: "Singapore", type: "Full-time", category: "Consulting" },
  { id: 3, title: "SAP Treasury Functional Consultant", location: "Seoul", type: "Full-time", category: "Consulting" },
  { id: 4, title: "Finance Transformation Manager", location: "Tokyo / Remote", type: "Full-time", category: "Management" },
  { id: 5, title: "SAP GRC Specialist", location: "Seoul", type: "Full-time", category: "Consulting" },
  { id: 6, title: "Business Development Manager – Japan", location: "Tokyo", type: "Full-time", category: "Sales" },
];

export default function Careers() {
  const { language } = useLanguage();

  const t = {
    title: language === "ko" ? "채용" : language === "ja" ? "採用情報" : "Careers",
    subtitle: language === "ko"
      ? "글로벌 재무 혁신을 이끄는 팀에 합류하세요."
      : language === "ja"
      ? "グローバルな財務変革をリードするチームに参加してください。"
      : "Join the team leading global finance transformation.",
    whyTitle: language === "ko" ? "왜 MAVEK BCS인가?" : language === "ja" ? "なぜMAVEK BCSなのか？" : "Why MAVEK BCS?",
    openingsTitle: language === "ko" ? "현재 채용 공고" : language === "ja" ? "現在の求人" : "Current Openings",
    apply: language === "ko" ? "지원하기" : language === "ja" ? "応募する" : "Apply Now",
    noOpenings: language === "ko" ? "현재 해당 직무 공고가 없습니다." : language === "ja" ? "現在該当する求人はありません。" : "No openings in this category currently.",
  };

  const values = [
    {
      icon: <Globe size={24} />,
      title: language === "ko" ? "글로벌 영향력" : language === "ja" ? "グローバルな影響力" : "Global Impact",
      desc: language === "ko"
        ? "세계 최고의 기업들과 함께 재무 혁신을 이끕니다."
        : language === "ja"
        ? "世界トップ企業と共に財務変革をリードします。"
        : "Work with world-class organizations to drive meaningful finance transformation.",
    },
    {
      icon: <TrendingUp size={24} />,
      title: language === "ko" ? "경력 성장" : language === "ja" ? "キャリア成長" : "Career Growth",
      desc: language === "ko"
        ? "명확한 경력 경로와 지속적인 학습 기회를 제공합니다."
        : language === "ja"
        ? "明確なキャリアパスと継続的な学習機会を提供します。"
        : "Clear career progression and continuous learning opportunities across SAP, Oracle, and finance domains.",
    },
    {
      icon: <Users size={24} />,
      title: language === "ko" ? "최고의 팀" : language === "ja" ? "最高のチーム" : "Best-in-Class Team",
      desc: language === "ko"
        ? "업계 최고의 전문가들과 함께 일할 수 있는 기회."
        : language === "ja"
        ? "業界最高の専門家と共に働く機会。"
        : "Work alongside industry-leading experts with deep domain knowledge and global experience.",
    },
    {
      icon: <Briefcase size={24} />,
      title: language === "ko" ? "다양한 프로젝트" : language === "ja" ? "多様なプロジェクト" : "Diverse Projects",
      desc: language === "ko"
        ? "다양한 산업과 기술에 걸친 복잡하고 흥미로운 프로젝트."
        : language === "ja"
        ? "様々な業界とテクノロジーにわたる複雑で興味深いプロジェクト。"
        : "Complex, challenging projects across multiple industries and technology platforms.",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)" }} />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="section-divider" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.title}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">{t.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Why MAVEK BCS */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="section-divider" />
          <h2 className="text-3xl font-bold mb-12" style={{ color: "var(--navy-dark)" }}>{t.whyTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="p-6 border border-gray-100">
                <div className="w-12 h-12 flex items-center justify-center mb-5 text-white" style={{ backgroundColor: "var(--navy)" }}>
                  {val.icon}
                </div>
                <h3 className="font-bold text-sm mb-3" style={{ color: "var(--navy-dark)" }}>{val.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="section-off-white py-20">
        <div className="container">
          <div className="section-divider" />
          <h2 className="text-3xl font-bold mb-10" style={{ color: "var(--navy-dark)" }}>{t.openingsTitle}</h2>
          <div className="space-y-3">
            {openings.map((job) => (
              <div key={job.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-gray-100 card-hover group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-xs font-semibold px-2 py-0.5" style={{ backgroundColor: "var(--off-white)", color: "var(--navy-dark)", border: "1px solid #e5e7eb" }}>
                      {job.category}
                    </span>
                    <span className="text-xs text-gray-400">{job.type}</span>
                  </div>
                  <h3 className="font-bold text-sm group-hover:text-[var(--navy)] transition-colors" style={{ color: "var(--navy-dark)" }}>{job.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{job.location}</p>
                </div>
                <Link
                  href="/contact"
                  className="btn-outline-navy no-underline mt-4 md:mt-0 text-xs self-start md:self-auto"
                >
                  {t.apply}
                  <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 text-center" style={{ backgroundColor: "var(--navy-dark)" }}>
            <h3 className="text-xl font-bold text-white mb-3">
              {language === "ko" ? "원하는 직무가 없으신가요?" : language === "ja" ? "希望する職種がありませんか？" : "Don't see the right role?"}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {language === "ko"
                ? "이력서를 보내주시면 적합한 기회가 생길 때 연락드리겠습니다."
                : language === "ja"
                ? "履歴書をお送りください。適切な機会が生まれた際にご連絡します。"
                : "Send us your resume and we'll reach out when the right opportunity arises."}
            </p>
            <Link href="/contact" className="btn-gold no-underline">
              {language === "ko" ? "이력서 보내기" : language === "ja" ? "履歴書を送る" : "Send Your Resume"}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
