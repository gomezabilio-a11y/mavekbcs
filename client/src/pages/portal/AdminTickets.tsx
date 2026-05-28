import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { usePortalT, getStatusColor, formatInTimezone } from "@/lib/portalI18n";
import { useAdminSession } from "@/contexts/AdminContext";
import { useLanguage } from "@/contexts/LanguageContext";
import AdminLayout from "./AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface TicketRow {
  id: number;
  ticketNumber: string;
  portalUserId: number;
  title: string;
  description: string;
  screenshotUrl: string | null;
  screenshotUrls: string | null;
  userTimezone: string;
  status: string;
  adminFeedback: string | null;
  spentHours: string | null;
  hoursDeducted: boolean;
  createdAtUtc: Date;
  resolvedAt: Date | null;
  companyName: string;
  username: string;
}

export default function AdminTickets() {
  const { language } = useLanguage();
  const t = usePortalT(language as "en" | "ko" | "ja");
  const { adminToken } = useAdminSession();
  const utils = trpc.useUtils();

  const [editTicket, setEditTicket] = useState<TicketRow | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [spentHours, setSpentHours] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const ticketsQuery = trpc.portalV2.adminListTickets.useQuery(
    { adminToken: adminToken ?? "" },
    { enabled: !!adminToken }
  );

  const updateMutation = trpc.portalV2.adminUpdateTicket.useMutation({
    onSuccess: () => {
      utils.portalV2.adminListTickets.invalidate();
      setEditTicket(null);
      toast.success("Ticket updated");
    },
    onError: (e) => toast.error(e.message),
  });

  const openEdit = (ticket: TicketRow) => {
    setEditTicket(ticket);
    setNewStatus(ticket.status);
    setFeedback(ticket.adminFeedback ?? "");
    setSpentHours(ticket.spentHours ?? "");
    setInternalNote((ticket as TicketRow & { internalNote?: string }).internalNote ?? "");
  };

  const filtered = (ticketsQuery.data ?? []).filter(
    (t) => filterStatus === "all" || t.status === filterStatus
  );

  const statusOptions = ["all", "open", "in_progress", "resolved", "closed"];

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t.allTickets}</h1>
          {/* Status filter */}
          <div className="flex gap-1.5">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filterStatus === s
                    ? "bg-[#c9a84c] text-black"
                    : "bg-[#1a2235] text-gray-400 hover:text-white"
                }`}
              >
                {s === "all" ? "All" : (t[s] ?? s)}
              </button>
            ))}
          </div>
        </div>

        <Card className="bg-[#111827] border-gray-700/40">
          <CardContent className="p-0">
            {ticketsQuery.isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-500" /></div>
            ) : filtered.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-12">{t.noTickets}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700/40">
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.ticketNumber}</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.companyName}</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.subject}</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.status}</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.spentHours}</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.createdAt}</th>
                      <th className="text-right text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/40">
                    {filtered.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono text-xs text-gray-400">{ticket.ticketNumber}</td>
                        <td className="px-4 py-3 text-white text-xs">{ticket.companyName}</td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-white text-sm truncate">{ticket.title}</p>
                          <p className="text-gray-500 text-xs truncate mt-0.5">{ticket.description}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-[10px] px-1.5 py-0 ${getStatusColor(ticket.status)}`}>
                            {t[ticket.status] ?? ticket.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-xs">
                          {ticket.spentHours ? `${ticket.spentHours}h` : "—"}
                          {ticket.hoursDeducted && <span className="ml-1 text-green-500 text-[10px]">✓</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {formatInTimezone(ticket.createdAtUtc, ticket.userTimezone, language as "en" | "ko" | "ja")}
                          <span className="text-[10px] text-gray-600 block mt-0.5">{ticket.userTimezone}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {/* Screenshot links: prefer screenshotUrls (multi), fallback to screenshotUrl */}
                            {(() => {
                              const allScreenshots: { url: string }[] = ticket.screenshotUrls
                                ? (() => { try { return JSON.parse(ticket.screenshotUrls) as { url: string }[]; } catch { return []; } })()
                                : ticket.screenshotUrl ? [{ url: ticket.screenshotUrl }] : [];
                              return allScreenshots.map((s, i) => (
                                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white h-7 px-2">
                                    <ExternalLink size={13} />
                                    {allScreenshots.length > 1 && <span className="text-[10px] ml-0.5">{i + 1}</span>}
                                  </Button>
                                </a>
                              ));
                            })()}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white h-7 px-2 gap-1"
                              onClick={() => openEdit(ticket as TicketRow)}
                            >
                              <Edit2 size={13} />
                              {t.edit}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Ticket Dialog */}
      <Dialog open={!!editTicket} onOpenChange={(o) => !o && setEditTicket(null)}>
        <DialogContent className="bg-[#111827] border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              {t.updateTicket} — <span className="font-mono text-sm text-gray-400">{editTicket?.ticketNumber}</span>
            </DialogTitle>
          </DialogHeader>
          {editTicket && (
            <div className="space-y-4 py-2">
              {/* Ticket summary */}
              <div className="bg-[#1a2235] rounded-lg p-3 text-sm">
                <p className="text-white font-medium">{editTicket.title}</p>
                <p className="text-gray-400 text-xs mt-1">{editTicket.description}</p>
                <p className="text-gray-500 text-xs mt-1">{editTicket.companyName} · {editTicket.username}</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs">{t.status}</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2235] border-gray-600">
                    <SelectItem value="open" className="text-white">{t.open}</SelectItem>
                    <SelectItem value="in_progress" className="text-white">{t.in_progress}</SelectItem>
                    <SelectItem value="resolved" className="text-white">{t.resolved}</SelectItem>
                    <SelectItem value="closed" className="text-white">{t.closed}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs">{t.spentHours}</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={spentHours}
                  onChange={(e) => setSpentHours(e.target.value)}
                  className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm"
                  placeholder="e.g. 2.5"
                />
                {newStatus === "resolved" && !editTicket.hoursDeducted && (
                  <p className="text-xs text-yellow-400">
                    ⚠ {t.deductHours}
                  </p>
                )}
                {editTicket.hoursDeducted && (
                  <p className="text-xs text-green-400">✓ Hours already deducted</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs">{t.adminFeedback}</Label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="bg-[#1a2235] border-gray-600 text-white text-sm resize-none"
                  placeholder={t.feedback}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs flex items-center gap-1.5">
                  <span className="bg-red-900/40 text-red-400 text-[10px] px-1.5 py-0.5 rounded">ADMIN ONLY</span>
                  {t.internalNote}
                </Label>
                <Textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  rows={2}
                  className="bg-[#1a2235] border-red-900/40 text-white text-sm resize-none"
                  placeholder="Internal notes (not visible to client)"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" className="text-gray-400" onClick={() => setEditTicket(null)}>{t.cancel}</Button>
            <Button
              className="bg-[#c9a84c] hover:bg-[#b8973b] text-black"
              disabled={updateMutation.isPending}
              onClick={() => {
                if (!editTicket) return;
                updateMutation.mutate({
                  adminToken: adminToken ?? "",
                  ticketId: editTicket.id,
                  status: newStatus as "open" | "in_progress" | "resolved" | "closed",
                  adminFeedback: feedback || undefined,
                  internalNote: internalNote || undefined,
                  spentHours: spentHours ? parseFloat(spentHours) : undefined,
                });
              }}
            >
              {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
