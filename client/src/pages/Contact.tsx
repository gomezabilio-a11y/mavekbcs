import { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Contact() {
  const { language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success(language === "ko" ? "메시지가 전송되었습니다." : language === "ja" ? "メッセージが送信されました。" : "Your message has been sent.");
    },
    onError: () => {
      toast.error(language === "ko" ? "오류가 발생했습니다. 다시 시도해 주세요." : language === "ja" ? "エラーが発生しました。もう一度お試しください。" : "An error occurred. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(language === "ko" ? "필수 항목을 입력해 주세요." : language === "ja" ? "必須項目を入力してください。" : "Please fill in all required fields.");
      return;
    }
    submitContact.mutate(form);
  };

  const t = {
    title: language === "ko" ? "문의하기" : language === "ja" ? "お問い合わせ" : "Contact Us",
    subtitle: language === "ko"
      ? "귀사의 재무 혁신 여정을 시작하기 위해 전문가와 상담하세요."
      : language === "ja"
      ? "財務変革の旅を始めるために専門家にご相談ください。"
      : "Speak with our specialists to begin your finance transformation journey.",
    name: language === "ko" ? "이름 *" : language === "ja" ? "お名前 *" : "Full Name *",
    email: language === "ko" ? "이메일 *" : language === "ja" ? "メールアドレス *" : "Email Address *",
    company: language === "ko" ? "회사명" : language === "ja" ? "会社名" : "Company",
    phone: language === "ko" ? "전화번호" : language === "ja" ? "電話番号" : "Phone Number",
    subject: language === "ko" ? "문의 주제" : language === "ja" ? "お問い合わせ件名" : "Subject",
    message: language === "ko" ? "메시지 *" : language === "ja" ? "メッセージ *" : "Message *",
    send: language === "ko" ? "메시지 보내기" : language === "ja" ? "メッセージを送る" : "Send Message",
    successTitle: language === "ko" ? "메시지가 전송되었습니다!" : language === "ja" ? "メッセージが送信されました！" : "Message Sent!",
    successText: language === "ko"
      ? "빠른 시일 내에 연락드리겠습니다."
      : language === "ja"
      ? "できるだけ早くご連絡いたします。"
      : "We will be in touch with you shortly.",
  };

  const offices = [
    {
      city: language === "ko" ? "서울" : language === "ja" ? "ソウル" : "Seoul",
      address: language === "ko" ? "서울특별시 강남구 테헤란로 152" : language === "ja" ? "ソウル特別市江南区テヘラン路152" : "152 Teheran-ro, Gangnam-gu, Seoul",
      phone: "+82 2 1234 5678",
      email: "seoul@mavekbcs.com",
    },
    {
      city: language === "ko" ? "도쿄" : language === "ja" ? "東京" : "Tokyo",
      address: language === "ko" ? "도쿄도 치요다구 마루노우치 2-4-1" : language === "ja" ? "東京都千代田区丸の内2-4-1" : "2-4-1 Marunouchi, Chiyoda-ku, Tokyo",
      phone: "+81 3 1234 5678",
      email: "tokyo@mavekbcs.com",
    },
    {
      city: language === "ko" ? "싱가포르" : language === "ja" ? "シンガポール" : "Singapore",
      address: "1 Raffles Place, #20-01, Singapore 048616",
      phone: "+65 6123 4567",
      email: "singapore@mavekbcs.com",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)" }} />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="section-divider" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.title}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">{t.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <CheckCircle size={56} className="mb-6" style={{ color: "var(--gold)" }} />
                  <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--navy-dark)" }}>{t.successTitle}</h2>
                  <p className="text-gray-500">{t.successText}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--navy-dark)" }}>{t.name}</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-[var(--navy)] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--navy-dark)" }}>{t.email}</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-[var(--navy)] transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--navy-dark)" }}>{t.company}</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-[var(--navy)] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--navy-dark)" }}>{t.phone}</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-[var(--navy)] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--navy-dark)" }}>{t.subject}</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-[var(--navy)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--navy-dark)" }}>{t.message}</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-[var(--navy)] transition-colors resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="btn-navy w-full justify-center disabled:opacity-60"
                  >
                    {submitContact.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {language === "ko" ? "전송 중..." : language === "ja" ? "送信中..." : "Sending..."}
                      </span>
                    ) : (
                      <>
                        {t.send}
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="section-divider" />
                <h3 className="text-lg font-bold mb-6" style={{ color: "var(--navy-dark)" }}>
                  {language === "ko" ? "글로벌 오피스" : language === "ja" ? "グローバルオフィス" : "Global Offices"}
                </h3>
                <div className="space-y-6">
                  {offices.map((office) => (
                    <div key={office.city} className="p-5 border border-gray-100">
                      <h4 className="font-bold text-sm mb-3" style={{ color: "var(--navy-dark)" }}>{office.city}</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-xs text-gray-500">
                          <MapPin size={12} className="mt-0.5 shrink-0" style={{ color: "var(--navy)" }} />
                          <span>{office.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone size={12} style={{ color: "var(--navy)" }} />
                          <span>{office.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail size={12} style={{ color: "var(--navy)" }} />
                          <span>{office.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
