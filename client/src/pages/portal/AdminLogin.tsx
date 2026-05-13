import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAdminSession } from "@/contexts/AdminContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const labels = {
  en: {
    title: "Admin Portal",
    subtitle: "MAVEK BCS Staff Login",
    username: "Username",
    password: "Password",
    login: "Sign In",
    loggingIn: "Signing in...",
    error: "Invalid username or password",
  },
  ko: {
    title: "관리자 포털",
    subtitle: "MAVEK BCS 직원 로그인",
    username: "아이디",
    password: "비밀번호",
    login: "로그인",
    loggingIn: "로그인 중...",
    error: "아이디 또는 비밀번호가 올바르지 않습니다",
  },
  ja: {
    title: "管理者ポータル",
    subtitle: "MAVEK BCS スタッフログイン",
    username: "ユーザー名",
    password: "パスワード",
    login: "サインイン",
    loggingIn: "サインイン中...",
    error: "ユーザー名またはパスワードが正しくありません",
  },
};

export default function AdminLogin() {
  const { language } = useLanguage();
  const lang = (language as keyof typeof labels) in labels ? (language as keyof typeof labels) : "en";
  const t = labels[lang];
  const [, navigate] = useLocation();
  const { setAdminSession } = useAdminSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.adminPortal.login.useMutation({
    onSuccess: (data) => {
      setAdminSession(data.token, data.user);
      navigate("/portal/admin/customers");
    },
    onError: () => {
      toast.error(t.error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    loginMutation.mutate({ username: username.trim(), password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#0a0f1e" }}
    >
      <div className="w-full max-w-sm px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ backgroundColor: "rgba(180,143,75,0.15)", border: "1px solid rgba(180,143,75,0.3)" }}
          >
            <Shield size={24} style={{ color: "#b48f4b" }} />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: "#f0e6d3" }}
          >
            {t.title}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8a9bb0" }}>
            {t.subtitle}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: "#8a9bb0" }}>
              {t.username}
            </Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="bg-transparent border-white/10 text-white placeholder:text-white/20 focus:border-[#b48f4b]/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: "#8a9bb0" }}>
              {t.password}
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="bg-transparent border-white/10 text-white placeholder:text-white/20 focus:border-[#b48f4b]/50 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full font-semibold mt-2"
            disabled={loginMutation.isPending}
            style={{ backgroundColor: "#b48f4b", color: "#0a0f1e" }}
          >
            {loginMutation.isPending ? t.loggingIn : t.login}
          </Button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: "#4a5568" }}>
          MAVEK BCS — Staff Access Only
        </p>
      </div>
    </div>
  );
}
