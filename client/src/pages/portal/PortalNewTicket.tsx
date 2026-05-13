import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { usePortalSession } from "@/contexts/PortalContext";
import { usePortalT } from "@/lib/portalI18n";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "./PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, CheckCircle2, Loader2 } from "lucide-react";

export default function PortalNewTicket() {
  const { portalToken } = usePortalSession();
  const { language } = useLanguage();
  const t = usePortalT(language as "en" | "ko" | "ja");
  const [, navigate] = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitMutation = trpc.portalV2.submitTicket.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => navigate("/portal/tickets"), 2000);
    },
  });

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalToken) return;

    let screenshotBase64: string | undefined;
    let screenshotMime: string | undefined;

    if (screenshot && screenshotPreview) {
      screenshotBase64 = screenshotPreview;
      screenshotMime = screenshot.type;
    }

    submitMutation.mutate({
      portalToken,
      title,
      description,
      screenshotBase64,
      screenshotMime,
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

              {/* Drag & drop upload */}
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-sm">{t.screenshot} (optional)</Label>
                {screenshotPreview ? (
                  <div className="relative">
                    <img
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      className="w-full max-h-48 object-contain rounded-lg border border-gray-600 bg-[#1a2235]"
                    />
                    <button
                      type="button"
                      onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                      className="absolute top-2 right-2 bg-black/60 rounded-full p-0.5 text-gray-300 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
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
                    <p className="text-xs text-gray-600 mt-1">PNG, JPG, GIF, WebP</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
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
