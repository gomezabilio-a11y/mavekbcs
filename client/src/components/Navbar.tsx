import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Globe, User, LogOut } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { INDUSTRIES, SOLUTION_CATEGORIES } from "@/lib/siteData";
import { trpc } from "@/lib/trpc";
import { getLocalizedPath, removeLanguagePrefix } from "@/lib/urlHelpers";

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      window.location.href = "/";
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [location]);

  const isActive = (path: string) => location.startsWith(path);

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div ref={menuRef}>
        {/* Top bar */}
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 no-underline">
              <div className="flex flex-col leading-none">
                <span
                  className="text-xl font-bold tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy-dark)" }}
                >
                  MAVEK BCS
                </span>
                <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-gray-500">
                  Global Financial Consulting
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Industries */}
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/industries")
                    ? "text-[var(--navy)]"
                    : "text-gray-600 hover:text-[var(--navy)]"
                }`}
                onMouseEnter={() => setActiveMenu("industries")}
                onClick={() => setActiveMenu(activeMenu === "industries" ? null : "industries")}
              >
                {t("nav.industries")}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${activeMenu === "industries" ? "rotate-180" : ""}`}
                />
              </button>

              {/* Solutions */}
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/solutions")
                    ? "text-[var(--navy)]"
                    : "text-gray-600 hover:text-[var(--navy)]"
                }`}
                onMouseEnter={() => setActiveMenu("solutions")}
                onClick={() => setActiveMenu(activeMenu === "solutions" ? null : "solutions")}
              >
                {t("nav.solutions")}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${activeMenu === "solutions" ? "rotate-180" : ""}`}
                />
              </button>

              {/* Insights */}
              <Link
                href="/insights"
                className={`px-3 py-2 text-sm font-medium transition-colors no-underline ${
                  isActive("/insights")
                    ? "text-[var(--navy)]"
                    : "text-gray-600 hover:text-[var(--navy)]"
                }`}
                onMouseEnter={() => setActiveMenu(null)}
              >
                {t("nav.insights")}
              </Link>

              {/* About */}
              <Link
                href="/about"
                className={`px-3 py-2 text-sm font-medium transition-colors no-underline ${
                  isActive("/about")
                    ? "text-[var(--navy)]"
                    : "text-gray-600 hover:text-[var(--navy)]"
                }`}
                onMouseEnter={() => setActiveMenu(null)}
              >
                {t("nav.about")}
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`px-3 py-2 text-sm font-medium transition-colors no-underline ${
                  isActive("/contact")
                    ? "text-[var(--navy)]"
                    : "text-gray-600 hover:text-[var(--navy)]"
                }`}
                onMouseEnter={() => setActiveMenu(null)}
              >
                {t("nav.contact")}
              </Link>

              {/* Careers */}
              <Link
                href="/careers"
                className={`px-3 py-2 text-sm font-medium transition-colors no-underline ${
                  isActive("/careers")
                    ? "text-[var(--navy)]"
                    : "text-gray-600 hover:text-[var(--navy)]"
                }`}
                onMouseEnter={() => setActiveMenu(null)}
              >
                {t("nav.careers")}
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language switcher */}
              <div className="relative">
                <button
                  className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-gray-600 hover:text-[var(--navy)] transition-colors"
                  onClick={() => setLangOpen(!langOpen)}
                >
                  <Globe size={14} />
                  <span>{language.toUpperCase()}</span>
                  <ChevronDown size={12} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg py-1 min-w-[100px] z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                          language === lang.code
                            ? "bg-[var(--navy)] text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                          // Navigate to the same page in the selected language
                          const cleanPath = removeLanguagePrefix(location);
                          const newPath = getLocalizedPath(cleanPath, lang.code);
                          window.location.href = newPath;
                        }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Client portal */}
              <Link
                href="/portal/login"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white no-underline transition-colors"
                style={{ backgroundColor: "var(--navy)" }}
              >
                <User size={13} />
                {t("nav.clientPortal")}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mega menus */}
        {activeMenu === "industries" && (
          <div
            className="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-40"
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="container py-8">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
                    {t("megamenu.industries.title")}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t("megamenu.industries.desc")}
                  </p>
                  <Link
                    href={getLocalizedPath("/industries", language)}
                    className="inline-flex items-center gap-1 mt-4 text-xs font-semibold uppercase tracking-wide no-underline"
                    style={{ color: "var(--navy)" }}
                  >
                    {t("megamenu.industries.viewAll")}
                  </Link>
                </div>
                <div className="col-span-3 grid grid-cols-3 gap-2">
                  {INDUSTRIES.map((ind) => (
                    <Link
                      key={ind.slug}
                      href={`/industries/${ind.slug}`}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--navy)] transition-colors no-underline group"
                    >
                      <span className="text-base">{ind.icon}</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {language === "ko" ? ind.nameKo : language === "ja" ? ind.nameJa : ind.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === "solutions" && (
          <div
            className="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-40"
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="container py-8">
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-1">
                  <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
                    {t("megamenu.solutions.title")}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t("megamenu.solutions.desc")}
                  </p>
                  <Link
                    href={getLocalizedPath("/solutions", language)}
                    className="inline-flex items-center gap-1 mt-4 text-xs font-semibold uppercase tracking-wide no-underline"
                    style={{ color: "var(--navy)" }}
                  >
                    {t("megamenu.solutions.viewAll")}
                  </Link>
                </div>
                <div className="col-span-3 grid grid-cols-4 gap-4">
                  {SOLUTION_CATEGORIES.map((cat) => (
                    <div key={cat.slug}>
                      <Link
                        href={`/solutions/${cat.slug}`}
                        className="block text-xs font-bold uppercase tracking-wider mb-2 no-underline transition-colors"
                        style={{ color: "var(--navy)" }}
                      >
                        {language === "ko" ? cat.nameKo : language === "ja" ? cat.nameJa : cat.name}
                      </Link>
                      {cat.solutions.map((sol) => (
                        <Link
                          key={sol.slug}
                          href={`/solutions/${cat.slug}/${sol.slug}`}
                          className="block text-xs text-gray-600 hover:text-[var(--navy)] py-0.5 no-underline transition-colors"
                        >
                          {language === "ko" ? sol.nameKo : language === "ja" ? sol.nameJa : sol.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 overflow-y-auto max-h-[80vh]">
          <div className="container py-4 space-y-1">
            <Link href="/industries" className="block px-3 py-2.5 text-sm font-medium text-gray-700 no-underline">
              {t("nav.industries")}
            </Link>
            <Link href="/solutions" className="block px-3 py-2.5 text-sm font-medium text-gray-700 no-underline">
              {t("nav.solutions")}
            </Link>
            <Link href="/insights" className="block px-3 py-2.5 text-sm font-medium text-gray-700 no-underline">
              {t("nav.insights")}
            </Link>
            <Link href="/about" className="block px-3 py-2.5 text-sm font-medium text-gray-700 no-underline">
              {t("nav.about")}
            </Link>
            <Link href="/contact" className="block px-3 py-2.5 text-sm font-medium text-gray-700 no-underline">
              {t("nav.contact")}
            </Link>
            <Link href="/careers" className="block px-3 py-2.5 text-sm font-medium text-gray-700 no-underline">
              {t("nav.careers")}
            </Link>
            <div className="pt-3 border-t border-gray-100">
              <div className="flex gap-2 px-3 pb-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`px-3 py-1 text-xs font-medium border transition-colors ${
                      language === lang.code
                        ? "bg-[var(--navy)] text-white border-[var(--navy)]"
                        : "border-gray-300 text-gray-600"
                    }`}
                    onClick={() => setLanguage(lang.code)}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              {isAuthenticated ? (
                <Link href="/portal/login" className="block px-3 py-2.5 text-sm font-semibold no-underline" style={{ color: "var(--navy)" }}>
                  {t("nav.clientPortal")}
                </Link>
              ) : (
                <a href={getLoginUrl()} className="block px-3 py-2.5 text-sm font-semibold no-underline" style={{ color: "var(--navy)" }}>
                  {t("nav.clientPortal")}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
