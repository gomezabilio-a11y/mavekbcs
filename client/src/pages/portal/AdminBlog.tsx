import { useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { useAdminSession } from "@/contexts/AdminContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/RichTextEditor";
import { Plus, Pencil, Trash2, Star, Image as ImageIcon, X, Search, Settings2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Financial Close", "Planning & Budgeting", "Tax & Compliance", "Treasury",
  "Financial Supply Chain", "Billing & Revenue", "Risk & Compliance",
  "Lease Management", "Finance Transformation", "Industry Trends", "Technology", "Industry Focus",
];

interface ArticleForm {
  id?: number;
  slug: string;
  title: string; titleKo: string; titleJa: string;
  excerpt: string; excerptKo: string; excerptJa: string;
  content: string; contentKo: string; contentJa: string;
  category: string;
  tags: string;
  featured: boolean;
  readTimeMinutes: number;
  publishedAt: string;
  imageUrl: string;
  thumbnailBase64?: string;
  thumbnailMime?: string;
  thumbnailPreview?: string;
}

const emptyForm = (): ArticleForm => ({
  slug: "", title: "", titleKo: "", titleJa: "",
  excerpt: "", excerptKo: "", excerptJa: "",
  content: "", contentKo: "", contentJa: "",
  category: "Financial Close", tags: "", featured: false,
  readTimeMinutes: 5, publishedAt: new Date().toISOString().slice(0, 10),
  imageUrl: "",
});

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const fieldStyle = { backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#f0e6d3" };

export default function AdminBlog() {
  const { adminToken } = useAdminSession();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm());
  const [isEditing, setIsEditing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    bannerSlug: "",
    featured1Slug: "",
    featured2Slug: "",
    featured3Slug: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const { data: articles = [], isLoading } = trpc.blog.listInsights.useQuery();

  const { data: insightsSettings } = trpc.blog.getInsightsSettings.useQuery();

  const updateSettingsMutation = trpc.blog.updateInsightsSettings.useMutation({
    onSuccess: () => {
      utils.blog.getInsightsSettings.invalidate();
      setSettingsOpen(false);
      toast.success("Page settings saved!");
    },
    onError: (e: { message: string }) => toast.error(e.message),
  });

  const createMutation = trpc.blog.createInsight.useMutation({
    onSuccess: () => { utils.blog.listInsights.invalidate(); setDialogOpen(false); toast.success("Article created!"); },
    onError: (e: { message: string }) => toast.error(e.message),
  });
  const updateMutation = trpc.blog.updateInsight.useMutation({
    onSuccess: () => { utils.blog.listInsights.invalidate(); setDialogOpen(false); toast.success("Article updated!"); },
    onError: (e: { message: string }) => toast.error(e.message),
  });
  const deleteMutation = trpc.blog.deleteInsight.useMutation({
    onSuccess: () => { utils.blog.listInsights.invalidate(); setDeleteId(null); toast.success("Article deleted"); },
    onError: (e: { message: string }) => toast.error(e.message),
  });

  const filtered = articles.filter((a) =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()) ||
    (a.titleKo ?? "").includes(search) || (a.slug ?? "").includes(search.toLowerCase())
  );

  function openCreate() {
    setForm(emptyForm());
    setIsEditing(false);
    setDialogOpen(true);
  }

  function openEdit(a: typeof articles[0]) {
    setForm({
      id: a.id,
      slug: a.slug,
      title: a.title,
      titleKo: a.titleKo ?? "",
      titleJa: a.titleJa ?? "",
      excerpt: a.excerpt ?? "",
      excerptKo: a.excerptKo ?? "",
      excerptJa: a.excerptJa ?? "",
      content: a.content ?? "",
      contentKo: a.contentKo ?? "",
      contentJa: a.contentJa ?? "",
      category: a.category ?? "Financial Close",
      tags: Array.isArray(a.tags) ? (a.tags as string[]).join(", ") : "",
      featured: a.featured ?? false,
      readTimeMinutes: a.readTimeMinutes ?? 5,
      publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      imageUrl: a.imageUrl ?? "",
      thumbnailPreview: a.imageUrl ?? undefined,
    });
    setIsEditing(true);
    setDialogOpen(true);
  }

  function openSettings() {
    if (insightsSettings) {
      setSettingsForm({
        bannerSlug: insightsSettings.bannerSlug ?? "",
        featured1Slug: insightsSettings.featured1Slug ?? "",
        featured2Slug: insightsSettings.featured2Slug ?? "",
        featured3Slug: insightsSettings.featured3Slug ?? "",
      });
    }
    setSettingsOpen(true);
  }

  function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      setForm((f) => ({ ...f, thumbnailBase64: base64, thumbnailMime: file.type, thumbnailPreview: dataUrl }));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.slug.trim()) { toast.error("Slug is required"); return; }
    if (!form.title.trim()) { toast.error("English title is required"); return; }
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      titleKo: form.titleKo || undefined,
      titleJa: form.titleJa || undefined,
      excerpt: form.excerpt || undefined,
      excerptKo: form.excerptKo || undefined,
      excerptJa: form.excerptJa || undefined,
      content: form.content || undefined,
      contentKo: form.contentKo || undefined,
      contentJa: form.contentJa || undefined,
      category: form.category,
      tags,
      featured: form.featured,
      readTimeMinutes: form.readTimeMinutes,
      publishedAt: form.publishedAt,
      imageUrl: form.imageUrl || undefined,
      thumbnailBase64: form.thumbnailBase64,
      thumbnailMime: form.thumbnailMime,
    };
    if (isEditing && form.id) {
      updateMutation.mutate({ id: form.id, adminToken: adminToken ?? "", ...payload });
    } else {
      createMutation.mutate({ adminToken: adminToken ?? "", ...payload });
    }
  }

  function handleSettingsSave() {
    updateSettingsMutation.mutate({
      adminToken: adminToken ?? "",
      bannerSlug: settingsForm.bannerSlug || undefined,
      featured1Slug: settingsForm.featured1Slug || undefined,
      featured2Slug: settingsForm.featured2Slug || undefined,
      featured3Slug: settingsForm.featured3Slug || undefined,
    });
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  // Article slug options for settings selects
  const slugOptions = articles.map((a) => ({ value: a.slug, label: `${a.slug} — ${a.title}` }));

  return (
    <AdminLayout>
      <div className="p-6 space-y-6" style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", color: "#f0e6d3" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#f0e6d3" }}>Blog / Insights</h1>
            <p className="text-sm mt-1" style={{ color: "#8a9bb0" }}>Manage articles in EN / KO / JA</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={openSettings}
              style={{ borderColor: "rgba(255,255,255,0.15)", color: "#8a9bb0" }}
              className="gap-2"
            >
              <Settings2 size={15} /> Page Settings
            </Button>
            <Button onClick={openCreate} style={{ backgroundColor: "#b48f4b", color: "#0a0f1e" }} className="font-semibold gap-2">
              <Plus size={16} /> New Article
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#8a9bb0" }} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="pl-9"
            style={fieldStyle}
          />
        </div>

        {/* Article List */}
        {isLoading ? (
          <div className="text-center py-12" style={{ color: "#8a9bb0" }}>Loading articles...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12" style={{ color: "#8a9bb0" }}>
            {search ? "No articles match your search." : "No articles yet. Click + New Article to create one."}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <div key={a.id} className="flex items-start gap-4 p-4 rounded border" style={{ backgroundColor: "#0d1526", borderColor: "rgba(255,255,255,0.08)" }}>
                {a.imageUrl && (
                  <img src={a.imageUrl} alt="" className="w-20 h-14 object-cover rounded flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="outline" className="text-xs" style={{ borderColor: "#b48f4b", color: "#b48f4b" }}>{a.category}</Badge>
                    {a.featured && (
                      <Badge className="text-xs" style={{ backgroundColor: "#b48f4b", color: "#0a0f1e" }}>
                        <Star size={10} className="mr-1" />Featured
                      </Badge>
                    )}
                    <span className="text-xs font-mono" style={{ color: "#8a9bb0" }}>{a.slug}</span>
                  </div>
                  <p className="text-sm font-semibold truncate" style={{ color: "#f0e6d3" }}>{a.title}</p>
                  {(a.titleKo || a.titleJa) && (
                    <p className="text-xs mt-0.5" style={{ color: "#8a9bb0" }}>
                      {a.titleKo && <span className="mr-2">KO: {a.titleKo}</span>}
                      {a.titleJa && <span>JA: {a.titleJa}</span>}
                    </p>
                  )}
                  <p className="text-xs mt-1" style={{ color: "#8a9bb0" }}>
                    {a.readTimeMinutes} min · {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : "Draft"}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(a)}
                    style={{ borderColor: "rgba(255,255,255,0.15)", color: "#8a9bb0" }}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteId(a.id)}
                    style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Page Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="max-w-lg" style={{ backgroundColor: "#0d1526", borderColor: "rgba(255,255,255,0.1)", color: "#f0e6d3" }}>
            <DialogHeader>
              <DialogTitle style={{ color: "#f0e6d3" }}>
                <span className="flex items-center gap-2"><Settings2 size={18} /> Insights Page Settings</span>
              </DialogTitle>
            </DialogHeader>
            <p className="text-xs mb-4" style={{ color: "#8a9bb0" }}>
              Select which articles appear in the hero banner and featured section on the public Insights page.
            </p>

            <div className="space-y-4">
              {/* Banner */}
              <div className="space-y-1.5">
                <Label style={{ color: "#c9a84c" }}>Hero Banner Article</Label>
                <p className="text-xs" style={{ color: "#8a9bb0" }}>Displayed as a full-width hero at the top of the Insights page with thumbnail background.</p>
                <Select value={settingsForm.bannerSlug || "__none__"} onValueChange={(v) => setSettingsForm((f) => ({ ...f, bannerSlug: v === "__none__" ? "" : v }))}>
                  <SelectTrigger style={fieldStyle}><SelectValue placeholder="Select article..." /></SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#0d1526", borderColor: "rgba(255,255,255,0.1)" }}>
                    <SelectItem value="__none__" style={{ color: "#8a9bb0" }}>— None —</SelectItem>
                    {slugOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value} style={{ color: "#f0e6d3" }}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Featured 1-3 */}
              {([1, 2, 3] as const).map((n) => {
                const key = `featured${n}Slug` as "featured1Slug" | "featured2Slug" | "featured3Slug";
                return (
                  <div key={n} className="space-y-1.5">
                    <Label style={{ color: "#8a9bb0" }}>Featured Article {n}</Label>
                    <Select value={settingsForm[key] || "__none__"} onValueChange={(v) => setSettingsForm((f) => ({ ...f, [key]: v === "__none__" ? "" : v }))}>
                      <SelectTrigger style={fieldStyle}><SelectValue placeholder="Select article..." /></SelectTrigger>
                      <SelectContent style={{ backgroundColor: "#0d1526", borderColor: "rgba(255,255,255,0.1)" }}>
                        <SelectItem value="__none__" style={{ color: "#8a9bb0" }}>— None —</SelectItem>
                        {slugOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value} style={{ color: "#f0e6d3" }}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-4" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <Button variant="outline" onClick={() => setSettingsOpen(false)} style={{ borderColor: "rgba(255,255,255,0.15)", color: "#8a9bb0" }}>Cancel</Button>
              <Button
                onClick={handleSettingsSave}
                disabled={updateSettingsMutation.isPending}
                style={{ backgroundColor: "#b48f4b", color: "#0a0f1e" }}
                className="font-semibold min-w-[100px]"
              >
                {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#0d1526", borderColor: "rgba(255,255,255,0.1)", color: "#f0e6d3" }}>
            <DialogHeader>
              <DialogTitle style={{ color: "#f0e6d3" }}>{isEditing ? "Edit Article" : "New Article"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Slug + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label style={{ color: "#8a9bb0" }}>Slug <span className="text-red-400">*</span></Label>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="my-article-slug"
                    style={fieldStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label style={{ color: "#8a9bb0" }}>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                    <SelectTrigger style={fieldStyle}><SelectValue /></SelectTrigger>
                    <SelectContent style={{ backgroundColor: "#0d1526", borderColor: "rgba(255,255,255,0.1)" }}>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c} style={{ color: "#f0e6d3" }}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label style={{ color: "#8a9bb0" }}>Read Time (min)</Label>
                  <Input
                    type="number" min={1} max={120}
                    value={form.readTimeMinutes}
                    onChange={(e) => setForm((f) => ({ ...f, readTimeMinutes: parseInt(e.target.value) || 5 }))}
                    style={fieldStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label style={{ color: "#8a9bb0" }}>Published At</Label>
                  <Input
                    type="date"
                    value={form.publishedAt}
                    onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                    style={fieldStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label style={{ color: "#8a9bb0" }}>Tags (comma-separated)</Label>
                  <Input
                    value={form.tags}
                    onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                    placeholder="SAP, Finance, Cloud"
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                />
                <Label style={{ color: "#8a9bb0" }}>Mark as featured (fallback when Page Settings not configured)</Label>
              </div>

              {/* Thumbnail */}
              <div className="space-y-1.5">
                <Label style={{ color: "#8a9bb0" }}>Thumbnail Image</Label>
                <div className="flex gap-3 items-center">
                  <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} style={{ borderColor: "rgba(255,255,255,0.15)", color: "#8a9bb0" }}>
                    <ImageIcon size={14} className="mr-2" /> Choose Image
                  </Button>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value, thumbnailPreview: undefined }))}
                    placeholder="Or paste image URL..."
                    style={{ ...fieldStyle, flex: 1 }}
                  />
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
                </div>
                {(form.thumbnailPreview || form.imageUrl) && (
                  <div className="relative inline-block mt-2">
                    <img src={form.thumbnailPreview || form.imageUrl} alt="Preview" className="h-28 w-auto rounded border object-cover" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
                    <button type="button" onClick={() => setForm((f) => ({ ...f, thumbnailPreview: undefined, thumbnailBase64: undefined, thumbnailMime: undefined, imageUrl: "" }))}
                      className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center text-xs" style={{ backgroundColor: "#ef4444", color: "white" }}>
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>

              {/* Multilingual Content */}
              <Tabs defaultValue="en">
                <TabsList style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <TabsTrigger value="en" style={{ color: "#8a9bb0" }}>English</TabsTrigger>
                  <TabsTrigger value="ko" style={{ color: "#8a9bb0" }}>Korean</TabsTrigger>
                  <TabsTrigger value="ja" style={{ color: "#8a9bb0" }}>Japanese</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="space-y-4 mt-4">
                  <div className="space-y-1.5">
                    <Label style={{ color: "#8a9bb0" }}>Title (EN) <span className="text-red-400">*</span></Label>
                    <Input value={form.title} onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => ({ ...f, title: v, slug: f.slug || slugify(v) }));
                    }} placeholder="Article title in English" required style={fieldStyle} />
                  </div>
                  <div className="space-y-1.5">
                    <Label style={{ color: "#8a9bb0" }}>Excerpt (EN)</Label>
                    <Textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                      placeholder="Short summary shown in article listing..." rows={3} style={fieldStyle} />
                  </div>
                  <div className="space-y-1.5">
                    <Label style={{ color: "#8a9bb0" }}>Content (EN)</Label>
                    <RichTextEditor value={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} placeholder="Write the full article in English..." minHeight="350px" />
                  </div>
                </TabsContent>

                <TabsContent value="ko" className="space-y-4 mt-4">
                  <div className="space-y-1.5">
                    <Label style={{ color: "#8a9bb0" }}>Title (KO)</Label>
                    <Input value={form.titleKo} onChange={(e) => setForm((f) => ({ ...f, titleKo: e.target.value }))} placeholder="Korean title" style={fieldStyle} />
                  </div>
                  <div className="space-y-1.5">
                    <Label style={{ color: "#8a9bb0" }}>Excerpt (KO)</Label>
                    <Textarea value={form.excerptKo} onChange={(e) => setForm((f) => ({ ...f, excerptKo: e.target.value }))}
                      placeholder="Korean summary..." rows={3} style={fieldStyle} />
                  </div>
                  <div className="space-y-1.5">
                    <Label style={{ color: "#8a9bb0" }}>Content (KO)</Label>
                    <RichTextEditor value={form.contentKo} onChange={(html) => setForm((f) => ({ ...f, contentKo: html }))} placeholder="Write the full article in Korean..." minHeight="350px" />
                  </div>
                </TabsContent>

                <TabsContent value="ja" className="space-y-4 mt-4">
                  <div className="space-y-1.5">
                    <Label style={{ color: "#8a9bb0" }}>Title (JA)</Label>
                    <Input value={form.titleJa} onChange={(e) => setForm((f) => ({ ...f, titleJa: e.target.value }))} placeholder="Japanese title" style={fieldStyle} />
                  </div>
                  <div className="space-y-1.5">
                    <Label style={{ color: "#8a9bb0" }}>Excerpt (JA)</Label>
                    <Textarea value={form.excerptJa} onChange={(e) => setForm((f) => ({ ...f, excerptJa: e.target.value }))}
                      placeholder="Japanese summary..." rows={3} style={fieldStyle} />
                  </div>
                  <div className="space-y-1.5">
                    <Label style={{ color: "#8a9bb0" }}>Content (JA)</Label>
                    <RichTextEditor value={form.contentJa} onChange={(html) => setForm((f) => ({ ...f, contentJa: html }))} placeholder="Write the full article in Japanese..." minHeight="350px" />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} style={{ borderColor: "rgba(255,255,255,0.15)", color: "#8a9bb0" }}>Cancel</Button>
                <Button type="submit" disabled={saving} style={{ backgroundColor: "#b48f4b", color: "#0a0f1e" }} className="font-semibold min-w-[100px]">
                  {saving ? "Saving..." : isEditing ? "Update" : "Publish"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <DialogContent style={{ backgroundColor: "#0d1526", borderColor: "rgba(255,255,255,0.1)", color: "#f0e6d3" }}>
            <DialogHeader>
              <DialogTitle style={{ color: "#f0e6d3" }}>Delete Article</DialogTitle>
            </DialogHeader>
            <p style={{ color: "#8a9bb0" }}>Are you sure you want to delete this article? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setDeleteId(null)} style={{ borderColor: "rgba(255,255,255,0.15)", color: "#8a9bb0" }}>Cancel</Button>
              <Button onClick={() => deleteId && deleteMutation.mutate({ id: deleteId, adminToken: adminToken ?? "" })} disabled={deleteMutation.isPending}
                style={{ backgroundColor: "#ef4444", color: "white" }}>
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
