import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { usePortalSession } from "@/contexts/PortalContext";
import { usePortalT } from "@/lib/portalI18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PortalLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setSession } = usePortalSession();
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const t = usePortalT(language as "en" | "ko" | "ja");

  const loginMutation = trpc.portalV2.login.useMutation({
    onSuccess: (data) => {
      setSession(data.token, {
        id: data.user.id,
        username: data.user.username,
        companyName: data.user.companyName,
        language: data.user.language as "en" | "ko" | "ja",
        timezone: data.user.timezone,
      });
      navigate("/portal/dashboard");
    },
    onError: () => {
      setError(t.invalidCredentials);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-white tracking-widest">MAVEK BCS</div>
          <div className="text-xs text-gray-400 tracking-[0.3em] uppercase mt-1">Global Financial Consulting</div>
        </div>

        <Card className="bg-[#111827] border-gray-700/50 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-white text-xl">{t.loginTitle}</CardTitle>
            <CardDescription className="text-gray-400 text-sm">{t.loginSubtitle}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="bg-red-900/30 border-red-700 text-red-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-gray-300 text-sm">{t.username}</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="bg-[#1a2235] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#c9a84c]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-gray-300 text-sm">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-[#1a2235] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#c9a84c]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#c9a84c] hover:bg-[#b8973b] text-black font-semibold mt-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t.loading : t.signIn}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-5">
          <a
            href="/portal/admin/login"
            className="text-xs text-gray-500 hover:text-[#c9a84c] transition-colors"
          >
            {language === "ko" ? "어드민 포털로 이동 →" : language === "ja" ? "管理ポータルへ →" : "Go to Admin Portal →"}
          </a>
        </div>
        <p className="text-center text-xs text-gray-600 mt-4">
          © {new Date().getFullYear()} MAVEK BCS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
