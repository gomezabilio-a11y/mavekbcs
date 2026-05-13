import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAdminSession } from "@/contexts/AdminContext";
import { useLanguage } from "@/contexts/LanguageContext";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, ShieldCheck, User, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

const labels = {
  en: {
    title: "Staff Accounts",
    subtitle: "Manage admin portal access for your team",
    addStaff: "Add Staff",
    username: "Username",
    displayName: "Display Name",
    password: "Password",
    role: "Role",
    master: "Master",
    staff: "Staff",
    active: "Active",
    inactive: "Inactive",
    status: "Status",
    actions: "Actions",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    create: "Create Account",
    creating: "Creating...",
    saving: "Saving...",
    newPassword: "New Password (leave blank to keep)",
    masterNote: "Master can manage all staff and customers. Staff can manage customers and tickets.",
    noStaff: "No staff accounts yet.",
    successCreate: "Staff account created",
    successUpdate: "Staff account updated",
    errorDuplicate: "Username already exists",
    errorGeneric: "An error occurred",
  },
  ko: {
    title: "직원 계정 관리",
    subtitle: "팀의 관리자 포털 접근 권한을 관리합니다",
    addStaff: "직원 추가",
    username: "아이디",
    displayName: "이름",
    password: "비밀번호",
    role: "권한",
    master: "마스터",
    staff: "스태프",
    active: "활성",
    inactive: "비활성",
    status: "상태",
    actions: "관리",
    edit: "수정",
    save: "저장",
    cancel: "취소",
    create: "계정 생성",
    creating: "생성 중...",
    saving: "저장 중...",
    newPassword: "새 비밀번호 (변경 없으면 빈칸)",
    masterNote: "마스터는 모든 직원 및 고객을 관리할 수 있습니다. 스태프는 고객 및 티켓을 관리할 수 있습니다.",
    noStaff: "등록된 직원 계정이 없습니다.",
    successCreate: "직원 계정이 생성되었습니다",
    successUpdate: "직원 계정이 수정되었습니다",
    errorDuplicate: "이미 사용 중인 아이디입니다",
    errorGeneric: "오류가 발생했습니다",
  },
  ja: {
    title: "スタッフアカウント管理",
    subtitle: "チームの管理者ポータルアクセスを管理します",
    addStaff: "スタッフ追加",
    username: "ユーザー名",
    displayName: "表示名",
    password: "パスワード",
    role: "権限",
    master: "マスター",
    staff: "スタッフ",
    active: "有効",
    inactive: "無効",
    status: "ステータス",
    actions: "操作",
    edit: "編集",
    save: "保存",
    cancel: "キャンセル",
    create: "アカウント作成",
    creating: "作成中...",
    saving: "保存中...",
    newPassword: "新しいパスワード（変更なしは空欄）",
    masterNote: "マスターはすべてのスタッフと顧客を管理できます。スタッフは顧客とチケットを管理できます。",
    noStaff: "スタッフアカウントがありません。",
    successCreate: "スタッフアカウントを作成しました",
    successUpdate: "スタッフアカウントを更新しました",
    errorDuplicate: "このユーザー名は既に使用されています",
    errorGeneric: "エラーが発生しました",
  },
};

interface StaffRow {
  id: number;
  username: string;
  displayName: string;
  role: "master" | "staff";
  isActive: boolean;
  createdAt: Date;
}

export default function AdminStaff() {
  const { language } = useLanguage();
  const lang = (language as keyof typeof labels) in labels ? (language as keyof typeof labels) : "en";
  const t = labels[lang];
  const { adminToken, adminUser } = useAdminSession();
  const utils = trpc.useUtils();

  const [showCreate, setShowCreate] = useState(false);
  const [editStaff, setEditStaff] = useState<StaffRow | null>(null);

  // Form state
  const [form, setForm] = useState({ username: "", displayName: "", password: "", role: "staff" as "master" | "staff" });
  const [editForm, setEditForm] = useState({ displayName: "", role: "staff" as "master" | "staff", password: "", isActive: true });

  const headers = adminToken ? { "x-admin-token": adminToken } : {};

  const staffQuery = trpc.adminPortal.listStaff.useQuery(
    { adminToken: adminToken ?? "" },
    { enabled: !!adminToken }
  );

  const createMutation = trpc.adminPortal.createStaff.useMutation({
    onSuccess: () => {
      toast.success(t.successCreate);
      setShowCreate(false);
      setForm({ username: "", displayName: "", password: "", role: "staff" });
      utils.adminPortal.listStaff.invalidate();
    },
    onError: (err) => {
      if (err.data?.code === "CONFLICT") toast.error(t.errorDuplicate);
      else toast.error(t.errorGeneric);
    },
  });

  const updateMutation = trpc.adminPortal.updateStaff.useMutation({
    onSuccess: () => {
      toast.success(t.successUpdate);
      setEditStaff(null);
      utils.adminPortal.listStaff.invalidate();
    },
    onError: () => toast.error(t.errorGeneric),
  });

  const openEdit = (s: StaffRow) => {
    setEditStaff(s);
    setEditForm({ displayName: s.displayName, role: s.role, password: "", isActive: s.isActive });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ ...form, adminToken: adminToken ?? "" });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaff) return;
    updateMutation.mutate({
      adminToken: adminToken ?? "",
      id: editStaff.id,
      displayName: editForm.displayName,
      role: editForm.role,
      isActive: editForm.isActive,
      password: editForm.password || undefined,
    });
  };

  const staffList = (staffQuery.data ?? []) as StaffRow[];

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#f0e6d3", fontFamily: "'Playfair Display', serif" }}>
              {t.title}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#4a5568" }}>{t.subtitle}</p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 text-xs"
            style={{ backgroundColor: "#b48f4b", color: "#0a0f1e" }}
          >
            <Plus size={14} /> {t.addStaff}
          </Button>
        </div>

        {/* Role note */}
        <div
          className="text-xs px-4 py-3 rounded mb-5"
          style={{ backgroundColor: "rgba(180,143,75,0.08)", border: "1px solid rgba(180,143,75,0.2)", color: "#8a9bb0" }}
        >
          {t.masterNote}
        </div>

        {/* Staff list */}
        <Card style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <CardContent className="p-0">
            {staffQuery.isLoading ? (
              <div className="py-12 text-center text-sm" style={{ color: "#4a5568" }}>Loading...</div>
            ) : staffList.length === 0 ? (
              <div className="py-12 text-center text-sm" style={{ color: "#4a5568" }}>{t.noStaff}</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {[t.displayName, t.username, t.role, t.status, t.actions].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#4a5568" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((s) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td className="px-5 py-3.5 font-medium" style={{ color: "#f0e6d3" }}>
                        <div className="flex items-center gap-2">
                          {s.role === "master" ? <ShieldCheck size={14} style={{ color: "#b48f4b" }} /> : <User size={14} style={{ color: "#8a9bb0" }} />}
                          {s.displayName}
                          {s.id === adminUser?.id && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(180,143,75,0.15)", color: "#b48f4b" }}>You</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#8a9bb0" }}>{s.username}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: s.role === "master" ? "rgba(180,143,75,0.15)" : "rgba(100,116,139,0.15)",
                            color: s.role === "master" ? "#b48f4b" : "#8a9bb0",
                          }}
                        >
                          {s.role === "master" ? t.master : t.staff}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {s.isActive ? <ToggleRight size={16} style={{ color: "#22c55e" }} /> : <ToggleLeft size={16} style={{ color: "#4a5568" }} />}
                          <span className="text-xs" style={{ color: s.isActive ? "#22c55e" : "#4a5568" }}>
                            {s.isActive ? t.active : t.inactive}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(s)}
                          className="text-xs h-7 px-2"
                          style={{ color: "#8a9bb0" }}
                        >
                          <Pencil size={12} className="mr-1" /> {t.edit}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent style={{ backgroundColor: "#0f1629", border: "1px solid rgba(255,255,255,0.1)", color: "#f0e6d3" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#f0e6d3" }}>{t.addStaff}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: "#8a9bb0" }}>{t.username}</Label>
              <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="bg-transparent border-white/10 text-white" required minLength={3} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: "#8a9bb0" }}>{t.displayName}</Label>
              <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="bg-transparent border-white/10 text-white" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: "#8a9bb0" }}>{t.password}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="bg-transparent border-white/10 text-white" required minLength={6} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: "#8a9bb0" }}>{t.role}</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as "master" | "staff" })}>
                <SelectTrigger className="bg-transparent border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">{t.staff}</SelectItem>
                  <SelectItem value="master">{t.master}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowCreate(false)} style={{ color: "#8a9bb0" }}>{t.cancel}</Button>
              <Button type="submit" disabled={createMutation.isPending} style={{ backgroundColor: "#b48f4b", color: "#0a0f1e" }}>
                {createMutation.isPending ? t.creating : t.create}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editStaff} onOpenChange={(open) => !open && setEditStaff(null)}>
        <DialogContent style={{ backgroundColor: "#0f1629", border: "1px solid rgba(255,255,255,0.1)", color: "#f0e6d3" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#f0e6d3" }}>{t.edit}: {editStaff?.username}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: "#8a9bb0" }}>{t.displayName}</Label>
              <Input value={editForm.displayName} onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })} className="bg-transparent border-white/10 text-white" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: "#8a9bb0" }}>{t.newPassword}</Label>
              <Input type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} className="bg-transparent border-white/10 text-white" placeholder="••••••" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: "#8a9bb0" }}>{t.role}</Label>
              <Select value={editForm.role} onValueChange={(v) => setEditForm({ ...editForm, role: v as "master" | "staff" })}>
                <SelectTrigger className="bg-transparent border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">{t.staff}</SelectItem>
                  <SelectItem value="master">{t.master}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" style={{ color: "#8a9bb0" }}>{t.status}</Label>
              <Select value={editForm.isActive ? "active" : "inactive"} onValueChange={(v) => setEditForm({ ...editForm, isActive: v === "active" })}>
                <SelectTrigger className="bg-transparent border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t.active}</SelectItem>
                  <SelectItem value="inactive">{t.inactive}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditStaff(null)} style={{ color: "#8a9bb0" }}>{t.cancel}</Button>
              <Button type="submit" disabled={updateMutation.isPending} style={{ backgroundColor: "#b48f4b", color: "#0a0f1e" }}>
                {updateMutation.isPending ? t.saving : t.save}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
