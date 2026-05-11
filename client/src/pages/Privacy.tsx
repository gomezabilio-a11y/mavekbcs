import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Privacy() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Privacy Policy",
      updated: "Last updated: May 2026",
      sections: [
        {
          heading: "1. Information We Collect",
          body: "MAVEK BCS collects information you provide directly to us, such as when you contact us through our website, request a consultation, or access our client portal. This may include your name, email address, company name, and the content of your communications.",
        },
        {
          heading: "2. How We Use Your Information",
          body: "We use the information we collect to respond to your inquiries, provide our consulting services, manage client engagements, send you relevant updates and insights, and improve our website and services.",
        },
        {
          heading: "3. Information Sharing",
          body: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.",
        },
        {
          heading: "4. Data Security",
          body: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our client portal uses industry-standard encryption and authentication.",
        },
        {
          heading: "5. Cookies",
          body: "Our website uses cookies to enhance your browsing experience, analyze site traffic, and remember your language preferences. You may disable cookies through your browser settings, though this may affect certain functionality.",
        },
        {
          heading: "6. Your Rights",
          body: "Depending on your jurisdiction, you may have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at privacy@mavekbcs.com.",
        },
        {
          heading: "7. Contact Us",
          body: "If you have questions about this Privacy Policy, please contact us at: MAVEK BCS, privacy@mavekbcs.com",
        },
      ],
    },
    ko: {
      title: "개인정보 처리방침",
      updated: "최종 업데이트: 2026년 5월",
      sections: [
        { heading: "1. 수집하는 정보", body: "MAVEK BCS는 웹사이트를 통해 문의하거나 컨설팅을 요청하거나 클라이언트 포털에 접근할 때 직접 제공하는 정보를 수집합니다." },
        { heading: "2. 정보 이용 방법", body: "수집한 정보는 문의 응답, 컨설팅 서비스 제공, 클라이언트 계약 관리, 관련 업데이트 및 인사이트 전송, 웹사이트 및 서비스 개선에 사용됩니다." },
        { heading: "3. 정보 공유", body: "개인정보를 제3자에게 판매, 거래 또는 임대하지 않습니다." },
        { heading: "4. 데이터 보안", body: "개인정보를 무단 접근, 변경, 공개 또는 파기로부터 보호하기 위해 적절한 기술적, 조직적 조치를 시행합니다." },
        { heading: "5. 쿠키", body: "웹사이트는 브라우징 경험 향상, 사이트 트래픽 분석, 언어 기본 설정 기억을 위해 쿠키를 사용합니다." },
        { heading: "6. 귀하의 권리", body: "관할권에 따라 개인정보에 대한 접근, 수정 또는 삭제 권리가 있을 수 있습니다. privacy@mavekbcs.com으로 문의하십시오." },
        { heading: "7. 문의", body: "개인정보 처리방침에 관한 질문은 privacy@mavekbcs.com으로 연락하십시오." },
      ],
    },
    ja: {
      title: "プライバシーポリシー",
      updated: "最終更新：2026年5月",
      sections: [
        { heading: "1. 収集する情報", body: "MAVEK BCSは、ウェブサイトを通じてお問い合わせいただいた際や、コンサルティングをご依頼の際、またはクライアントポータルにアクセスする際に直接提供される情報を収集します。" },
        { heading: "2. 情報の利用方法", body: "収集した情報は、お問い合わせへの対応、コンサルティングサービスの提供、クライアント契約の管理、関連する最新情報やインサイトの送信、ウェブサイトおよびサービスの改善に使用します。" },
        { heading: "3. 情報の共有", body: "個人情報を第三者に販売、取引、または貸与することはありません。" },
        { heading: "4. データセキュリティ", body: "個人情報を不正アクセス、改ざん、開示、または破壊から保護するために、適切な技術的・組織的措置を実施しています。" },
        { heading: "5. クッキー", body: "当ウェブサイトは、ブラウジング体験の向上、サイトトラフィックの分析、言語設定の記憶のためにクッキーを使用しています。" },
        { heading: "6. お客様の権利", body: "お住まいの地域によっては、個人情報へのアクセス、修正、または削除の権利がある場合があります。privacy@mavekbcs.comまでお問い合わせください。" },
        { heading: "7. お問い合わせ", body: "プライバシーポリシーに関するご質問は、privacy@mavekbcs.comまでご連絡ください。" },
      ],
    },
  };

  const c = content[language] || content.en;

  return (
    <Layout>
      <section className="py-16" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="container">
          <div className="section-divider" />
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {c.title}
          </h1>
          <p className="text-gray-400 text-sm">{c.updated}</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container max-w-3xl mx-auto">
          {c.sections.map((section) => (
            <div key={section.heading} className="mb-10">
              <h2 className="text-lg font-bold mb-3" style={{ color: "var(--navy-dark)" }}>{section.heading}</h2>
              <p className="text-gray-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
