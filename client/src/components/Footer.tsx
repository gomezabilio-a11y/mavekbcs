import { Link } from "wouter";
import { Globe, Mail, MapPin } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { INDUSTRIES, SOLUTION_CATEGORIES } from "@/lib/siteData";

export default function Footer() {
  const { t, language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
  ];

  const offices = [
    { key: "about.hk", city: "Hong Kong", address: language === "ko" ? "홍콩 센트럴 스탠리 스트리트 28, 3층" : language === "ja" ? "香港 中環 士丹利街 28号 3階" : "3F, 28 Stanley Street, Central, Hong Kong" },
    { key: "about.japan", city: "Japan", address: language === "ko" ? "일본 오사카부 오사카시 기타구 소네자키신치 1-13-22 미도스지 프론트 타워 1층" : language === "ja" ? "大阪府大阪市北区曽根崎新地 1-13-22 御堂筋フロントタワー 1F" : "1F Midosuji Front Tower, 1-13-22 Sonezakishinchi, Kita-gu, Osaka-shi, Osaka, Japan" },
    { key: "about.korea", city: "Korea", address: language === "ko" ? "대한민국 인천광역시 연수구 컨벤시아대로 165 동북아트레이드타워(NEATT) 26층" : language === "ja" ? "大韓民国 仁川広域市 延寿区 コンベンシア大路 165 東北アジア貿易タワー(NEATT) 26階" : "26F Northeast Asia Trade Tower, 165 Convensia-daero, Yeonsu-gu, Incheon, Republic of Korea" },
    { key: "about.philippines", city: "Philippines", address: "Taguig, Metro Manila, Philippines" },
  ];

  return (
    <footer style={{ backgroundColor: "var(--navy-dark)", color: "white" }}>
      {/* Main footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div
                className="text-2xl font-bold tracking-tight mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                MAVEK BCS
              </div>
              <div className="text-xs tracking-[0.2em] uppercase text-gray-400">
                Global Financial Consulting
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              {t("footer.tagline")}. Specializing in SAP, Oracle, and Blackline financial technology implementations across Asia-Pacific and beyond.
            </p>

            {/* Offices */}
            <div className="space-y-2">
              {offices.map((office) => (
                <div key={office.key} className="flex items-start gap-2 text-xs text-gray-400">
                  <MapPin size={12} className="mt-0.5 shrink-0 text-gray-500" />
                  <span>
                    <span className="text-gray-300 font-medium">{t(office.key)}</span>
                    {" · "}
                    {office.address}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <Mail size={12} />
              <a href="mailto:info@mavekbcs.com" className="hover:text-white transition-colors no-underline">
                info@mavekbcs.com
              </a>
            </div>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
              {t("nav.industries")}
            </h4>
            <ul className="space-y-2">
              {INDUSTRIES.map((ind) => (
                <li key={ind.slug}>
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="text-xs text-gray-400 hover:text-white transition-colors no-underline"
                  >
                    {language === "ko" ? ind.nameKo : language === "ja" ? ind.nameJa : ind.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
              {t("nav.solutions")}
            </h4>
            <ul className="space-y-2">
              {SOLUTION_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/solutions/${cat.slug}`}
                    className="text-xs text-gray-400 hover:text-white transition-colors no-underline"
                  >
                    {language === "ko" ? cat.nameKo : language === "ja" ? cat.nameJa : cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
              Company
            </h4>
            <ul className="space-y-2 mb-8">
              <li>
                <Link href="/about" className="text-xs text-gray-400 hover:text-white transition-colors no-underline">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/about/csr" className="text-xs text-gray-400 hover:text-white transition-colors no-underline">
                  {t("nav.csr")}
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-xs text-gray-400 hover:text-white transition-colors no-underline">
                  {t("nav.insights")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-xs text-gray-400 hover:text-white transition-colors no-underline">
                  {t("nav.careers")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs text-gray-400 hover:text-white transition-colors no-underline">
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-xs text-gray-400 hover:text-white transition-colors no-underline">
                  {t("nav.clientPortal")}
                </Link>
              </li>
            </ul>

            {/* Language selector */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                <Globe size={12} />
                <span className="uppercase tracking-wider">Language</span>
              </div>
              <div className="flex flex-col gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`text-left text-xs transition-colors ${
                      language === lang.code
                        ? "text-white font-medium"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                    onClick={() => setLanguage(lang.code)}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">{t("footer.copyright")}</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors no-underline">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors no-underline">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
