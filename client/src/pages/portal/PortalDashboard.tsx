import { useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { usePortalSession } from "@/contexts/PortalContext";
import { usePortalT, formatInTimezone, getStatusColor } from "@/lib/portalI18n";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "./PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function HoursGauge({ total, used, remaining }: { total: number; used: number; remaining: number }) {
  const pct = total > 0 ? Math.min(100, (remaining / total) * 100) : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circumference;

  // Color: green > 50%, yellow > 20%, red <= 20%
  const color = pct > 50 ? "#22c55e" : pct > 20 ? "#eab308" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Background track */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e2d45" strokeWidth="12" />
        {/* Progress arc */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        {/* Center text */}
        <text x="70" y="64" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">
          {remaining.toFixed(1)}
        </text>
        <text x="70" y="82" textAnchor="middle" fill="#9ca3af" fontSize="10">
          hrs left
        </text>
      </svg>
      <div className="flex gap-6 mt-2 text-xs text-gray-400">
        <span>Total: <span className="text-white font-medium">{total.toFixed(1)}</span></span>
        <span>Used: <span className="text-white font-medium">{used.toFixed(1)}</span></span>
      </div>
    </div>
  );
}

export default function PortalDashboard() {
  const { portalToken, portalUser } = usePortalSession();
  const { language } = useLanguage();
  const t = usePortalT(language as "en" | "ko" | "ja");
  const tz = portalUser?.timezone ?? "UTC";
  const lang = portalUser?.language ?? "en";

  const contractQuery = trpc.portalV2.myContract.useQuery(
    { portalToken: portalToken! },
    { enabled: !!portalToken }
  );

  const ticketsQuery = trpc.portalV2.myTickets.useQuery(
    { portalToken: portalToken! },
    { enabled: !!portalToken }
  );

  const recentTickets = useMemo(() => (ticketsQuery.data ?? []).slice(0, 5), [ticketsQuery.data]);

  const stats = useMemo(() => {
    const all = ticketsQuery.data ?? [];
    return {
      open: all.filter((t) => t.status === "open").length,
      inProgress: all.filter((t) => t.status === "in_progress").length,
      resolved: all.filter((t) => t.status === "resolved" || t.status === "closed").length,
    };
  }, [ticketsQuery.data]);

  return (
    <PortalLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t.dashboard}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{portalUser?.companyName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Contract hours gauge */}
          <Card className="bg-[#111827] border-gray-700/40 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                <Clock size={15} className="text-[#c9a84c]" />
                {t.contractHours}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contractQuery.isLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-gray-500" /></div>
              ) : contractQuery.data ? (
                <>
                  <HoursGauge
                    total={contractQuery.data.totalHours}
                    used={contractQuery.data.usedHours}
                    remaining={contractQuery.data.remainingHours}
                  />
                  {contractQuery.data.contractEndDate && (
                    <p className="text-center text-xs text-gray-500 mt-3">
                      {t.contractPeriod}:{" "}
                      {formatInTimezone(contractQuery.data.contractEndDate, tz, lang)}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm text-center py-6">—</p>
              )}
            </CardContent>
          </Card>

          {/* Ticket stats */}
          <div className="lg:col-span-2 grid grid-cols-3 gap-4">
            {[
              { label: t.open, value: stats.open, icon: AlertCircle, color: "text-blue-400" },
              { label: t.in_progress, value: stats.inProgress, icon: Loader2, color: "text-yellow-400" },
              { label: t.resolved, value: stats.resolved, icon: CheckCircle2, color: "text-green-400" },
            ].map((s) => (
              <Card key={s.label} className="bg-[#111827] border-gray-700/40">
                <CardContent className="pt-5 pb-4 flex flex-col items-center gap-2">
                  <s.icon size={22} className={s.color} />
                  <div className="text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </CardContent>
              </Card>
            ))}

            {/* Quick action */}
            <Card className="bg-[#111827] border-gray-700/40 col-span-3">
              <CardContent className="pt-4 pb-4 flex items-center justify-between">
                <span className="text-sm text-gray-300">{t.newTicket}</span>
                <Link href="/portal/tickets/new">
                  <Button size="sm" className="bg-[#c9a84c] hover:bg-[#b8973b] text-black gap-1.5">
                    <PlusCircle size={14} />
                    {t.newTicket}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent tickets */}
        <Card className="bg-[#111827] border-gray-700/40">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-white text-sm font-medium">{t.tickets}</CardTitle>
            <Link href="/portal/tickets">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs h-7">
                {t.viewTickets} →
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {ticketsQuery.isLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-gray-500" /></div>
            ) : recentTickets.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">{t.noTickets}</p>
            ) : (
              <div className="divide-y divide-gray-700/40">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-gray-500 font-mono">{ticket.ticketNumber}</span>
                        <Badge className={`text-[10px] px-1.5 py-0 ${getStatusColor(ticket.status)}`}>
                          {t[ticket.status] ?? ticket.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-white truncate">{ticket.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatInTimezone(ticket.createdAtUtc, tz, lang)}
                      </p>
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
