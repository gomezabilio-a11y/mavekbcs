import { useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
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
import { Plus, Pencil, Trash2, Star, StarOff, Image as ImageIcon, X, Search } from "lucide-react";
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

export default function AdminBlog() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm());
  const [isEditing, setIsEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const { data: articles = [], isLoading } = trpc.blog.listInsights.useQuery();

  const createMutation = trpc.blog.createInsight.useMutation({
    onSuccess: () => { utils.blog.listInsights.invalidate(); setDialogOpen(false); toast.success("Article created!"); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.blog.updateInsight.useMutation({
    onSuccess: () => { utils.blog.listInsights.invalidate(); setDialogOpen(false); toast.success("Article updated!"); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.blog.deleteInsight.useMutation({
    onSuccess: () => { utils.blog.listInsights.invalidate(); setDeleteId(null); toast.success("Article deleted"); },
    onError: (e) => toast.error(e.message),
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

  function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const [header, base64] = dataUrl.split(",");
      const mime = header.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
      setForm((f) => ({ ...f, thumbnailBase64: base64, thumbnailMime: mime, thumbnailPreview: dataUrl }));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      slug: form.slug,
      title: form.title,
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
      updateMutation.mutate({ ...payload, id: form.id });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const fieldStyle = {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.1)",
    color: "#f0e6d3",
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#f0e6d3", fontFamily: "'Playfair Display', serif" }}>Blog Articles</h1>
            <p className="text-sm mt-1" style={{ color: "#8a9bb0" }}>{articles.length} articles · EN / KO / JA</p>
          </div>
          <Button onClick={openCreate} style={{ backgroundColor: "#b48f4b", color: "#0a0f1e" }} className="gap-2 font-semibold">
            <Plus size={16} /> New Article
          </Button>
        </div>

        <div className="relative mb-5">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4a5568" }} />
          <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" style={fieldStyle} />
        </div>

        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#8a9bb0" }}>Thumbnail</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#8a9bb0" }}>Title (EN)</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#8a9bb0" }}>Category</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#8a9bb0" }}>Published</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#8a9bb0" }}>Featured</th>
                <th className="text-right px-4 py-3 font-medium" style={{ color: "#8a9bb0" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-12" style={{ color: "#4a5568" }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12" style={{ color: "#4a5568" }}>No articles yet. Click "New Article" to create one.</td></tr>
              ) : filtered.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    {a.imageUrl ? (
                      <img src={a.imageUrl} alt="" className="w-14 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-14 h-10 rounded flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                        <ImageIcon size={14} style={{ color: "#4a5568" }} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium truncate max-w-xs" style={{ color: "#f0e6d3" }}>{a.title}</div>
                    <div className="text-xs mt-0.5 truncate max-w-xs" style={{ color: "#4a5568" }}>{a.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs" style={{ borderColor: "rgba(180,143,75,0.4)", color: "#b48f4b" }}>{a.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#8a9bb0" }}>
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {a.featured ? <Star size={14} style={{ color: "#b48f4b" }} /> : <StarOff size={14} style={{ color: "#4a5568" }} />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded hover:bg-white/10 transition-colors" style={{ color: "#8a9bb0" }}><Pencil size={14} /></button>
                      <button onClick={() => setDeleteId(a.id)} className="p-1.5 rounded hover:bg-red-500/10 transition-colors" style={{ color: "#ef4444" }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto" style={{ backgroundColor: "#0d1526", borderColor: "rgba(255,255,255,0.1)", color: "#f0e6d3" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#f0e6d3", fontFamily: "'Playfair Display', serif" }}>
              {isEditing ? "Edit Article" : "New Article"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label style={{ color: "#8a9bb0" }}>Slug <span className="text-red-400">*</span></Label>
                <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="my-article-slug" required style={fieldStyle} />
              </div>
              <div className="space-y-1.5">
                <Label style={{ color: "#8a9bb0" }}>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger style={fieldStyle}><SelectValue /></SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#0d1526", borderColor: "rgba(255,255,255,0.1)" }}>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c} style={{ color: "#f0e6d3" }}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label style={{ color: "#8a9bb0" }}>Published Date</Label>
                <Input type="date" value={form.publishedAt} onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))} style={fieldStyle} />
              </div>
              <div className="space-y-1.5">
                <Label style={{ color: "#8a9bb0" }}>Read Time (min)</Label>
                <Input type="number" min={1} max={120} value={form.readTimeMinutes} onChange={(e) => setForm((f) => ({ ...f, readTimeMinutes: parseInt(e.target.value) || 5 }))} style={fieldStyle} />
              </div>
              <div className="space-y-1.5">
                <Label style={{ color: "#8a9bb0" }}>Tags (comma separated)</Label>
                <Input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="SAP, Finance, ERP" style={fieldStyle} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
              <Label style={{ color: "#8a9bb0" }}>Featured article (shown at top of Insights page)</Label>
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#8a9bb0" }}>Thumbnail Image</Label>
              <div className="flex items-start gap-4">
                {form.thumbnailPreview ? (
                  <div className="relative">
                    <img src={form.thumbnailPreview} alt="thumbnail" className="w-32 h-20 object-cover rounded-lg border" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
                    <button type="button" onClick={() => setForm((f) => ({ ...f, thumbnailPreview: undefined, thumbnailBase64: undefined, thumbnailMime: undefined, imageUrl: "" }))}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#ef4444" }}>
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-20 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-[#b48f4b]/50 transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.15)" }} onClick={() => fileRef.current?.click()}>
                    <ImageIcon size={20} style={{ color: "#4a5568" }} />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} style={{ borderColor: "rgba(255,255,255,0.15)", color: "#8a9bb0" }}>
                    <ImageIcon size={14} className="mr-2" /> Upload Image
                  </Button>
                  <p className="text-xs" style={{ color: "#4a5568" }}>Or paste an external URL:</p>
                  <Input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value, thumbnailPreview: e.target.value || undefined }))}
                    placeholder="https://..." style={fieldStyle} />
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
            </div>

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
                    const title = e.target.value;
                    setForm((f) => ({ ...f, title, slug: f.slug || slugify(title) }));
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
              <Button type="submit" disabled={isSaving} style={{ backgroundColor: "#b48f4b", color: "#0a0f1e" }} className="font-semibold min-w-[100px]">
                {isSaving ? "Saving..." : isEditing ? "Update" : "Publish"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent style={{ backgroundColor: "#0d1526", borderColor: "rgba(255,255,255,0.1)", color: "#f0e6d3" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#f0e6d3" }}>Delete Article</DialogTitle>
          </DialogHeader>
          <p style={{ color: "#8a9bb0" }}>Are you sure you want to delete this article? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)} style={{ borderColor: "rgba(255,255,255,0.15)", color: "#8a9bb0" }}>Cancel</Button>
            <Button onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })} disabled={deleteMutation.isPending}
              style={{ backgroundColor: "#ef4444", color: "white" }}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
