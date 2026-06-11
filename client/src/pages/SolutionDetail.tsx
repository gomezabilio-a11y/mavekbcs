import { Link } from "wouter";
import { ArrowRight, ChevronRight, CheckCircle2, Zap, Shield, BarChart3, Globe, Settings, TrendingUp, Lock } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOLUTION_CATEGORIES } from "@/lib/siteData";
import { trpc } from "@/lib/trpc";
import { getLocalizedPath } from "@/lib/urlHelpers";
import { getRelatedArticlesForSolution } from "@/lib/insightMapping";

interface SolutionDetailProps {
  params: { category: string; slug: string };
}

const solutionDetails: Record<string, {
  overview: string; overviewKo: string; overviewJa: string;
  keyFeatures: string[]; keyFeaturesKo: string[]; keyFeaturesJa: string[];
  benefits: string[]; benefitsKo: string[]; benefitsJa: string[];
}> = {
  "sap-afc": {
    overview: 'In the high-stakes environment of global finance, the "Last Mile of Finance" is often the most chaotic. SAP AFC is not merely a task manager; it is a sophisticated cloud-based orchestrator designed to unify the fragmented Record-to-Report (R2R) lifecycle. MAVEK BCS leverages SAP AFC to eliminate the reliance on manual spreadsheets and disconnected emails, replacing them with a digital nerve center. Our implementation provides group controllers with an unprecedented level of transparency, allowing them to monitor the closing status of hundreds of subsidiaries in real-time. By institutionalizing standardized closing sequences and automating background job chains, MAVEK BCS helps your organization achieve a "Fast Close," reducing operational costs and allowing your finance team to focus on value-added analysis rather than administrative firefighting.',
    overviewKo: '글로벌 금융의 치열한 환경에서 \'재무의 라스트 마일(Last Mile)\'은 종종 가장 혼란스러운 단계입니다. SAP AFC는 단순한 태스크 관리자가 아니라, 분산된 기록-보고(R2R) 라이프사이클을 하나로 통합하기 위해 설계된 정교한 클라우드 기반 오케스트레이터입니다. MAVEK BCS는 SAP AFC를 활용해 수동 스프레드시트와 단편화된 이메일에 대한 의존도를 없애고, 이를 디지털 신경 중추로 대체합니다. 당사의 솔루션 도입을 통해 그룹 컨트롤러는 수백 개의 자회사 결산 상태를 실시간으로 모니터링할 수 있는 전례 없는 수준의 투명성을 확보하게 됩니다. MAVEK BCS는 표준화된 결산 절차를 체계화하고 백그라운드 작업 체인을 자동화하여 귀사가 \'결산 조기화(Fast Close)\'를 달성하도록 돕고, 재무팀이 행정적인 사후 처리가 아닌 가치 중심의 분석에 집중할 수 있도록 지원합니다.',
    overviewJa: "グローバルファイナンスという極めて重要な環境において、「ファイナンスのラストマイル」はしばしば最も混乱を極めるプロセスとなります。SAP AFCは単なるタスク管理ツールではありません。断片化されたRecord-to-Report（R2R）ライフサイクルを統合するために設計された、高度なクラウドベースのオーケストレーターです。MAVEK BCSは、SAP AFCを活用することで手動のスプレッドシートやバラバラのメールへの依存を排除し、デジタルな神経中枢へと置き換えます。当社の導入支援により、グループコントローラーは前例のないレベルの透明性を確保し、数百に及ぶ子会社の決算状況をリアルタイムで監視することが可能になります。標準化された決算シーケンスの制度化とバックグラウンドジョブチェーンの自動化により、MAVEK BCSはお客様の組織が「ファスト・クローズ（決算早期化）」を実現できるよう支援します。これにより、オペレーションコストを削減し、財務チームが事務的な火消し作業ではなく、付加価値の高い分析に集中できる環境を提供します。",
    keyFeatures: ["Global Closing Task Orchestration", "Automated Background Job Chains", "Real-time Closing Readiness Dashboards", "Standardized Best-Practice Templates", "Complete Governance & Audit Trails", "Intelligent Bottleneck Detection"],
    keyFeaturesKo: ['글로벌 결산 작업 오케스트레이션', '백그라운드 작업 체인 자동화', '실시간 결산 준비 상태 대시보드', '표준화된 베스트 프랙티스 템플릿', '완벽한 거버넌스 및 감사 추적(Audit Trail)', '지능형 병목 구간 탐지'],
    keyFeaturesJa: ["グローバル決算タスクのオーケストレーション", "バックグラウンドジョブチェーンの自動化", "リアルタイム決算準備状況ダッシュボード", "標準化されたベストプラクティス・テンプレート", "完全なガバナンスおよび監査証跡", "インテリジェントなボトルネック検知"],
    benefits: ["Reduce close cycle by up to 30%", "Eliminate manual task tracking spreadsheets", "Improve close quality and reduce errors", "Provide real-time visibility to CFO and controllers"],
    benefitsKo: ["결산 주기를 최대 30% 단축", "수동 작업 추적 스프레드시트 제거", "결산 품질 향상 및 오류 감소", "CFO 및 컨트롤러에게 실시간 가시성 제공"],
    benefitsJa: ["決算サイクルを最大30%短縮", "手動タスク追跡スプレッドシートの排除", "決算品質の向上とエラーの削減", "CFOとコントローラーへのリアルタイム可視性の提供"],
  },
  "sap-group-reporting": {
    overview: 'As business cycles accelerate, waiting weeks for consolidated results is no longer viable. SAP Group Reporting, embedded within SAP S/4HANA, revolutionizes the consolidation process by removing the wall between local accounting and group reporting. It facilitates a "Continuous Consolidation" model where data is validated and aggregated as transactions occur, not just at month-end. MAVEK BCS specializes in architecting this unified data model to provide a single source of truth for your entire organization. Our consulting approach ensures that complex eliminations, currency translations, and multi-GAAP requirements are handled automatically within the system, empowering the Office of the CFO to provide stakeholders with accurate, real-time insights into the group\'s financial performance.',
    overviewKo: '비즈니스 사이클이 가속화됨에 따라, 연결 결산 결과를 얻기 위해 몇 주씩 기다리는 방식은 더 이상 유효하지 않습니다. SAP S/4HANA에 내장된 SAP Group Reporting은 로컬 회계와 그룹 보고 사이의 벽을 허물어 연결 프로세스에 혁신을 가져옵니다. 이 솔루션은 데이터가 월말뿐만 아니라 거래가 발생할 때마다 검증 및 집계되는 \'실시간 연결(Continuous Consolidation)\' 모델을 촉진합니다. MAVEK BCS는 이 통합 데이터 모델을 설계하여 전사적인 단일 신뢰 원천(SSOT)을 제공하는 데 특화되어 있습니다. 당사의 컨설팅을 통해 복잡한 내부거래 제거, 통화 환산, 다중 회계 기준(Multi-GAAP) 요구사항이 시스템 내에서 자동으로 처리되며, CFO 오피스는 이해관계자에게 그룹의 재무 성과에 대한 정확하고 실시간적인 통찰력을 제공할 수 있습니다.',
    overviewJa: "ビジネスサイクルの加速に伴い、連結結果を数週間も待つことはもはや許容されません。SAP S/4HANAに組み込まれたSAP Group Reportingは、ローカル会計とグループ報告の間の壁を取り払うことで、連結プロセスに革命をもたらします。これは「継続的連結（Continuous Consolidation）」モデルを促進し、期末だけでなく、取引が発生するたびにデータが検証・集計される仕組みを提供します。MAVEK BCSはこの統合データモデルの構築に精通しており、組織全体に「シングル・ソース・オブ・トゥルース（信頼できる唯一の情報源）」を提供します。当社のコンサルティングアプローチにより、複雑な内部取引消去、通貨換算、およびマルチGAAP（会計基準）要件がシステム内で自動的に処理されるようになり、CFO組織がステークホルダーに対してグループの財務状況に関する正確でリアルタイムなインサイトを提供できるよう支援します。",
    keyFeatures: ["Native S/4HANA Data Integration", "Real-time Intercompany Elimination", "Multi-GAAP & Multi-Currency Agility", "Automated Consolidation Ledger", "Advanced Equity & Investment Handling", "Drill-down to Transactional Details"],
    keyFeaturesKo: ['네이티브 S/4HANA 데이터 통합', '실시간 내부거래 제거 및 대조', '다중 회계 기준 및 다국적 통화 기민성', '자동화된 연결 원장', '고도화된 자본 및 투자 지분 처리', '트랜잭션 단위까지의 드릴다운(Drill-down)'],
    keyFeaturesJa: ["ネイティブなS/4HANAデータ統合", "リアルタイムな内部取引消去", "マルチGAAPおよび多通貨への機敏な対応", "自動化された連結元帳", "高度な資本・投資持分処理", "トランザクションレベルまでのドリルダウン"],
    benefits: ["Accelerate group close by up to 40%", "Single source of truth for group financials", "Reduce manual consolidation adjustments", "Support IFRS and local GAAP simultaneously"],
    benefitsKo: ["그룹 결산을 최대 40% 가속화", "그룹 재무에 대한 단일 진실의 원천", "수동 통합 조정 감소", "IFRS 및 현지 GAAP 동시 지원"],
    benefitsJa: ["グループ決算を最大40%加速", "グループ財務の単一の真実の源泉", "手動連結調整の削減", "IFRSとローカルGAAPの同時サポート"],
  },
  "oracle-fccs": {
    overview: "For multinational corporations with complex ownership structures and diverse ERP landscapes, financial integrity is paramount. Oracle FCCS is a world-class EPM solution that brings rigorous discipline to the global consolidation process. It combines a robust consolidation engine with powerful workflow orchestration to ensure every step of the close is executed with precision. MAVEK BCS excels in tailoring FCCS to navigate the intricacies of minority interests, complex equity accounting, and varied local reporting standards. By implementing FCCS, we help your organization build a transparent, repeatable, and audit-ready consolidation framework that scales effortlessly with your global expansion, ensuring that your corporate story is always backed by verifiable data.",
    overviewKo: '복잡한 소유 구조와 다양한 ERP 환경을 가진 다국적 기업에게 재무 정합성은 무엇보다 중요합니다. Oracle FCCS는 글로벌 연결 프로세스에 엄격한 규율을 부여하는 세계적인 수준의 EPM 솔루션입니다. 강력한 연결 엔진과 고도화된 워크플로우 오케스트레이션 기능을 결합하여 결산의 모든 단계가 정밀하게 실행되도록 보장합니다. MAVEK BCS는 소수 지분 관리, 복잡한 지분법 회계, 다양한 현지 보고 기준을 충족할 수 있도록 FCCS를 최적화하는 데 탁월한 역량을 보유하고 있습니다. FCCS 도입을 통해 투명하고 반복 가능하며 감사에 즉시 대응할 수 있는 연결 프레임워크 구축을 도와드리며, 이는 글로벌 확장에 맞춰 유연하게 확장되어 귀사의 재무 스토리가 항상 검증된 데이터에 의해 뒷받침되도록 보장합니다.',
    overviewJa: "複雑な資本構造と多様なERP環境を持つ多国籍企業にとって、財務の整合性は最優先事項です。Oracle FCCSは、グローバル連結プロセスに厳格な規律をもたらす世界クラスのEPMソリューションです。強力な連結エンジンと高度なワークフロー・オーケストレーションを組み合わせ、決算のあらゆるステップが正確に実行されることを保証します。MAVEK BCSは、少数株主持分、複雑な持分法会計、および多様なローカル報告基準の細かな調整においてFCCSを最適化することに長けています。FCCSを導入することで、透明性が高く、反復可能で、監査に耐えうる連結フレームワークの構築を支援します。これはグローバルな事業拡大に合わせて容易に拡張可能であり、貴社のコーポレートストーリーが常に検証可能なデータによって裏付けられることを確実にします。",
    keyFeatures: ["Automated Complex Equity Accounting", "End-to-End Closing Workflow Control", "Built-in Financial Intelligence & Rules", "Automated Cash Flow Statement Logic", "Multi-Source Data Integration Hub", "C-Suite Level Financial Reporting"],
    keyFeaturesKo: ['복잡한 지분법 회계 자동화', '엔드-투-엔드 결산 워크플로우 제어', '내장된 재무 인텔리전스 및 규칙', '현금 흐름 보고서 로직 자동화', '다중 소스 데이터 통합 허브', '경영진 수준의 고도화된 재무 보고'],
    keyFeaturesJa: ["複雑な持分会計の自動化", "エンドツーエンドの決算ワークフロー制御", "組み込みの財務インテリジェンスとルール", "キャッシュ・フロー計算書ロジックの自動化", "マルチソース・データ統合ハブ", "経営層レベルの財務報告"],
    benefits: ["Reduce consolidation time by 50%", "Improve accuracy of group financial statements", "Enable faster regulatory filing", "Reduce IT infrastructure costs"],
    benefitsKo: ["통합 시간을 50% 단축", "그룹 재무제표의 정확도 향상", "규제 제출 가속화", "IT 인프라 비용 절감"],
    benefitsJa: ["連結時間を50%短縮", "グループ財務諸表の精度向上", "規制申告の迅速化", "ITインフラコストの削減"],
  },
  "oracle-arcs": {
    overview: "Account reconciliation is often the single biggest hurdle to a fast close. Oracle ARCS modernizes this traditionally manual and error-prone task by utilizing machine learning and intelligent matching. By focusing your finance team on high-risk exceptions rather than mundane data entry, MAVEK BCS implements ARCS to drastically improve operational efficiency. Our consulting approach ensures that your reconciliation process becomes a proactive risk-mitigation tool, preventing financial misstatements before they occur.",
    overviewKo: '계정 대조 작업은 종종 결산 조기화를 가로막는 가장 큰 장애물입니다. Oracle ARCS는 머신러닝과 지능형 매칭을 활용하여 수동적이고 오류가 잦았던 이 작업을 현대화합니다. MAVEK BCS는 재무팀이 단순 데이터 입력이 아닌 고위험 예외 사항에 집중할 수 있도록 ARCS를 구축하여 운영 효율성을 획기적으로 향상시킵니다. 당사의 컨설팅 접근 방식은 계정 대조 프로세스를 선제적인 리스크 완화 도구로 전환하여, 재무제표 오류가 발생하기 전에 미리 방지할 수 있도록 보장합니다.',
    overviewJa: "勘定照合は、決算早期化における最大の障壁となることが多々あります。Oracle ARCSは、機械学習とインテリジェントなマッチング機能を活用することで、従来の手動でミスが起きやすかったこの業務を近代化します。MAVEK BCSはARCSを導入することで、財務チームを定型的なデータ入力から解放し、高リスクな例外事項の管理に集中させることで、業務効率を劇的に向上させます。当社のコンサルティングにより、照合プロセスをプロアクティブなリスク軽減ツールへと変貌させ、財務諸表の誤表記を未然に防ぎます。",
    keyFeatures: ["High-volume Transaction Matching", "Risk-based Reconciliation Prioritization", "Digital Evidence Management", "Real-time Exception Alerts", "Aging Item Tracking", "Global Completion Dashboards"],
    keyFeaturesKo: ['대량 트랜잭션 자동 매칭', '리스크 기반 대조 우선순위 관리', '디지털 증빙 자료 관리', '실시간 예외 사항 알림', '미결 항목 노후화 추적', '전사 대조 완료 상태 대시보드'],
    keyFeaturesJa: ["大量トランザクションの自動マッチング", "リスクベースの照合優先順位付け", "デジタル証跡管理", "リアルタイムの例外アラート", "未決済項目のエージング追跡", "グローバルな完了状況ダッシュボード"],
    benefits: ["Reduce reconciliation time by 60%", "Eliminate manual spreadsheet reconciliations", "Improve audit readiness", "Reduce financial statement risk"],
    benefitsKo: ["조정 시간을 60% 단축", "수동 스프레드시트 조정 제거", "감사 준비성 향상", "재무제표 위험 감소"],
    benefitsJa: ["調整時間を60%短縮", "手動スプレッドシート調整の排除", "監査準備の向上", "財務諸表リスクの削減"],
  },
  "blackline": {
    overview: 'In a multi-ERP environment, financial consistency is a challenge. Blackline is the global leader in Financial Operations Management, designed to modernize the accounting function through high-level automation. It acts as the critical bridge between your ERP systems and the final financial report. MAVEK BCS excels in deploying Blackline to enable "Continuous Accounting," automating repetitive journals and reconciliations so your finance team can transition from data processors to strategic advisors.',
    overviewKo: '멀티 ERP 환경에서 재무적 일관성을 유지하는 것은 매우 어려운 과제입니다. Blackline은 고도의 자동화를 통해 회계 기능을 현대화하도록 설계된 재무 운영 관리 분야의 글로벌 리더입니다. 이 솔루션은 귀사의 ERP 시스템과 최종 재무 보고서 사이의 핵심적인 가교 역할을 수행합니다. MAVEK BCS는 Blackline을 성공적으로 배포하여 \'연속 회계(Continuous Accounting)\'를 구현하는 데 뛰어난 역량을 갖추고 있으며, 반복적인 분개 및 대조 작업을 자동화하여 귀사의 재무팀이 데이터 처리자에서 전략적 조언자로 전환될 수 있도록 지원합니다.',
    overviewJa: "マルチERP環境において、財務の一貫性を維持することは大きな挑戦です。Blacklineは財務業務管理（Financial Operations Management）のグローバルリーダーであり、高度な自動化を通じて会計機能を近代化します。ERPシステムと最終的な財務報告の間の重要な架け橋として機能します。MAVEK BCSはBlacklineの展開において卓越した実績を持ち、「継続的会計（Continuous Accounting）」を実現します。反復的な仕訳や照合を自動化することで、財務チームをデータ処理担当者から戦略的アドバイザーへと進化させます。",
    keyFeatures: ["Recurring Journal Entry Automation", "Intelligent Transaction Matching Engine", "Dedicated External Auditor Portal", "Global Task Checklist Synchronization", "Manual Process Elimination", "Seamless Multi-ERP Integration"],
    keyFeaturesKo: ['반복 분개장 처리 자동화', '지능형 트랜잭션 매칭 엔진', '외부 감사인 전용 포털', '글로벌 작업 체크리스트 동기화', '수동 프로세스 제거 및 자동화', '원활한 멀티 ERP 데이터 통합'],
    keyFeaturesJa: ["反復仕訳の自動化", "インテリジェントなトランザクション照合エンジン", "外部監査人専用ポータル", "グローバルなタスク・チェックリストの同期", "手動プロセスの排除", "シームレスなマルチERP統合"],
    benefits: ["Reduce close cycle by up to 25%", "Improve reconciliation quality", "Enable continuous accounting", "Reduce audit preparation time"],
    benefitsKo: ["결산 주기를 최대 25% 단축", "조정 품질 향상", "지속적인 회계 가능", "감사 준비 시간 단축"],
    benefitsJa: ["決算サイクルを最大25%短縮", "調整品質の向上", "継続的な会計の実現", "監査準備時間の短縮"],
  },
  "sap-drc": {
    overview: 'The global tax landscape is undergoing a digital revolution, with "Real-time Tax" becoming the new standard. SAP DRC is a mission-critical hub that enables MNCs to keep pace with the frantic rate of regulatory change. MAVEK BCS leverages DRC to automate the entire lifecycle of e-invoicing and digital statutory reporting, ensuring that your transactions are legally validated in real-time as they occur. We remove the burden of manual tax filings and the risk of non-compliance across multiple jurisdictions. Our implementation ensures that your compliance process is not just a defensive necessity, but a seamless, automated part of your business operations.',
    overviewKo: '글로벌 세무 환경은 \'실시간 세무 신고\'가 새로운 표준이 되는 디지털 혁명을 겪고 있습니다. SAP DRC는 다국적 기업이 급변하는 규제 속도를 따라갈 수 있게 해주는 핵심 허브입니다. MAVEK BCS는 DRC를 활용하여 전자 인보이스 발행 및 디지털 법정 보고의 전체 라이프사이클을 자동화하며, 거래가 발생함과 동시에 실시간으로 법적 검증이 이루어지도록 보장합니다. 이를 통해 수동 세무 신고의 부담과 여러 국가에 걸친 규제 미준수 리스크를 제거합니다. 당사의 솔루션 도입은 컴플라이언스 프로세스를 단순히 방어적인 필요 업무가 아니라, 비즈니스 운영의 원활하고 자동화된 일부로 변모시킵니다.',
    overviewJa: "グローバルな税制環境はデジタル革命の真っ只中にあり、「リアルタイム納税」が新たな標準となりつつあります。SAP DRCは、多国籍企業が猛烈なスピードで変化する規制に対応し続けるためのミッションクリティカルなハブです。MAVEK BCSは、DRCを活用して電子請求書発行（e-invoicing）とデジタル法定報告のライフサイクル全体を自動化し、取引が発生した瞬間にリアルタイムで法的検証が行われるようにします。これにより、手動の税務申告の負担や、複数の管轄区域における非コンプライアンスのリスクを排除します。当社の導入支援により、コンプライアンスプロセスは単なる防御的な必要事項ではなく、ビジネスオペレーションの一部としてシームレスに自動化されます。",
    keyFeatures: ["Real-time E-Invoicing & Legal Validation", "Country-Specific Digital Tax Reporting", "Automated Regulatory Logic Updates", "Global Compliance Command Center", "Direct Tax Authority Connectivity", "Pre-Submission Data Integrity Checks"],
    keyFeaturesKo: ['실시간 전자 인보이스 및 법적 검증', '국가별 디지털 세무 리포팅', '규제 로직 자동 업데이트 서비스', '글로벌 컴플라이언스 통합 관제 센터', '세무 당국과의 직접 데이터 연동', '제출 전 데이터 무결성 사전 검증'],
    keyFeaturesJa: ["リアルタイムな電子請求書発行および法的検証", "国別のデジタル税務報告", "規制ロジックの自動更新", "グローバル・コンプライアンス・コマンドセンター", "税務当局への直接接続", "提出前のデータ整合性チェック"],
    benefits: ["Achieve global tax compliance from a single platform", "Reduce compliance risk and penalties", "Automate regulatory updates", "Reduce manual tax reporting effort"],
    benefitsKo: ["단일 플랫폼에서 글로벌 세금 준수 달성", "규정 준수 위험 및 벌금 감소", "규제 업데이트 자동화", "수동 세금 보고 노력 감소"],
    benefitsJa: ["単一プラットフォームからグローバルな税務コンプライアンスを達成", "コンプライアンスリスクとペナルティの削減", "規制更新の自動化", "手動税務報告の工数削減"],
  },
  "sap-trm": {
    overview: "In an era of geopolitical instability and fluctuating markets, managing financial risk is a board-level priority. SAP TRM is a comprehensive solution that provides the analytical depth required to manage liquidity, foreign exchange (FX), interest rates, and commodity price risks. MAVEK BCS doesn't just install the software; we engineer a robust risk management framework. We configure advanced hedging strategies and automated effectiveness testing to ensure compliance with international standards like IFRS 9. Our goal is to transform your treasury department into a proactive risk-mitigation hub, where market volatility is quantified and managed through sophisticated modeling.",
    overviewKo: '지정학적 불안정성과 요동치는 시장 상황 속에서 재무 리스크 관리는 이사회의 최우선 과제입니다. SAP TRM은 유동성, 외환(FX), 금리 및 원자재 가격 리스크를 관리하는 데 필요한 깊이 있는 분석력을 제공하는 포괄적인 솔루션입니다. MAVEK BCS는 단순한 소프트웨어 설치를 넘어 강력한 리스크 관리 프레임워크를 설계합니다. 고도화된 헤지 전략과 자동화된 유효성 테스트를 구성하여 IFRS 9과 같은 국제 표준 준수를 보장합니다. 당사의 목표는 귀사의 자금 부서를 능동적인 리스크 완화 허브로 전환하여, 정교한 모델링을 통해 시장 변동성을 정량화하고 관리함으로써 그룹의 재무적 안정성을 확고히 하는 것입니다.',
    overviewJa: "地政学的な不安定さと市場の変動が激しい現代において、財務リスクの管理は取締役会レベルの優先事項です。SAP TRMは、流動性、外国為替（FX）、金利、および商品価格のリスクを管理するために必要な分析深度を提供する包括的なソリューションです。MAVEK BCSは単にソフトウェアをインストールするだけではありません。強固なリスク管理フレームワークを構築します。高度なヘッジ戦略と自動化された有効性テストを構成し、IFRS第9号などの国際基準への準拠を確実にします。当社の目標は、貴社の財務部門を能動的なリスク軽減ハブへと変革することです。高度なモデリングを通じて市場のボラティリティを定量化・管理し、グループの財務的安定性を維持します。",
    keyFeatures: ["Quantitative Market Risk Analysis", "Automated Hedge Accounting Compliance", "Integrated Trade-to-Accounting Workflow", "Sophisticated FX & Interest Rate Hedging", "Risk Scenario & Stress Testing", "Unified Global Treasury Analytics"],
    keyFeaturesKo: ['정량적 시장 리스크 분석 (VaR)', '헤지 회계 준수 자동화', '통합된 거래-회계 워크플로우', '정교한 외환 및 금리 헤지 도구', '리스크 시나리오 및 스트레스 테스트', '통합 글로벌 자금 분석 보고서'],
    keyFeaturesJa: ["高度な市場リスク定量化（VaR）", "自動化されたヘッジ会計コンプライアンス", "統合された取引から会計までのワークフロー", "洗練された為替・金利ヘッジ", "リスクシナリオおよびストレステスト", "統合されたグローバル・トレジャリー分析"],
    benefits: ["Reduce financial risk exposure", "Achieve hedge accounting compliance", "Improve treasury efficiency", "Enhance risk reporting to board"],
    benefitsKo: ["재무 위험 노출 감소", "헤지 회계 규정 준수 달성", "재무 효율성 향상", "이사회에 대한 위험 보고 강화"],
    benefitsJa: ["財務リスクエクスポージャーの削減", "ヘッジ会計コンプライアンスの達成", "財務効率の向上", "取締役会へのリスク報告の強化"],
  },
  "sap-cash-management": {
    overview: "Cash visibility is the cornerstone of financial resilience. As a core pillar of SAP S/4HANA Treasury, SAP Cash Management provides an uncompromising, real-time view of your company's global liquidity position. MAVEK BCS implements this solution to act as a high-precision radar for your cash managers, integrating data across sales, procurement, and finance to create highly accurate liquidity forecasts. We help you move away from reactive cash management to a strategic model where internal funding is optimized and external borrowing costs are minimized. With our expertise, your organization will gain the ability to mobilize cash across borders with speed and confidence.",
    overviewKo: '현금 가시성은 재무적 복원력의 초석입니다. SAP S/4HANA Treasury의 핵심 축인 SAP Cash Management는 기업의 글로벌 유동성 상태에 대해 실시간으로 타협 없는 가시성을 제공합니다. MAVEK BCS는 이 솔루션을 구축하여 자금 관리자가 실시간으로 은행 잔고를 모니터링하고 판매, 구매, 재무 데이터를 통합하여 고도로 정확한 유동성 예측을 생성할 수 있는 정밀 레이더 역할을 수행하게 합니다. 당사는 귀사가 수동적인 자금 관리에서 벗어나 내부 자금을 최적화하고 외부 차입 비용을 최소화하는 전략적 모델로 이동하도록 돕습니다.',
    overviewJa: "キャッシュの可視化は、財務レジリエンス（回復力）の礎石です。SAP S/4HANA Treasuryの核心的な柱であるSAP Cash Managementは、貴社のグローバルな流動性ポジションについて、一切の妥協のないリアルタイムの視界を提供します。MAVEK BCSはこのソリューションを導入し、キャッシュマネージャーにとっての高精度な「レーダー」として機能させます。販売、購買、および財務のデータを統合し、極めて正確な流動性予測を作成します。当社は、受動的な現金管理から、内部資金調達が最適化され、外部借入コストが最小化される戦略的モデルへの移行を支援します。当社の専門知識により、貴社は国境を越えて迅速かつ自信を持って資金を動かす能力を手に入れることができます。",
    keyFeatures: ["Real-time Global Bank Balance Hub", "Multi-Dimensional Liquidity Forecasting", "Automated Bank Statement Integration", "Advanced Cash Pooling & Concentration", "Bank Account Lifecycle Governance", "Integrated In-House Banking Support"],
    keyFeaturesKo: ['실시간 글로벌 은행 잔액 통합 허브', '다차원적 유동성 예측 및 분석', '은행 거래 명세서 자동 매칭', '고도화된 현금 풀링 및 집중화', '은행 계좌 라이프사이클 거버넌스', '통합 사내 은행(In-House Banking) 지원'],
    keyFeaturesJa: ["リアルタイムなグローバル銀行残高ハブ", "多次元的な流動性予測", "銀行取引明細書の自動照合", "高度なキャッシュ・プーリングおよび集中化", "銀行口座ライフサイクル・ガバナンス", "統合されたインハウス・バンキング支援"],
    benefits: ["Improve cash visibility by 100%", "Reduce idle cash balances", "Optimize working capital", "Reduce bank fees through consolidation"],
    benefitsKo: ["현금 가시성을 100% 향상", "유휴 현금 잔액 감소", "운전 자본 최적화", "통합을 통한 은행 수수료 절감"],
    benefitsJa: ["現金可視性を100%向上", "遊休現金残高の削減", "運転資本の最適化", "統合による銀行手数料の削減"],
  },
  "sap-mbc": {
    overview: "Managing hundreds of individual bank portals and disconnected communication protocols is an operational burden for global MNCs. SAP MBC is a secure, cloud-based multi-bank hub that simplifies the digital connection between your ERP and the global banking network. MAVEK BCS replaces fragmented banking interfaces with a single, secure channel for all your financial institutions. Our implementation reduces IT complexity, enhances security through end-to-end encryption, and ensures that your global payments and bank statements flow with unparalleled speed and reliability.",
    overviewKo: '수백 개의 개별 은행 포털과 서로 다른 통신 프로토콜을 관리하는 것은 글로벌 기업에 막대한 운영 부담입니다. SAP MBC는 ERP와 글로벌 은행 네트워크를 직접 연결하는 안전한 클라우드 기반 멀티뱅크 허브입니다. MAVEK BCS는 파편화된 은행 인터페이스를 하나의 안전한 채널로 교체해 드립니다. 당사의 구축 서비스는 IT 복잡성을 줄이고 종단 간 암호화를 통해 보안을 강화하며, 글로벌 지불 및 은행 명세서가 전례 없는 속도와 신뢰성으로 처리되도록 보장합니다.',
    overviewJa: "数百もの個別の銀行ポータルやバラバラの通信プロトコルを管理することは、多国籍企業にとって大きな業務負担です。SAP MBCは、ERPとグローバルな銀行ネットワークとの間のデジタル接続を簡素化する、安全なクラウドベースのマルチバンク・ハブです。MAVEK BCSは、断片化された銀行インターフェースを、すべての金融機関に対応する単一の安全なチャネルに置き換えます。当社の導入により、ITの複雑さが軽減され、エンドツーエンドの暗号化によってセキュリティが強化され、グローバルな支払と銀行取引明細書が比類のないスピードと信頼性で流れるようになります。",
    keyFeatures: ["Protocol Consolidation & Simplification", "Native SWIFT Network Integration", "Secure Payment Data Transmission", "Real-time Payment Status Tracking", "Reduced IT Middleware Overhead", "Unified Global Banking Gateway"],
    keyFeaturesKo: ['프로토콜 통합 및 통신 단순화', 'SWIFT 네트워크 네이티브 연결', '보안 지불 데이터 전송 보장', '실시간 지불 상태 추적', 'IT 미들웨어 유지비용 절감', '통합 글로벌 뱅킹 게이트웨이'],
    keyFeaturesJa: ["通信プロトコルの集約と簡素化", "ネイティブなSWIFTネットワーク統合", "安全な支払データ伝送", "リアルタイムな支払ステータス追跡", "ITミドルウェア・オーバーヘッドの削減", "統合されたグローバル・バンキング・ゲートウェイ"],
    benefits: ["Reduce bank connectivity costs by 40%", "Simplify payment operations", "Improve payment visibility", "Reduce bank onboarding time"],
    benefitsKo: ["은행 연결 비용을 40% 절감", "결제 운영 간소화", "결제 가시성 향상", "은행 온보딩 시간 단축"],
    benefitsJa: ["銀行接続コストを40%削減", "支払い業務の簡素化", "支払い可視性の向上", "銀行オンボーディング時間の短縮"],
  },
  "sap-fscm": {
    overview: 'Working capital optimization is a vital competitive advantage in today\'s volatile economy. SAP FSCM is an integrated suite designed to optimize the "Order-to-Cash" cycle by managing credit risk, streamlining collections, and automating dispute resolution. MAVEK BCS transforms your treasury function from a transactional department into a strategic hub that maximizes cash flow and minimizes bad debt. Our data-driven consulting approach ensures that your credit policies are perfectly balanced with sales growth, ensuring sustainable liquidity.',
    overviewKo: '운전자본 최적화는 변동성이 큰 오늘날의 경제에서 중요한 경쟁 우위입니다. SAP FSCM은 신용 리스크 관리, 수금 프로세스 효율화, 분쟁 해결 자동화를 통해 \'주문에서 대금 회수(O2C)\' 사이클을 최적화하도록 설계된 통합 제품군입니다. MAVEK BCS는 귀사의 자금 기능을 단순 거래 부서에서 현금 흐름을 극대화하고 대손상각을 최소화하는 전략적 허브로 전환시킵니다. 데이터 기반의 컨설팅을 통해 신용 정책과 매출 성장의 완벽한 균형을 실현합니다.',
    overviewJa: "今日の不安定な経済において、運転資本の最適化は極めて重要な競争優位性となります。SAP FSCMは、信用リスクの管理、回収業務の効率化、および紛争解決の自動化を通じて「受注から入金（Order-to-Cash）」サイクルを最適化するために設計された統合スイートです。MAVEK BCSは、貴社の財務機能を単なる事務処理部門から、キャッシュフローを最大化し貸倒損失を最小化する戦略的ハブへと変貌させます。当社のデータ駆動型のコンサルティングにより、信用政策と売上成長の完璧なバランスを実現し、持続可能な流動性を確保します。",
    keyFeatures: ["Real-time Credit Scoring & Monitoring", "Intelligent Collection Prioritization", "Dispute Resolution Workflow Automation", "Digital Bill Presentment & Payment (EBPP)", "Proactive Bad Debt Risk Mitigation", "Working Capital Efficiency Analytics"],
    keyFeaturesKo: ['실시간 신용 점수 산정 및 모니터링', '지능형 수금 우선순위 관리', '분쟁 해결 워크플로우 자동화', '전자 대금 청구 및 지불 (EBPP)', '선제적 대손 리스크 완화', '운전자본 효율성 분석 및 통찰'],
    keyFeaturesJa: ["リアルタイムな与信スコアリングおよびモニタリング", "インテリジェントな回収業務の優先順位付け", "紛争解決ワークフローの自動化", "電子請求書提示および支払（EBPP）", "能動的な貸倒リスクの軽減", "運転資本効率の分析"],
    benefits: ["Reduce DSO by up to 20%", "Improve credit risk management", "Accelerate dispute resolution", "Reduce bad debt write-offs"],
    benefitsKo: ["DSO를 최대 20% 감소", "신용 위험 관리 향상", "분쟁 해결 가속화", "대손 상각 감소"],
    benefitsJa: ["DSOを最大20%削減", "信用リスク管理の向上", "紛争解決の加速", "貸倒償却の削減"],
  },
  "sap-brim": {
    overview: 'As business models shift toward subscriptions and usage-based services, companies need a billing engine that can handle high-volume, complex pricing. SAP BRIM is the definitive solution for MNCs transitioning to "Everything-as-a-Service" (XaaS) models. MAVEK BCS excels in architecting BRIM to process millions of consumption events with surgical precision. We ensure that your revenue recognition is accurate, your convergent invoicing is transparent, and your partner settlement processes are fully automated, allowing you to scale your innovation effortlessly.',
    overviewKo: '비즈니스 모델이 구독 및 사용량 기반 서비스로 전환됨에 따라 대량의 복잡한 가격 책정을 처리할 수 있는 빌링 엔진이 필수적입니다. SAP BRIM은 \'서비스형(XaaS)\' 모델로 전환하는 기업을 위한 결정적인 솔루션입니다. MAVEK BCS는 수백만 건의 사용량 데이터를 정밀하게 처리할 수 있도록 BRIM 아키텍처를 설계하는 데 탁월합니다. 정확한 수익 인식, 투명한 통합 청구, 자동화된 파트너 정산을 통해 귀사의 비즈니스 혁신이 막힘없이 확장될 수 있도록 보장합니다.',
    overviewJa: "ビジネスモデルがサブスクリプションや従量課金制へと移行する中、企業には大量かつ複雑な価格設定を処理できる請求エンジンが必要です。SAP BRIMは、XaaS（Everything-as-a-Service）モデルへ移行する多国籍企業にとっての決定的なソリューションです。MAVEK BCSは、数百万件の消費イベントを緻密に処理するBRIMの構築に長けています。正確な収益認識、透明性の高い統合請求、そして完全自動化されたパートナー決済プロセスを実現し、貴社のイノベーションを容易にスケールアップさせます。",
    keyFeatures: ["High-volume Usage-based Rating", "Complex Subscription Lifecycle Management", "Convergent Invoicing Consolidation", "Partner Revenue Share & Settlement", "Dynamic Real-time Pricing Logic", "Scalable Transaction Processing Engine"],
    keyFeaturesKo: ['대량 트랜잭션 사용량 기반 요금 산정', '복잡한 구독 라이프사이클 관리', '통합 청구(Convergent Invoicing) 자동화', '파트너 수익 배분 및 정산 관리', '동적 실시간 가격 책정 로직', '확장 가능한 트랜잭션 처리 엔진'],
    keyFeaturesJa: ["大量トランザクションの従量課金処理", "複雑なサブスクリプション・ライフサイクル管理", "統合請求（Convergent Invoicing）", "パートナーへの収益配分および決済", "動的でリアルタイムな価格設定ロジック", "拡張性の高いトランザクション処理エンジン"],
    benefits: ["Support new business models quickly", "Achieve IFRS 15 compliance", "Reduce billing errors and disputes", "Accelerate revenue recognition"],
    benefitsKo: ["새로운 비즈니스 모델을 빠르게 지원", "IFRS 15 규정 준수 달성", "청구 오류 및 분쟁 감소", "수익 인식 가속화"],
    benefitsJa: ["新しいビジネスモデルを迅速にサポート", "IFRS 15コンプライアンスの達成", "請求エラーと紛争の削減", "収益認識の加速"],
  },
  "sap-grc": {
    overview: 'In a global regulatory environment, corporate reputation is built on trust and absolute transparency. SAP GRC is an enterprise-wide framework designed to identify risks and manage internal controls within a single, integrated platform. MAVEK BCS implements GRC to create a culture of "Clean Finance," where fraud is prevented through continuous monitoring. We specialize in automating access controls to prevent Segregation of Duties (SoD) conflicts, ensuring that your global operations are managed with the highest ethical and professional standards.',
    overviewKo: '글로벌 규제 환경에서 기업의 평판은 신뢰와 절대적인 투명성 위에 구축됩니다. SAP GRC는 단일 통합 플랫폼 내에서 리스크를 식별하고 내부 통제를 관리하는 전사적 프레임워크입니다. MAVEK BCS는 지속적인 모니터링을 통해 부정을 방지하는 \'투명한 재무(Clean Finance)\' 문화를 조성하기 위해 GRC를 구축합니다. 당사는 특히 업무 분장(SoD) 갈등을 방지하기 위한 액세스 제어 자동화에 전문성을 보유하고 있으며, 귀사의 글로벌 운영이 최고의 윤리적 및 전문적 표준에 따라 관리되도록 보장합니다.',
    overviewJa: "グローバルな規制環境において、企業の評判は信頼と絶対的な透明性の上に成り立ちます。SAP GRCは、単一の統合プラットフォーム内でリスクを特定し、内部統制を管理するために設計された全社的なフレームワークです。MAVEK BCSは、継続的なモニタリングを通じて不正を防止する「クリーン・ファイナンス」の文化を構築するためにGRCを導入します。職務分掌（SoD）の競合を防ぐためのアクセス管理の自動化を専門とし、グローバルな事業運営が最高レベルの倫理的・専門的基準で管理されることを保証します。",
    keyFeatures: ["Automated Segregation of Duties (SoD)", "Continuous Process Control Monitoring", "Strategic Risk Identification & Heatmapping", "Unified Audit Project Management", "Centralized Policy & Compliance Tracking", "Proactive Fraud Detection Framework"],
    keyFeaturesKo: ['자동화된 업무 분장(SoD) 관리', '지속적인 프로세스 통제 모니터링', '전략적 리스크 식별 및 히트맵 보고', '통합 감사 프로젝트 관리', '중앙 집중식 정책 및 규제 준수 추적', '선제적 부정행위 탐지 프레임워크'],
    keyFeaturesJa: ["自動化された職務分掌（SoD）管理", "継続的なプロセス統制モニタリング", "戦略的リスク特定およびヒートマッピング", "統合された監査プロジェクト管理", "集中管理されたポリシーおよびコンプライアンス追跡", "能動的な不正検知フレームワーク"],
    benefits: ["Reduce compliance violations", "Automate audit processes", "Improve risk visibility", "Reduce audit preparation costs"],
    benefitsKo: ["규정 준수 위반 감소", "감사 프로세스 자동화", "위험 가시성 향상", "감사 준비 비용 절감"],
    benefitsJa: ["コンプライアンス違反の削減", "監査プロセスの自動化", "リスク可視性の向上", "監査準備コストの削減"],
  },
  "sap-analytics-cloud": {
    overview: 'Static budgets are no longer sufficient for the modern enterprise. SAC for Planning is an AI-driven platform that unifies financial planning, forecasting, and analysis. MAVEK BCS helps the Office of the CFO move into "Extended Planning & Analysis" (xP&A), connecting strategic goals with operational reality. Our implementation empowers your team with machine learning insights, allowing you to predict future performance rather than just reporting on the past, ensuring your organization remains agile and forward-looking.',
    overviewKo: '정적인 예산 관리는 더 이상 현대 기업에 충분하지 않습니다. SAC for Planning은 재무 계획, 예측 및 분석을 통합하는 AI 기반 플랫폼입니다. MAVEK BCS는 CFO 오피스가 \'확장된 계획 및 분석(xP&A)\'으로 나아가 재무 목표와 운영의 실제를 연결하도록 돕습니다. 당사의 구축 서비스를 통해 재무팀은 머신러닝 통찰력을 활용하여 과거 보고에 그치지 않고 미래 성과를 예측함으로써 조직의 기민성과 전방위적 시야를 확보할 수 있습니다.',
    overviewJa: "現代の企業にとって、静的な予算管理だけではもはや不十分です。SAC for Planningは、財務計画、予測、および分析を統合するAI駆動型のプラットフォームです。MAVEK BCSは、CFO組織が「拡張計画分析（xP&A）」へと移行し、戦略目標と業務の現実を結びつけることを支援します。当社の導入により、財務チームは機械学習によるインサイトを活用できるようになり、過去の報告だけでなく将来のパフォーマンスを予測することが可能になります。これにより、組織は機敏性を保ち、常に先を見据えることができます。",
    keyFeatures: ["AI-driven Predictive Forecasting", 'Driver-based "What-if" Simulations', "Integrated BI & Planning Analysis", "Collaborative Enterprise Budgeting", "Real-time Visualization Dashboards", "Seamless S/4HANA Data Connectivity"],
    keyFeaturesKo: ['AI 기반 예측형 포캐스팅', '드라이버 기반 \'What-if\' 시나리오 분석', '통합 BI 및 플래닝 데이터 분석', '전사 부서 간 협업 예산 편성', '실시간 시각화 대시보드', '원활한 S/4HANA 데이터 연결성'],
    keyFeaturesJa: ["AI駆動型の予測シミュレーション", "ドライバーベースの「What-if」シナリオ分析", "統合されたBIおよび計画分析", "協調的なエンタープライズ予算編成", "リアルタイムな可視化ダッシュボード", "シームレスなS/4HANAデータ接続"],
    benefits: ["Reduce planning cycle time by 50%", "Improve forecast accuracy", "Enable real-time performance monitoring", "Eliminate disconnected planning tools"],
    benefitsKo: ["계획 주기 시간을 50% 단축", "예측 정확도 향상", "실시간 성과 모니터링 가능", "연결되지 않은 계획 도구 제거"],
    benefitsJa: ["計画サイクル時間を50%短縮", "予測精度の向上", "リアルタイムパフォーマンスモニタリングの実現", "切り離された計画ツールの排除"],
  },
  "oracle-pbcs": {
    overview: 'Agility and precision in forecasting are the hallmarks of successful financial leadership. Oracle PBCS brings sophisticated budgeting and forecasting capabilities to the cloud without the burden of heavy IT infrastructure. MAVEK BCS specializes in configuring PBCS to execute rolling forecasts and complex allocations with ease. We empower your planners to test multiple scenarios in secure "sandboxes," ensuring that your organization can respond instantly to market shifts with data-backed financial strategies.',
    overviewKo: '예측의 기민성과 정밀함은 성공적인 재무 리더십의 상징입니다. Oracle PBCS는 무거운 IT 인프라 부담 없이 세련된 예산 편성 및 예측 기능을 클라우드로 가져옵니다. MAVEK BCS는 롤링 포캐스트와 복잡한 배부 작업을 손쉽게 실행할 수 있도록 PBCS를 구성하는 데 전문성이 있습니다. 기획자가 안전한 \'샌드박스\' 내에서 여러 시나리오를 테스트할 수 있게 함으로써, 데이터에 기반한 재무 전략을 통해 시장 변화에 즉각 대응할 수 있는 역량을 부여합니다.',
    overviewJa: "予測における機敏性と精度は、財務リーダーシップの成功を象徴するものです。Oracle PBCSは、重厚なITインフラの負担なしに、洗練された予算編成と予測機能をクラウドでもたらします。MAVEK BCSは、ローリング予測や複雑な配分を容易に実行できるようPBCSを構成することに長けています。計画担当者が安全な「サンドボックス」内で複数のシナリオをテストできるようにし、組織がデータに基づいた財務戦略を持って市場の変化に即座に対応できる体制を整えます。",
    keyFeatures: ["Flexible Financial Modeling & Simulation", "Seamless Excel Smart View Integration", "Drag-and-drop Report Generation", "Secure Scenario Sandboxing", "Complex Allocation Logic Processing", "Top-down & Bottom-up Alignment"],
    keyFeaturesKo: ['유연한 재무 모델링 및 시뮬레이션', '엑셀 기반 스마트 뷰(Smart View) 통합', '드래그 앤 드롭 방식의 보고서 생성', '안전한 시나리오 테스트용 샌드박스', '복잡한 비용 배부 로직 처리', '상향식/하향식 계획 정렬 및 일치'],
    keyFeaturesJa: ["柔軟な財務モデリングおよびシミュレーション", "シームレスなExcel Smart View統合", "ドラッグ＆ドロップによるレポート生成", "安全なシナリオ・サンドボックス", "複雑な配分ロジックの処理", "トップダウンおよびボトムアップの整合"],
    benefits: ["Accelerate planning cycle by 40%", "Improve forecast accuracy", "Enable collaborative planning", "Reduce planning tool maintenance"],
    benefitsKo: ["계획 주기를 40% 가속화", "예측 정확도 향상", "협업 계획 가능", "계획 도구 유지 관리 감소"],
    benefitsJa: ["計画サイクルを40%加速", "予測精度の向上", "コラボレーティブ計画の実現", "計画ツールのメンテナンス削減"],
  },
  "sap-re-fx": {
    overview: "Lease accounting compliance is a critical requirement for global financial integrity. In response to standards like IFRS 16 and ASC 842, SAP RE-FX has become an essential tool for MNCs. MAVEK BCS provides a comprehensive solution for managing large-scale real estate portfolios and equipment leases. We ensure a perfect alignment between your physical assets and financial reporting, turning a complex compliance burden into a strategic opportunity for portfolio optimization and facility management.",
    overviewKo: '리스 회계 준수는 글로벌 재무 정합성을 위한 필수 요건입니다. IFRS 16 및 ASC 842 표준에 대응하여 SAP RE-FX는 다국적 기업에 없어서는 안 될 도구가 되었습니다. MAVEK BCS는 대규모 부동산 포트폴리오와 장비 리스를 관리하기 위한 포괄적인 솔루션을 제공합니다. 당사는 물리적 자산과 재무 보고 간의 완벽한 일치를 보장하여, 복잡한 컴플라이언스 부담을 포트폴리오 최적화 및 시설 관리를 위한 전략적 기회로 전환해 드립니다.',
    overviewJa: "リース会計のコンプライアンスは、グローバルな財務の整合性における重要な要件です。IFRS第16号やASC 842などの基準への対応において、SAP RE-FXは多国籍企業にとって不可欠なツールとなっています。MAVEK BCSは、大規模な不動産ポートフォリオや設備リースを管理するための包括的なソリューションを提供します。物理的資産と財務報告の完璧な一致を保証し、複雑なコンプライアンスの負担を、ポートフォリオの最適化や施設管理のための戦略的な機会へと変貌させます。",
    keyFeatures: ["Native IFRS 16 / ASC 842 Compliance", "Unified Global Lease Repository", "Space & Occupancy Optimization", "Automated Renewal & Expiry Alerts", "Maintenance Cost Tracking", "Real-time Liability & Asset Calculations"],
    keyFeaturesKo: ['네이티브 IFRS 16 / ASC 842 준수', '통합 글로벌 리스 리포지토리', '공간 및 점유율 최적화 분석', '계약 갱신 및 종료 자동 알림', '유지보수 비용 추적 및 관리', '실시간 리스 부채 및 자산 계산'],
    keyFeaturesJa: ["ネイティブなIFRS 16 / ASC 842準拠", "統合されたグローバル・リース・リポジトリ", "空間および占有率の最適化", "契約更新および期限の自動アラート", "メンテナンスコストの追跡", "リアルタイムな負債および資産計算"],
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

  // Related insights from DB (with thumbnails)
  const { data: allInsights = [] } = trpc.blog.listInsights.useQuery();
  const insightsWithParsedTags = allInsights.map((i) => ({
    ...i,
    parsedTags: Array.isArray(i.tags) ? (i.tags as string[]) : (typeof i.tags === 'string' ? JSON.parse(i.tags) : []),
  }));
  const matchedInsights = getRelatedArticlesForSolution(
    insightsWithParsedTags.map((i) => ({ category: i.category, tags: i.parsedTags })),
    slug,
    3
  );
  const relatedInsightsFiltered = matchedInsights
    .map((match) =>
      insightsWithParsedTags.find(
        (i) => i.category === match.category && JSON.stringify(i.parsedTags) === JSON.stringify(match.tags)
      )
    )
    .filter((i) => i !== undefined)
    .map(({ parsedTags, ...rest }) => rest) as typeof allInsights;

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
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>{language === "ja" ? "MAVEK BCSを選ぶ理由" : language === "ko" ? "MAVEK BCS를 선택하는 이유" : "Why MAVEK BCS"}</span>
              <div className="h-px w-12" style={{ backgroundColor: "var(--gold)" }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {language === "ko" ? "글로벌 재무 성공을 위한 당신의 파트너" : language === "ja" ? "グローバルな財務的成功への架け橋" : "Your Bridge to Global Financial Success"}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-3xl mx-auto">
              {language === "ko"
                ? "MAVEK BCS는 단순히 소프트웨어를 구현하는 것이 아니라 재무 탁월성을 설계합니다. 모든 솔루션 뒤에는 비즈니스 목표가 있다는 것을 이해합니다 — 더 빠른 성장, 낮은 리스크, 그리고 높은 투명성. 세계 최고 수준의 기술과 깊은 기능적·산업적 전문성을 결합하여, 귀사를 민첩성과 지속 가능한 성공의 미래로 이끌겠습니다. 귀사의 글로벌 재무 혁신이 저희의 궁극적인 사명입니다."
                : language === "ja"
                ? "MAVEK BCSは、単にソフトウェアを導入するだけではありません。私たちは「財務的卓越性（Financial Excellence）」を設計します。あらゆるソリューションの背後には、成長の加速、リスクの低減、そして透明性の向上という明確なビジネス目標があることを、私たちは深く理解しています。世界クラスのテクノロジーと、当社の深い専門知識および業界への知見を組み合わせることで、貴社のビジネスをアジリティ（機敏性）と持続可能な成功が共存する未来へと導きます。貴社のグローバルな財務変革を実現することこそが、私たちの究極の使命です。"
                : "At MAVEK BCS, we don't just implement software; we engineer financial excellence. We understand that behind every solution is a business goal — faster growth, lower risk, and higher transparency. By combining these world-class technologies with our deep functional and industry expertise, we lead your business to a future of agility and sustainable success. Your global financial transformation is our ultimate mission."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-gold no-underline">
                {language === "ko" ? "전문가와 상담하기" : language === "ja" ? "専門家に相談する" : "Speak with a Specialist"}
                <ArrowRight size={16} />
              </Link>
              <Link href="/solutions" className="btn-outline-navy no-underline" style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>
                {language === "ko" ? "모든 솔루션 보기" : language === "ja" ? "すべてのソリューションを見る" : "Explore All Solutions"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Insights */}
      {relatedInsightsFiltered.length > 0 && (
        <section className="section-off-white py-20">
          <div className="container">
            <div className="section-divider" />
            <h2 className="text-3xl font-bold mb-10" style={{ color: "var(--navy-dark)" }}>
              {language === "ko" ? "관련 인사이트" : language === "ja" ? "関連インサイト" : "Related Insights"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedInsightsFiltered.map((insight) => (
                <Link key={insight.slug} href={getLocalizedPath(`/insights/${insight.slug}`, language)} className="flex flex-col bg-white border border-gray-100 card-hover no-underline group overflow-hidden">
                  {insight.imageUrl && (
                    <div className="w-full h-36 overflow-hidden">
                      <img
                        src={insight.imageUrl}
                        alt={insight.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 mb-3 inline-block" style={{ backgroundColor: "var(--navy-dark)", color: "white" }}>
                      {insight.category}
                    </span>
                    <h4 className="text-sm font-bold mb-2 group-hover:text-[var(--navy)] transition-colors" style={{ color: "var(--navy-dark)" }}>
                      {language === "ko" ? (insight.titleKo ?? insight.title) : language === "ja" ? (insight.titleJa ?? insight.title) : insight.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {language === "ko" && insight.excerptKo ? insight.excerptKo : language === "ja" && insight.excerptJa ? insight.excerptJa : insight.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
