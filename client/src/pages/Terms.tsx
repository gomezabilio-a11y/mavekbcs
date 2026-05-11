import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Terms() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Terms of Use",
      updated: "Last updated: May 2026",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          body: "By accessing and using the MAVEK BCS website, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this website.",
        },
        {
          heading: "2. Use of Website",
          body: "This website is provided for informational purposes about MAVEK BCS and its services. You may use this website for lawful purposes only. You agree not to use this site in any way that could damage, disable, or impair the website or interfere with any other party's use of the website.",
        },
        {
          heading: "3. Intellectual Property",
          body: "All content on this website, including text, graphics, logos, and images, is the property of MAVEK BCS and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.",
        },
        {
          heading: "4. Client Portal",
          body: "Access to the Client Portal is restricted to authorized clients of MAVEK BCS. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.",
        },
        {
          heading: "5. Disclaimer of Warranties",
          body: "This website is provided 'as is' without any representations or warranties, express or implied. MAVEK BCS makes no representations or warranties in relation to this website or the information and materials provided on this website.",
        },
        {
          heading: "6. Limitation of Liability",
          body: "MAVEK BCS will not be liable to you for any loss or damage arising out of or in connection with your use of this website.",
        },
        {
          heading: "7. Changes to Terms",
          body: "We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website constitutes acceptance of the modified terms.",
        },
        {
          heading: "8. Contact",
          body: "For questions about these Terms of Use, please contact us at legal@mavekbcs.com.",
        },
      ],
    },
    ko: {
      title: "이용약관",
      updated: "최종 업데이트: 2026년 5월",
      sections: [
        { heading: "1. 약관 동의", body: "MAVEK BCS 웹사이트에 접근하고 사용함으로써 본 이용약관에 동의하는 것으로 간주됩니다." },
        { heading: "2. 웹사이트 이용", body: "본 웹사이트는 MAVEK BCS 및 그 서비스에 관한 정보 제공을 목적으로 합니다. 합법적인 목적으로만 사용하십시오." },
        { heading: "3. 지적재산권", body: "본 웹사이트의 모든 콘텐츠는 MAVEK BCS의 재산이며 관련 지적재산권법에 의해 보호됩니다." },
        { heading: "4. 클라이언트 포털", body: "클라이언트 포털 접근은 MAVEK BCS의 승인된 클라이언트에게만 허용됩니다." },
        { heading: "5. 보증 면책", body: "본 웹사이트는 명시적 또는 묵시적 보증 없이 '있는 그대로' 제공됩니다." },
        { heading: "6. 책임 제한", body: "MAVEK BCS는 본 웹사이트 이용으로 인한 손실 또는 손해에 대해 책임을 지지 않습니다." },
        { heading: "7. 약관 변경", body: "당사는 언제든지 이용약관을 수정할 권리를 보유합니다." },
        { heading: "8. 문의", body: "이용약관에 관한 질문은 legal@mavekbcs.com으로 연락하십시오." },
      ],
    },
    ja: {
      title: "利用規約",
      updated: "最終更新：2026年5月",
      sections: [
        { heading: "1. 規約への同意", body: "MAVEK BCSウェブサイトにアクセスし使用することにより、本利用規約に同意したものとみなされます。" },
        { heading: "2. ウェブサイトの利用", body: "本ウェブサイトはMAVEK BCSおよびそのサービスに関する情報提供を目的としています。合法的な目的のみにご利用ください。" },
        { heading: "3. 知的財産権", body: "本ウェブサイトのすべてのコンテンツはMAVEK BCSの財産であり、関連する知的財産権法により保護されています。" },
        { heading: "4. クライアントポータル", body: "クライアントポータルへのアクセスはMAVEK BCSの承認されたクライアントのみに制限されています。" },
        { heading: "5. 保証の免責", body: "本ウェブサイトは明示または黙示の保証なしに「現状のまま」提供されます。" },
        { heading: "6. 責任の制限", body: "MAVEK BCSは、本ウェブサイトの利用に起因する損失または損害について責任を負いません。" },
        { heading: "7. 規約の変更", body: "当社はいつでも本利用規約を変更する権利を留保します。" },
        { heading: "8. お問い合わせ", body: "利用規約に関するご質問は、legal@mavekbcs.comまでご連絡ください。" },
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
