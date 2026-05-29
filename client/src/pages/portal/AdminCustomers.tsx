import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { usePortalT, TIMEZONES } from "@/lib/portalI18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminSession } from "@/contexts/AdminContext";
import AdminLayout from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit2, Clock, Loader2, Trash2, History, Eye, EyeOff } from "lucide-react";
import { formatInTimezone, getStatusColor } from "@/lib/portalI18n";
import { toast } from "sonner";

interface CustomerRow {
  id: number;
  username: string;
  companyName: string;
  email: string | null;
  language: string;
  timezone: string;
  isActive: boolean;
  totalHours: number;
  usedHours: number;
  remainingHours: number;
}

// ── Customer Ticket History sub-component ────────────────────────────────────
function CustomerTicketHistory({ adminToken, customer, lang }: { adminToken: string; customer: CustomerRow; lang: string }) {
  const ticketsQuery = trpc.portalV2.adminListTickets.useQuery(
    { adminToken },
    { enabled: !!adminToken }
  );

  const customerTickets = (ticketsQuery.data ?? []).filter((tk) => tk.portalUserId === customer.id);

  if (ticketsQuery.isLoading) {
    return <div className="py-8 text-center text-gray-400">Loading...</div>;
  }

  if (customerTickets.length === 0) {
    return <div className="py-8 text-center text-gray-400">No tickets found for this customer.</div>;
  }

  const totalSpent = customerTickets.reduce((sum, tk) => sum + parseFloat(String(tk.spentHours ?? 0)), 0);
  const deducted = customerTickets.filter((tk) => tk.hoursDeducted).length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1a2235] rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{customerTickets.length}</div>
          <div className="text-xs text-gray-400 mt-0.5">Total Tickets</div>
        </div>
        <div className="bg-[#1a2235] rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-[#c9a84c]">{totalSpent.toFixed(1)}h</div>
          <div className="text-xs text-gray-400 mt-0.5">Hours Used</div>
        </div>
        <div className="bg-[#1a2235] rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{deducted}</div>
          <div className="text-xs text-gray-400 mt-0.5">Deducted</div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-3 py-2 text-left text-xs text-gray-400 font-medium">Ticket #</th>
              <th className="px-3 py-2 text-left text-xs text-gray-400 font-medium">Subject</th>
              <th className="px-3 py-2 text-left text-xs text-gray-400 font-medium">Status</th>
              <th className="px-3 py-2 text-right text-xs text-gray-400 font-medium">Hours</th>
              <th className="px-3 py-2 text-center text-xs text-gray-400 font-medium">Deducted</th>
              <th className="px-3 py-2 text-left text-xs text-gray-400 font-medium">Created</th>
              <th className="px-3 py-2 text-left text-xs text-gray-400 font-medium">Internal Note</th>
            </tr>
          </thead>
          <tbody>
            {customerTickets.map((tk) => (
              <tr key={tk.id} className="border-b border-gray-800 hover:bg-[#1a2235]">
                <td className="px-3 py-2 text-gray-300 text-xs font-mono">{tk.ticketNumber}</td>
                <td className="px-3 py-2 text-white text-xs max-w-[180px]">
                  <div className="truncate">{tk.title}</div>
                  {tk.adminFeedback && (
                    <div className="text-gray-400 text-[10px] truncate mt-0.5">{tk.adminFeedback}</div>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${getStatusColor(tk.status)}`}>
                    {tk.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-gray-300 text-xs">
                  {tk.spentHours ? `${parseFloat(String(tk.spentHours)).toFixed(1)}h` : "-"}
                </td>
                <td className="px-3 py-2 text-center">
                  {tk.hoursDeducted
                    ? <span className="text-green-400 text-xs">✓</span>
                    : <span className="text-gray-600 text-xs">-</span>}
                </td>
                <td className="px-3 py-2 text-gray-400 text-xs">
                  {formatInTimezone(tk.createdAtUtc, customer.timezone, lang)}
                </td>
                <td className="px-3 py-2 text-gray-400 text-xs max-w-[150px]">
                  <div className="truncate">{tk.internalNote ?? "-"}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminCustomers() {
  const { language } = useLanguage();
  const lang = language as "en" | "ko" | "ja";
  const t = usePortalT(lang);
  const utils = trpc.useUtils();
  const { adminToken } = useAdminSession();

  // Dialogs
  const [showCreate, setShowCreate] = useState(false);
  const [editCustomer, setEditCustomer] = useState<CustomerRow | null>(null);
  const [contractCustomer, setContractCustomer] = useState<CustomerRow | null>(null);

  // Create form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newLang, setNewLang] = useState<"en" | "ko" | "ja">("en");
  const [newTz, setNewTz] = useState("UTC");

  // Contract form
  const [contractHours, setContractHours] = useState("");
  const [contractStart, setContractStart] = useState("");
  const [contractEnd, setContractEnd] = useState("");
  const [contractNotes, setContractNotes] = useState("");

  const [deleteCustomer, setDeleteCustomer] = useState<CustomerRow | null>(null);
  const [historyCustomer, setHistoryCustomer] = useState<CustomerRow | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);

  const customersQuery = trpc.portalV2.adminListUsers.useQuery(
    { adminToken: adminToken ?? "" },
    { enabled: !!adminToken }
  );

  const createMutation = trpc.portalV2.adminCreateUser.useMutation({
    onSuccess: () => {
      utils.portalV2.adminListUsers.invalidate();
      setShowCreate(false);
      setNewUsername(""); setNewPassword(""); setNewCompany(""); setNewEmail("");
      toast.success("Customer created successfully");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.portalV2.adminUpdateUser.useMutation({
    onSuccess: () => {
      utils.portalV2.adminListUsers.invalidate();
      setEditCustomer(null);
      toast.success("Customer updated");
    },
    onError: (e) => toast.error(e.message),
  });

  const contractMutation = trpc.portalV2.adminSetContract.useMutation({
    onSuccess: () => {
      utils.portalV2.adminListUsers.invalidate();
      setContractCustomer(null);
      toast.success("Contract hours updated");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.portalV2.adminDeleteCustomer.useMutation({
    onSuccess: () => {
      utils.portalV2.adminListUsers.invalidate();
      setDeleteCustomer(null);
      toast.success("Customer deleted");
    },
    onError: (e) => toast.error(e.message),
  });

  const openEdit = (c: CustomerRow) => {
    setEditCustomer(c);
    setEditPassword("");
    setShowEditPassword(false);
  };

  const openContract = (c: CustomerRow) => {
    setContractCustomer(c);
    setContractHours(String(c.totalHours));
    setContractStart("");
    setContractEnd("");
    setContractNotes("");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t.customers}</h1>
          <Button
            className="bg-[#c9a84c] hover:bg-[#b8973b] text-black gap-1.5"
            onClick={() => setShowCreate(true)}
          >
            <PlusCircle size={15} />
            {t.createCustomer}
          </Button>
        </div>

        <Card className="bg-[#111827] border-gray-700/40">
          <CardContent className="p-0">
            {customersQuery.isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-500" /></div>
            ) : (customersQuery.data ?? []).length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-12">{t.noCustomers}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700/40">
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.companyName}</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.username}</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.contractHours}</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.status}</th>
                      <th className="text-right text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/40">
                    {customersQuery.data!.map((c) => (
                      <tr key={c.id} className="hover:bg-white/2">
                        <td className="px-4 py-3 text-white font-medium">{c.companyName}</td>
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{c.username}</td>
                        <td className="px-4 py-3">
                          <div className="text-white">{c.remainingHours.toFixed(1)} / {c.totalHours.toFixed(1)} hrs</div>
                          <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-[#c9a84c] rounded-full"
                              style={{ width: `${c.totalHours > 0 ? (c.remainingHours / c.totalHours) * 100 : 0}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={c.isActive ? "bg-green-900/40 text-green-400 border-0" : "bg-gray-700 text-gray-400 border-0"}>
                            {c.isActive ? t.active : t.inactive}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white h-7 px-2 gap-1"
                              onClick={() => openContract(c)}
                            >
                              <Clock size={13} />
                              {t.setContractHours}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400 hover:text-blue-300 h-7 px-2 gap-1"
                              onClick={() => setHistoryCustomer(c)}
                            >
                              <History size={13} />
                              Tickets
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white h-7 px-2 gap-1"
                              onClick={() => openEdit(c)}
                            >
                              <Edit2 size={13} />
                              {t.edit}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 h-7 px-2 gap-1"
                              onClick={() => setDeleteCustomer(c)}
                            >
                              <Trash2 size={13} />
                              {t.delete ?? "Delete"}
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

      {/* Create Customer Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-[#111827] border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{t.createCustomer}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs">{t.username}</Label>
                <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs">{t.password}</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-300 text-xs">{t.companyName}</Label>
              <Input value={newCompany} onChange={(e) => setNewCompany(e.target.value)}
                className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-300 text-xs">{t.email}</Label>
              <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs">{t.language}</Label>
                <Select value={newLang} onValueChange={(v) => setNewLang(v as "en" | "ko" | "ja")}>
                  <SelectTrigger className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2235] border-gray-600">
                    <SelectItem value="en" className="text-white">English</SelectItem>
                    <SelectItem value="ko" className="text-white">한국어</SelectItem>
                    <SelectItem value="ja" className="text-white">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs">{t.timezone}</Label>
                <Select value={newTz} onValueChange={setNewTz}>
                  <SelectTrigger className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2235] border-gray-600 max-h-48">
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value} className="text-white text-xs">{tz.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-gray-400" onClick={() => setShowCreate(false)}>{t.cancel}</Button>
            <Button
              className="bg-[#c9a84c] hover:bg-[#b8973b] text-black"
              disabled={createMutation.isPending || !newUsername || !newPassword || !newCompany}
              onClick={() => createMutation.mutate({
                adminToken: adminToken ?? "",
                username: newUsername, password: newPassword, companyName: newCompany,
                email: newEmail || undefined, language: newLang, timezone: newTz,
              })}
            >
              {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editCustomer} onOpenChange={(o) => !o && setEditCustomer(null)}>
        <DialogContent className="bg-[#111827] border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{t.editCustomer}</DialogTitle>
          </DialogHeader>
          {editCustomer && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs">{t.companyName}</Label>
                <Input
                  defaultValue={editCustomer.companyName}
                  id="edit-company"
                  className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs">{t.email}</Label>
                <Input
                  defaultValue={editCustomer.email ?? ""}
                  id="edit-email"
                  className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs flex items-center gap-1.5">
                  New Password
                  <span className="text-gray-500 text-[10px]">(leave blank to keep current)</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showEditPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm pr-8"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                  >
                    {showEditPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs">{t.language}</Label>
                  <Select defaultValue={editCustomer.language} onValueChange={(v) => {
                    setEditCustomer({ ...editCustomer, language: v });
                  }}>
                    <SelectTrigger className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2235] border-gray-600">
                      <SelectItem value="en" className="text-white">English</SelectItem>
                      <SelectItem value="ko" className="text-white">한국어</SelectItem>
                      <SelectItem value="ja" className="text-white">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs">{t.timezone}</Label>
                  <Select defaultValue={editCustomer.timezone} onValueChange={(v) => {
                    setEditCustomer({ ...editCustomer, timezone: v });
                  }}>
                    <SelectTrigger className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2235] border-gray-600 max-h-48">
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value} className="text-white text-xs">{tz.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" className="text-gray-400" onClick={() => setEditCustomer(null)}>{t.cancel}</Button>
            <Button
              className="bg-[#c9a84c] hover:bg-[#b8973b] text-black"
              disabled={updateMutation.isPending}
              onClick={() => {
                if (!editCustomer) return;
                const company = (document.getElementById("edit-company") as HTMLInputElement)?.value;
                const email = (document.getElementById("edit-email") as HTMLInputElement)?.value;
                updateMutation.mutate({
                  adminToken: adminToken ?? "",
                  id: editCustomer.id,
                  companyName: company,
                  email: email || undefined,
                  language: editCustomer.language as "en" | "ko" | "ja",
                  timezone: editCustomer.timezone,
                  password: editPassword || undefined,
                });
              }}
            >
              {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Contract Hours Dialog */}
      <Dialog open={!!contractCustomer} onOpenChange={(o) => !o && setContractCustomer(null)}>
        <DialogContent className="bg-[#111827] border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {t.setContractHours} — {contractCustomer?.companyName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-gray-300 text-xs">{t.totalHours}</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={contractHours}
                onChange={(e) => setContractHours(e.target.value)}
                className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs">{t.contractPeriod} (Start)</Label>
                <Input type="date" value={contractStart} onChange={(e) => setContractStart(e.target.value)}
                  className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs">{t.contractPeriod} (End)</Label>
                <Input type="date" value={contractEnd} onChange={(e) => setContractEnd(e.target.value)}
                  className="bg-[#1a2235] border-gray-600 text-white h-8 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-300 text-xs">Notes</Label>
              <Textarea value={contractNotes} onChange={(e) => setContractNotes(e.target.value)}
                rows={2} className="bg-[#1a2235] border-gray-600 text-white text-sm resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-gray-400" onClick={() => setContractCustomer(null)}>{t.cancel}</Button>
            <Button
              className="bg-[#c9a84c] hover:bg-[#b8973b] text-black"
              disabled={contractMutation.isPending || !contractHours}
              onClick={() => {
                if (!contractCustomer) return;
                contractMutation.mutate({
                  adminToken: adminToken ?? "",
                  portalUserId: contractCustomer.id,
                  totalHours: parseFloat(contractHours),
                  contractStartDate: contractStart || undefined,
                  contractEndDate: contractEnd || undefined,
                  notes: contractNotes || undefined,
                });
              }}
            >
              {contractMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Customer Ticket History Dialog */}
      <Dialog open={!!historyCustomer} onOpenChange={(o) => !o && setHistoryCustomer(null)}>
        <DialogContent className="bg-[#111827] border-gray-700 text-white max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <History size={16} className="text-blue-400" />
              Ticket History — {historyCustomer?.companyName}
            </DialogTitle>
          </DialogHeader>
          {historyCustomer && (
            <CustomerTicketHistory
              adminToken={adminToken ?? ""}
              customer={historyCustomer}
              lang={lang}
            />
          )}
          <DialogFooter>
            <Button variant="ghost" className="text-gray-400" onClick={() => setHistoryCustomer(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteCustomer} onOpenChange={(o) => !o && setDeleteCustomer(null)}>
        <DialogContent className="bg-[#111827] border-gray-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-400">{t.deleteCustomer ?? "Delete Customer"}</DialogTitle>
          </DialogHeader>
          <p className="text-gray-300 text-sm py-2">
            {t.deleteConfirm ?? "Are you sure you want to delete"} <strong className="text-white">{deleteCustomer?.companyName}</strong>?
            {" "}{t.deleteWarning ?? "This will permanently remove all their tickets and contract data."}
          </p>
          <DialogFooter>
            <Button variant="ghost" className="text-gray-400" onClick={() => setDeleteCustomer(null)}>{t.cancel}</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deleteCustomer) return;
                deleteMutation.mutate({ adminToken: adminToken ?? "", portalUserId: deleteCustomer.id });
              }}
            >
              {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : (t.confirmDelete ?? "Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
