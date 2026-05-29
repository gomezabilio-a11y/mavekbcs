import { useLanguage } from "@/contexts/LanguageContext";
import { usePortalSession } from "@/contexts/PortalContext";
import { usePortalT, formatInTimezone, getStatusColor } from "@/lib/portalI18n";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { History, Clock, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function PortalTicketHistory() {
  const { language } = useLanguage();
  const t = usePortalT(language as "en" | "ko" | "ja");
  const { portalToken, portalUser, isAuthenticated } = usePortalSession();
  const timezone = portalUser?.timezone ?? "UTC";
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/portal/login");
    }
  }, [isAuthenticated, navigate]);

  const { data: history, isLoading } = trpc.portalV2.myTicketHistory.useQuery(
    { portalToken: portalToken ?? "" },
    { enabled: !!portalToken }
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Top nav bar */}
      <header className="bg-[#0d1526] border-b border-gray-700/40 px-6 py-4 flex items-center gap-4">
        <Link href="/portal/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm no-underline">
          <ArrowLeft size={16} />
          {t.dashboard}
        </Link>
        <div className="w-px h-4 bg-gray-700" />
        <div className="flex items-center gap-2">
          <History size={16} className="text-[#c9a84c]" />
          <span className="text-white font-semibold text-sm">{t.ticketHistory}</span>
        </div>
        <div className="ml-auto text-xs text-gray-500">
          {portalUser?.companyName}
        </div>
      </header>

      <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">{t.ticketHistory}</h1>
          <p className="text-gray-400 text-sm">{t.ticketHistoryDesc}</p>
        </div>

        {/* Summary cards */}
        {history && history.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.ticketHistory}</div>
              <div className="text-3xl font-bold text-white">{history.length}</div>
            </div>
            <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.usedHours}</div>
              <div className="text-3xl font-bold text-[#c9a84c]">
                {history.reduce((sum, tk) => sum + (tk.spentHours ?? 0), 0).toFixed(1)} hrs
              </div>
            </div>
            <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.hoursDeducted}</div>
              <div className="text-3xl font-bold text-green-400">
                {history.filter((tk) => tk.hoursDeducted).length}
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">{t.loading}</div>
          ) : !history || history.length === 0 ? (
            <div className="p-16 text-center">
              <CheckCircle2 size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">{t.noHistory}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700/40">
                    <th className="text-left px-5 py-3.5 text-gray-400 font-medium whitespace-nowrap">{t.ticketNumber}</th>
                    <th className="text-left px-5 py-3.5 text-gray-400 font-medium">{t.subject}</th>
                    <th className="text-left px-5 py-3.5 text-gray-400 font-medium whitespace-nowrap">{t.status}</th>
                    <th className="text-right px-5 py-3.5 text-gray-400 font-medium whitespace-nowrap">{t.spentHours}</th>
                    <th className="text-center px-5 py-3.5 text-gray-400 font-medium whitespace-nowrap">{t.hoursDeducted}</th>
                    <th className="text-left px-5 py-3.5 text-gray-400 font-medium whitespace-nowrap">{t.createdAt}</th>
                    <th className="text-left px-5 py-3.5 text-gray-400 font-medium whitespace-nowrap">{t.resolvedAt}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((ticket) => (
                    <tr
                      key={ticket.ticketNumber}
                      className="border-b border-gray-700/20 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4 text-[#c9a84c] font-mono text-xs whitespace-nowrap">{ticket.ticketNumber}</td>
                      <td className="px-5 py-4">
                        <div className="text-white font-medium">{ticket.title}</div>
                        {ticket.adminFeedback && (
                          <div className="text-gray-400 text-xs mt-0.5">
                            {t.adminFeedback}: {ticket.adminFeedback}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                          {t[ticket.status] ?? ticket.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {ticket.spentHours != null ? (
                          <span className="flex items-center justify-end gap-1 text-white">
                            <Clock size={13} className="text-gray-400" />
                            {ticket.spentHours.toFixed(1)}h
                          </span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        {ticket.hoursDeducted ? (
                          <span className="text-green-400 text-xs font-medium">{t.yes}</span>
                        ) : (
                          <span className="text-gray-500 text-xs">{t.no}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {formatInTimezone(ticket.createdAtUtc, timezone, language)}
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {ticket.resolvedAt
                          ? formatInTimezone(ticket.resolvedAt, timezone, language)
                          : <span className="text-gray-600">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
