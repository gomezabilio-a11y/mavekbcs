import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { usePortalSession } from "@/contexts/PortalContext";
import { usePortalT } from "@/lib/portalI18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Ticket, PlusCircle, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface PortalLayoutProps {
  children: React.ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { isAuthenticated, clearSession, portalUser } = usePortalSession();
  const [location, navigate] = useLocation();
  const { language } = useLanguage();
  const t = usePortalT(language as "en" | "ko" | "ja");
  const { user: adminUser } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/portal/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const customerNav = [
    { href: "/portal/dashboard", icon: LayoutDashboard, label: t.dashboard },
    { href: "/portal/tickets", icon: Ticket, label: t.tickets },
    { href: "/portal/tickets/new", icon: PlusCircle, label: t.newTicket },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0d1526] border-r border-gray-700/40 flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-700/40">
          <div className="text-sm font-bold text-white tracking-widest">MAVEK BCS</div>
          <div className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mt-0.5">Client Portal</div>
        </div>

        {/* Company */}
        <div className="px-5 py-3 border-b border-gray-700/40">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{t.companyName}</div>
          <div className="text-sm text-white font-medium truncate">{portalUser?.companyName}</div>
        </div>

        {/* Customer nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {customerNav.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-[#c9a84c]/15 text-[#c9a84c]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin Portal link — only visible to admin Manus users */}
        {adminUser?.role === "admin" && (
          <div className="px-3 pb-3 border-t border-gray-700/40 pt-3">
            <Link
              href="/portal/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
            >
              <ShieldCheck size={16} />
              Go to Admin Portal
            </Link>
          </div>
        )}

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-gray-700/40">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 gap-2"
            onClick={() => {
              clearSession();
              navigate("/portal/login");
            }}
          >
            <LogOut size={15} />
            {t.signOut}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
