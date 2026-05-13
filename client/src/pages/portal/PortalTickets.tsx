import { trpc } from "@/lib/trpc";
import { usePortalSession } from "@/contexts/PortalContext";
import { usePortalT, formatInTimezone, getStatusColor } from "@/lib/portalI18n";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "./PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function PortalTickets() {
  const { portalToken, portalUser } = usePortalSession();
  const { language } = useLanguage();
  const t = usePortalT(language as "en" | "ko" | "ja");
  const tz = portalUser?.timezone ?? "UTC";
  const lang = portalUser?.language ?? "en";

  const ticketsQuery = trpc.portalV2.myTickets.useQuery(
    { portalToken: portalToken! },
    { enabled: !!portalToken }
  );

  return (
    <PortalLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">{t.tickets}</h1>

        <Card className="bg-[#111827] border-gray-700/40">
          <CardContent className="p-0">
            {ticketsQuery.isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-500" /></div>
            ) : (ticketsQuery.data ?? []).length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-12">{t.noTickets}</p>
            ) : (
              <div className="divide-y divide-gray-700/40">
                {ticketsQuery.data!.map((ticket) => (
                  <div key={ticket.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500 font-mono">{ticket.ticketNumber}</span>
                          <Badge className={`text-[10px] px-1.5 py-0 ${getStatusColor(ticket.status)}`}>
                            {t[ticket.status] ?? ticket.status}
                          </Badge>
                          {ticket.spentHours && (
                            <span className="text-xs text-gray-500">
                              {ticket.spentHours}h
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white font-medium">{ticket.title}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{ticket.description}</p>
                        {ticket.adminFeedback && (
                          <div className="mt-2 p-2 bg-[#1a2235] rounded text-xs text-gray-300 border-l-2 border-[#c9a84c]">
                            <span className="text-[#c9a84c] font-medium">{t.adminFeedback}: </span>
                            {ticket.adminFeedback}
                          </div>
                        )}
                        {ticket.screenshotUrl && (
                          <a
                            href={ticket.screenshotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-xs text-[#c9a84c] hover:underline"
                          >
                            📎 {t.screenshot}
                          </a>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-gray-500">{t.createdAt}</div>
                        <div className="text-xs text-gray-300 mt-0.5">
                          {formatInTimezone(ticket.createdAtUtc, tz, lang)}
                        </div>
                        {ticket.resolvedAt && (
                          <>
                            <div className="text-xs text-gray-500 mt-1">{t.resolvedAt}</div>
                            <div className="text-xs text-green-400 mt-0.5">
                              {formatInTimezone(ticket.resolvedAt, tz, lang)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
