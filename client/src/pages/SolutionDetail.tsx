import { Link } from "wouter";
import { ArrowRight, ChevronRight, CheckCircle2, Zap, Shield, BarChart3, Globe, Settings, TrendingUp, Lock } from "lucide-react";
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
    overview: "In the high-stakes environment of global finance, the \"Last Mile of Finance\" is often the most chaotic. SAP AFC is not merely a task manager; it is a sophisticated cloud-based orchestrator designed to unify the fragmented Record-to-Report (R2R) lifecycle. MAVEK BCS leverages SAP AFC to eliminate the reliance on manual spreadsheets and disconnected emails, replacing them with a digital nerve center. Our implementation provides group controllers with an unprecedented level of transparency, allowing them to monitor the closing status of hundreds of subsidiaries in real-time. By institutionalizing standardized closing sequences and automating background job chains, MAVEK BCS helps your organization achieve a \"Fast Close,\" reducing operational costs and allowing your finance team to focus on value-added analysis rather than administrative firefighting.",
    overviewKo: "SAP AFC는 글로벌 기업 구조 전반의 복잡한 '기록에서 보고(R2R)' 프로세스를 조율하기 위해 설계된 클라우드 기반 전문 솔루션입니다. 그룹 컨트롤러가 수백 개의 법인에 대한 결산 작업을 실시간으로 계획, 실행 및 모니터링할 수 있는 디지털 관제탑 역할을 합니다. 반복적인 결산 활동을 자동화함으로써 재무제표 작성 시간을 대폭 단축합니다.",
    overviewJa: "SAP アドバンスト財務決算(AFC)は、財務決算プロセスを自動化・加速するインテリジェントなソリューションです。一元化されたタスク管理、自動化された照合、組織全体の決算状況のリアルタイム可視性を提供します。",
    keyFeatures: ["Global Closing Task Orchestration", "Automated Background Job Chains", "Real-time Closing Readiness Dashboards", "Standardized Best-Practice Templates", "Complete Governance & Audit Trails", "Intelligent Bottleneck Detection"],
    keyFeaturesKo: ["중앙 집중식 작업 조율: 단일 대시보드 내에서 다양한 글로벌 자회사 간의 결산 절차를 표준화합니다.", "고급 자동화: 작업 체인 및 백그라운드 처리의 자동 실행을 통해 수동 개입을 최소화합니다.", "실시간 결산 상태: 모든 법인의 결산 진행 상황을 즉시 파악하여 그룹 보고가 지연되기 전 병목 구간을 식별합니다.", "거버넌스 및 감사 대응: 타임스탬프가 포함된 감사 추적 기능을 통해 모든 결산 활동에 대한 완벽한 추적성을 제공합니다."],
    keyFeaturesJa: ["一元化された決算タスク管理", "自動化された照合ワークフロー", "リアルタイム決算状況ダッシュボード", "SAP S/4HANAと非SAPシステムとの統合", "決算マネージャー向けモバイルアクセス", "監査証跡とコンプライアンス文書化"],
    benefits: ["Reduce close cycle by up to 30%", "Eliminate manual task tracking spreadsheets", "Improve close quality and reduce errors", "Provide real-time visibility to CFO and controllers"],
    benefitsKo: ["결산 주기를 최대 30% 단축", "수동 작업 추적 스프레드시트 제거", "결산 품질 향상 및 오류 감소", "CFO 및 컨트롤러에게 실시간 가시성 제공"],
    benefitsJa: ["決算サイクルを最大30%短縮", "手動タスク追跡スプレッドシートの排除", "決算品質の向上とエラーの削減", "CFOとコントローラーへのリアルタイム可視性の提供"],
  },
  "sap-group-reporting": {
    overview: "As business cycles accelerate, waiting weeks for consolidated results is no longer viable. SAP Group Reporting, embedded within SAP S/4HANA, revolutionizes the consolidation process by removing the wall between local accounting and group reporting. It facilitates a \"Continuous Consolidation\" model where data is validated and aggregated as transactions occur, not just at month-end. MAVEK BCS specializes in architecting this unified data model to provide a single source of truth for your entire organization. Our consulting approach ensures that complex eliminations, currency translations, and multi-GAAP requirements are handled automatically within the system, empowering the Office of the CFO to provide stakeholders with accurate, real-time insights into the group's financial performance.",
    overviewKo: "SAP S/4HANA를 위한 차세대 연결 엔진인 Group Reporting은 로컬 회계와 그룹 수준 재무제표 간의 간극을 메워줍니다. 실시간 연결(Continuous Consolidation)을 가능하게 하여 전통적인 '결산 후 통합' 방식을 탈피하고, 월중 어느 시점에서나 그룹의 재무 건전성을 확인할 수 있도록 합니다.",
    overviewJa: "SAP グループレポーティングは、複雑な企業構造全体でリアルタイムの財務連結とレポーティングを可能にします。SAP S/4HANAと直接統合する最新のクラウド対応ソリューションでレガシー連結ツールを置き換えます。",
    keyFeatures: ["Native S/4HANA Data Integration", "Real-time Intercompany Elimination", "Multi-GAAP & Multi-Currency Agility", "Automated Consolidation Ledger", "Advanced Equity & Investment Handling", "Drill-down to Transactional Details"],
    keyFeaturesKo: ["실시간 연결: 로컬 원장과 그룹 통합 뷰 간의 실시간 데이터 통합을 지원합니다.", "자동화된 내부거래 대조: 데이터 무결성을 보장하기 위해 내부거래 매칭 및 제거 작업을 즉각적으로 수행합니다.", "다중 표준 보고: 로컬 GAAP와 글로벌 표준(IFRS/US GAAP)에 따른 보고서를 동시에 생성합니다.", "통합 데이터 모델: 데이터 복제나 수동 추출이 필요 없는 '단일 신뢰 원천(Single Source of Truth)'을 제공합니다."],
    keyFeaturesJa: ["リアルタイム連結エンジン", "マルチGAAP報告サポート", "内部取引消去の自動化", "通貨換算と再評価", "所有権管理", "規制報告パッケージ"],
    benefits: ["Accelerate group close by up to 40%", "Single source of truth for group financials", "Reduce manual consolidation adjustments", "Support IFRS and local GAAP simultaneously"],
    benefitsKo: ["그룹 결산을 최대 40% 가속화", "그룹 재무에 대한 단일 진실의 원천", "수동 통합 조정 감소", "IFRS 및 현지 GAAP 동시 지원"],
    benefitsJa: ["グループ決算を最大40%加速", "グループ財務の単一の真実の源泉", "手動連結調整の削減", "IFRSとローカルGAAPの同時サポート"],
  },
  "oracle-fccs": {
    overview: "For multinational corporations with complex ownership structures and diverse ERP landscapes, financial integrity is paramount. Oracle FCCS is a world-class EPM solution that brings rigorous discipline to the global consolidation process. It combines a robust consolidation engine with powerful workflow orchestration to ensure every step of the close is executed with precision. MAVEK BCS excels in tailoring FCCS to navigate the intricacies of minority interests, complex equity accounting, and varied local reporting standards. By implementing FCCS, we help your organization build a transparent, repeatable, and audit-ready consolidation framework that scales effortlessly with your global expansion, ensuring that your corporate story is always backed by verifiable data.",
    overviewKo: "Oracle FCCS는 글로벌 재무 통합의 엄격한 요구사항을 처리하기 위해 구축된 포괄적인 클라우드 솔루션입니다. 구성 유연성이 뛰어나 다양한 사업 단위와 복잡한 소유 구조를 가진 다국적 기업에 적합하며, 로컬 법인부터 경영진까지 재무 투명성을 보장하는 구조화된 워크플로우를 제공합니다.",
    overviewJa: "Oracle 財務連結・決算クラウドサービス(FCCS)は、複雑なマルチエンティティ、マルチ通貨の連結要件を持つ組織向けの強力なクラウドベースプラットフォームを提供します。",
    keyFeatures: ["Automated Complex Equity Accounting", "End-to-End Closing Workflow Control", "Built-in Financial Intelligence & Rules", "Automated Cash Flow Statement Logic", "Multi-Source Data Integration Hub", "C-Suite Level Financial Reporting"],
    keyFeaturesKo: ["복잡한 소유권 관리: 소수 지분, 지분법, 복잡한 인수 회계 처리를 자동화합니다.", "내장된 베스트 프랙티스: 국제 회계 표준을 따르는 즉시 사용 가능한 연결 로직과 현금 흐름 보고 기능을 제공합니다.", "동적 워크플로우 및 승인: 자동 알림 및 다단계 승인 경로가 포함된 맞춤형 결산 일정을 지원합니다.", "포괄적 데이터 통합: 다양한 ERP 시스템(SAP, Oracle, Microsoft 등)의 데이터를 단일 플랫폼으로 원활하게 취합합니다."],
    keyFeaturesJa: ["クラウドネイティブ連結エンジン", "補足データ収集", "差異分析とコメンタリー", "自動化された内部取引マッチング", "XBRLレポーティングサポート", "ナラティブレポーティング統合"],
    benefits: ["Reduce consolidation time by 50%", "Improve accuracy of group financial statements", "Enable faster regulatory filing", "Reduce IT infrastructure costs"],
    benefitsKo: ["통합 시간을 50% 단축", "그룹 재무제표의 정확도 향상", "규제 제출 가속화", "IT 인프라 비용 절감"],
    benefitsJa: ["連結時間を50%短縮", "グループ財務諸表の精度向上", "規制申告の迅速化", "ITインフラコストの削減"],
  },
  "oracle-arcs": {
    overview: "The account reconciliation process is often the biggest hurdle to a fast close. Oracle ARCS automates this traditionally manual and error-prone task. By using AI and machine learning to match transactions, it allows finance teams to focus only on high-risk exceptions, drastically improving efficiency.",
    overviewKo: "계정 대조 프로세스는 종종 빠른 결산을 가로막는 가장 큰 장애물입니다. Oracle ARCS는 전통적으로 수동적이고 오류가 잦았던 이 작업을 자동화합니다. AI와 머신러닝을 활용해 트랜잭션을 매칭함으로써 재무팀이 고위험 예외 사항에만 집중할 수 있게 하여 효율성을 획기적으로 높입니다.",
    overviewJa: "Oracle アカウント調整クラウドサービス(ARCS)は、アカウント調整プロセスを自動化し、リスクを軽減して効率を向上させます。",
    keyFeatures: ["High-Volume Transaction Matching: Automated reconciliation of millions of bank transactions against general ledger entries using sophisticated matching rules", "Risk-Based Reconciliation: Prioritizes reconciliations based on account materiality and risk profile to optimize human resources", "Automated Document Archiving: Digital storage of all supporting evidence for each reconciled account, ensuring audit compliance", "Real-time Compliance Dashboard: Instant tracking of reconciliation completion rates and outstanding aging items across the global organization"],
    keyFeaturesKo: ["대량 트랜잭션 매칭: 정교한 매칭 규칙을 사용하여 수백만 건의 은행 거래와 총계정원장 항목을 자동으로 대조합니다.", "리스크 기반 대조: 계정의 중요도와 리스크 프로필에 따라 대조 작업의 우선순위를 정해 인적 자원을 최적화합니다.", "자동화된 문서 아카이빙: 각 대조 계정에 대한 모든 증빙 자료를 디지털로 저장하여 감사 준수를 보장합니다.", "실시간 컴플라이언스 대시보드: 글로벌 조직 전반의 대조 완료율 및 미결 항목을 즉시 추적합니다."],
    keyFeaturesJa: ["自動化された残高比較", "リスクベースの調整優先順位付け", "差異分析と調査", "作成者/レビュアーワークフロー", "ERPシステムとの統合", "コンプライアンスレポーティング"],
    benefits: ["Reduce reconciliation time by 60%", "Eliminate manual spreadsheet reconciliations", "Improve audit readiness", "Reduce financial statement risk"],
    benefitsKo: ["조정 시간을 60% 단축", "수동 스프레드시트 조정 제거", "감사 준비성 향상", "재무제표 위험 감소"],
    benefitsJa: ["調整時間を60%短縮", "手動スプレッドシート調整の排除", "監査準備の向上", "財務諸表リスクの削減"],
  },
  "blackline": {
    overview: "Blackline is the market leader in Financial Operations Management. It is designed to modernize the \"Continuous Accounting\" model by automating the manual tasks that occur between the ERP and the final financial statement. It is particularly effective in hybrid environments where multiple ERPs are used.",
    overviewKo: "Blackline은 재무 운영 관리 분야의 시장 선도자입니다. ERP와 최종 재무제표 사이에서 발생하는 수동 작업들을 자동화하여 '연속 회계(Continuous Accounting)' 모델을 현대화하도록 설계되었습니다. 특히 여러 ERP를 사용하는 하이브리드 환경에서 매우 효과적입니다.",
    overviewJa: "BlackLineは、財務決算プロセス全体を自動化・制御する最新の会計プラットフォームです。",
    keyFeatures: ["Journal Entry Automation: Intelligent creation and posting of recurring and non-recurring journals based on predefined business logic", "Smart Transaction Matching: Powerful engine that automates the matching of complex data sets (e.g., credit card processing, intercompany charges)", "External Audit Collaboration: Provides a dedicated \"Auditor Portal\" where external teams can access evidence without disrupting the finance team", "Task Management Synergy: A global checklist that synchronizes the finance team's efforts across time zones and departments"],
    keyFeaturesKo: ["분개장 자동화: 사전 정의된 비즈니스 로직에 따라 반복 및 비반복 분개를 지능적으로 생성하고 전기합니다.", "스마트 트랜잭션 매칭: 신용카드 처리, 내부거래 비용 등 복잡한 데이터 세트의 매칭을 자동화하는 강력한 엔진을 제공합니다.", "외부 감사 협업: 외부 감사인이 재무팀의 업무 방해 없이 증빙 자료에 접근할 수 있는 전용 '감사 포털'을 제공합니다.", "작업 관리 시너지: 시간대와 부서를 초월하여 재무팀의 노력을 동기화하는 글로벌 체크리스트를 제공합니다."],
    keyFeaturesJa: ["アカウント調整の自動化", "仕訳入力管理", "タスクと決算管理", "内部取引ハブ", "トランザクションマッチング", "財務レポーティング分析"],
    benefits: ["Reduce close cycle by up to 25%", "Improve reconciliation quality", "Enable continuous accounting", "Reduce audit preparation time"],
    benefitsKo: ["결산 주기를 최대 25% 단축", "조정 품질 향상", "지속적인 회계 가능", "감사 준비 시간 단축"],
    benefitsJa: ["決算サイクルを最大25%短縮", "調整品質の向上", "継続的な会計の実現", "監査準備時間の短縮"],
  },
  "sap-drc": {
    overview: "The global tax landscape is undergoing a digital revolution, with \"Real-time Tax\" becoming the new standard. SAP DRC is a mission-critical hub that enables MNCs to keep pace with the frantic rate of regulatory change. MAVEK BCS leverages DRC to automate the entire lifecycle of e-invoicing and digital statutory reporting, ensuring that your transactions are legally validated in real-time as they occur. We remove the burden of manual tax filings and the risk of non-compliance across multiple jurisdictions. Our implementation ensures that your compliance process is not just a defensive necessity, but a seamless, automated part of your business operations, protecting your reputation and your bottom line.",
    overviewKo: "'실시간 과세' 시대에 정부들은 전자 인보이스와 디지털 보고를 점점 더 의무화하고 있습니다. SAP DRC는 다국적 기업들이 단일 통합 인터페이스를 통해 급변하는 현지 규정을 준수할 수 있도록 지원하는 글로벌 허브입니다.",
    overviewJa: "SAP ドキュメント・レポーティングコンプライアンス(DRC)は、グローバルな電子請求書義務と税務報告要件を管理するためのSAPの包括的なソリューションです。",
    keyFeatures: ["Real-time E-Invoicing & Legal Validation", "Country-Specific Digital Tax Reporting", "Automated Regulatory Logic Updates", "Global Compliance Command Center", "Direct Tax Authority Connectivity", "Pre-Submission Data Integrity Checks"],
    keyFeaturesKo: ["전자 인보이스 연결: 글로벌 세무 당국과의 실시간 통합을 통해 매출 및 매입 인보이스의 즉각적인 법적 검증을 수행합니다.", "현지화된 법정 보고: 요구되는 디지털 형식(XML, JSON 등)으로 국가별 세무 신고서(VAT, GST 등)를 자동 생성합니다.", "글로벌 컴플라이언스 모니터: 전 세계 모든 자회사의 규제 준수 상태를 하나의 대시보드에서 추적합니다.", "규제 업데이트 서비스: 정부의 세법 및 디지털 형식 변경에 맞춰 시스템 로직을 지속적으로 업데이트합니다."],
    keyFeaturesJa: ["60カ国以上の電子請求書", "リアルタイム税務報告", "SAP S/4HANA統合", "自動規制更新", "監査ファイル生成", "多国間コンプライアンス管理"],
    benefits: ["Achieve global tax compliance from a single platform", "Reduce compliance risk and penalties", "Automate regulatory updates", "Reduce manual tax reporting effort"],
    benefitsKo: ["단일 플랫폼에서 글로벌 세금 준수 달성", "규정 준수 위험 및 벌금 감소", "규제 업데이트 자동화", "수동 세금 보고 노력 감소"],
    benefitsJa: ["単一プラットフォームからグローバルな税務コンプライアンスを達成", "コンプライアンスリスクとペナルティの削減", "規制更新の自動化", "手動税務報告の工数削減"],
  },
  "sap-trm": {
    overview: "In an era of geopolitical instability and fluctuating markets, managing financial risk is a board-level priority. SAP TRM is a comprehensive solution that provides the analytical depth required to manage liquidity, foreign exchange (FX), interest rates, and commodity price risks. MAVEK BCS doesn't just install the software; we engineer a robust risk management framework. We configure advanced hedging strategies and automated effectiveness testing to ensure compliance with international standards like IFRS 9. Our goal is to transform your treasury department into a proactive risk-mitigation hub, where market volatility is quantified and managed through sophisticated modeling, ensuring your group's financial stability remains unshakable regardless of global market conditions.",
    overviewKo: "SAP TRM은 기업의 유동성을 관리하고 외환(FX), 금리, 원자재 가격 변동과 같은 재무 리스크를 완화하기 위한 결정적인 솔루션입니다. 현금을 최적화하고 그룹의 재무적 안정성을 확보하는 데 필요한 도구를 제공합니다.",
    overviewJa: "SAP トレジャリー・リスク管理(TRM)は、金融商品、ヘッジ戦略、財務リスクを管理するための包括的なツールを提供します。",
    keyFeatures: ["Advanced Market Risk Quantification (VaR)", "Automated Hedge Accounting & Compliance", "Integrated Trade-to-Accounting Workflow", "Sophisticated FX & Interest Rate Hedging", "Risk Scenario & Stress Testing", "Unified Global Treasury Analytics"],
    keyFeaturesKo: ["고급 리스크 분석: VaR(Value-at-Risk) 및 민감도 분석을 포함한 시장 리스크의 정량적 모델링을 지원합니다.", "통합 헤지 회계: IFRS 9 준수를 위해 헤지 수단에 대한 자동 문서화 및 유효성 테스트를 수행합니다.", "프론트-투-백 오피스 자동화: 초기 거래 입력부터 결제 및 회계 처리까지 전 과정을 원활하게 통합합니다.", "유동성 관리 통합: 자금 상태와 직접 연동하여 기업 자본을 가장 효율적으로 사용할 수 있도록 보장합니다."],
    keyFeaturesJa: ["金融商品管理", "ヘッジ会計 (IFRS 9/ASC 815)", "市場リスク分析", "カウンターパーティリスク管理", "規制報告", "SAP キャッシュマネジメントとの統合"],
    benefits: ["Reduce financial risk exposure", "Achieve hedge accounting compliance", "Improve treasury efficiency", "Enhance risk reporting to board"],
    benefitsKo: ["재무 위험 노출 감소", "헤지 회계 규정 준수 달성", "재무 효율성 향상", "이사회에 대한 위험 보고 강화"],
    benefitsJa: ["財務リスクエクスポージャーの削減", "ヘッジ会計コンプライアンスの達成", "財務効率の向上", "取締役会へのリスク報告の強化"],
  },
  "sap-cash-management": {
    overview: "Cash visibility is the cornerstone of financial resilience. As a core pillar of SAP S/4HANA Treasury, SAP Cash Management provides an uncompromising, real-time view of your company's global liquidity position. MAVEK BCS implements this solution to act as a high-precision radar for your cash managers, integrating data across sales, procurement, and finance to create highly accurate liquidity forecasts. We help you move away from reactive cash management to a strategic model where internal funding is optimized and external borrowing costs are minimized. With our expertise, your organization will gain the ability to mobilize cash across borders with speed and confidence, maximizing interest income and ensuring the most efficient use of corporate capital.",
    overviewKo: "SAP S/4HANA 재무 관리의 핵심 구성 요소인 SAP 현금 관리는 기업의 글로벌 유동성에 대한 완벽한 가시성을 제공합니다. 현금 관리자가 실시간으로 은행 잔액을 모니터링하고, 미래 현금 필요량을 예측하며, 외부 차입 비용을 줄이기 위한 내부 자금 조달을 최적화하는 데 필요한 주요 도구입니다.",
    overviewJa: "SAP キャッシュマネジメントは、グローバルな銀行環境全体でリアルタイムの現金可視性と流動性管理を提供します。",
    keyFeatures: ["Real-time Global Bank Balance Hub", "Multi-Dimensional Liquidity Forecasting", "Automated Bank Statement Integration", "Advanced Cash Pooling & Concentration", "Bank Account Lifecycle Governance", "Integrated In-House Banking Support"],
    keyFeaturesKo: ["실시간 글로벌 현금 가시성: 전체 글로벌 조직의 모든 은행 계좌 잔액에 대한 단일 '신뢰 원천'을 제공합니다.", "고급 유동성 예측: 영업, 구매, 재무 데이터를 통합하여 높은 정밀도로 미래 현금 포지션을 예측합니다.", "자동화된 은행 명세서 처리: 글로벌 은행과의 직접 연동을 통해 수백만 건의 일일 거래 대조를 자동화합니다.", "현금 풀링 및 집중: 유휴 현금 잔액을 최소화하고 외부 차입 비용을 줄이기 위해 유동성을 중앙 집중화합니다."],
    keyFeaturesJa: ["リアルタイム現金ポジション", "流動性予測", "銀行口座管理", "キャッシュプーリングとネッティング", "ペイメントファクトリー機能", "SAP TRMとの統合"],
    benefits: ["Improve cash visibility by 100%", "Reduce idle cash balances", "Optimize working capital", "Reduce bank fees through consolidation"],
    benefitsKo: ["현금 가시성을 100% 향상", "유휴 현금 잔액 감소", "운전 자본 최적화", "통합을 통한 은행 수수료 절감"],
    benefitsJa: ["現金可視性を100%向上", "遊休現金残高の削減", "運転資本の最適化", "統合による銀行手数料の削減"],
  },
  "sap-mbc": {
    overview: "Large MNCs struggle with managing hundreds of individual bank portals and communication protocols. SAP MBC is a cloud-based multi-bank hub that simplifies the connection between the ERP and the global banking network (SWIFT, EBICS, Host-to-Host).",
    overviewKo: "대규모 다국적 기업은 수백 개의 개별 은행 포털과 통신 프로토콜을 관리하는 데 어려움을 겪습니다. SAP MBC는 ERP와 글로벌 은행 네트워크(SWIFT, EBICS, Host-to-Host 등) 사이의 연결을 단순화하는 클라우드 기반 멀티뱅크 허브입니다.",
    overviewJa: "SAP マルチバンクコネクティビティ(MBC)は、支払い処理と銀行明細書取得のための単一の標準化されたチャネルを提供し、複数の二国間銀行接続を置き換えることで銀行通信を簡素化します。",
    keyFeatures: ["Protocol Consolidation: Replaces multiple bank-specific interfaces with a single, secure cloud connection", "Global Payment Visibility: Real-time tracking of outbound payments and incoming bank statements across all global accounts", "SWIFT Integration: Native connectivity to the SWIFT network for global payment messaging and bank statement retrieval", "Bank Fee Optimization: Reduces the IT cost and complexity of maintaining individual banking interfaces and middleware"],
    keyFeaturesKo: ["프로토콜 통합: 여러 은행별 인터페이스를 하나의 안전한 클라우드 연결로 대체합니다.", "글로벌 지불 가시성: 모든 글로벌 계좌에 대한 출금 지불 및 입금 내역을 실시간으로 추적합니다.", "SWIFT 통합: 글로벌 지불 메시징 및 은행 명세서 수신을 위해 SWIFT 네트워크와 네이티브 연결을 지원합니다.", "은행 수수료 최적화: 개별 은행 인터페이스 및 미들웨어를 유지 관리하는 데 드는 IT 비용과 복잡성을 줄여줍니다."],
    keyFeaturesJa: ["単一銀行接続ハブ", "SWIFTとローカルフォーマットサポート", "支払い状況モニタリング", "銀行明細書の自動化", "マルチバンク支払い処理", "規制コンプライアンス"],
    benefits: ["Reduce bank connectivity costs by 40%", "Simplify payment operations", "Improve payment visibility", "Reduce bank onboarding time"],
    benefitsKo: ["은행 연결 비용을 40% 절감", "결제 운영 간소화", "결제 가시성 향상", "은행 온보딩 시간 단축"],
    benefitsJa: ["銀行接続コストを40%削減", "支払い業務の簡素化", "支払い可視性の向上", "銀行オンボーディング時間の短縮"],
  },
  "sap-fscm": {
    overview: "SAP FSCM is an integrated suite of modules designed to optimize the Order-to-Cash (O2C) cycle by managing credit risk, streamlining collections, and automating dispute management. It transforms the treasury function from a transactional department into a strategic hub that maximizes working capital and minimizes bad debt.",
    overviewKo: "SAP FSCM은 신용 리스크 관리, 수금 간소화, 분쟁 관리 자동화를 통해 주문-현금화(O2C) 사이클을 최적화하도록 설계된 통합 모듈 제품군입니다. 재무 기능을 거래 처리 부서에서 운전 자본을 극대화하고 대손을 최소화하는 전략적 허브로 전환합니다.",
    overviewJa: "SAP 財務サプライチェーン管理(FSCM)は、クレジット管理、回収管理、紛争管理のための統合ソリューションを提供し、組織が運転資本を最適化し財務リスクを削減するのを支援します。",
    keyFeatures: ["Automated Credit Management: Real-time scoring and credit limit monitoring based on internal payment history and external credit agency data", "Collections Intelligence: Data-driven prioritization of collection activities to focus on the most critical outstanding receivables", "Dispute Resolution Workflow: Centralized tracking of customer payment discrepancies to accelerate resolution and improve customer relations", "Electronic Bill Presentment & Payment (EBPP): Digital invoicing and payment portals to reduce DSO (Days Sales Outstanding)"],
    keyFeaturesKo: ["자동화된 신용 관리: 내부 결제 이력 및 외부 신용 기관 데이터를 기반으로 실시간 신용 한도 모니터링을 수행합니다.", "수금 인텔리전스: 가장 중요한 미수금에 집중하기 위해 데이터 기반으로 수금 활동의 우선순위를 정합니다.", "분쟁 해결 워크플로우: 고객 결제 불일치를 중앙에서 추적하여 해결을 가속화하고 고객 관계를 개선합니다.", "전자 청구서 제시 및 결제(EBPP): 디지털 인보이스 및 결제 포털을 통해 DSO(매출채권 회수 기간)를 단축합니다."],
    keyFeaturesJa: ["与信限度管理", "自動督促", "回収ワークリスト管理", "紛争ケース管理", "顧客リスクスコアリング", "SAP ARとの統合"],
    benefits: ["Reduce DSO by up to 20%", "Improve credit risk management", "Accelerate dispute resolution", "Reduce bad debt write-offs"],
    benefitsKo: ["DSO를 최대 20% 감소", "신용 위험 관리 향상", "분쟁 해결 가속화", "대손 상각 감소"],
    benefitsJa: ["DSOを最大20%削減", "信用リスク管理の向上", "紛争解決の加速", "貸倒償却の削減"],
  },
  "sap-brim": {
    overview: "As business models shift toward subscriptions and usage-based services, SAP BRIM (formerly Hybris Billing) provides the high-volume transaction engine required for complex pricing and billing. It is the definitive solution for MNCs transitioning to Everything-as-a-Service (XaaS) models.",
    overviewKo: "비즈니스 모델이 구독 및 사용량 기반 서비스로 전환됨에 따라, SAP BRIM(구 Hybris Billing)은 복잡한 가격 책정 및 청구에 필요한 대용량 트랜잭션 엔진을 제공합니다. 서비스형 모든 것(XaaS) 모델로 전환하는 다국적 기업을 위한 결정적인 솔루션입니다.",
    overviewJa: "SAP 請求・収益イノベーション管理(BRIM)は、サブスクリプション、使用量ベースの価格設定、ハイブリッドモデルを含む複雑な請求シナリオを管理するための包括的なプラットフォームです。",
    keyFeatures: ["Subscription & Usage-Based Rating: Scalable engine that processes millions of consumption events and applies complex pricing tiers in real-time", "Convergent Invoicing: Consolidating multiple service charges (recurring, one-time, usage-based) into a single, clear customer invoice", "Partner Settlement & Revenue Share: Automated calculation and payout management for complex partner ecosystems and marketplaces", "Advanced Contract Management: Lifecycle management of service contracts, including automated renewals and mid-term upgrades"],
    keyFeaturesKo: ["구독 및 사용량 기반 요금 산정: 수백만 건의 소비 이벤트를 처리하고 실시간으로 복잡한 가격 계층을 적용하는 확장 가능한 엔진을 제공합니다.", "통합 인보이스 발행: 여러 서비스 요금(정기, 일회성, 사용량 기반)을 하나의 명확한 고객 인보이스로 통합합니다.", "파트너 정산 및 수익 배분: 복잡한 파트너 생태계 및 마켓플레이스에 대한 자동화된 계산 및 지급 관리를 수행합니다.", "고급 계약 관리: 자동 갱신 및 중도 업그레이드를 포함한 서비스 계약의 전체 라이프사이클을 관리합니다."],
    keyFeaturesJa: ["サブスクリプション請求管理", "使用量ベースの請求とレーティング", "収益認識 (IFRS 15/ASC 606)", "契約管理", "収益会計", "マルチパーティ決済"],
    benefits: ["Support new business models quickly", "Achieve IFRS 15 compliance", "Reduce billing errors and disputes", "Accelerate revenue recognition"],
    benefitsKo: ["새로운 비즈니스 모델을 빠르게 지원", "IFRS 15 규정 준수 달성", "청구 오류 및 분쟁 감소", "수익 인식 가속화"],
    benefitsJa: ["新しいビジネスモデルを迅速にサポート", "IFRS 15コンプライアンスの達成", "請求エラーと紛争の削減", "収益認識の加速"],
  },
  "sap-grc": {
    overview: "Trust is the most valuable asset a corporation holds. SAP GRC is an enterprise-wide framework designed to protect that trust by identifying risks, managing internal controls, and ensuring absolute transparency. MAVEK BCS implements SAP GRC to create a culture of \"Clean Finance,\" where fraud is prevented before it starts and compliance is woven into the fabric of every process. We specialize in automating access controls to prevent Segregation of Duties (SoD) conflicts and implementing continuous process monitoring to detect control deficiencies in real-time. With our guidance, your governance framework becomes a strategic advantage, providing stakeholders with the confidence that your global operations are managed with the highest ethical and professional standards.",
    overviewKo: "SAP GRC는 단일 통합 플랫폼 내에서 리스크를 식별하고, 내부 통제를 관리하며, 규제 준수를 보장할 수 있도록 지원하는 전사적 프레임워크입니다. 사기를 방지하고 글로벌 조직 전반에 걸쳐 Clean Finance를 보장함으로써 기업 평판을 보호합니다.",
    overviewJa: "SAP ガバナンス・リスク・コンプライアンス(GRC)は、企業リスクを管理し、規制コンプライアンスを確保し、組織全体で効果的なガバナンスを維持するための統合フレームワークを提供します。",
    keyFeatures: ["Automated Segregation of Duties (SoD)", "Continuous Process Control Monitoring", "Strategic Risk Identification & Mapping", "Unified Audit Project Management", "Centralized Policy & Compliance Tracking", "Proactive Fraud Detection Framework"],
    keyFeaturesKo: ["접근 통제 및 직무 분리(SoD): 재무 사기로 이어질 수 있는 충돌 접근을 방지하기 위해 사용자 권한을 자동으로 모니터링합니다.", "프로세스 통제 자동화: 내부 재무 통제를 지속적으로 모니터링하여 결함을 실시간으로 식별하고 시정합니다.", "리스크 관리 및 히트맵: 경영진 의사결정을 위한 시각적 보고와 함께 기업 리스크의 정량적·정성적 평가를 수행합니다.", "자동화된 감사 관리: 계획부터 실행 및 보고까지 전체 감사 라이프사이클을 간소화합니다."],
    keyFeaturesJa: ["アクセス制御とSoD管理", "プロセス制御と監査管理", "リスク管理フレームワーク", "規制変更管理", "不正管理", "グローバル貿易コンプライアンス"],
    benefits: ["Reduce compliance violations", "Automate audit processes", "Improve risk visibility", "Reduce audit preparation costs"],
    benefitsKo: ["규정 준수 위반 감소", "감사 프로세스 자동화", "위험 가시성 향상", "감사 준비 비용 절감"],
    benefitsJa: ["コンプライアンス違反の削減", "監査プロセスの自動化", "リスク可視性の向上", "監査準備コストの削減"],
  },
  "sap-analytics-cloud": {
    overview: "SAC for Planning is an AI-driven, cloud-native platform that unifies financial planning, forecasting, and analysis. It allows the Office of the CFO to move beyond spreadsheets into Extended Planning & Analysis (xP&A), connecting financial goals with operational reality.",
    overviewKo: "SAC 플래닝은 재무 계획, 예측 및 분석을 통합하는 AI 기반 클라우드 네이티브 플랫폼입니다. CFO 오피스가 스프레드시트를 넘어 '확장된 계획 및 분석(xP&A)'으로 나아가 재무 목표와 운영 실무를 연결할 수 있도록 합니다.",
    overviewJa: "SAP アナリティクスクラウド(SAC)は、単一のクラウドプラットフォームでビジネスインテリジェンス、計画、予測分析を組み合わせ、財務チームがより速く正確に計画し、ビジネス全体にインサイトを提供できるようにします。",
    keyFeatures: ["Predictive Forecasting: Built-in machine learning algorithms that analyze historical trends to generate accurate future projections automatically", "Driver-Based Modeling: Advanced What-if scenario analysis to see how changes in market drivers impact the bottom line", "Unified BI & Planning: Real-time data visualization that allows users to move seamlessly from analyzing historical data to entering plan values", "Collaborative Enterprise Planning: Real-time collaboration tools that align budgets across HR, Sales, and Finance departments globally"],
    keyFeaturesKo: ["예측형 포캐스팅: 내장된 머신러닝 알고리즘이 과거 트렌드를 분석하여 정확한 미래 전망치를 자동으로 생성합니다.", "드라이버 기반 모델링: 시장 동인(Driver)의 변화가 실적에 미치는 영향을 파악하기 위한 고급 'What-if' 시나리오 분석을 수행합니다.", "통합 BI 및 플래닝: 실시간 데이터 시각화를 통해 사용자가 과거 데이터 분석에서 계획값 입력으로 원활하게 전환할 수 있습니다.", "협업적 전사 계획: 글로벌 전역의 인사, 영업, 재무 부서 간 예산을 일치시킬 수 있는 실시간 협업 도구를 제공합니다."],
    keyFeaturesJa: ["統合計画と分析", "AI/MLによる予測予測", "ドライバーベースの計画モデル", "リアルタイムデータ接続", "コラボレーティブ計画ワークフロー", "モバイルファーストダッシュボード"],
    benefits: ["Reduce planning cycle time by 50%", "Improve forecast accuracy", "Enable real-time performance monitoring", "Eliminate disconnected planning tools"],
    benefitsKo: ["계획 주기 시간을 50% 단축", "예측 정확도 향상", "실시간 성과 모니터링 가능", "연결되지 않은 계획 도구 제거"],
    benefitsJa: ["計画サイクル時間を50%短縮", "予測精度の向上", "リアルタイムパフォーマンスモニタリングの実現", "切り離された計画ツールの排除"],
  },
  "oracle-pbcs": {
    overview: "Oracle PBCS is a market-leading EPM (Enterprise Performance Management) solution that brings the power of Hyperion to the cloud. It is designed for agility, allowing MNCs to execute sophisticated budgeting processes and rolling forecasts without the burden of heavy IT infrastructure.",
    overviewKo: "Oracle PBCS는 Hyperion의 기능을 클라우드로 가져온 시장 선도적인 EPM(기업 성과 관리) 솔루션입니다. 민첩성을 위해 설계되었으며, 다국적 기업이 무거운 IT 인프라 부담 없이 정교한 예산 편성 프로세스와 롤링 포캐스트를 실행할 수 있게 합니다.",
    overviewJa: "Oracle 計画・予算クラウドサービス(PBCS)は、組み込みのワークフロー、承認、レポーティング機能を備えたアジャイルなドライバーベースの財務計画を構築できるクラウドベースの計画・予算ソリューションです。",
    keyFeatures: ["Flexible Financial Modeling: Robust engine for complex allocations, currency translations, and bottom-up/top-down budgeting", "Interactive Dashboards & Reporting: Drag-and-drop report builders that provide instant insights into budget vs. actual variances", "Oracle Smart View Integration: Allowing finance teams to leverage their existing Excel skills while working directly with a secure, centralized database", "Scalable Sandboxing: Private environments where planners can test multiple budget scenarios without affecting the master data"],
    keyFeaturesKo: ["유연한 재무 모델링: 복잡한 배부, 통화 변환, 상향식/하향식 예산 편성을 위한 강력한 엔진을 갖추고 있습니다.", "대화형 대시보드 및 보고: 드래그 앤 드롭 방식의 보고서 작성기를 통해 예산 대비 실적 차이에 대한 즉각적인 통찰력을 제공합니다.", "Oracle Smart View 통합: 재무팀이 익숙한 엑셀 기술을 활용하면서 보안이 유지되는 중앙 집중식 데이터베이스와 직접 연동할 수 있습니다.", "확장 가능한 샌드박싱: 마스터 데이터에 영향을 주지 않고 기획자가 다양한 예산 시나리오를 테스트할 수 있는 프라이빗 환경을 제공합니다."],
    keyFeaturesJa: ["ドライバーベースの計画モデル", "ローリング予測機能", "シナリオモデリングとWhat-If分析", "ワークフローと承認管理", "ナラティブレポーティング", "Oracle ERPクラウドとの統合"],
    benefits: ["Accelerate planning cycle by 40%", "Improve forecast accuracy", "Enable collaborative planning", "Reduce planning tool maintenance"],
    benefitsKo: ["계획 주기를 40% 가속화", "예측 정확도 향상", "협업 계획 가능", "계획 도구 유지 관리 감소"],
    benefitsJa: ["計画サイクルを40%加速", "予測精度の向上", "コラボレーティブ計画の実現", "計画ツールのメンテナンス削減"],
  },
  "sap-re-fx": {
    overview: "In response to global lease accounting standards (IFRS 16 / ASC 842), SAP RE-FX has become a critical compliance tool. It provides a comprehensive solution for managing large-scale corporate real estate portfolios and complex equipment leases while ensuring perfect financial alignment.",
    overviewKo: "글로벌 리스 회계 표준(IFRS 16 / ASC 842)에 대응하여 SAP RE-FX는 필수적인 컴플라이언스 도구가 되었습니다. 대규모 기업 부동산 포트폴리오와 복잡한 장비 리스를 관리하는 동시에 완벽한 재무적 일관성을 보장하는 포괄적인 솔루션을 제공합니다.",
    overviewJa: "SAP 不動産管理(RE-FX)は、包括的なリースと不動産管理機能を提供し、組織がIFRS 16コンプライアンスを確保し、占有コストを最適化しながら不動産ポートフォリオ全体を管理できるようにします。",
    keyFeatures: ["IFRS 16 / ASC 842 Native Compliance: Automated calculation of Right-of-Use (RoU) assets and lease liabilities with direct posting to the ledger", "Portfolio Management: Centralized repository for all lease terms, critical dates, and financial conditions for global property assets", "Space & Occupancy Optimization: Visual tools to track space utilization, vacancy rates, and facility management costs", "Contract Lifecycle Automation: Automated triggers for lease renewals, indexations, and terminations to prevent missed financial opportunities"],
    keyFeaturesKo: ["IFRS 16 / ASC 842 네이티브 준수: 사용권(RoU) 자산 및 리스 부채의 자동 계산과 원장 직접 전기 기능을 제공합니다.", "포트폴리오 관리: 글로벌 자산에 대한 모든 리스 조건, 중요 날짜 및 재무 조건을 중앙 리포지토리에서 관리합니다.", "공간 및 점유 최적화: 공간 활용도, 공실률, 시설 관리 비용을 추적하기 위한 시각적 도구를 제공합니다.", "계약 라이프사이클 자동화: 리스 갱신, 지수화(Indexation), 종료에 대한 자동 트리거를 통해 재무적 기회 손실을 방지합니다."],
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
                  <div className="section-divider mt-10" />
                  <h3 className="text-2xl font-bold mb-6" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? "핵심 기능" : language === "ja" ? "主要機能" : "Key Features"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keyFeatures.map((feature, idx) => {
                      const featureIcons = [Zap, Shield, BarChart3, Globe, Settings, TrendingUp, Lock, CheckCircle2];
                      const FeatureIcon = featureIcons[idx % featureIcons.length];
                      const [title, ...descParts] = feature.split(":");
                      const desc = descParts.join(":").trim();
                      return (
                        <div key={idx} className="flex items-start gap-4 p-5 border border-gray-100 hover:border-[var(--gold)] transition-colors group" style={{ backgroundColor: "var(--off-white)" }}>
                          <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--navy-dark)" }}>
                            <FeatureIcon size={18} color="var(--gold)" />
                          </div>
                          <div>
                            <p className="text-sm font-bold mb-1" style={{ color: "var(--navy-dark)" }}>{title.trim()}</p>
                            {desc && <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>}
                          </div>
                        </div>
                      );
                    })}
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

      {/* Why MAVEK BCS CTA */}
      <section className="py-20" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-12" style={{ backgroundColor: "var(--gold)" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>Why MAVEK BCS</span>
              <div className="h-px w-12" style={{ backgroundColor: "var(--gold)" }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {language === "ko" ? "글로벌 재무 성공을 위한 당신의 파트너" : language === "ja" ? "グローバル財務成功へのブリッジ" : "Your Bridge to Global Financial Success"}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-3xl mx-auto">
              {language === "ko"
                ? "MAVEK BCS는 단순히 소프트웨어를 구현하는 것이 아니라 재무 탁월성을 설계합니다. 모든 솔루션 뒤에는 비즈니스 목표가 있다는 것을 이해합니다 — 더 빠른 성장, 낮은 리스크, 그리고 높은 투명성. 세계 최고 수준의 기술과 깊은 기능적·산업적 전문성을 결합하여, 귀사를 민첩성과 지속 가능한 성공의 미래로 이끌겠습니다. 귀사의 글로벌 재무 혁신이 저희의 궁극적인 사명입니다."
                : language === "ja"
                ? "MAVEKBCSは、単にソフトウェアを導入するだけでなく、財務の卓越性を設計します。すべてのソリューションの背後にはビジネス目標があることを理解しています — より速い成長、低いリスク、そして高い透明性。世界クラスのテクノロジーと深い機能的・業界的専門知識を組み合わせることで、貴社をアジリティと持続可能な成功の未来へと導きます。"
                : "At MAVEK BCS, we don't just implement software; we engineer financial excellence. We understand that behind every solution is a business goal — faster growth, lower risk, and higher transparency. By combining these world-class technologies with our deep functional and industry expertise, we lead your business to a future of agility and sustainable success. Your global financial transformation is our ultimate mission."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-gold no-underline">
                {language === "ko" ? "전문가와 상담하기" : language === "ja" ? "専門家に相談する" : "Speak with a Specialist"}
                <ArrowRight size={16} />
              </Link>
              <Link href="/solutions" className="btn-outline-navy no-underline" style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>
                {language === "ko" ? "모든 솔루션 보기" : language === "ja" ? "すべてのソリューション" : "Explore All Solutions"}
              </Link>
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
