import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { usePortalSession } from "@/contexts/PortalContext";
import { usePortalT, formatInTimezone, getStatusColor } from "@/lib/portalI18n";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "./PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, History, Clock, CheckCircle2, AlertCircle, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

// ── Screenshot lightbox ─────────────────────────────────────────────────────
function ScreenshotLightbox({
  screenshots,
  initialIndex,
  onClose,
}: {
  screenshots: { url: string }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(screenshots.length - 1, i + 1));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="bg-[#0a0f1e] border-gray-700 p-0 flex flex-col items-center justify-center"
        style={{ width: "90vw", maxWidth: "90vw", height: "90vh", maxHeight: "90vh", transform: "none", top: "5vh", left: "5vw" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-gray-400 hover:text-white bg-black/50 rounded-full p-1"
        >
          <X size={18} />
        </button>
        {/* Counter */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs text-gray-400 bg-black/50 px-3 py-1 rounded-full">
          {idx + 1} / {screenshots.length}
        </div>
        {/* Image */}
        <img
          src={screenshots[idx].url}
          alt={`screenshot ${idx + 1}`}
          className="max-h-[80vh] max-w-full object-contain rounded"
        />
        {/* Nav */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={idx === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              disabled={idx === screenshots.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        {/* Thumbnails */}
        {screenshots.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {screenshots.map((s, i) => (
              <button key={i} onClick={() => setIdx(i)}>
                <img
                  src={s.url}
                  alt={`thumb ${i + 1}`}
                  className={`h-12 w-16 object-cover rounded border-2 transition-colors ${i === idx ? "border-[#c9a84c]" : "border-gray-600 opacity-60 hover:opacity-100"}`}
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Parse screenshotUrls helper ─────────────────────────────────────────────
function parseScreenshots(ticket: { screenshotUrls?: string | null; screenshotUrl?: string | null }): { url: string }[] {
  if (ticket.screenshotUrls) {
    try { return JSON.parse(ticket.screenshotUrls) as { url: string }[]; } catch { /* fall through */ }
  }
  if (ticket.screenshotUrl) return [{ url: ticket.screenshotUrl }];
  return [];
}

// ── Screenshot thumbnail strip ──────────────────────────────────────────────
function ScreenshotStrip({
  screenshots,
  onOpen,
}: {
  screenshots: { url: string }[];
  onOpen: (idx: number) => void;
}) {
  if (screenshots.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {screenshots.map((s, i) => (
        <button key={i} onClick={() => onOpen(i)} className="relative group">
          <img
            src={s.url}
            alt={`screenshot ${i + 1}`}
            className="h-16 w-24 object-cover rounded border border-gray-600 hover:border-[#c9a84c] transition-colors"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
            <ImageIcon size={16} className="text-white" />
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function PortalTickets() {
  const { portalToken, portalUser } = usePortalSession();
  const { language } = useLanguage();
  const t = usePortalT(language as "en" | "ko" | "ja");
  const tz = portalUser?.timezone ?? "UTC";
  const lang = (portalUser?.language ?? language) as string;

  const [lightbox, setLightbox] = useState<{ screenshots: { url: string }[]; index: number } | null>(null);

  const ticketsQuery = trpc.portalV2.myTickets.useQuery(
    { portalToken: portalToken! },
    { enabled: !!portalToken }
  );

  const allTickets = ticketsQuery.data ?? [];

  // Active: not resolved/closed
  const activeTickets = allTickets.filter((tk) => tk.status !== "resolved" && tk.status !== "closed");

  // History: resolved or closed, sorted newest first
  const historyTickets = allTickets
    .filter((tk) => tk.status === "resolved" || tk.status === "closed")
    .sort((a, b) => Number(b.resolvedAt ?? b.createdAtUtc) - Number(a.resolvedAt ?? a.createdAtUtc));

  const totalSpent = historyTickets.reduce((sum, tk) => sum + (tk.spentHours ? parseFloat(String(tk.spentHours)) : 0), 0);
  const deductedCount = historyTickets.filter((tk) => tk.hoursDeducted).length;

  return (
    <PortalLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-10">

        {/* ── Active Tickets ───────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-[#c9a84c]" />
            <h2 className="text-xl font-bold text-white">{t.tickets}</h2>
            {activeTickets.length > 0 && (
              <span className="ml-1 bg-[#c9a84c]/20 text-[#c9a84c] text-xs font-semibold px-2 py-0.5 rounded-full">
                {activeTickets.length}
              </span>
            )}
          </div>

          <Card className="bg-[#111827] border-gray-700/40">
            <CardContent className="p-0">
              {ticketsQuery.isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-500" /></div>
              ) : activeTickets.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-10">{t.noTickets}</p>
              ) : (
                <div className="divide-y divide-gray-700/40">
                  {activeTickets.map((ticket) => {
                    const screenshots = parseScreenshots(ticket);
                    return (
                      <div key={ticket.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-500 font-mono">{ticket.ticketNumber}</span>
                              <Badge className={`text-[10px] px-1.5 py-0 ${getStatusColor(ticket.status)}`}>
                                {t[ticket.status] ?? ticket.status}
                              </Badge>
                              {ticket.spentHours && (
                                <span className="text-xs text-gray-500 flex items-center gap-0.5">
                                  <Clock size={11} /> {parseFloat(String(ticket.spentHours)).toFixed(1)}h
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
                            <ScreenshotStrip
                              screenshots={screenshots}
                              onOpen={(idx) => setLightbox({ screenshots, index: idx })}
                            />
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs text-gray-500">{t.createdAt}</div>
                            <div className="text-xs text-gray-300 mt-0.5">
                              {formatInTimezone(ticket.createdAtUtc, tz, lang)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ── Ticket History ───────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <History size={18} className="text-[#c9a84c]" />
            <h2 className="text-xl font-bold text-white">{t.ticketHistory}</h2>
          </div>

          {/* Summary cards */}
          {historyTickets.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{historyTickets.length}</div>
                <div className="text-xs text-gray-500 mt-0.5">{t.ticketHistory}</div>
              </div>
              <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#c9a84c]">{totalSpent.toFixed(1)}h</div>
                <div className="text-xs text-gray-500 mt-0.5">{t.usedHours}</div>
              </div>
              <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{deductedCount}</div>
                <div className="text-xs text-gray-500 mt-0.5">{t.hoursDeducted}</div>
              </div>
            </div>
          )}

          <div className="bg-[#0d1526] border border-gray-700/40 rounded-lg overflow-hidden">
            {ticketsQuery.isLoading ? (
              <div className="p-8 text-center text-gray-400">{t.loading}</div>
            ) : historyTickets.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle2 size={40} className="mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400">{t.noHistory}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700/40">
                      <th className="text-left px-4 py-3 text-gray-400 font-medium whitespace-nowrap">{t.ticketNumber}</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">{t.subject}</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium whitespace-nowrap">{t.status}</th>
                      <th className="text-right px-4 py-3 text-gray-400 font-medium whitespace-nowrap">{t.spentHours}</th>
                      <th className="text-center px-4 py-3 text-gray-400 font-medium whitespace-nowrap">{t.hoursDeducted}</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium whitespace-nowrap">{t.createdAt}</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium whitespace-nowrap">{t.resolvedAt}</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium whitespace-nowrap">Screenshots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyTickets.map((ticket) => {
                      const screenshots = parseScreenshots(ticket);
                      return (
                        <tr key={ticket.ticketNumber} className="border-b border-gray-700/20 hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3 text-[#c9a84c] font-mono text-xs whitespace-nowrap">{ticket.ticketNumber}</td>
                          <td className="px-4 py-3">
                            <div className="text-white font-medium">{ticket.title}</div>
                            {ticket.adminFeedback && (
                              <div className="text-gray-400 text-xs mt-0.5">
                                {t.adminFeedback}: {ticket.adminFeedback}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                              {t[ticket.status] ?? ticket.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            {ticket.spentHours != null ? (
                              <span className="flex items-center justify-end gap-1 text-white">
                                <Clock size={13} className="text-gray-400" />
                                {parseFloat(String(ticket.spentHours)).toFixed(1)}h
                              </span>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            {ticket.hoursDeducted ? (
                              <span className="text-green-400 text-xs font-medium">{t.yes}</span>
                            ) : (
                              <span className="text-gray-500 text-xs">{t.no}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                            {formatInTimezone(ticket.createdAtUtc, tz, lang)}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                            {ticket.resolvedAt
                              ? formatInTimezone(ticket.resolvedAt, tz, lang)
                              : <span className="text-gray-600">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            {screenshots.length > 0 ? (
                              <div className="flex gap-1 flex-wrap">
                                {screenshots.map((s, i) => (
                                  <button key={i} onClick={() => setLightbox({ screenshots, index: i })} className="relative group">
                                    <img
                                      src={s.url}
                                      alt={`screenshot ${i + 1}`}
                                      className="h-10 w-14 object-cover rounded border border-gray-600 hover:border-[#c9a84c] transition-colors"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                      <ImageIcon size={12} className="text-white" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-600 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <ScreenshotLightbox
          screenshots={lightbox.screenshots}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </PortalLayout>
  );
}
