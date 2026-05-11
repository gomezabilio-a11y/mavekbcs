import { useState } from "react";
import { Link } from "wouter";
import { Plus, Edit2, Trash2, Users, FileText, Clock, ChevronRight, X, Check } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { ArrowRight } from "lucide-react";

type ContractStatus = "active" | "pending" | "completed" | "on_hold" | "expired";

interface ContractFormData {
  userId: number;
  clientName: string;
  projectDescription: string;
  contractStatus: ContractStatus;
  totalHours: number;
  remainingHours: number;
  contractStartDate: string;
  contractEndDate: string;
  notes: string;
}

const emptyForm: ContractFormData = {
  userId: 0,
  clientName: "",
  projectDescription: "",
  contractStatus: "active",
  totalHours: 0,
  remainingHours: 0,
  contractStartDate: "",
  contractEndDate: "",
  notes: "",
};

export default function AdminPortal() {
  const { user, isAuthenticated, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ContractFormData>(emptyForm);

  const utils = trpc.useUtils();
  const { data: contracts, isLoading: contractsLoading } = trpc.portal.allContracts.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const { data: users } = trpc.portal.listUsers.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const createContract = trpc.portal.createContract.useMutation({
    onSuccess: () => {
      toast.success("Contract created successfully");
      utils.portal.allContracts.invalidate();
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateContract = trpc.portal.updateContract.useMutation({
    onSuccess: () => {
      toast.success("Contract updated successfully");
      utils.portal.allContracts.invalidate();
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      updateContract.mutate({
        id: editingId,
        ...form,
        contractStartDate: form.contractStartDate || undefined,
        contractEndDate: form.contractEndDate || undefined,
      });
    } else {
      createContract.mutate({
        ...form,
        contractStartDate: form.contractStartDate || undefined,
        contractEndDate: form.contractEndDate || undefined,
      });
    }
  };

  const startEdit = (contract: NonNullable<typeof contracts>[0]) => {
    setEditingId(contract.id);
    setForm({
      userId: contract.userId,
      clientName: contract.clientName || "",
      projectDescription: contract.projectDescription || "",
      contractStatus: contract.contractStatus as ContractStatus,
      totalHours: contract.totalHours,
      remainingHours: contract.remainingHours,
      contractStartDate: contract.contractStartDate ? new Date(contract.contractStartDate).toISOString().split("T")[0] : "",
      contractEndDate: contract.contractEndDate ? new Date(contract.contractEndDate).toISOString().split("T")[0] : "",
      notes: contract.notes || "",
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const statusColors: Record<ContractStatus, string> = {
    active: "#15803d",
    pending: "#b45309",
    completed: "#1d4ed8",
    on_hold: "#7c3aed",
    expired: "#dc2626",
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--navy-dark)" }}>Login Required</h2>
          <a href={getLoginUrl()} className="btn-navy no-underline">
            Log In <ArrowRight size={14} />
          </a>
        </div>
      </Layout>
    );
  }

  if (user?.role !== "admin") {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--navy-dark)" }}>Access Denied</h2>
          <p className="text-gray-500 mb-8">This page is only accessible to administrators.</p>
          <Link href="/portal" className="btn-outline-navy no-underline">Go to Client Portal</Link>
        </div>
      </Layout>
    );
  }

  const totalContracts = contracts?.length ?? 0;
  const activeContracts = contracts?.filter((c) => c.contractStatus === "active").length ?? 0;
  const totalHoursRemaining = contracts?.reduce((sum, c) => sum + c.remainingHours, 0) ?? 0;

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)" }} />
        <div className="container relative z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link href="/portal" className="no-underline hover:text-white transition-colors">Client Portal</Link>
            <ChevronRight size={12} />
            <span className="text-gray-300">Admin</span>
          </div>
          <div className="section-divider" />
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin Portal
          </h1>
          <p className="text-gray-400 text-sm">Manage client contracts and service hours</p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: <FileText size={20} />, label: "Total Contracts", value: totalContracts },
              { icon: <Check size={20} />, label: "Active Contracts", value: activeContracts },
              { icon: <Clock size={20} />, label: "Total Hours Remaining", value: totalHoursRemaining },
            ].map((stat) => (
              <div key={stat.label} className="p-6 border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: "var(--off-white)", color: "var(--navy)" }}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: "var(--navy-dark)" }}>{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Header + Add Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="section-divider" />
              <h2 className="text-xl font-bold" style={{ color: "var(--navy-dark)" }}>Client Contracts</h2>
            </div>
            {!showForm && (
              <button
                onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
                className="btn-navy text-sm"
              >
                <Plus size={14} />
                Add Contract
              </button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 p-6 border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm" style={{ color: "var(--navy-dark)" }}>
                  {editingId !== null ? "Edit Contract" : "New Contract"}
                </h3>
                <button type="button" onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">User *</label>
                  <select
                    required
                    value={form.userId || ""}
                    onChange={(e) => setForm({ ...form, userId: Number(e.target.value) })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]"
                  >
                    <option value="">Select a user</option>
                    {users?.map((u) => (
                      <option key={u.id} value={u.id}>{u.name || u.email || u.openId}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Client Name</label>
                  <input
                    type="text"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]"
                    placeholder="e.g. Acme Corporation"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Project Description</label>
                  <input
                    type="text"
                    value={form.projectDescription}
                    onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]"
                    placeholder="e.g. SAP AFC Implementation Phase 1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Status</label>
                  <select
                    value={form.contractStatus}
                    onChange={(e) => setForm({ ...form, contractStatus: e.target.value as ContractStatus })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Total Hours</label>
                  <input
                    type="number"
                    min={0}
                    value={form.totalHours}
                    onChange={(e) => setForm({ ...form, totalHours: Number(e.target.value) })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Remaining Hours</label>
                  <input
                    type="number"
                    min={0}
                    value={form.remainingHours}
                    onChange={(e) => setForm({ ...form, remainingHours: Number(e.target.value) })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    value={form.contractStartDate}
                    onChange={(e) => setForm({ ...form, contractStartDate: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    value={form.contractEndDate}
                    onChange={(e) => setForm({ ...form, contractEndDate: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)] resize-none"
                    placeholder="Optional internal notes"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  type="submit"
                  disabled={createContract.isPending || updateContract.isPending}
                  className="btn-navy text-sm"
                >
                  {createContract.isPending || updateContract.isPending ? "Saving..." : editingId !== null ? "Update Contract" : "Create Contract"}
                </button>
                <button type="button" onClick={cancelForm} className="btn-outline-navy text-sm">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Contracts Table */}
          {contractsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !contracts || contracts.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm border border-dashed border-gray-200">
              No contracts yet. Click "Add Contract" to create the first one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["ID", "Client / Project", "User", "Status", "Total Hrs", "Remaining", "Start", "End", "Actions"].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => {
                    const assignedUser = users?.find((u) => u.id === contract.userId);
                    return (
                      <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 text-gray-400 text-xs">#{contract.id}</td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-xs" style={{ color: "var(--navy-dark)" }}>
                            {contract.projectDescription || contract.clientName || "—"}
                          </div>
                          {contract.clientName && contract.projectDescription && (
                            <div className="text-xs text-gray-400">{contract.clientName}</div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-500">
                          {assignedUser?.name || assignedUser?.email || `User #${contract.userId}`}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className="text-xs font-semibold px-2 py-0.5"
                            style={{
                              color: statusColors[contract.contractStatus as ContractStatus] || "#666",
                              backgroundColor: `${statusColors[contract.contractStatus as ContractStatus]}18` || "#f5f5f5",
                            }}
                          >
                            {contract.contractStatus.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-gray-600">{contract.totalHours}</td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className="font-semibold text-xs"
                            style={{ color: contract.remainingHours < 10 ? "#dc2626" : "var(--navy-dark)" }}
                          >
                            {contract.remainingHours}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-500 whitespace-nowrap">
                          {contract.contractStartDate ? new Date(contract.contractStartDate).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-500 whitespace-nowrap">
                          {contract.contractEndDate ? new Date(contract.contractEndDate).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => startEdit(contract)}
                            className="p-1.5 text-gray-400 hover:text-[var(--navy)] transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Users section */}
          <div className="mt-12">
            <div className="section-divider" />
            <div className="flex items-center gap-2 mb-5">
              <Users size={16} style={{ color: "var(--navy)" }} />
              <h2 className="text-xl font-bold" style={{ color: "var(--navy-dark)" }}>Registered Users</h2>
            </div>
            {users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["ID", "Name", "Email", "Open ID"].map((h) => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 text-gray-400 text-xs">#{u.id}</td>
                        <td className="py-3 px-3 font-medium text-xs" style={{ color: "var(--navy-dark)" }}>{u.name || "—"}</td>
                        <td className="py-3 px-3 text-xs text-gray-500">{u.email || "—"}</td>
                        <td className="py-3 px-3 text-xs text-gray-400 font-mono">{u.openId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No users registered yet.</p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
