import { Link } from "wouter";
import { ArrowRight, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { INDUSTRIES, SOLUTION_CATEGORIES } from "@/lib/siteData";
import { trpc } from "@/lib/trpc";
import { articleMatchesIndustry } from "@/lib/insightMapping";
import { getLocalizedPath } from "@/lib/urlHelpers";

interface IndustryDetailProps {
  params: { slug: string };
}

const industryContent: Record<string, {
  overview: string; overviewKo: string; overviewJa: string;
  challenges: string[]; challengesKo: string[]; challengesJa: string[];
  solutions: string[]; solutionsKo: string[]; solutionsJa: string[];
}> = {
  "automotive": {
    overview: "The automotive industry is navigating a historic pivot from the century-old internal combustion engine to a software-defined, electric mobility ecosystem. This transition requires a massive and delicate reallocation of capital (CapEx) to fund EV research and development while maintaining the profitability of legacy operations. Beyond R&D, the volatility of raw materials like lithium and cobalt creates significant instability in inventory valuation, demanding real-time cost analysis. Furthermore, the sheer volume of vehicle leasing contracts necessitates flawless IFRS 16 compliance to manage balance sheet integrity, while complex multi-tier supply chain financing requires sophisticated treasury oversight to ensure global liquidity.",
    overviewKo: "자동차 산업은 지난 100년간 유지해온 내연기관의 시대에서 전기차 및 자율주행 기반의 모빌리티 생태계로 전환되는 거대한 변곡점에 서 있습니다. 이 과정에서 기업들은 기존의 수익 모델을 유지하면서도 전기차 연구개발을 위해 수십조 원의 자본(CapEx)을 새롭게 배분해야 하는 이중 과제에 직면해 있습니다. 특히 리튬이나 코발트 같은 핵심 원자재의 가격 변동은 재고 자산 가치 평가에 막대한 영향을 미치며, 복잡한 다단계 공급망에서 발생하는 대금 결제 시스템은 고도화된 자금 관리 솔루션을 필요로 합니다. 또한 수만 건에 달하는 차량 리스 계약에 대해 IFRS 16 기준을 준수하며 정확한 회계 처리를 수행하는 것은 재무 부서의 핵심적인 운영 리스크로 작용하고 있습니다.",
    overviewJa: "自動車産業は、過去100年間維持されてきた内燃機関の時代から、電気自動車（EV）および自動運転ベースのモビリティ・エコシステムへと移行する巨大な転換点に立っています。この過程で企業は、既存の収益モデルを維持しつつ、EVの研究開発のために数十兆ウォン規模の資本（CapEx）を新たに配分するという二重の課題に直面しています。特にリチウムやコバルトといった主要原材料の価格変動は棚卸資産の評価に多大な影響を及ぼし、複雑な多段階のサプライチェーンで発生する代金決済システムは、高度な資金管理ソリューションを必要としています。また、数万件にのぼる車両リース契約に対してIFRS第16号を遵守し、正確な会計処理を行うことは、財務部門にとって核心的なオペレーショナル・リスクとなっています。",
    challenges: ["CapEx reallocation between EV R&D and legacy ICE profitability", "Raw material volatility (lithium, cobalt) and real-time inventory valuation", "IFRS 16 compliance for high-volume vehicle leasing contracts", "Multi-tier supply chain treasury and global liquidity management"],
    challengesKo: ["복잡한 다계층 공급업체 재무 관리", "EV 전환 투자 계획 및 ROI 추적", "구독 및 모빌리티 서비스에 대한 수익 인식", "글로벌 제조 운영 전반의 통화 위험"],
    challengesJa: ["複雑なマルチティアサプライヤーの財務管理", "EV転換の投資計画とROI追跡", "サブスクリプションとモビリティサービスの収益認識", "グローバル製造業務全体の為替リスク"],
    solutions: ["sap-afc", "sap-analytics-cloud", "sap-fscm", "sap-trm"],
    solutionsKo: ["SAP AFC", "SAP 애널리틱스 클라우드", "SAP FSCM", "SAP TRM"],
    solutionsJa: ["SAP AFC", "SAP アナリティクスクラウド", "SAP FSCM", "SAP TRM"],
  },
  "semiconductors": {
    overview: "Operating at the edge of human innovation, the semiconductor industry faces a unique combination of astronomical investment costs and extreme demand volatility. Constructing a single \"Fab\" requires tens of billions of dollars in capital, and without advanced financial simulation, the risk of misaligned capacity is a constant threat to solvency. Due to rapid technological cycles, inventory can become obsolete almost overnight, making real-time write-down analysis a critical daily function. Additionally, as IP and physical chips move across borders, managing the complex global tax nexus and transfer pricing is essential to mitigate immense regulatory risks and protect global margins.",
    overviewKo: "반도체 산업은 천문학적인 투자 비용과 극심한 수요 변동성이 공존하는 초정밀 산업입니다. 하나의 '팹(Fab)'을 건설하는 데 들어가는 수십조 원의 투자 예산이 실제 수익(ROI)으로 연결되기까지는 수년이 걸리며, 이를 위한 고도화된 재무 시뮬레이션 없이는 막대한 손실을 입을 위험이 큽니다. 기술 주기가 매우 짧아 재고 자산이 순식간에 진부화되는 특성 때문에 실시간 재고 감액 분석이 필수적이며, 전 세계적으로 분산된 지식재산권(IP)과 물리적 칩 이동에 따른 국가 간 이전가격 관리는 세무 리스크의 중심에 있습니다. 따라서 대규모 장기 투자를 정밀하게 추적하고 최적화할 수 있는 강력한 재무 통제 시스템이 요구됩니다.",
    overviewJa: "半導体産業は、天文学的な投資費用と極端な需要変動が共存する超精密産業です。一つの「ファブ（Fab）」を建設するために投入される数十兆ウォンの投資予算が実際の利益（ROI）につながるまでには数年を要し、これに対応した高度な財務シミュレーションなしには莫大な損失を被るリスクが極めて高いのが現状です。技術サイクルが非常に短く、棚卸資産が瞬時に陳腐化する特性があるため、リアルタイムの在庫減損分析が不可欠です。また、世界的に分散された知的財産権（IP）や物理的なチップの移動に伴う国間の移転価格管理は、税務リスクの中核をなしています。したがって、大規模な長期投資を精密に追跡・最適化できる強力な財務統制システムが求められます。",
    challenges: ["Fab capital investment planning and capacity risk simulation", "Real-time inventory write-down analysis for rapid obsolescence cycles", "Global tax nexus and transfer pricing for cross-border IP and chip flows", "Financial modeling to manage extreme demand volatility and cycle risk"],
    challengesKo: ["R&D 비용 자본화 및 상각 추적", "여러 라이선시에 걸친 복잡한 IP 로열티 관리", "수요 변동성 및 재고 평가", "글로벌 팹 운영 전반의 다중 통화 연결"],
    challengesJa: ["R&Dコストの資本化と償却追跡", "複数のライセンシーにわたる複雑なIPロイヤルティ管理", "需要変動と在庫評価", "グローバルファブ運営全体のマルチ通貨連結"],
    solutions: ["sap-analytics-cloud", "sap-afc", "sap-trm", "sap-group-reporting"],
    solutionsKo: ["SAP 애널리틱스 클라우드", "SAP AFC", "SAP TRM", "SAP 그룹 보고"],
    solutionsJa: ["SAP アナリティクスクラウド", "SAP AFC", "SAP TRM", "SAP グループレポーティング"],
  },
  "pharmaceuticals": {
    overview: "The pharmaceutical sector represents a high-stakes environment where financial success is intrinsically tied to the success of multi-year, multi-phase global clinical trials. Accurately tracking and accruing trial costs across different jurisdictions is a massive accounting challenge that directly impacts corporate valuation. Furthermore, the looming threat of the \"patent cliff\" requires sophisticated revenue modeling to prepare for the sudden drop in income when blockbuster drugs lose exclusivity. Managing the complex \"Gross-to-Net\" landscape — filled with rebates, chargebacks, and intricate discount structures — demands automated solutions to ensure revenue integrity and meet the rigorous audit trails required by global regulators.",
    overviewKo: "제약 산업은 고위험 고수익 구조의 전형으로, 신약 하나를 개발하기 위해 수만 명을 대상으로 수년간 여러 국가에서 진행하는 임상 시험 비용의 회계 처리가 매우 복잡합니다. 특히 발생주의 회계 원칙에 따라 임상 단계별 비용을 정확히 배분하고 인식하는 능력이 기업 가치에 직결됩니다. 또한 주요 약품의 특허 만료에 따른 '특허 절벽' 현상은 매출 급락이라는 치명적인 재무적 충격을 예고하므로, 이에 대비한 정교한 수익 모델링이 필수적입니다. 더불어 리베이트와 할인 구조가 얽힌 복잡한 유통망 속에서 순매출(Net Revenue)을 투명하게 산출하고 강화되는 규제 당국의 감사 추적에 대응하기 위해 고도의 자동화된 솔루션이 필요합니다.",
    overviewJa: "製薬産業はハイリスク・ハイリターンの典型であり、一つの新薬を開発するために数万人を対象に数年間、複数の国で行われる臨床試験費用の会計処理は極めて複雑です。特に発生主義会計の原則に基づき、臨床段階別の費用を正確に配分・認識する能力は、企業価値に直結します。また、主要医薬品の特許満了に伴う「パテント・クリフ（特許の崖）」現象は売上の急落という致命的な財務的衝撃を予告するため、これに備えた精緻な収益モデリングが不可欠です。さらに、リベートや割引構造が絡み合う複雑な流通網の中で純売上高（Net Revenue）を透明に算出し、強化される規制当局の監査証跡に対応するため、高度に自動化されたソリューションが必要です。",
    challenges: ["Multi-jurisdiction clinical trial cost accrual and capitalization", "Patent cliff revenue modeling and exclusivity loss preparation", "Gross-to-Net management: rebates, chargebacks, and discount structures", "Automated audit trails for global regulatory compliance (FDA, EMA)"],
    challengesKo: ["임상 시험 비용 관리 및 자본화", "복잡한 로열티 및 마일스톤 지불 추적", "글로벌 법인 간 이전 가격 책정", "FDA, EMA 및 기타 기관에 대한 규제 보고"],
    challengesJa: ["臨床試験コスト管理と資本化", "複雑なロイヤルティとマイルストーン支払いの追跡", "グローバルエンティティ間の移転価格", "FDA、EMAおよびその他の機関への規制報告"],
    solutions: ["sap-afc", "sap-grc", "sap-analytics-cloud", "sap-group-reporting"],
    solutionsKo: ["SAP AFC", "SAP GRC", "SAP 애널리틱스 클라우드", "SAP 그룹 보고"],
    solutionsJa: ["SAP AFC", "SAP GRC", "SAP アナリティクスクラウド", "SAP グループレポーティング"],
  },
  "telecommunications": {
    overview: "As the world transitions to 5G and prepares for 6G, the telecommunications industry must manage colossal infrastructure investments while navigating complex revenue recognition standards. Under IFRS 15, the bundling of hardware sales with long-term service plans creates a data-intensive accounting hurdle that requires precise allocation of transaction prices. The management of thousands of tower and retail leases adds another layer of financial burden that must be optimized. In a saturated market, real-time churn analytics are vital to understanding the financial impact of customer loss, allowing the finance team to support marketing with data-driven agility while optimizing the depreciation of massive network assets.",
    overviewKo: "통신 산업은 5G를 넘어 6G로 이어지는 막대한 인프라 설비 투자와 함께, 하드웨어와 복잡한 서비스 요금제가 결합된 수익 인식 체계를 다루어야 합니다. IFRS 15 기준에 따라 단말기 판매와 매월 발생하는 통신 서비스 수익을 구분하여 인식하는 과정은 방대한 데이터를 필요로 하며, 수천 개의 기지국과 매장 리스 계약을 관리하는 데 따른 재무적 부담도 상당합니다. 특히 시장 포화 상태에서 발생하는 고객 이탈(Churn)이 재무 성과에 미치는 영향을 실시간으로 분석하여 마케팅 예산에 반영하는 기민함이 필요하며, 장기적인 네트워크 설비 투자의 감가상각을 최적화하여 자본 효율성을 높이는 것이 핵심적인 재무 과제입니다.",
    overviewJa: "通信産業は、5Gを超え6Gへとつながる莫大なインフラ設備投資とともに、ハードウェアと複雑なサービス料金プランが結合された収益認識体系を扱わなければなりません。IFRS第15号に基づき、端末販売と毎月発生する通信サービス収益を区分して認識するプロセスは膨大なデータを必要とし、数千の基地局や店舗のリース契約を管理することに伴う財務的負担も相当なものです。特に市場の飽和状態で発生する顧客離脱（Churn）が財務成果に及ぼす影響をリアルタイムで分析し、マーケティング予算に反映させる機敏さが求められます。また、長期的なネットワーク設備投資の減価償却を最適化し、資本効率を高めることが核心的な財務課題となっています。",
    challenges: ["IFRS 15 revenue recognition for bundled hardware and service contracts", "Tower and retail lease portfolio optimization under IFRS 16", "Real-time churn analytics and financial impact modeling", "Network asset depreciation optimization across massive 5G infrastructure"],
    challengesKo: ["대용량 구독 청구 및 수익 인식", "네트워크 자산 자본화 및 감가상각", "로밍 수익 정산 및 통신사 간 청구", "스펙트럼 라이선스 회계 및 상각"],
    challengesJa: ["大量のサブスクリプション請求と収益認識", "ネットワーク資産の資本化と減価償却", "ローミング収益決済とキャリア間請求", "スペクトラムライセンスの会計と償却"],
    solutions: ["sap-brim", "sap-analytics-cloud", "sap-fscm", "sap-drc"],
    solutionsKo: ["SAP BRIM", "SAP 애널리틱스 클라우드", "SAP FSCM", "SAP DRC"],
    solutionsJa: ["SAP BRIM", "SAP アナリティクスクラウド", "SAP FSCM", "SAP DRC"],
  },
  "oil-and-gas": {
    overview: "Traditional energy giants are operating under the constant pressure of commodity price volatility and the accelerating global mandate for decarbonization. To protect cash flows, advanced treasury systems are required to execute sophisticated hedging strategies, while the complexity of Joint Venture (JV) accounting demands transparent cost-sharing and revenue-splitting logic with global partners. One of the most significant long-term liabilities involves Asset Retirement Obligations (ARO), where firms must accurately provision for the decommissioning of rigs decades in advance. Today, the strategic priority for finance is modeling the transition risk as the world moves toward green energy, ensuring that legacy assets do not become stranded.",
    overviewKo: "전통적인 에너지 산업은 국제 유가와 천연가스 가격의 극심한 변동성 속에서 자금 흐름을 보호해야 하는 상시적인 리스크에 노출되어 있습니다. 이를 위해 고도화된 자금 관리(Treasury) 시스템을 통한 헤징 전략 수립이 필수적이며, 글로벌 파트너들과 공동으로 운영하는 합작 투자(Joint Venture)의 수익과 비용 배분 로직을 투명하게 관리해야 합니다. 또한 노후된 시추 시설의 해체 및 복구 비용에 대한 재무적 충당금을 장기적으로 정확히 산출하는 작업은 미래의 현금 흐름 예측에 결정적인 영향을 미칩니다. 최근에는 에너지 전환 가속화에 따른 기존 자산의 가치 하락 위험을 모델링하는 것이 재무 전략의 최우선 순위로 떠오르고 있습니다.",
    overviewJa: "伝統的なエネルギー産業は、国際原油価格と天然ガス価格の極端な変動の中で、キャッシュフローを保護しなければならない常時的なリスクにさらされています。このため、高度な資金管理（Treasury）システムを通じたヘッジ戦略の策定が不可欠であり、グローバルパートナーと共同運営する合弁事業（Joint Venture）の収益・費用配分ロジックを透明に管理しなければなりません。また、老朽化した掘削施設の解体および復旧費用に対する財務的引当金を長期的に正確に算出する作業は、将来のキャッシュフロー予測に決定的な影響を及ぼします。最近では、エネルギー転換の加速に伴う既存資産の価値下落リスクをモデリングすることが、財務戦略の最優先事項となっています。",
    challenges: ["Sophisticated hedging strategies to protect cash flows from price volatility", "Joint Venture (JV) accounting with transparent cost-sharing and revenue-splitting", "Asset Retirement Obligation (ARO) provisioning for long-term decommissioning", "Transition risk modeling as legacy assets face stranding in the energy shift"],
    challengesKo: ["합작 투자 회계 및 파트너 보고", "원자재 가격 헤징 및 위험 관리", "생산 분배 계약 회계", "해체 부채 추정 및 충당금"],
    challengesJa: ["ジョイントベンチャー会計とパートナーレポーティング", "商品価格ヘッジとリスク管理", "生産分配契約の会計", "廃止費用負債の見積もりと引当"],
    solutions: ["sap-trm", "sap-analytics-cloud", "sap-grc", "sap-group-reporting"],
    solutionsKo: ["SAP TRM", "SAP 애널리틱스 클라우드", "SAP GRC", "SAP 그룹 보고"],
    solutionsJa: ["SAP TRM", "SAP アナリティクスクラウド", "SAP GRC", "SAP グループレポーティング"],
  },
  "renewable-energy": {
    overview: "While the renewable energy sector is fueled by innovation and subsidies, its financial backbone is incredibly complex. The project financing required for wind and solar farms involves intricate debt-to-equity structures and long-term repayment schedules that are sensitive to shifting government incentives. Unlike traditional power, revenue models are intermittent and tied to weather patterns, making static forecasting obsolete. Advanced solutions are needed to model these variable cash flows and manage the massive CapEx required for smart grid integration and battery storage, ensuring that the transition to green energy remains financially sustainable and attractive to institutional investors.",
    overviewKo: "신재생 에너지 산업은 기술적 혁신과 정책적 지원이라는 두 축을 기반으로 급성장하고 있으나, 그 이면에는 매우 복잡한 재무적 구조가 자리 잡고 있습니다. 풍력이나 태양광 단지 건설을 위한 장기 프로젝트 파이낸싱은 복잡한 부채 및 자본 구조를 수반하며, 정부의 보조금 및 세액 공제 제도 변화에 따라 수익성이 크게 요동칩니다. 날씨에 따라 변동하는 에너지 생산량과 연동된 재무적 수익 예측은 기존의 정적인 모델링으로는 불가능하며, ESS(에너지 저장 장치)와 같은 신규 인프라 투자에 대한 자본 비용을 정밀하게 분석하여 안정적인 현금 흐름을 확보하는 것이 이 산업의 지속 가능성을 결정짓는 핵심 과제입니다.",
    overviewJa: "再生可能エネルギー産業は、技術革新と政策支援という二つの軸を基盤に急成長していますが、その裏には非常に複雑な財務構造が存在します。風力や太陽光発電所の建設に向けた長期プロジェクトファイナンスは、複雑な負債・資本構造を伴い、政府の補助金や税額控除制度の変化によって収益性が大きく変動します。天候に左右されるエネルギー生産量と連動した財務収益予測は、従来の静的なモデリングでは不可能であり、ESS（エネルギー貯蔵装置）のような新規インフラ投資に対する資本コストを精密に分析し、安定したキャッシュフローを確保することが、この産業の持続可能性を左右する核心課題です。",
    challenges: ["Project finance with complex debt-to-equity structures for wind and solar farms", "Variable cash flow modeling tied to intermittent, weather-dependent revenue", "CapEx management for smart grid integration and battery storage investment", "ESG and green bond reporting to maintain institutional investor confidence"],
    challengesKo: ["프로젝트 재무 및 SPV 회계", "그린 본드 및 지속 가능성 연계 금융", "ESG 지표 수집 및 보고", "장기 전력 구매 계약 회계"],
    challengesJa: ["プロジェクト財務とSPV会計", "グリーンボンドとサステナビリティ連動型ファイナンス", "ESGメトリクスの収集とレポーティング", "長期電力購入契約の会計"],
    solutions: ["sap-analytics-cloud", "sap-group-reporting", "sap-trm", "sap-re-fx"],
    solutionsKo: ["SAP 애널리틱스 클라우드", "SAP 그룹 보고", "SAP TRM", "SAP RE-FX"],
    solutionsJa: ["SAP アナリティクスクラウド", "SAP グループレポーティング", "SAP TRM", "SAP RE-FX"],
  },
  "financial-services": {
    overview: "In the digital age, the financial services industry is defined by real-time connectivity and a relentless regulatory environment. Managing global liquidity across multiple bank accounts requires seamless API integration and instant visibility to avoid overnight shortfalls. Compliance with Basel III and IFRS 9 mandates automated, algorithmic calculations for risk-weighted assets and expected credit losses to maintain regulatory capital levels. As cyber-threats and fraud become more sophisticated, real-time financial monitoring is the primary line of defense. Finance leaders must also manage the significant \"technical debt\" of transitioning from legacy mainframes to cloud-native architectures without disrupting global operations.",
    overviewKo: "금융 서비스 산업은 디지털 기술의 발전과 함께 실시간 연결성이 가장 강조되는 분야입니다. 글로벌 은행 간의 실시간 유동성 관리와 API를 통한 시스템 통합은 기본이 되었으며, 바젤 III나 IFRS 9과 같은 강화된 규제 기준에 맞춰 위험 가중 자산과 기대 신용 손실을 자동으로 산출하는 정교한 알고리즘이 요구됩니다. 특히 금융 사고와 사기 위협이 고도화됨에 따라 실시간 재무 모니터링을 통한 리스크 관리가 기업의 생존과 직결되며, 노후화된 레거시 시스템을 클라우드 기반의 재무 아키텍처로 전환하며 발생하는 막대한 비용을 효율적으로 통제하는 것이 재무 부서의 시급한 숙제입니다.",
    overviewJa: "金融サービス産業は、デジタル技術の発展とともにリアルタイムの接続性が最も強調される分野です。グローバル銀行間のリアルタイム流動性管理やAPIを通じたシステム統合は基本となっており、バーゼルIIIやIFRS第9号といった強化された規制基準に合わせて、リスクアセットや予想信用損失を自動的に算出する精緻なアルゴリズムが要求されます。特に金融事故や詐欺の脅威が高度化する中、リアルタイムの財務モニタリングを通じたリスク管理は企業の生存に直結します。また、老朽化したレガシーシステムをクラウドベースの財務アーキテクチャへと移行する際に発生する莫大な費用を効率的に統制することが、財務部門の急務となっています。",
    challenges: ["Global liquidity management with real-time multi-bank API visibility", "Basel III and IFRS 9 automated risk-weighted asset and ECL calculations", "Real-time financial monitoring as the primary defense against cyber-fraud", "Legacy mainframe to cloud-native migration without disrupting global operations"],
    challengesKo: ["IFRS 9/17 및 규제 자본 보고", "실시간 유동성 모니터링 및 스트레스 테스트", "복잡한 그룹 구조 전반의 다중 법인 연결", "자금 세탁 방지 및 규정 준수 보고"],
    challengesJa: ["IFRS 9/17と規制資本報告", "リアルタイムの流動性モニタリングとストレステスト", "複雑なグループ構造全体のマルチエンティティ連結", "マネーロンダリング防止とコンプライアンス報告"],
    solutions: ["sap-afc", "sap-group-reporting", "sap-grc", "sap-analytics-cloud"],
    solutionsKo: ["SAP AFC", "SAP 그룹 보고", "SAP GRC", "SAP 애널리틱스 클라우드"],
    solutionsJa: ["SAP AFC", "SAP グループレポーティング", "SAP GRC", "SAP アナリティクスクラウド"],
  },
  "real-estate": {
    overview: "The real estate industry is uniquely sensitive to global interest rate hikes, making debt servicing and asset valuation the top priorities for finance teams. For firms with massive portfolios, the accurate implementation of IFRS 16 / ASC 842 is a high-stakes requirement to avoid audit failures and misstated liabilities. Finance leaders must model how fluctuating rates impact the Capitalization Rate (Cap Rate) and overall portfolio value in real-time. Additionally, tracking the market-to-book value gap and monitoring the credit health of commercial tenants is essential to proactively manage receivables and ensure that the asset mix remains optimized for current economic conditions.",
    overviewKo: "부동산 산업은 글로벌 금리 인상과 경기 변동에 가장 민감하게 반응하는 분야로, 부채 서비스 능력과 자산 가치 평가의 정확성이 무엇보다 중요합니다. 특히 대규모 리스 포트폴리오를 보유한 기업은 IFRS 16 기준을 완벽히 준수하지 못할 경우 심각한 감사 실패로 이어질 수 있습니다. 금리 변동이 대출 상환 및 전체 투자 수익률(Cap Rate)에 미치는 영향을 실시간으로 모델링하여 포트폴리오를 조정해야 하며, 시장 상황에 따라 요동치는 자산의 시장 가치와 장부 가치 사이의 간극을 투명하게 추적해야 합니다. 또한 상업용 임차인들의 재무 건강 상태를 실시간으로 모니터링하여 미수금 리스크를 선제적으로 관리하는 고도화된 솔루션이 필요합니다.",
    overviewJa: "不動産業界は、世界的な金利上昇と景気変動に最も敏感に反応する分野であり、負債の支払能力と資産価値評価の正確性が何よりも重要です。特に大規模なリースポートフォリオを保有する企業は、IFRS第16号を完璧に遵守できない場合、深刻な監査失敗につながる可能性があります。金利変動がローン返済および全体の投資利回り（Cap Rate）に及ぼす影響をリアルタイムでモデリングしてポートフォリオを調整しなければならず、市場状況によって変動する資産の市場価値と帳簿価格の乖離を透明に追跡する必要があります。また、商業用テナントの財務の健全性をリアルタイムでモニタリングし、未収金リスクを先制的に管理する高度なソリューションが必要です。",
    challenges: ["IFRS 16 / ASC 842 implementation for large, complex property portfolios", "Real-time Cap Rate modeling under fluctuating interest rate environments", "Market-to-book value gap tracking and portfolio mix optimization", "Commercial tenant credit health monitoring and proactive receivables management"],
    challengesKo: ["IFRS 16 리스 회계 및 공시", "부동산 포트폴리오 평가 및 손상 테스트", "부동산 투자 수단에 대한 펀드 회계", "임차인 청구 및 서비스 요금 조정"],
    challengesJa: ["IFRS 16リース会計と開示", "不動産ポートフォリオの評価と減損テスト", "不動産投資ビークルのファンド会計", "テナント請求とサービスチャージ調整"],
    solutions: ["sap-re-fx", "sap-analytics-cloud", "sap-afc", "oracle-fccs"],
    solutionsKo: ["SAP RE-FX", "SAP 애널리틱스 클라우드", "SAP AFC", "Oracle FCCS"],
    solutionsJa: ["SAP RE-FX", "SAP アナリティクスクラウド", "SAP AFC", "Oracle FCCS"],
  },
  "retail": {
    overview: "The evolution of retail into an omnichannel powerhouse has led to an explosion in the volume and complexity of financial data. Reconciling millions of micro-transactions across physical stores, e-commerce platforms, and global marketplaces requires a level of automation that manual systems cannot provide. As inflation and logistics costs compress margins, real-time cost-of-goods-sold (COGS) tracking becomes a survival tool. Retailers must also navigate extreme seasonal cash flow swings, requiring sophisticated liquidity forecasting to ensure that the supply chain is funded during peak periods while maintaining lean operations during off-peak cycles.",
    overviewKo: "유통 산업은 오프라인 매장과 이커머스, 그리고 다양한 마켓플레이스가 결합된 옴니채널 환경으로 진화하면서 재무 데이터의 양과 복잡성이 기하급수적으로 늘어났습니다. 매일 발생하는 수백만 건의 마이크로 거래를 자동으로 대조하고 정산하는 능력 없이는 정확한 결산이 불가능하며, 인플레이션과 물류비 상승에 따른 마진 압박을 견뎌내기 위해 실시간 원가 분석이 필수적입니다. 또한 계절적 요인에 따른 극심한 유동성 변화를 관리하기 위해 정교한 현금 흐름 예측 모델을 운영해야 하며, 전 세계적인 공급망 혼란 상황에서 재고 자산이 자금을 묶어두는 비용을 최소화하는 효율적인 재무 통제가 요구됩니다.",
    overviewJa: "流通産業は、実店舗とEC、そして多様なマーケットプレイスが結合されたオムニチャネル環境へと進化し、財務データの量と複雑さが指数関数的に増加しました。毎日発生する数百万件のマイクロトランザクションを自動的に照合・精算する能力なしには正確な決算が不可能であり、インフレや物流費の上昇に伴うマージンの圧迫を克服するためにリアルタイムの原価分析が不可欠です。また、季節的要因による極端な流動性の変化を管理するために、精緻なキャッシュフロー予測モデルを運用しなければならず、世界的なサプライチェーンの混乱状況下で棚卸資産が資金を固定化するコストを最小限に抑える効率的な財務統制が求められます。",
    challenges: ["Reconciling millions of micro-transactions across stores, e-commerce, and marketplaces", "Real-time COGS tracking as inflation and logistics costs compress margins", "Seasonal cash flow forecasting to fund peak supply chains and lean off-cycles", "Omnichannel financial data integration requiring full automation at scale"],
    challengesKo: ["다중 관할 부가가치세 및 판매세 준수", "옴니채널 수익 인식 및 반품 관리", "공급업체 지불 조건 및 운전 자본 최적화", "계절적 수요 계획 및 재고 재무"],
    challengesJa: ["多管轄のVATと売上税コンプライアンス", "オムニチャネルの収益認識と返品管理", "サプライヤー支払い条件と運転資本最適化", "季節需要計画と在庫財務"],
    solutions: ["sap-drc", "sap-brim", "sap-fscm", "sap-analytics-cloud"],
    solutionsKo: ["SAP DRC", "SAP BRIM", "SAP FSCM", "SAP 애널리틱스 클라우드"],
    solutionsJa: ["SAP DRC", "SAP BRIM", "SAP FSCM", "SAP アナリティクスクラウド"],
  },
  "energy": {
    overview: "Traditional power generation faces the dual challenge of aging infrastructure and the need to optimize production against fluctuating demand patterns. Sophisticated financial modeling is required to match hourly production costs with shifting consumption, while energy trading floors require real-time treasury oversight to control risk. Under strict government price caps, the margin for error is razor-thin, making it essential to identify and eliminate operational cost leakages. Strategic finance must balance the CapEx needed for infrastructure maintenance with the investments required for clean energy upgrades, all while justifying rate increases to skeptical regulatory bodies.",
    overviewKo: "전통적인 발전 및 에너지 산업은 소비 패턴의 변화와 환경 규제라는 거센 도전에 직면해 있습니다. 에너지 소비의 시간대별 변화와 생산 비용을 실시간으로 매칭하여 재무적 수익성을 모델링해야 하며, 복잡한 에너지 거래소에서의 자금 흐름을 감시하고 리스크를 제어할 수 있는 고도의 자금 관리 시스템이 필요합니다. 정부의 가격 상한제와 같은 규제 환경 속에서 수익성을 확보하기 위해서는 운영 비용의 미세한 누수까지 잡아내는 최적화 솔루션이 필수적이며, 노후 시설의 유지 보수와 새로운 친환경 설비 투자 사이에서 자본 효율성을 극대화할 수 있는 전략적 의사결정 지원 체계가 마련되어야 합니다.",
    overviewJa: "伝統的な発電・エネルギー産業は、消費パターンの変化と環境規制という厳しい挑戦に直面しています。エネルギー消費の時間帯別の変化と生産コストをリアルタイムでマッチングさせて財務的な収益性をモデリングしなければならず、複雑なエネルギー取引所における資金の流れを監視し、リスクを制御できる高度な資金管理システムが必要です。政府の価格上限設定のような規制環境の中で収益性を確保するためには、オペレーショナルコストの微細な漏れまで特定する最適化ソリューションが不可欠です。また、老朽施設のメンテナンスと新しいクリーンエネルギー設備投資の間で資本効率を最大化できる戦略的意思決定支援体系を整えなければなりません。",
    challenges: ["Matching hourly production costs to shifting consumption with financial modeling", "Real-time treasury oversight on energy trading floors to control risk", "Identifying and eliminating operational cost leakages under strict price caps", "Balancing infrastructure maintenance CapEx with clean energy upgrade investment"],
    challengesKo: ["원자재 가격 위험 관리 및 헤징", "대규모 인프라 투자를 위한 자본 프로젝트 회계", "여러 에너지 시장에 걸친 규제 준수", "자산 폐기 의무 회계"],
    challengesJa: ["商品価格リスク管理とヘッジ", "大規模インフラ投資の資本プロジェクト会計", "複数のエネルギー市場にわたる規制コンプライアンス", "資産廃止債務会計"],
    solutions: ["sap-trm", "sap-analytics-cloud", "sap-grc", "sap-afc"],
    solutionsKo: ["SAP TRM", "SAP 애널리틱스 클라우드", "SAP GRC", "SAP AFC"],
    solutionsJa: ["SAP TRM", "SAP アナリティクスクラウド", "SAP GRC", "SAP AFC"],
  },
  "utilities": {
    overview: "The utility sector is seeing a transformation in billing complexity as smart meters and tiered pricing become the global standard. Finance teams must implement revenue recognition systems that can handle this granularity while providing the transparent data needed for regulatory \"rate case\" justifications. Given the 30-to-50-year lifecycle of utility assets, managing long-term debt and capital structures is a core competency. Furthermore, the mandate to integrate ESG reporting — tracking carbon footprints and water usage alongside financial metrics — requires a unified data environment that connects operational metrics directly to the financial statement.",
    overviewKo: "유틸리티 산업은 스마트 미터기 도입과 누진제 적용 등 과금 체계가 정교해짐에 따라 이를 뒷받침할 수익 인식 시스템의 업그레이드가 절실합니다. 공공 서비스의 성격상 요금 인상을 위해서는 규제 기관을 설득할 수 있는 투명하고 정밀한 재무적 근거가 상시 준비되어야 하며, 인프라의 수명이 수십 년에 달하는 만큼 장기 부채와 자본 구조를 안정적으로 관리하는 역량이 중요합니다. 최근에는 탄소 배출량이나 수자원 사용량 같은 비재무적 데이터까지 재무 보고서와 결합하여 공시해야 하는 ESG 리포팅 의무가 강화되면서, 이를 체계적으로 통합 관리할 수 있는 첨단 솔루션의 중요성이 더욱 커지고 있습니다.",
    overviewJa: "公共事業（ユーティリティ）産業は、スマートメーターの導入や累進制の適用など課金体系が精緻化するにつれ、これを支える収益認識システムのアップグレードが切実になっています。公共サービスという特性上、料金引き上げのためには規制機関を説得できる透明かつ精密な財務的根拠を常時備える必要があり、インフラの寿命が数十年におよぶため、長期負債と資本構造を安定的に管理する能力が重要です。最近では、炭素排出量や水資源の使用量といった非財務データまで財務報告書と結合して開示しなければならないESGレポーティング義務が強化されており、これらを体系的に統合管理できる先端ソリューションの重要性がさらに高まっています。",
    challenges: ["Revenue recognition for granular smart meter and tiered pricing structures", "Regulatory rate case justification with transparent, auditable financial data", "Long-term debt and capital structure management for 30-to-50-year asset lifecycles", "Unified ESG reporting integrating carbon and water metrics with financial statements"],
    challengesKo: ["규제 자산 기반 회계 및 요금 사례 지원", "장기 계약 수익 인식", "인프라 투자 계획 및 추적", "환경 규정 준수 비용 관리"],
    challengesJa: ["規制資産ベース会計とレートケースサポート", "長期契約の収益認識", "インフラ投資計画と追跡", "環境コンプライアンスコスト管理"],
    solutions: ["sap-analytics-cloud", "sap-re-fx", "sap-afc", "sap-grc"],
    solutionsKo: ["SAP 애널리틱스 클라우드", "SAP RE-FX", "SAP AFC", "SAP GRC"],
    solutionsJa: ["SAP アナリティクスクラウド", "SAP RE-FX", "SAP AFC", "SAP GRC"],
  },
  "electronics-manufacturing": {
    overview: "Electronics manufacturers operate in a high-velocity environment where component shortages and currency fluctuations can derail a quarterly result in days. Real-time integration with Contract Manufacturing (EMS) partners is required to prevent cost leakages and ensure supply chain transparency. Managing warranty provisions also requires data-driven modeling to accurately estimate long-term repair liabilities for high-tech products. Finally, the rapid depreciation of specialized manufacturing equipment must be optimized for tax and accounting purposes, ensuring that capital is recycled efficiently in an industry where today's cutting-edge factory is tomorrow's legacy site.",
    overviewKo: "전자 제조 산업은 글로벌 부품 수급의 불확실성과 빠른 제품 교체 주기라는 특유의 리스크를 안고 있습니다. 특정 부품의 수급 지연이 전체 생산 라인의 멈춤으로 이어지고, 이것이 재무 실적에 미치는 영향을 즉각적으로 산출하여 대응책을 마련해야 합니다. 또한 제품의 기술적 결함에 대비한 보증 책임 충당금을 데이터 기반으로 정밀하게 모델링하여 재무 건전성을 유지해야 하며, 위탁 생산 파트너들과의 긴밀한 재무 데이터 통합을 통해 보이지 않는 원가 누수를 방지해야 합니다. 첨단 제조 설비의 빠른 감가상각을 효율적으로 관리하여 세무 혜택을 극대화하고 자산 운영의 효율성을 높이는 것이 이 산업의 핵심 성공 요인입니다.",
    overviewJa: "電子機器製造業は、グローバルな部品需給の不確実性と速い製品サイクルという特有のリスクを抱えています。特定の部品の需給遅延が生産ライン全体の停止につながり、それが財務実績に及ぼす影響を即座に算出して対応策を講じなければなりません。また、製品の技術的欠陥に備えた製品保証引当金をデータに基づいて精密にモデリングし、財務の健全性を維持する必要があります。さらに、委託先製造パートナー（EMS）との緊密な財務データ統合を通じて、目に見えないコスト漏洌を防止しなければなりません。先端製造設備の速い減価償却を効率的に管理して税務上のメリットを最大化し、資産運用の効率を高めることが、この産業の核心的な成功要因です。",
    challenges: ["Real-time EMS/contract manufacturer integration to prevent cost leakages", "Data-driven warranty provision modeling for long-term repair liability estimation", "Currency fluctuation management to protect quarterly results from FX exposure", "Depreciation optimization for specialized equipment in rapidly evolving factories"],
    challengesKo: ["제품 원가 회계 및 마진 분석", "보증 충당금 추정 및 관리", "글로벌 공급망 재무 및 공급업체 위험", "R&D 자본화 및 제품 수명 주기 원가 계산"],
    challengesJa: ["製品原価会計とマージン分析", "保証引当金の見積もりと管理", "グローバルサプライチェーン財務とサプライヤーリスク", "R&D資本化と製品ライフサイクルコスト計算"],
    solutions: ["sap-afc", "sap-analytics-cloud", "sap-fscm", "sap-drc"],
    solutionsKo: ["SAP AFC", "SAP 애널리틱스 클라우드", "SAP FSCM", "SAP DRC"],
    solutionsJa: ["SAP AFC", "SAP アナリティクスクラウド", "SAP FSCM", "SAP DRC"],
  },
};

// Industry images: hero (full-width background), macro (wide shot), detail (close-up)
const industryImages: Record<string, { hero: string; macro: string; detail: string }> = {
  "automotive": {
    hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80",
  },
  "semiconductors": {
    hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1601132359864-c974e79890ac?w=900&q=80",
  },
  "pharmaceuticals": {
    hero: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=900&q=80",
  },
  "telecommunications": {
    hero: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&q=80",
  },
  "oil-and-gas": {
    hero: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
  },
  "renewable-energy": {
    hero: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&q=80",
  },
  "financial-services": {
    hero: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80",
  },
  "real-estate": {
    hero: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&q=80",
  },
  "retail": {
    hero: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
  },
  "energy": {
    hero: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900&q=80",
  },
  "utilities": {
    hero: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
  },
  "electronics-manufacturing": {
    hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
    macro: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80",
    detail: "https://images.unsplash.com/photo-1601132359864-c974e79890ac?w=900&q=80",
  },
};

export default function IndustryDetail({ params }: IndustryDetailProps) {
  const { language } = useLanguage();
  const { data: allInsights = [] } = trpc.blog.listInsights.useQuery();
  const { slug } = params;

  const industry = INDUSTRIES.find((i) => i.slug === slug);
  const content = industryContent[slug];
  const images = industryImages[slug];

  if (!industry) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Industry not found</h1>
          <Link href="/industries" className="btn-outline-navy no-underline">Back to Industries</Link>
        </div>
      </Layout>
    );
  }

  const name = language === "ko" ? industry.nameKo : language === "ja" ? industry.nameJa : industry.name;
  const overview = content ? (language === "ko" ? content.overviewKo : language === "ja" ? content.overviewJa : content.overview) : industry.description;
  const challenges = content ? (language === "ko" ? content.challengesKo : language === "ja" ? content.challengesJa : content.challenges) : [];

  // Find related solutions
  const relatedSolutionSlugs = content?.solutions || [];
  const relatedSolutions = SOLUTION_CATEGORIES.flatMap((cat) =>
    cat.solutions.filter((s) => relatedSolutionSlugs.includes(s.slug)).map((s) => ({ ...s, categorySlug: cat.slug }))
  );

  // Find related insights from DB using category/tag auto-mapping
  const relatedInsights = allInsights
    .filter((i) => articleMatchesIndustry(slug, i.category, Array.isArray(i.tags) ? (i.tags as string[]) : []))
    .slice(0, 4);

  return (
    <Layout>
      {/* Hero */}
      <section
        className="py-32 relative overflow-hidden"
        style={{ backgroundColor: "var(--navy-dark)" }}
      >
        {/* Background image with dark overlay */}
        {images?.hero && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${images.hero})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.25,
            }}
          />
        )}
        {/* Gradient overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(10,14,30,0.92) 50%, rgba(10,14,30,0.5) 100%)",
          }}
        />
        <div className="container relative z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/industries" className="no-underline hover:text-white transition-colors">
              {language === "ko" ? "산업" : language === "ja" ? "業界" : "Industries"}
            </Link>
            <ChevronRight size={12} />
            <span className="text-gray-300">{name}</span>
          </div>
          <div className="max-w-3xl">
            <div className="text-5xl mb-6">{industry.icon}</div>
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: language === "ko" ? "'Noto Sans KR', sans-serif" : language === "ja" ? "'Noto Sans JP', sans-serif" : "'Playfair Display', serif", lineHeight: language === "en" ? "1.1" : "1.3" }}
            >
              {name}
            </h1>
            <p className="text-lg text-gray-300" style={{ lineHeight: language === "en" ? "1.7" : "1.9", maxWidth: "640px" }}>
              {language === "ko" ? industry.descriptionKo : language === "ja" ? industry.descriptionJa : industry.description}
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-20">
        <div className="container">
          {/* Overview text + Key Challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="section-divider" />
              <h2
                className="text-3xl font-bold mb-6"
                style={{
                  color: "var(--navy-dark)",
                  fontFamily: language === "ko" ? "'Noto Sans KR', sans-serif" : language === "ja" ? "'Noto Sans JP', sans-serif" : "'Playfair Display', serif",
                  lineHeight: language === "en" ? "1.2" : "1.4",
                }}
              >
                {language === "ko" ? "산업 개요" : language === "ja" ? "業界概要" : "Industry Overview"}
              </h2>
              <p
                className="text-gray-600 text-lg"
                style={{
                  lineHeight: language === "en" ? "1.8" : "2.0",
                  wordBreak: language === "ko" ? "keep-all" : "normal",
                  overflowWrap: "break-word",
                }}
              >
                {overview}
              </p>
            </div>
            <div>
              <div className="section-divider" />
              <h3
                className="text-lg font-bold mb-4"
                style={{
                  color: "var(--navy)",
                  fontFamily: language === "ko" ? "'Noto Sans KR', sans-serif" : language === "ja" ? "'Noto Sans JP', sans-serif" : undefined,
                }}
              >
                {language === "ko" ? "주요 과제" : language === "ja" ? "主要な課題" : "Key Challenges"}
              </h3>
              <ul className="space-y-3">
                {challenges.map((challenge, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-gray-600"
                    style={{
                      lineHeight: language === "en" ? "1.6" : "1.85",
                      wordBreak: language === "ko" ? "keep-all" : "normal",
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: "var(--gold)" }} />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Macro + Detail images */}
          {images && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                  src={images.macro}
                  alt={`${name} - industry overview`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                  src={images.detail}
                  alt={`${name} - detail view`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Solutions */}
      {relatedSolutions.length > 0 && (
        <section className="section-off-white py-20">
          <div className="container">
            <div className="section-divider" />
            <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--navy-dark)" }}>
              {language === "ko" ? "관련 솔루션" : language === "ja" ? "関連ソリューション" : "Relevant Solutions"}
            </h2>
            <p className="text-gray-500 mb-10 text-sm">
              {language === "ko" ? "이 산업에 맞춤화된 솔루션" : language === "ja" ? "この業界向けにカスタマイズされたソリューション" : "Solutions tailored for this industry"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {relatedSolutions.map((sol) => (
                <Link
                  key={sol.slug}
                  href={`/solutions/${sol.categorySlug}/${sol.slug}`}
                  className="flex gap-5 p-6 bg-white border border-gray-100 card-hover no-underline group"
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0 text-xs font-bold text-white"
                    style={{ backgroundColor: sol.vendor === "SAP" ? "var(--navy)" : sol.vendor === "Oracle" ? "var(--navy-mid)" : "var(--navy-light)" }}
                  >
                    {sol.vendor.slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 group-hover:text-[var(--navy)] transition-colors" style={{ color: "var(--navy-dark)" }}>
                      {language === "ko" ? sol.nameKo : language === "ja" ? sol.nameJa : sol.name}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {language === "ko" ? sol.shortDescriptionKo : language === "ja" ? sol.shortDescriptionJa : sol.shortDescription}
                    </p>
                  </div>
                  <ArrowRight size={14} className="shrink-0 mt-1 text-gray-400 group-hover:text-[var(--navy)] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Insights */}
      {relatedInsights.length > 0 && (
        <section className="section-navy py-20">
          <div className="container">
            <div className="section-divider" />
            <h2 className="text-3xl font-bold text-white mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
              {language === "ko" ? "관련 인사이트" : language === "ja" ? "関連インサイト" : "Related Insights"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedInsights.map((insight) => (
                <Link
                  key={insight.slug}
                  href={getLocalizedPath(`/insights/${insight.slug}`, language)}
                  className="no-underline group card-hover overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {insight.imageUrl && (
                    <div className="h-36 relative overflow-hidden">
                      <img
                        src={insight.imageUrl}
                        alt={insight.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,14,30,0.6) 0%, transparent 60%)" }} />
                    </div>
                  )}
                  <div className="p-5">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 mb-3 inline-block"
                      style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}
                    >
                      {insight.category}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug group-hover:text-gray-200 transition-colors">
                      {language === "ko" ? insight.titleKo : language === "ja" ? insight.titleJa : insight.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="container text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--navy-dark)" }}>
            {language === "ko" ? `${name} 재무 혁신에 대해 논의하시겠습니까?` : language === "ja" ? `${name}の財務変革について話し合いますか？` : `Ready to discuss ${name} finance transformation?`}
          </h3>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto text-sm">
            {language === "ko" ? "업계 전문 컨설턴트와 귀사의 특정 과제에 대해 이야기하세요." : language === "ja" ? "業界専門のコンサルタントと貴社の具体的な課題についてお話しください。" : "Speak with our industry specialists about your specific challenges."}
          </p>
          <Link href="/contact" className="btn-navy no-underline">
            {language === "ko" ? "전문가에게 문의" : language === "ja" ? "専門家に相談" : "Speak with an Expert"}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
