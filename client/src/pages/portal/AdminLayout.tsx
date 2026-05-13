import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAdminSession } from "@/contexts/AdminContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, ListChecks, LogOut, Shield, ChevronRight } from "lucide-react";

const labels = {
  en: {
    adminPanel: "Admin Panel",
    customers: "Customers",
    allTickets: "All Tickets",
    staff: "Staff Accounts",
    logout: "Sign Out",
    master: "Master",
    staff_role: "Staff",
  },
  ko: {
    adminPanel: "관리자 패널",
    customers: "고객 관리",
    allTickets: "전체 티켓",
    staff: "직원 계정",
    logout: "로그아웃",
    master: "마스터",
    staff_role: "스태프",
  },
  ja: {
    adminPanel: "管理者パネル",
    customers: "顧客管理",
    allTickets: "全チケット",
    staff: "スタッフアカウント",
    logout: "サインアウト",
    master: "マスター",
    staff_role: "スタッフ",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const lang = (language as keyof typeof labels) in labels ? (language as keyof typeof labels) : "en";
  const t = labels[lang];
  const [location, navigate] = useLocation();
  const { adminUser, isAdminAuthenticated, clearAdminSession } = useAdminSession();

  // Redirect to admin login if not authenticated
  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate("/portal/admin/login");
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated || !adminUser) return null;

  const isMaster = adminUser.role === "master";

  const navItems = [
    { href: "/portal/admin/customers", icon: Users, label: t.customers },
    { href: "/portal/admin/tickets", icon: ListChecks, label: t.allTickets },
    ...(isMaster ? [{ href: "/portal/admin/staff", icon: Shield, label: t.staff }] : []),
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0a0f1e" }}>
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 flex flex-col"
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(180,143,75,0.2)" }}
            >
              <Shield size={14} style={{ color: "#b48f4b" }} />
            </div>
            <div>
              <p
                className="text-xs font-bold leading-none"
                style={{ color: "#f0e6d3", fontFamily: "'Playfair Display', serif" }}
              >
                MAVEK BCS
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "#4a5568" }}>
                {t.adminPanel}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const active = location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors no-underline"
                style={{
                  backgroundColor: active ? "rgba(180,143,75,0.15)" : "transparent",
                  color: active ? "#b48f4b" : "#8a9bb0",
                }}
              >
                <item.icon size={15} />
                {item.label}
                {active && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="mb-3">
            <p className="text-xs font-semibold truncate" style={{ color: "#f0e6d3" }}>
              {adminUser.displayName}
            </p>
            <span
              className="inline-block text-[10px] px-1.5 py-0.5 rounded mt-0.5 font-medium"
              style={{
                backgroundColor: isMaster ? "rgba(180,143,75,0.2)" : "rgba(100,116,139,0.2)",
                color: isMaster ? "#b48f4b" : "#8a9bb0",
              }}
            >
              {isMaster ? t.master : t.staff_role}
            </span>
          </div>
          <button
            onClick={() => {
              clearAdminSession();
              navigate("/portal/admin/login");
            }}
            className="flex items-center gap-2 text-xs font-medium transition-colors w-full"
            style={{ color: "#4a5568" }}
          >
            <LogOut size={13} />
            {t.logout}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
