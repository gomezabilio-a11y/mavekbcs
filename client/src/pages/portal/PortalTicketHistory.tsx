import { useLanguage } from "@/contexts/LanguageContext";
import { usePortalSession } from "@/contexts/PortalContext";
import { usePortalT, formatInTimezone, getStatusColor } from "@/lib/portalI18n";
import { trpc } from "@/lib/trpc";
import PortalLayout from "./PortalLayout";
import { Badge } from "@/components/ui/badge";
import { History, Clock, CheckCircle2 } from "lucide-react";

export default function PortalTicketHistory() {
  const { language } = useLanguage();
  const t = usePortalT(language as "en" | "ko" | "ja");
  const { portalToken, portalUser } = usePortalSession();
  const timezone = portalUser?.timezone ?? "UTC";

  const { data: history, isLoading } = trpc.portalV2.myTicketHistory.useQuery(
    { portalToken: portalToken ?? "" },
    { enabled: !!portalToken }
  );

  return (
    <PortalLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <History size={22} className="text-[#c9a84c]" />
            <h1 className="text-2xl font-bold text-white">{t.ticketHistory}</h1>
          </div>
          <p className="text-gray-400 text-sm">{t.ticketHistoryDesc}</p>
        </div>

        {/* Summary cards */}
        {history && history.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.ticketHistory}</div>
              <div className="text-2xl font-bold text-white">{history.length}</div>
            </div>
            <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.usedHours}</div>
              <div className="text-2xl font-bold text-[#c9a84c]">
                {history.reduce((sum, t) => sum + (t.spentHours ?? 0), 0).toFixed(1)} hrs
              </div>
            </div>
            <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.hoursDeducted}</div>
              <div className="text-2xl font-bold text-green-400">
                {history.filter((t) => t.hoursDeducted).length}
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">{t.loading}</div>
          ) : !history || history.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 size={40} className="mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400">{t.noHistory}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700/40">
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">{t.ticketNumber}</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">{t.subject}</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">{t.status}</th>
                    <th className="text-right px-4 py-3 text-gray-400 font-medium">{t.spentHours}</th>
                    <th className="text-center px-4 py-3 text-gray-400 font-medium">{t.hoursDeducted}</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">{t.createdAt}</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">{t.resolvedAt}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((ticket) => (
                    <tr
                      key={ticket.ticketNumber}
                      className="border-b border-gray-700/20 hover:bg-white/2 transition-colors"
                    >
                      <td className="px-4 py-3 text-[#c9a84c] font-mono text-xs">{ticket.ticketNumber}</td>
                      <td className="px-4 py-3">
                        <div className="text-white font-medium max-w-xs truncate">{ticket.title}</div>
                        {ticket.adminFeedback && (
                          <div className="text-gray-400 text-xs mt-0.5 max-w-xs truncate">
                            {t.adminFeedback}: {ticket.adminFeedback}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                          {t[ticket.status] ?? ticket.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {ticket.spentHours != null ? (
                          <span className="flex items-center justify-end gap-1 text-white">
                            <Clock size={13} className="text-gray-400" />
                            {ticket.spentHours.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {ticket.hoursDeducted ? (
                          <span className="text-green-400 text-xs font-medium">{t.yes}</span>
                        ) : (
                          <span className="text-gray-500 text-xs">{t.no}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {formatInTimezone(ticket.createdAtUtc, timezone, language)}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
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
    </PortalLayout>
  );
}
