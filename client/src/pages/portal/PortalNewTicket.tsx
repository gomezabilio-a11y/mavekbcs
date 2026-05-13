import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { usePortalSession } from "@/contexts/PortalContext";
import { usePortalT } from "@/lib/portalI18n";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "./PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, Loader2, CheckCircle2, ImagePlus } from "lucide-react";

interface ScreenshotFile {
  preview: string;
  base64: string;
  mime: string;
  name: string;
}

const MAX_SCREENSHOTS = 5;
const MAX_SIZE_MB = 5;

export default function PortalNewTicket() {
  const { portalToken } = usePortalSession();
  const { language } = useLanguage();
  const t = usePortalT(language as "en" | "ko" | "ja");
  const [, navigate] = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [screenshots, setScreenshots] = useState<ScreenshotFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitMutation = trpc.portalV2.submitTicket.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => navigate("/portal/tickets"), 2000);
    },
  });

  const processFile = (file: File): Promise<ScreenshotFile | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) { resolve(null); return; }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64 = dataUrl.replace(/^data:[^;]+;base64,/, "");
        resolve({ preview: dataUrl, base64, mime: file.type, name: file.name });
      };
      reader.readAsDataURL(file);
    });
  };

  const addFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    const remaining = MAX_SCREENSHOTS - screenshots.length;
    if (remaining <= 0) return;
    const results = await Promise.all(fileArr.slice(0, remaining).map(processFile));
    const valid = results.filter((r): r is ScreenshotFile => r !== null);
    setScreenshots((prev) => [...prev, ...valid]);
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    await addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalToken) return;
    submitMutation.mutate({
      portalToken,
      title,
      description,
      screenshots: screenshots.length > 0
        ? screenshots.map((s) => ({ base64: s.base64, mime: s.mime }))
        : undefined,
    });
  };

  if (success) {
    return (
      <PortalLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <CheckCircle2 size={48} className="text-green-400 mx-auto mb-3" />
            <p className="text-white text-lg font-medium">{t.ticketSubmitted}</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const canAddMore = screenshots.length < MAX_SCREENSHOTS;

  return (
    <PortalLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">{t.newTicket}</h1>
        <Card className="bg-[#111827] border-gray-700/40">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitMutation.isError && (
                <Alert className="bg-red-900/30 border-red-700 text-red-300">
                  <AlertDescription>{submitMutation.error?.message}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label className="text-gray-300 text-sm">{t.subject}</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={512}
                  className="bg-[#1a2235] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#c9a84c]"
                  placeholder={t.subject}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300 text-sm">{t.description}</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  className="bg-[#1a2235] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#c9a84c] resize-none"
                  placeholder={t.description}
                />
              </div>

              {/* Multi-screenshot upload */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">
                  {t.screenshot} (optional) — {screenshots.length}/{MAX_SCREENSHOTS}
                </Label>

                {/* Preview grid */}
                {screenshots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {screenshots.map((s, i) => (
                      <div
                        key={i}
                        className="relative group rounded-lg overflow-hidden border border-gray-600 bg-[#1a2235] aspect-video"
                      >
                        <img
                          src={s.preview}
                          alt={s.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeScreenshot(i)}
                          className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 text-gray-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {canAddMore && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 hover:border-gray-500 bg-[#1a2235] aspect-video text-gray-500 hover:text-gray-400 transition-colors"
                      >
                        <ImagePlus size={20} />
                        <span className="text-xs mt-1">Add more</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Drop zone (shown when no screenshots yet) */}
                {screenshots.length === 0 && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? "border-[#c9a84c] bg-[#c9a84c]/5"
                        : "border-gray-600 hover:border-gray-500 bg-[#1a2235]"
                    }`}
                  >
                    <Upload size={24} className="mx-auto mb-2 text-gray-500" />
                    <p className="text-sm text-gray-400">{t.dragDropHint}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      PNG, JPG, GIF, WebP · Up to {MAX_SCREENSHOTS} files · {MAX_SIZE_MB}MB each
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="bg-[#c9a84c] hover:bg-[#b8973b] text-black font-semibold"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? (
                    <><Loader2 size={14} className="animate-spin mr-1.5" />{t.submitting}</>
                  ) : t.submitTicket}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onClick={() => navigate("/portal/tickets")}
                >
                  {t.cancel}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
