import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ko" | "ja";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.about": "About",
    "nav.industries": "Industries",
    "nav.solutions": "Solutions",
    "nav.insights": "Insights",
    "nav.contact": "Contact",
    "nav.careers": "Careers",
    "nav.clientPortal": "Client Portal",
    "nav.csr": "Corporate Social Responsibility",
    // Language names
    "lang.en": "English",
    "lang.ko": "한국어",
    "lang.ja": "日本語",
    // Hero
    "hero.tagline": "Global Financial Consulting",
    "hero.headline": "Transforming Finance Through Technology",
    "hero.subheadline": "We partner with the world's leading organizations to implement complex financial solutions across SAP, Oracle, and Blackline platforms.",
    "hero.cta.explore": "Explore Solutions",
    "hero.cta.contact": "Contact Us",
    // About
    "about.title": "About MAVEK BCS",
    "about.subtitle": "A Global Financial Consulting Firm",
    "about.description": "MAVEK BCS is a global financial consulting firm specializing in complex financial solutions. We partner with organizations across Asia-Pacific and beyond to implement, optimize, and transform their financial technology ecosystems.",
    "about.offices": "Our Offices",
    "about.hk": "Hong Kong",
    "about.japan": "Japan",
    "about.korea": "Korea",
    "about.philippines": "Philippines",
    // Industries
    "industries.title": "Industries We Serve",
    "industries.subtitle": "Deep expertise across 12 major sectors",
    // Solutions
    "solutions.title": "Our Solutions",
    "solutions.subtitle": "Specialized financial technology implementations",
    "solutions.learnMore": "Learn More",
    "solutions.keyFeatures": "Key Features",
    "solutions.benefits": "Business Benefits",
    "solutions.watchVideo": "Watch Introduction",
    // Insights
    "insights.title": "Insights",
    "insights.subtitle": "Thought leadership from our financial technology experts",
    "insights.readMore": "Read Article",
    "insights.readTime": "min read",
    "insights.allCategories": "All Categories",
    "insights.relatedIndustries": "Related Industries",
    "insights.relatedSolutions": "Related Solutions",
    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "Get in touch with our team",
    "contact.name": "Full Name",
    "contact.email": "Email Address",
    "contact.company": "Company",
    "contact.message": "Message",
    "contact.submit": "Send Message",
    "contact.success": "Thank you. We will be in touch shortly.",
    // Careers
    "careers.title": "Careers",
    "careers.subtitle": "Join the MAVEK BCS team",
    "careers.description": "We are always looking for talented professionals to join our growing team across our offices in Hong Kong, Japan, Korea, and the Philippines.",
    // Client Portal
    "portal.title": "Client Portal",
    "portal.subtitle": "Access your project dashboard",
    "portal.login": "Sign In",
    "portal.remainingHours": "Remaining Service Hours",
    "portal.contractStatus": "Contract Status",
    "portal.totalHours": "Total Contracted Hours",
    "portal.projectDescription": "Project Description",
    "portal.contractPeriod": "Contract Period",
    "portal.status.active": "Active",
    "portal.status.pending": "Pending",
    "portal.status.completed": "Completed",
    "portal.status.on_hold": "On Hold",
    "portal.status.expired": "Expired",
    // Footer
    "footer.tagline": "Global Financial Consulting Firm",
    "footer.copyright": "© 2024 MAVEK BCS. All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    // CSR
    "csr.title": "Corporate Social Responsibility",
    "csr.subtitle": "Our commitment to society and the environment",
  },
  ko: {
    "nav.about": "회사 소개",
    "nav.industries": "산업",
    "nav.solutions": "솔루션",
    "nav.insights": "인사이트",
    "nav.contact": "문의",
    "nav.careers": "채용",
    "nav.clientPortal": "고객 포털",
    "nav.csr": "기업 사회적 책임",
    "lang.en": "English",
    "lang.ko": "한국어",
    "lang.ja": "日本語",
    "hero.tagline": "글로벌 금융 컨설팅",
    "hero.headline": "기술을 통한 금융 혁신",
    "hero.subheadline": "SAP, Oracle, Blackline 플랫폼 전반에 걸쳐 복잡한 금융 솔루션을 구현하기 위해 세계 최고의 기업들과 협력합니다.",
    "hero.cta.explore": "솔루션 탐색",
    "hero.cta.contact": "문의하기",
    "about.title": "MAVEK BCS 소개",
    "about.subtitle": "글로벌 금융 컨설팅 기업",
    "about.description": "MAVEK BCS는 복잡한 금융 솔루션을 전문으로 하는 글로벌 금융 컨설팅 기업입니다. 아시아 태평양 및 그 너머의 조직들과 협력하여 금융 기술 생태계를 구현, 최적화 및 혁신합니다.",
    "about.offices": "사무소",
    "about.hk": "홍콩",
    "about.japan": "일본",
    "about.korea": "한국",
    "about.philippines": "필리핀",
    "industries.title": "서비스 산업",
    "industries.subtitle": "12개 주요 산업 분야의 깊은 전문성",
    "solutions.title": "솔루션",
    "solutions.subtitle": "전문 금융 기술 구현",
    "solutions.learnMore": "자세히 보기",
    "solutions.keyFeatures": "주요 기능",
    "solutions.benefits": "비즈니스 혜택",
    "solutions.watchVideo": "소개 영상 보기",
    "insights.title": "인사이트",
    "insights.subtitle": "금융 기술 전문가의 사고 리더십",
    "insights.readMore": "기사 읽기",
    "insights.readTime": "분 읽기",
    "insights.allCategories": "전체 카테고리",
    "insights.relatedIndustries": "관련 산업",
    "insights.relatedSolutions": "관련 솔루션",
    "contact.title": "문의하기",
    "contact.subtitle": "저희 팀에 연락하세요",
    "contact.name": "성명",
    "contact.email": "이메일 주소",
    "contact.company": "회사명",
    "contact.message": "메시지",
    "contact.submit": "메시지 보내기",
    "contact.success": "감사합니다. 곧 연락드리겠습니다.",
    "careers.title": "채용",
    "careers.subtitle": "MAVEK BCS 팀에 합류하세요",
    "careers.description": "홍콩, 일본, 한국, 필리핀 사무소에서 성장하는 팀에 합류할 유능한 전문가를 항상 찾고 있습니다.",
    "portal.title": "고객 포털",
    "portal.subtitle": "프로젝트 대시보드에 액세스",
    "portal.login": "로그인",
    "portal.remainingHours": "잔여 서비스 시간",
    "portal.contractStatus": "계약 상태",
    "portal.totalHours": "총 계약 시간",
    "portal.projectDescription": "프로젝트 설명",
    "portal.contractPeriod": "계약 기간",
    "portal.status.active": "활성",
    "portal.status.pending": "대기 중",
    "portal.status.completed": "완료",
    "portal.status.on_hold": "보류",
    "portal.status.expired": "만료",
    "footer.tagline": "글로벌 금융 컨설팅 기업",
    "footer.copyright": "© 2024 MAVEK BCS. 모든 권리 보유.",
    "footer.privacy": "개인정보 처리방침",
    "footer.terms": "서비스 약관",
    "csr.title": "기업 사회적 책임",
    "csr.subtitle": "사회와 환경에 대한 우리의 약속",
  },
  ja: {
    "nav.about": "会社概要",
    "nav.industries": "業界",
    "nav.solutions": "ソリューション",
    "nav.insights": "インサイト",
    "nav.contact": "お問い合わせ",
    "nav.careers": "採用情報",
    "nav.clientPortal": "クライアントポータル",
    "nav.csr": "企業の社会的責任",
    "lang.en": "English",
    "lang.ko": "한국어",
    "lang.ja": "日本語",
    "hero.tagline": "グローバル金融コンサルティング",
    "hero.headline": "テクノロジーで金融を変革する",
    "hero.subheadline": "SAP、Oracle、Blacklineプラットフォーム全体にわたる複雑な金融ソリューションを実装するために、世界有数の組織と連携しています。",
    "hero.cta.explore": "ソリューションを探る",
    "hero.cta.contact": "お問い合わせ",
    "about.title": "MAVEK BCSについて",
    "about.subtitle": "グローバル金融コンサルティング会社",
    "about.description": "MAVEK BCSは、複雑な金融ソリューションを専門とするグローバル金融コンサルティング会社です。アジア太平洋地域およびそれ以外の組織と協力して、金融テクノロジーエコシステムの実装、最適化、変革を行います。",
    "about.offices": "オフィス",
    "about.hk": "香港",
    "about.japan": "日本",
    "about.korea": "韓国",
    "about.philippines": "フィリピン",
    "industries.title": "対応業界",
    "industries.subtitle": "12の主要セクターにわたる深い専門知識",
    "solutions.title": "ソリューション",
    "solutions.subtitle": "専門的な金融テクノロジーの実装",
    "solutions.learnMore": "詳細を見る",
    "solutions.keyFeatures": "主な機能",
    "solutions.benefits": "ビジネス上のメリット",
    "solutions.watchVideo": "紹介動画を見る",
    "insights.title": "インサイト",
    "insights.subtitle": "金融テクノロジーの専門家によるソートリーダーシップ",
    "insights.readMore": "記事を読む",
    "insights.readTime": "分で読める",
    "insights.allCategories": "すべてのカテゴリ",
    "insights.relatedIndustries": "関連業界",
    "insights.relatedSolutions": "関連ソリューション",
    "contact.title": "お問い合わせ",
    "contact.subtitle": "チームにご連絡ください",
    "contact.name": "氏名",
    "contact.email": "メールアドレス",
    "contact.company": "会社名",
    "contact.message": "メッセージ",
    "contact.submit": "メッセージを送る",
    "contact.success": "ありがとうございます。まもなくご連絡いたします。",
    "careers.title": "採用情報",
    "careers.subtitle": "MAVEK BCSチームに参加しませんか",
    "careers.description": "香港、日本、韓国、フィリピンのオフィスで、成長するチームに参加する優秀な専門家を常に求めています。",
    "portal.title": "クライアントポータル",
    "portal.subtitle": "プロジェクトダッシュボードにアクセス",
    "portal.login": "サインイン",
    "portal.remainingHours": "残りサービス時間",
    "portal.contractStatus": "契約ステータス",
    "portal.totalHours": "契約総時間",
    "portal.projectDescription": "プロジェクト説明",
    "portal.contractPeriod": "契約期間",
    "portal.status.active": "アクティブ",
    "portal.status.pending": "保留中",
    "portal.status.completed": "完了",
    "portal.status.on_hold": "一時停止",
    "portal.status.expired": "期限切れ",
    "footer.tagline": "グローバル金融コンサルティング会社",
    "footer.copyright": "© 2024 MAVEK BCS. 無断転載禁止。",
    "footer.privacy": "プライバシーポリシー",
    "footer.terms": "利用規約",
    "csr.title": "企業の社会的責任",
    "csr.subtitle": "社会と環境への私たちのコミットメント",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("mavek-lang");
    if (stored === "ko" || stored === "ja" || stored === "en") return stored;
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("mavek-lang", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
