import { Link } from "wouter";
import { ArrowRight, ChevronRight, Play } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOLUTION_CATEGORIES, INSIGHTS } from "@/lib/siteData";

interface SolutionDetailProps {
  params: { category: string; slug: string };
}

const solutionDetails: Record<string, {
  overview: string; overviewKo: string; overviewJa: string;
  keyFeatures: string[]; keyFeaturesKo: string[]; keyFeaturesJa: string[];
  benefits: string[]; benefitsKo: string[]; benefitsJa: string[];
}> = {
  "sap-afc": {
    overview: "SAP AFC is a specialized cloud-based solution designed to orchestrate the complex \"Record-to-Report\" (R2R) process across a global corporate structure. It acts as a digital command center, allowing group controllers to plan, execute, and monitor closing tasks for hundreds of legal entities in real-time. By automating repetitive closing activities, it significantly reduces the time-to-market for financial statements.",
    overviewKo: "SAP 고급 재무 결산(AFC)은 재무 결산 프로세스를 자동화하고 가속화하는 지능형 솔루션입니다. 중앙화된 작업 관리, 자동화된 조정 및 전체 조직의 결산 상태에 대한 실시간 가시성을 제공합니다.",
    overviewJa: "SAP アドバンスト財務決算(AFC)は、財務決算プロセスを自動化・加速するインテリジェントなソリューションです。一元化されたタスク管理、自動化された照合、組織全体の決算状況のリアルタイム可視性を提供します。",
    keyFeatures: ["Centralized Task Orchestration: Standardization of closing procedures across diverse global subsidiaries within a single dashboard", "Advanced Automation: Automated execution of job chains and background processing to minimize manual intervention", "Real-time Closing Status: Immediate visibility into the closing progress of every entity, highlighting bottlenecks before they delay the group report", "Governance & Audit Readiness: Full traceability of all closing activities with a time-stamped audit trail for internal and external auditors"],
    keyFeaturesKo: ["중앙화된 결산 작업 관리", "자동화된 조정 워크플로우", "실시간 결산 상태 대시보드", "SAP S/4HANA 및 비SAP 시스템과의 통합", "결산 관리자를 위한 모바일 접근", "감사 추적 및 규정 준수 문서화"],
    keyFeaturesJa: ["一元化された決算タスク管理", "自動化された照合ワークフロー", "リアルタイム決算状況ダッシュボード", "SAP S/4HANAと非SAPシステムとの統合", "決算マネージャー向けモバイルアクセス", "監査証跡とコンプライアンス文書化"],
    benefits: ["Reduce close cycle by up to 30%", "Eliminate manual task tracking spreadsheets", "Improve close quality and reduce errors", "Provide real-time visibility to CFO and controllers"],
    benefitsKo: ["결산 주기를 최대 30% 단축", "수동 작업 추적 스프레드시트 제거", "결산 품질 향상 및 오류 감소", "CFO 및 컨트롤러에게 실시간 가시성 제공"],
    benefitsJa: ["決算サイクルを最大30%短縮", "手動タスク追跡スプレッドシートの排除", "決算品質の向上とエラーの削減", "CFOとコントローラーへのリアルタイム可視性の提供"],
  },
  "sap-group-reporting": {
    overview: "As the next-generation consolidation engine for SAP S/4HANA, Group Reporting bridges the gap between local accounting and group-level financial statements. It eliminates the traditional \"wait-and-consolidate\" approach by allowing for continuous consolidation, meaning the group's financial health can be viewed at any point during the month.",
    overviewKo: "SAP 그룹 보고는 복잡한 기업 구조 전반에 걸쳐 실시간 재무 통합 및 보고를 가능하게 합니다. SAP S/4HANA와 직접 통합되는 현대적이고 클라우드 지원 솔루션으로 레거시 통합 도구를 대체합니다.",
    overviewJa: "SAP グループレポーティングは、複雑な企業構造全体でリアルタイムの財務連結とレポーティングを可能にします。SAP S/4HANAと直接統合する最新のクラウド対応ソリューションでレガシー連結ツールを置き換えます。",
    keyFeatures: ["Continuous Consolidation: Real-time data integration between local ledgers and the group's consolidated view", "Automated Intercompany Reconciliation: Instant matching and elimination of intercompany transactions to ensure data integrity", "Multi-Standard Reporting: Simultaneous generation of reports for both local GAAPs and global standards (IFRS/US GAAP)", "Unified Data Model: A \"Single Source of Truth\" that eliminates the need for data replication or manual extracts"],
    keyFeaturesKo: ["실시간 통합 엔진", "다중 GAAP 보고 지원", "내부 거래 제거 자동화", "통화 환산 및 재평가", "소유권 관리", "규제 보고 패키지"],
    keyFeaturesJa: ["リアルタイム連結エンジン", "マルチGAAP報告サポート", "内部取引消去の自動化", "通貨換算と再評価", "所有権管理", "規制報告パッケージ"],
    benefits: ["Accelerate group close by up to 40%", "Single source of truth for group financials", "Reduce manual consolidation adjustments", "Support IFRS and local GAAP simultaneously"],
    benefitsKo: ["그룹 결산을 최대 40% 가속화", "그룹 재무에 대한 단일 진실의 원천", "수동 통합 조정 감소", "IFRS 및 현지 GAAP 동시 지원"],
    benefitsJa: ["グループ決算を最大40%加速", "グループ財務の単一の真実の源泉", "手動連結調整の削減", "IFRSとローカルGAAPの同時サポート"],
  },
  "oracle-fccs": {
    overview: "Oracle FCCS is a comprehensive cloud solution built to handle the rigorous demands of global financial consolidation. It is highly configurable, making it the preferred choice for MNCs with diverse business units and complex ownership structures. It provides a structured workflow that ensures financial transparency from local entities up to the C-suite.",
    overviewKo: "Oracle 재무 통합 및 결산 클라우드 서비스(FCCS)는 복잡한 다중 법인, 다중 통화 통합 요구 사항을 가진 조직을 위한 강력한 클라우드 기반 플랫폼을 제공합니다.",
    overviewJa: "Oracle 財務連結・決算クラウドサービス(FCCS)は、複雑なマルチエンティティ、マルチ通貨の連結要件を持つ組織向けの強力なクラウドベースプラットフォームを提供します。",
    keyFeatures: ["Complex Ownership Management: Automated handling of minority interests, equity methods, and complex acquisition accounting", "Pre-built Best Practices: Out-of-the-box consolidation logic and cash flow reporting that follow international financial standards", "Dynamic Workflow & Approvals: Customizable closing schedules with automated notifications and multi-level approval paths", "Comprehensive Data Integration: Seamlessly aggregates data from multiple ERP systems (SAP, Oracle, Microsoft, etc.) into a single platform"],
    keyFeaturesKo: ["클라우드 네이티브 통합 엔진", "보완 데이터 수집", "분산 분석 및 해설", "자동화된 내부 거래 매칭", "XBRL 보고 지원", "서술 보고 통합"],
    keyFeaturesJa: ["クラウドネイティブ連結エンジン", "補足データ収集", "差異分析とコメンタリー", "自動化された内部取引マッチング", "XBRLレポーティングサポート", "ナラティブレポーティング統合"],
    benefits: ["Reduce consolidation time by 50%", "Improve accuracy of group financial statements", "Enable faster regulatory filing", "Reduce IT infrastructure costs"],
    benefitsKo: ["통합 시간을 50% 단축", "그룹 재무제표의 정확도 향상", "규제 제출 가속화", "IT 인프라 비용 절감"],
    benefitsJa: ["連結時間を50%短縮", "グループ財務諸表の精度向上", "規制申告の迅速化", "ITインフラコストの削減"],
  },
  "oracle-arcs": {
    overview: "The account reconciliation process is often the biggest hurdle to a fast close. Oracle ARCS automates this traditionally manual and error-prone task. By using AI and machine learning to match transactions, it allows finance teams to focus only on high-risk exceptions, drastically improving efficiency.",
    overviewKo: "Oracle 계정 조정 클라우드 서비스(ARCS)는 계정 조정 프로세스를 자동화하여 위험을 줄이고 효율성을 향상시킵니다.",
    overviewJa: "Oracle アカウント調整クラウドサービス(ARCS)は、アカウント調整プロセスを自動化し、リスクを軽減して効率を向上させます。",
    keyFeatures: ["High-Volume Transaction Matching: Automated reconciliation of millions of bank transactions against general ledger entries using sophisticated matching rules", "Risk-Based Reconciliation: Prioritizes reconciliations based on account materiality and risk profile to optimize human resources", "Automated Document Archiving: Digital storage of all supporting evidence for each reconciled account, ensuring audit compliance", "Real-time Compliance Dashboard: Instant tracking of reconciliation completion rates and outstanding aging items across the global organization"],
    keyFeaturesKo: ["자동화된 잔액 비교", "위험 기반 조정 우선순위 지정", "분산 분석 및 조사", "작성자/검토자 워크플로우", "ERP 시스템과의 통합", "규정 준수 보고"],
    keyFeaturesJa: ["自動化された残高比較", "リスクベースの調整優先順位付け", "差異分析と調査", "作成者/レビュアーワークフロー", "ERPシステムとの統合", "コンプライアンスレポーティング"],
    benefits: ["Reduce reconciliation time by 60%", "Eliminate manual spreadsheet reconciliations", "Improve audit readiness", "Reduce financial statement risk"],
    benefitsKo: ["조정 시간을 60% 단축", "수동 스프레드시트 조정 제거", "감사 준비성 향상", "재무제표 위험 감소"],
    benefitsJa: ["調整時間を60%短縮", "手動スプレッドシート調整の排除", "監査準備の向上", "財務諸表リスクの削減"],
  },
  "oracle-close-manager": {
    overview: "Oracle Close Manager is a powerful workflow orchestration engine designed to centralize and automate the entire extended financial close process. It replaces manual checklists and fragmented spreadsheets with a synchronized, digital timeline. By providing absolute visibility into every task\u2014from sub-ledger closing to final regulatory filing\u2014it ensures that multinational corporations can close their books faster, with higher accuracy and better governance.",
    overviewKo: "Oracle 결산 관리자는 재무 결산 프로세스를 위한 포괄적인 작업 관리를 제공합니다.",
    overviewJa: "Oracle クローズマネージャーは、財務決算プロセスのための包括的なタスク管理を提供します。",
    keyFeatures: ["Centralized Task Orchestration: Integration of all closing activities into a single, automated schedule that spans across different departments and global entities", "Automated Workflow & Notifications: Streamlined approval paths with automated alerts, ensuring that dependencies are managed and bottlenecks are identified in real-time", "Real-time Progress Dashboards: Visual tracking of the entire closing cycle, allowing controllers to see exactly which tasks are pending and who is responsible", "ERP-Agnostic Integration: The ability to trigger and monitor tasks across various systems (SAP, Oracle EBS, NetSuite) within a unified closing calendar", "Audit & Compliance Tracking: Comprehensive logging of who did what and when, providing a robust evidence trail for external auditors and internal compliance teams"],
    keyFeaturesKo: ["결산 작업 정의 및 할당", "종속성 관리", "실시간 상태 추적", "ARCS 및 FCCS와의 통합", "모바일 접근", "자동화된 알림"],
    keyFeaturesJa: ["決算タスクの定義と割り当て", "依存関係管理", "リアルタイム状況追跡", "ARCSとFCCSとの統合", "モバイルアクセス", "自動通知"],
    benefits: ["Improve close visibility for management", "Reduce missed close deadlines", "Standardize close procedures globally", "Enable continuous close improvement"],
    benefitsKo: ["경영진을 위한 결산 가시성 향상", "결산 마감일 누락 감소", "글로벌 결산 절차 표준화", "지속적인 결산 개선 가능"],
    benefitsJa: ["経営陣の決算可視性向上", "決算期限の見逃し削減", "グローバルな決算手続きの標準化", "継続的な決算改善の実現"],
  },
  "blackline": {
    overview: "Blackline is the market leader in Financial Operations Management. It is designed to modernize the \"Continuous Accounting\" model by automating the manual tasks that occur between the ERP and the final financial statement. It is particularly effective in hybrid environments where multiple ERPs are used.",
    overviewKo: "BlackLine은 전체 재무 결산 프로세스를 자동화하고 제어하는 현대적인 회계 플랫폼입니다.",
    overviewJa: "BlackLineは、財務決算プロセス全体を自動化・制御する最新の会計プラットフォームです。",
    keyFeatures: ["Journal Entry Automation: Intelligent creation and posting of recurring and non-recurring journals based on predefined business logic", "Smart Transaction Matching: Powerful engine that automates the matching of complex data sets (e.g., credit card processing, intercompany charges)", "External Audit Collaboration: Provides a dedicated \"Auditor Portal\" where external teams can access evidence without disrupting the finance team", "Task Management Synergy: A global checklist that synchronizes the finance team's efforts across time zones and departments"],
    keyFeaturesKo: ["계정 조정 자동화", "분개 관리", "작업 및 결산 관리", "내부 거래 허브", "거래 매칭", "재무 보고 분석"],
    keyFeaturesJa: ["アカウント調整の自動化", "仕訳入力管理", "タスクと決算管理", "内部取引ハブ", "トランザクションマッチング", "財務レポーティング分析"],
    benefits: ["Reduce close cycle by up to 25%", "Improve reconciliation quality", "Enable continuous accounting", "Reduce audit preparation time"],
    benefitsKo: ["결산 주기를 최대 25% 단축", "조정 품질 향상", "지속적인 회계 가능", "감사 준비 시간 단축"],
    benefitsJa: ["決算サイクルを最大25%短縮", "調整品質の向上", "継続的な会計の実現", "監査準備時間の短縮"],
  },
  "sap-drc": {
    overview: "In an era of \"Real-time Tax,\" governments are increasingly mandating e-invoicing and digital reporting. SAP DRC is a global hub that enables MNCs to stay compliant with these rapidly changing local regulations through a single, unified interface.",
    overviewKo: "SAP 문서 및 보고 규정 준수(DRC)는 글로벌 전자 인보이스 의무 및 세금 보고 요구 사항을 관리하기 위한 SAP의 포괄적인 솔루션입니다.",
    overviewJa: "SAP ドキュメント・レポーティングコンプライアンス(DRC)は、グローバルな電子請求書義務と税務報告要件を管理するためのSAPの包括的なソリューションです。",
    keyFeatures: ["E-Invoicing Connectivity: Real-time integration with global tax authorities for the instant legal validation of sales and purchase invoices", "Localized Statutory Reporting: Automated generation of country-specific tax returns (VAT, GST) in the required digital formats (XML, JSON)", "Global Compliance Monitor: A single dashboard to track the compliance status of every subsidiary across the globe", "Regulatory Update Service: Continuous updates to the system logic as governments change their tax laws and digital formats"],
    keyFeaturesKo: ["60개국 이상의 전자 인보이스", "실시간 세금 보고", "SAP S/4HANA 통합", "자동 규제 업데이트", "감사 파일 생성", "다국가 규정 준수 관리"],
    keyFeaturesJa: ["60カ国以上の電子請求書", "リアルタイム税務報告", "SAP S/4HANA統合", "自動規制更新", "監査ファイル生成", "多国間コンプライアンス管理"],
    benefits: ["Achieve global tax compliance from a single platform", "Reduce compliance risk and penalties", "Automate regulatory updates", "Reduce manual tax reporting effort"],
    benefitsKo: ["단일 플랫폼에서 글로벌 세금 준수 달성", "규정 준수 위험 및 벌금 감소", "규제 업데이트 자동화", "수동 세금 보고 노력 감소"],
    benefitsJa: ["単一プラットフォームからグローバルな税務コンプライアンスを達成", "コンプライアンスリスクとペナルティの削減", "規制更新の自動化", "手動税務報告の工数削減"],
  },
  "sap-trm": {
    overview: "SAP TRM is the definitive solution for managing corporate liquidity and mitigating financial risks such as foreign exchange (FX), interest rate, and commodity price volatility. It provides the tools necessary to optimize cash and ensure the group's financial stability.",
    overviewKo: "SAP 재무 및 위험 관리(TRM)는 금융 상품, 헤징 전략 및 재무 위험을 관리하기 위한 포괄적인 도구를 제공합니다.",
    overviewJa: "SAP トレジャリー・リスク管理(TRM)は、金融商品、ヘッジ戦略、財務リスクを管理するための包括的なツールを提供します。",
    keyFeatures: ["Advanced Risk Analysis: Quantitative modeling of market risks, including Value-at-Risk (VaR) and sensitivity analysis", "Integrated Hedge Accounting: Automated documentation and effectiveness testing for hedging instruments to ensure IFRS 9 compliance", "Front-to-Back Office Automation: Seamless integration from the initial trade entry to settlement and accounting", "Liquidity Management Integration: Direct link to cash positions to ensure the most efficient use of corporate capital"],
    keyFeaturesKo: ["금융 상품 관리", "헤지 회계 (IFRS 9/ASC 815)", "시장 위험 분석", "거래 상대방 위험 관리", "규제 보고", "SAP 현금 관리와의 통합"],
    keyFeaturesJa: ["金融商品管理", "ヘッジ会計 (IFRS 9/ASC 815)", "市場リスク分析", "カウンターパーティリスク管理", "規制報告", "SAP キャッシュマネジメントとの統合"],
    benefits: ["Reduce financial risk exposure", "Achieve hedge accounting compliance", "Improve treasury efficiency", "Enhance risk reporting to board"],
    benefitsKo: ["재무 위험 노출 감소", "헤지 회계 규정 준수 달성", "재무 효율성 향상", "이사회에 대한 위험 보고 강화"],
    benefitsJa: ["財務リスクエクスポージャーの削減", "ヘッジ会計コンプライアンスの達成", "財務効率の向上", "取締役会へのリスク報告の強化"],
  },
  "sap-cash-management": {
    overview: "As a core component of SAP S/4HANA Treasury, SAP Cash Management provides the ultimate visibility into a company's global liquidity. It serves as the primary tool for cash managers to monitor bank balances in real-time, forecast future cash needs, and optimize internal funding to reduce external borrowing costs.",
    overviewKo: "SAP 현금 관리는 글로벌 은행 환경 전반에 걸쳐 실시간 현금 가시성 및 유동성 관리를 제공합니다.",
    overviewJa: "SAP キャッシュマネジメントは、グローバルな銀行環境全体でリアルタイムの現金可視性と流動性管理を提供します。",
    keyFeatures: ["Real-time Global Cash Visibility: A single Source of Truth for all bank account balances across the entire global organization", "Advanced Liquidity Forecasting: Integrating data from Sales, Procurement, and Finance to project future cash positions with high precision", "Automated Bank Statement Processing: Direct integration with global banks to automate the reconciliation of millions of daily transactions", "Cash Pooling & Concentration: Centralizing liquidity to minimize idle cash balances and reduce the cost of external borrowing"],
    keyFeaturesKo: ["실시간 현금 포지션", "유동성 예측", "은행 계좌 관리", "현금 풀링 및 네팅", "결제 팩토리 기능", "SAP TRM과의 통합"],
    keyFeaturesJa: ["リアルタイム現金ポジション", "流動性予測", "銀行口座管理", "キャッシュプーリングとネッティング", "ペイメントファクトリー機能", "SAP TRMとの統合"],
    benefits: ["Improve cash visibility by 100%", "Reduce idle cash balances", "Optimize working capital", "Reduce bank fees through consolidation"],
    benefitsKo: ["현금 가시성을 100% 향상", "유휴 현금 잔액 감소", "운전 자본 최적화", "통합을 통한 은행 수수료 절감"],
    benefitsJa: ["現金可視性を100%向上", "遊休現金残高の削減", "運転資本の最適化", "統合による銀行手数料の削減"],
  },
  "sap-mbc": {
    overview: "Large MNCs struggle with managing hundreds of individual bank portals and communication protocols. SAP MBC is a cloud-based multi-bank hub that simplifies the connection between the ERP and the global banking network (SWIFT, EBICS, Host-to-Host).",
    overviewKo: "SAP 멀티 뱅크 연결(MBC)은 결제 처리 및 은행 명세서 검색을 위한 단일 표준화된 채널을 제공하여 여러 양자 은행 연결을 대체함으로써 은행 통신을 단순화합니다.",
    overviewJa: "SAP マルチバンクコネクティビティ(MBC)は、支払い処理と銀行明細書取得のための単一の標準化されたチャネルを提供し、複数の二国間銀行接続を置き換えることで銀行通信を簡素化します。",
    keyFeatures: ["Protocol Consolidation: Replaces multiple bank-specific interfaces with a single, secure cloud connection", "Global Payment Visibility: Real-time tracking of outbound payments and incoming bank statements across all global accounts", "SWIFT Integration: Native connectivity to the SWIFT network for global payment messaging and bank statement retrieval", "Bank Fee Optimization: Reduces the IT cost and complexity of maintaining individual banking interfaces and middleware"],
    keyFeaturesKo: ["단일 은행 연결 허브", "SWIFT 및 현지 형식 지원", "결제 상태 모니터링", "은행 명세서 자동화", "다중 은행 결제 처리", "규제 준수"],
    keyFeaturesJa: ["単一銀行接続ハブ", "SWIFTとローカルフォーマットサポート", "支払い状況モニタリング", "銀行明細書の自動化", "マルチバンク支払い処理", "規制コンプライアンス"],
    benefits: ["Reduce bank connectivity costs by 40%", "Simplify payment operations", "Improve payment visibility", "Reduce bank onboarding time"],
    benefitsKo: ["은행 연결 비용을 40% 절감", "결제 운영 간소화", "결제 가시성 향상", "은행 온보딩 시간 단축"],
    benefitsJa: ["銀行接続コストを40%削減", "支払い業務の簡素化", "支払い可視性の向上", "銀行オンボーディング時間の短縮"],
  },
  "sap-fscm": {
    overview: "SAP FSCM is an integrated suite of modules designed to optimize the Order-to-Cash (O2C) cycle by managing credit risk, streamlining collections, and automating dispute management. It transforms the treasury function from a transactional department into a strategic hub that maximizes working capital and minimizes bad debt.",
    overviewKo: "SAP 재무 공급망 관리(FSCM)는 신용 관리, 수금 관리 및 분쟁 관리를 위한 통합 솔루션을 제공하여 조직이 운전 자본을 최적화하고 재무 위험을 줄이는 데 도움을 줍니다.",
    overviewJa: "SAP 財務サプライチェーン管理(FSCM)は、クレジット管理、回収管理、紛争管理のための統合ソリューションを提供し、組織が運転資本を最適化し財務リスクを削減するのを支援します。",
    keyFeatures: ["Automated Credit Management: Real-time scoring and credit limit monitoring based on internal payment history and external credit agency data", "Collections Intelligence: Data-driven prioritization of collection activities to focus on the most critical outstanding receivables", "Dispute Resolution Workflow: Centralized tracking of customer payment discrepancies to accelerate resolution and improve customer relations", "Electronic Bill Presentment & Payment (EBPP): Digital invoicing and payment portals to reduce DSO (Days Sales Outstanding)"],
    keyFeaturesKo: ["신용 한도 관리", "자동화된 독촉", "수금 작업 목록 관리", "분쟁 사례 관리", "고객 위험 점수", "SAP AR과의 통합"],
    keyFeaturesJa: ["与信限度管理", "自動督促", "回収ワークリスト管理", "紛争ケース管理", "顧客リスクスコアリング", "SAP ARとの統合"],
    benefits: ["Reduce DSO by up to 20%", "Improve credit risk management", "Accelerate dispute resolution", "Reduce bad debt write-offs"],
    benefitsKo: ["DSO를 최대 20% 감소", "신용 위험 관리 향상", "분쟁 해결 가속화", "대손 상각 감소"],
    benefitsJa: ["DSOを最大20%削減", "信用リスク管理の向上", "紛争解決の加速", "貸倒償却の削減"],
  },
  "sap-brim": {
    overview: "As business models shift toward subscriptions and usage-based services, SAP BRIM (formerly Hybris Billing) provides the high-volume transaction engine required for complex pricing and billing. It is the definitive solution for MNCs transitioning to Everything-as-a-Service (XaaS) models.",
    overviewKo: "SAP 청구 및 수익 혁신 관리(BRIM)는 구독, 사용 기반 가격 책정 및 하이브리드 모델을 포함한 복잡한 청구 시나리오를 관리하기 위한 포괄적인 플랫폼입니다.",
    overviewJa: "SAP 請求・収益イノベーション管理(BRIM)は、サブスクリプション、使用量ベースの価格設定、ハイブリッドモデルを含む複雑な請求シナリオを管理するための包括的なプラットフォームです。",
    keyFeatures: ["Subscription & Usage-Based Rating: Scalable engine that processes millions of consumption events and applies complex pricing tiers in real-time", "Convergent Invoicing: Consolidating multiple service charges (recurring, one-time, usage-based) into a single, clear customer invoice", "Partner Settlement & Revenue Share: Automated calculation and payout management for complex partner ecosystems and marketplaces", "Advanced Contract Management: Lifecycle management of service contracts, including automated renewals and mid-term upgrades"],
    keyFeaturesKo: ["구독 청구 관리", "사용 기반 청구 및 요율 책정", "수익 인식 (IFRS 15/ASC 606)", "계약 관리", "수익 회계", "다자간 정산"],
    keyFeaturesJa: ["サブスクリプション請求管理", "使用量ベースの請求とレーティング", "収益認識 (IFRS 15/ASC 606)", "契約管理", "収益会計", "マルチパーティ決済"],
    benefits: ["Support new business models quickly", "Achieve IFRS 15 compliance", "Reduce billing errors and disputes", "Accelerate revenue recognition"],
    benefitsKo: ["새로운 비즈니스 모델을 빠르게 지원", "IFRS 15 규정 준수 달성", "청구 오류 및 분쟁 감소", "수익 인식 가속화"],
    benefitsJa: ["新しいビジネスモデルを迅速にサポート", "IFRS 15コンプライアンスの達成", "請求エラーと紛争の削減", "収益認識の加速"],
  },
  "sap-grc": {
    overview: "SAP GRC is an enterprise-wide framework that enables companies to identify risks, manage internal controls, and ensure regulatory compliance within a single integrated platform. It protects corporate reputation by preventing fraud and ensuring Clean Finance across the global organization.",
    overviewKo: "SAP 거버넌스, 위험 및 규정 준수(GRC)는 기업 위험을 관리하고, 규제 준수를 보장하며, 조직 전반에 걸쳐 효과적인 거버넌스를 유지하기 위한 통합 프레임워크를 제공합니다.",
    overviewJa: "SAP ガバナンス・リスク・コンプライアンス(GRC)は、企業リスクを管理し、規制コンプライアンスを確保し、組織全体で効果的なガバナンスを維持するための統合フレームワークを提供します。",
    keyFeatures: ["Access Control & SoD (Segregation of Duties): Automated monitoring of user permissions to prevent conflicting access that could lead to financial fraud", "Process Control Automation: Continuous monitoring of internal financial controls to identify and remediate deficiencies in real-time", "Risk Management & Heatmaps: Quantitative and qualitative assessment of corporate risks with visual reporting for executive decision-making", "Automated Audit Management: Streamlining the entire audit lifecycle from planning to execution and reporting"],
    keyFeaturesKo: ["접근 제어 및 직무 분리 관리", "프로세스 제어 및 감사 관리", "위험 관리 프레임워크", "규제 변경 관리", "사기 관리", "글로벌 무역 규정 준수"],
    keyFeaturesJa: ["アクセス制御とSoD管理", "プロセス制御と監査管理", "リスク管理フレームワーク", "規制変更管理", "不正管理", "グローバル貿易コンプライアンス"],
    benefits: ["Reduce compliance violations", "Automate audit processes", "Improve risk visibility", "Reduce audit preparation costs"],
    benefitsKo: ["규정 준수 위반 감소", "감사 프로세스 자동화", "위험 가시성 향상", "감사 준비 비용 절감"],
    benefitsJa: ["コンプライアンス違反の削減", "監査プロセスの自動化", "リスク可視性の向上", "監査準備コストの削減"],
  },
  "sap-analytics-cloud": {
    overview: "SAC for Planning is an AI-driven, cloud-native platform that unifies financial planning, forecasting, and analysis. It allows the Office of the CFO to move beyond spreadsheets into Extended Planning & Analysis (xP&A), connecting financial goals with operational reality.",
    overviewKo: "SAP 애널리틱스 클라우드(SAC)는 단일 클라우드 플랫폼에서 비즈니스 인텔리전스, 계획 및 예측 분석을 결합하여 재무 팀이 더 빠르고 정확하게 계획하고 전체 비즈니스에 인사이트를 제공할 수 있도록 합니다.",
    overviewJa: "SAP アナリティクスクラウド(SAC)は、単一のクラウドプラットフォームでビジネスインテリジェンス、計画、予測分析を組み合わせ、財務チームがより速く正確に計画し、ビジネス全体にインサイトを提供できるようにします。",
    keyFeatures: ["Predictive Forecasting: Built-in machine learning algorithms that analyze historical trends to generate accurate future projections automatically", "Driver-Based Modeling: Advanced What-if scenario analysis to see how changes in market drivers impact the bottom line", "Unified BI & Planning: Real-time data visualization that allows users to move seamlessly from analyzing historical data to entering plan values", "Collaborative Enterprise Planning: Real-time collaboration tools that align budgets across HR, Sales, and Finance departments globally"],
    keyFeaturesKo: ["통합 계획 및 분석", "AI/ML을 활용한 예측 예측", "드라이버 기반 계획 모델", "실시간 데이터 연결", "협업 계획 워크플로우", "모바일 우선 대시보드"],
    keyFeaturesJa: ["統合計画と分析", "AI/MLによる予測予測", "ドライバーベースの計画モデル", "リアルタイムデータ接続", "コラボレーティブ計画ワークフロー", "モバイルファーストダッシュボード"],
    benefits: ["Reduce planning cycle time by 50%", "Improve forecast accuracy", "Enable real-time performance monitoring", "Eliminate disconnected planning tools"],
    benefitsKo: ["계획 주기 시간을 50% 단축", "예측 정확도 향상", "실시간 성과 모니터링 가능", "연결되지 않은 계획 도구 제거"],
    benefitsJa: ["計画サイクル時間を50%短縮", "予測精度の向上", "リアルタイムパフォーマンスモニタリングの実現", "切り離された計画ツールの排除"],
  },
  "oracle-pbcs": {
    overview: "Oracle PBCS is a market-leading EPM (Enterprise Performance Management) solution that brings the power of Hyperion to the cloud. It is designed for agility, allowing MNCs to execute sophisticated budgeting processes and rolling forecasts without the burden of heavy IT infrastructure.",
    overviewKo: "Oracle 계획 및 예산 클라우드 서비스(PBCS)는 내장된 워크플로우, 승인 및 보고 기능을 갖춘 민첩한 드라이버 기반 재무 계획을 수립할 수 있는 클라우드 기반 계획 및 예산 솔루션입니다.",
    overviewJa: "Oracle 計画・予算クラウドサービス(PBCS)は、組み込みのワークフロー、承認、レポーティング機能を備えたアジャイルなドライバーベースの財務計画を構築できるクラウドベースの計画・予算ソリューションです。",
    keyFeatures: ["Flexible Financial Modeling: Robust engine for complex allocations, currency translations, and bottom-up/top-down budgeting", "Interactive Dashboards & Reporting: Drag-and-drop report builders that provide instant insights into budget vs. actual variances", "Oracle Smart View Integration: Allowing finance teams to leverage their existing Excel skills while working directly with a secure, centralized database", "Scalable Sandboxing: Private environments where planners can test multiple budget scenarios without affecting the master data"],
    keyFeaturesKo: ["드라이버 기반 계획 모델", "롤링 예측 기능", "시나리오 모델링 및 가정 분석", "워크플로우 및 승인 관리", "서술 보고", "Oracle ERP Cloud와의 통합"],
    keyFeaturesJa: ["ドライバーベースの計画モデル", "ローリング予測機能", "シナリオモデリングとWhat-If分析", "ワークフローと承認管理", "ナラティブレポーティング", "Oracle ERPクラウドとの統合"],
    benefits: ["Accelerate planning cycle by 40%", "Improve forecast accuracy", "Enable collaborative planning", "Reduce planning tool maintenance"],
    benefitsKo: ["계획 주기를 40% 가속화", "예측 정확도 향상", "협업 계획 가능", "계획 도구 유지 관리 감소"],
    benefitsJa: ["計画サイクルを40%加速", "予測精度の向上", "コラボレーティブ計画の実現", "計画ツールのメンテナンス削減"],
  },
  "sap-re-fx": {
    overview: "In response to global lease accounting standards (IFRS 16 / ASC 842), SAP RE-FX has become a critical compliance tool. It provides a comprehensive solution for managing large-scale corporate real estate portfolios and complex equipment leases while ensuring perfect financial alignment.",
    overviewKo: "SAP 부동산 관리(RE-FX)는 포괄적인 리스 및 부동산 관리 기능을 제공하여 조직이 IFRS 16 규정 준수를 보장하고 점유 비용을 최적화하면서 전체 부동산 포트폴리오를 관리할 수 있도록 합니다.",
    overviewJa: "SAP 不動産管理(RE-FX)は、包括的なリースと不動産管理機能を提供し、組織がIFRS 16コンプライアンスを確保し、占有コストを最適化しながら不動産ポートフォリオ全体を管理できるようにします。",
    keyFeatures: ["IFRS 16 / ASC 842 Native Compliance: Automated calculation of Right-of-Use (RoU) assets and lease liabilities with direct posting to the ledger", "Portfolio Management: Centralized repository for all lease terms, critical dates, and financial conditions for global property assets", "Space & Occupancy Optimization: Visual tools to track space utilization, vacancy rates, and facility management costs", "Contract Lifecycle Automation: Automated triggers for lease renewals, indexations, and terminations to prevent missed financial opportunities"],
    keyFeaturesKo: ["IFRS 16/ASC 842 리스 회계", "리스 포트폴리오 관리", "자동화된 분개", "사용권 자산 관리", "리스 수정 처리", "규제 공시 보고"],
    keyFeaturesJa: ["IFRS 16/ASC 842リース会計", "リースポートフォリオ管理", "自動化された仕訳", "使用権資産管理", "リース変更処理", "規制開示レポーティング"],
    benefits: ["Achieve IFRS 16 compliance", "Reduce lease accounting effort by 60%", "Improve lease portfolio visibility", "Reduce audit risk"],
    benefitsKo: ["IFRS 16 규정 준수 달성", "리스 회계 노력을 60% 감소", "리스 포트폴리오 가시성 향상", "감사 위험 감소"],
    benefitsJa: ["IFRS 16コンプライアンスの達成", "リース会計工数を60%削減", "リースポートフォリオ可視性の向上", "監査リスクの削減"],
  },
};

export default function SolutionDetail({ params }: SolutionDetailProps) {
  const { language } = useLanguage();
  const { category: categorySlug, slug } = params;

  const category = SOLUTION_CATEGORIES.find((c) => c.slug === categorySlug);
  const solution = category?.solutions.find((s) => s.slug === slug);
  const details = solutionDetails[slug];

  if (!category || !solution) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Solution not found</h1>
          <Link href="/solutions" className="btn-outline-navy no-underline">Back to Solutions</Link>
        </div>
      </Layout>
    );
  }

  const solName = language === "ko" ? solution.nameKo : language === "ja" ? solution.nameJa : solution.name;
  const catName = language === "ko" ? category.nameKo : language === "ja" ? category.nameJa : category.name;
  const overview = details ? (language === "ko" ? details.overviewKo : language === "ja" ? details.overviewJa : details.overview) : solution.shortDescription;
  const keyFeatures = details ? (language === "ko" ? details.keyFeaturesKo : language === "ja" ? details.keyFeaturesJa : details.keyFeatures) : [];
  const benefits = details ? (language === "ko" ? details.benefitsKo : language === "ja" ? details.benefitsJa : details.benefits) : [];

  // Related insights
  const relatedInsights = INSIGHTS.filter((i) => i.relatedSolutions.includes(slug)).slice(0, 3);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)" }} />
        <div className="container relative z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/solutions" className="no-underline hover:text-white transition-colors">Solutions</Link>
            <ChevronRight size={12} />
            <Link href={`/solutions/${categorySlug}`} className="no-underline hover:text-white transition-colors">{catName}</Link>
            <ChevronRight size={12} />
            <span className="text-gray-300">{solution.name}</span>
          </div>
          <div className="flex items-start gap-4 mb-6">
            <span
              className="text-sm font-bold px-3 py-1.5 text-white mt-1"
              style={{ backgroundColor: solution.vendor === "SAP" ? "var(--gold)" : solution.vendor === "Oracle" ? "#c74b00" : "#1a1a2e", color: solution.vendor === "SAP" ? "var(--navy-dark)" : "white" }}
            >
              {solution.vendor}
            </span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {solName}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              {language === "ko" ? solution.shortDescriptionKo : language === "ja" ? solution.shortDescriptionJa : solution.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Overview + Features */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="section-divider" />
              <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--navy-dark)" }}>
                {language === "ko" ? "솔루션 개요" : language === "ja" ? "ソリューション概要" : "Solution Overview"}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-10">{overview}</p>

              {/* Video */}
              {solution.youtubeVideoId && (
                <div className="relative aspect-video bg-gray-900 mb-10 overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${solution.youtubeVideoId}`}
                    title={solution.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Key Features */}
              {keyFeatures.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-5" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? "주요 기능" : language === "ja" ? "主要機能" : "Key Features"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {keyFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50">
                        <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: "var(--gold)" }} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Benefits Sidebar */}
            <div>
              <div className="section-divider" />
              <h3 className="text-lg font-bold mb-5" style={{ color: "var(--navy)" }}>
                {language === "ko" ? "주요 이점" : language === "ja" ? "主要なメリット" : "Key Benefits"}
              </h3>
              <div className="space-y-3 mb-8">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 border-l-2" style={{ borderColor: "var(--gold)", backgroundColor: "var(--off-white)" }}>
                    <span className="text-sm text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="p-6" style={{ backgroundColor: "var(--navy-dark)" }}>
                <h4 className="text-white font-bold mb-3 text-sm">
                  {language === "ko" ? "전문가와 상담" : language === "ja" ? "専門家に相談" : "Speak with a Specialist"}
                </h4>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                  {language === "ko" ? "이 솔루션이 귀사에 적합한지 알아보세요." : language === "ja" ? "このソリューションが貴社に適しているかを確認してください。" : "Find out if this solution is right for your organization."}
                </p>
                <Link href="/contact" className="btn-gold no-underline text-xs w-full justify-center">
                  {language === "ko" ? "문의하기" : language === "ja" ? "お問い合わせ" : "Get in Touch"}
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Insights */}
      {relatedInsights.length > 0 && (
        <section className="section-off-white py-20">
          <div className="container">
            <div className="section-divider" />
            <h2 className="text-3xl font-bold mb-10" style={{ color: "var(--navy-dark)" }}>
              {language === "ko" ? "관련 인사이트" : language === "ja" ? "関連インサイト" : "Related Insights"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedInsights.map((insight) => (
                <Link key={insight.slug} href={`/insights/${insight.slug}`} className="p-6 bg-white border border-gray-100 card-hover no-underline group">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 mb-3 inline-block" style={{ backgroundColor: "var(--navy-dark)", color: "white" }}>
                    {insight.category}
                  </span>
                  <h4 className="text-sm font-bold mb-2 group-hover:text-[var(--navy)] transition-colors" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? insight.titleKo : language === "ja" ? insight.titleJa : insight.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {insight.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
