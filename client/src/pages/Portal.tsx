import { Link } from "wouter";
import { Clock, FileText, ArrowRight, LogIn, AlertCircle, CheckCircle, PauseCircle, XCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

function StatusBadge({ status, language }: { status: string; language: string }) {
  const config: Record<string, { icon: React.ReactNode; label: string; labelKo: string; labelJa: string; color: string; bg: string }> = {
    active: {
      icon: <CheckCircle size={14} />,
      label: "Active",
      labelKo: "활성",
      labelJa: "アクティブ",
      color: "#15803d",
      bg: "#f0fdf4",
    },
    on_hold: {
      icon: <PauseCircle size={14} />,
      label: "On Hold",
      labelKo: "보류 중",
      labelJa: "保留中",
      color: "#b45309",
      bg: "#fffbeb",
    },
    completed: {
      icon: <CheckCircle size={14} />,
      label: "Completed",
      labelKo: "완료",
      labelJa: "完了",
      color: "#1d4ed8",
      bg: "#eff6ff",
    },
    cancelled: {
      icon: <XCircle size={14} />,
      label: "Cancelled",
      labelKo: "취소됨",
      labelJa: "キャンセル済み",
      color: "#dc2626",
      bg: "#fef2f2",
    },
  };

  const cfg = config[status] || config.active;
  const label = language === "ko" ? cfg.labelKo : language === "ja" ? cfg.labelJa : cfg.label;

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.icon}
      {label}
    </span>
  );
}

export default function Portal() {
  const { language } = useLanguage();
  const { user, isAuthenticated, loading } = useAuth();
  const { data: contractsData, isLoading: dataLoading } = trpc.portal.myContracts.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const totalRemainingHours = contractsData?.reduce((sum, c) => sum + c.remainingHours, 0) ?? 0;
  const portalData = contractsData ? { contracts: contractsData, totalRemainingHours } : null;

  const t = {
    title: language === "ko" ? "클라이언트 포털" : language === "ja" ? "クライアントポータル" : "Client Portal",
    subtitle: language === "ko"
      ? "서비스 시간 및 계약 상태를 확인하세요."
      : language === "ja"
      ? "サービス時間と契約状況を確認してください。"
      : "View your remaining service hours and contract status.",
    loginRequired: language === "ko" ? "로그인이 필요합니다" : language === "ja" ? "ログインが必要です" : "Login Required",
    loginDesc: language === "ko"
      ? "클라이언트 포털에 접근하려면 로그인하세요."
      : language === "ja"
      ? "クライアントポータルにアクセスするにはログインしてください。"
      : "Please log in to access your client portal.",
    login: language === "ko" ? "로그인" : language === "ja" ? "ログイン" : "Log In",
    welcome: language === "ko" ? "환영합니다" : language === "ja" ? "ようこそ" : "Welcome",
    remainingHours: language === "ko" ? "잔여 서비스 시간" : language === "ja" ? "残余サービス時間" : "Remaining Service Hours",
    contractStatus: language === "ko" ? "계약 상태" : language === "ja" ? "契約状況" : "Contract Status",
    contracts: language === "ko" ? "계약 목록" : language === "ja" ? "契約一覧" : "Your Contracts",
    noContracts: language === "ko" ? "계약 정보가 없습니다." : language === "ja" ? "契約情報がありません。" : "No contracts found.",
    hours: language === "ko" ? "시간" : language === "ja" ? "時間" : "hours",
    startDate: language === "ko" ? "시작일" : language === "ja" ? "開始日" : "Start Date",
    endDate: language === "ko" ? "종료일" : language === "ja" ? "End Date" : "End Date",
    totalHours: language === "ko" ? "총 시간" : language === "ja" ? "総時間" : "Total Hours",
    usedHours: language === "ko" ? "사용된 시간" : language === "ja" ? "使用時間" : "Used Hours",
    contact: language === "ko" ? "문의하기" : language === "ja" ? "お問い合わせ" : "Contact Us",
    noPortalAccess: language === "ko" ? "포털 접근 권한이 없습니다" : language === "ja" ? "ポータルへのアクセス権限がありません" : "No Portal Access",
    noPortalAccessDesc: language === "ko"
      ? "귀하의 계정에는 클라이언트 포털 접근 권한이 없습니다. 담당자에게 문의하세요."
      : language === "ja"
      ? "お客様のアカウントにはクライアントポータルへのアクセス権限がありません。担当者にお問い合わせください。"
      : "Your account does not have client portal access. Please contact your account manager.",
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)" }} />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="section-divider" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.title}
            </h1>
            <p className="text-gray-300 leading-relaxed">{t.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 min-h-[60vh]">
        <div className="container max-w-4xl">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !isAuthenticated ? (
            /* Login Prompt */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 flex items-center justify-center mb-6" style={{ backgroundColor: "var(--off-white)" }}>
                <LogIn size={28} style={{ color: "var(--navy)" }} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--navy-dark)" }}>{t.loginRequired}</h2>
              <p className="text-gray-500 mb-8 max-w-sm">{t.loginDesc}</p>
              <a href={getLoginUrl()} className="btn-navy no-underline">
                {t.login}
                <ArrowRight size={14} />
              </a>
            </div>
          ) : dataLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !portalData ? (
            /* No Access */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 flex items-center justify-center mb-6" style={{ backgroundColor: "#fef2f2" }}>
                <AlertCircle size={28} style={{ color: "#dc2626" }} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--navy-dark)" }}>{t.noPortalAccess}</h2>
              <p className="text-gray-500 mb-8 max-w-sm">{t.noPortalAccessDesc}</p>
              <Link href="/contact" className="btn-outline-navy no-underline">
                {t.contact}
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            /* Portal Dashboard */
            <div>
              <div className="mb-10">
                <p className="text-sm text-gray-500 mb-1">{t.welcome},</p>
                <h2 className="text-2xl font-bold" style={{ color: "var(--navy-dark)" }}>{user?.name}</h2>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="p-8 border border-gray-100" style={{ borderLeft: "4px solid var(--gold)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={20} style={{ color: "var(--navy)" }} />
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t.remainingHours}</span>
                  </div>
                  <div className="text-5xl font-bold" style={{ color: "var(--navy-dark)" }}>
                    {portalData.totalRemainingHours}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{t.hours}</div>
                </div>
                <div className="p-8 border border-gray-100" style={{ borderLeft: "4px solid var(--navy)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText size={20} style={{ color: "var(--navy)" }} />
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t.contractStatus}</span>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: "var(--navy-dark)" }}>
                    {portalData.contracts.filter((c: typeof portalData.contracts[0]) => c.contractStatus === "active").length}
                  </div>
                  <div className="text-sm text-gray-400">
                    {language === "ko" ? "활성 계약" : language === "ja" ? "アクティブな契約" : "Active Contracts"}
                  </div>
                </div>
              </div>

              {/* Contracts Table */}
              <div>
                <div className="section-divider" />
                <h3 className="text-xl font-bold mb-6" style={{ color: "var(--navy-dark)" }}>{t.contracts}</h3>
                {portalData.contracts.length === 0 ? (
                  <p className="text-gray-400 text-sm">{t.noContracts}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {language === "ko" ? "계약명" : language === "ja" ? "契約名" : "Contract"}
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{t.startDate}</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{t.endDate}</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{t.totalHours}</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{t.usedHours}</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {language === "ko" ? "잔여" : language === "ja" ? "残余" : "Remaining"}
                          </th>
                          <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{t.contractStatus}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portalData.contracts.map((contract: typeof portalData.contracts[0]) => {
                          const remaining = contract.remainingHours;
                          const pct = Math.min(100, Math.round(((contract.totalHours - contract.remainingHours) / Math.max(1, contract.totalHours)) * 100));
                          return (
                            <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-4 px-4 font-medium" style={{ color: "var(--navy-dark)" }}>
                                {contract.projectDescription || contract.clientName || "Contract #" + contract.id}
                              </td>
                              <td className="py-4 px-4 text-gray-500">
                                {contract.contractStartDate ? new Date(contract.contractStartDate).toLocaleDateString() : "-"}
                              </td>
                              <td className="py-4 px-4 text-gray-500">
                                {contract.contractEndDate ? new Date(contract.contractEndDate).toLocaleDateString() : "-"}
                              </td>
                              <td className="py-4 px-4 text-right text-gray-600">{contract.totalHours}</td>
                              <td className="py-4 px-4 text-right text-gray-600">{contract.totalHours - contract.remainingHours}</td>
                              <td className="py-4 px-4 text-right">
                                <div>
                                  <span className="font-semibold" style={{ color: remaining < 10 ? "#dc2626" : "var(--navy-dark)" }}>
                                    {remaining}
                                  </span>
                                  <div className="w-20 h-1.5 bg-gray-200 mt-1.5 ml-auto">
                                    <div
                                      className="h-full transition-all"
                                      style={{
                                        width: `${pct}%`,
                                        backgroundColor: pct > 80 ? "#dc2626" : pct > 60 ? "#b45309" : "var(--navy)",
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <StatusBadge status={contract.contractStatus} language={language} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Contact CTA */}
              <div className="mt-12 p-6 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? "서비스 시간 추가가 필요하신가요?" : language === "ja" ? "サービス時間の追加が必要ですか？" : "Need to add more service hours?"}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {language === "ko" ? "담당 컨설턴트에게 문의하세요." : language === "ja" ? "担当コンサルタントにお問い合わせください。" : "Contact your account manager to extend your contract."}
                  </p>
                </div>
                <Link href="/contact" className="btn-outline-navy no-underline shrink-0 text-xs">
                  {language === "ko" ? "문의하기" : language === "ja" ? "お問い合わせ" : "Contact Us"}
                  <ArrowRight size={12} />
                </Link>
              </div>

              {/* Admin Portal Link */}
              <div className="mt-6 p-6 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50">
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? "어드민 포탈" : language === "ja" ? "管理者ポータル" : "Admin Portal"}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {language === "ko" ? "관리자 권한으로 포탈에 접근하세요." : language === "ja" ? "管理者権限でポータルにアクセスしてください。" : "Access the portal with admin privileges."}
                  </p>
                </div>
                <Link href="/admin" className="btn-navy no-underline shrink-0 text-xs">
                  {language === "ko" ? "어드민 포탈" : language === "ja" ? "管理者ポータル" : "Admin Portal"}
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
