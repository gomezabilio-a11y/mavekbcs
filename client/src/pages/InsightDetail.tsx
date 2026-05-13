import { Link } from "wouter";
import { ArrowRight, ChevronRight, Clock, Tag } from "lucide-react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { INSIGHTS, SOLUTION_CATEGORIES, INDUSTRIES } from "@/lib/siteData";

interface InsightDetailProps {
  params: { slug: string };
}

// Full article body content keyed by slug
const articleContent: Record<string, string> = {
  "what-is-advanced-financial-closing-afc": `Today's increasingly complex business environment places constant pressure on finance organizations to close books faster, improve reporting accuracy, and strengthen compliance across global operations. Yet traditional financial close processes often rely heavily on manual coordination, spreadsheets, emails, and disconnected activities spanning multiple systems and teams. This creates inefficiencies, increases operational risk, and limits transparency during one of the most critical periods in the financial cycle — the close.

To address these challenges, SAP introduced SAP Advanced Financial Closing (AFC), an intelligent financial close orchestration solution designed to automate, standardize, and accelerate period-end closing activities across the enterprise.

**Understanding SAP AFC**

SAP Advanced Financial Closing (AFC) is a centralized solution that helps organizations plan, monitor, automate, and govern financial closing activities within SAP environments. Built to integrate seamlessly with SAP S/4HANA, AFC enables finance teams to coordinate complex closing processes in a structured and controlled manner.

Rather than managing closing activities manually through spreadsheets or email-based communication, AFC provides a digital framework where all closing tasks, dependencies, approvals, and job executions can be managed centrally.

The solution supports:

Month-end closing

Quarter-end closing

Year-end closing

Regulatory and statutory reporting activities

Intercompany reconciliation processes

Financial data validation and monitoring

By orchestrating these activities through automation and workflow-driven execution, AFC significantly reduces manual effort while improving operational consistency and transparency.

**Key Capabilities of SAP AFC**

**1. Centralized Close Orchestration**

AFC provides a centralized cockpit where finance teams can monitor the status of all closing activities in real time. Tasks can be assigned to specific users or teams, organized by dependency, and monitored through dashboards and status indicators.

This gives organizations complete visibility into:

Outstanding tasks

Delayed activities

Dependency bottlenecks

Process completion status

Overall close progress across entities and regions

As a result, finance leaders gain better control over the closing process and can proactively address issues before they impact reporting deadlines.

**2. Automation of Repetitive Activities**

One of AFC's most valuable capabilities is the automation of recurring financial close tasks.

SAP AFC can trigger:

SAP background jobs

Financial reconciliation programs

Data validation routines

Allocation executions

Currency valuation runs

Consolidation preparation activities

These activities can be executed automatically based on predefined schedules or dependency logic.

For example, once data posting activities are completed, AFC can automatically initiate subsequent validation or reconciliation jobs without manual intervention.

This reduces:

Manual coordination effort

Human error

Dependency management complexity

Operational delays

**3. Standardization Across Global Operations**

Large multinational organizations often struggle with inconsistent closing procedures across subsidiaries, regions, or business units.

AFC enables organizations to standardize:

Closing calendars

Task templates

Approval workflows

Escalation procedures

Execution logic

This creates a consistent governance model across the enterprise while still allowing flexibility for local statutory requirements.

Standardization also improves audit readiness and simplifies compliance management.

**4. Improved Transparency and Auditability**

Every activity executed within AFC is logged and traceable. Organizations can maintain detailed audit trails showing:

Who executed a task

When it was completed

Which job or program was triggered

Whether any errors occurred

Approval and sign-off history

This level of transparency supports both internal governance and external audit requirements.

**Benefits for Finance Organizations**

Organizations implementing SAP AFC typically experience several measurable benefits, including:

Faster financial close cycles

Reduced manual workload

Improved process accuracy

Enhanced compliance and governance

Better collaboration between finance and IT teams

Increased visibility into close execution status

Lower operational risk during critical reporting periods

In many cases, AFC helps companies transition from reactive close management to a more proactive and controlled financial operations model.

**AFC and SAP S/4HANA Integration**

SAP AFC is especially powerful when integrated with SAP S/4HANA. Through native integration, AFC can directly orchestrate SAP transactions, background jobs, and custom ABAP programs.

This allows organizations to automate complex finance activities while leveraging existing SAP investments and processes.

To fully enable automation, however, closing-related transactions and programs must be designed to support background execution, stable selection parameters, and predefined job variants. Proper technical preparation is therefore essential for successful AFC implementation.

**Conclusion**

SAP Advanced Financial Closing is more than a task management tool. It is a strategic financial close orchestration platform that enables organizations to modernize and automate one of the most critical finance processes.

By improving visibility, reducing manual dependency, and enabling intelligent automation, AFC helps finance organizations achieve faster, more reliable, and more controlled financial closing operations in an increasingly demanding business environment.`,

  "group-reporting-explained": `SAP Group Reporting is SAP's modern financial consolidation and reporting solution, designed to replace legacy tools like SAP BCS (Business Consolidation System) and third-party consolidation applications. It enables finance teams to perform real-time consolidation directly within SAP S/4HANA, eliminating the data extraction and loading cycles that characterize traditional consolidation approaches.

**Architecture and Integration**

Unlike standalone consolidation tools, Group Reporting is embedded within the SAP S/4HANA platform. This means that legal entity financial data flows directly into the consolidation layer without the need for intermediate staging or transformation. The result is a significant reduction in close cycle time and improved data quality.

**Multi-GAAP Support**

One of Group Reporting's key strengths is its ability to support multiple accounting standards simultaneously. Organizations can maintain parallel ledgers for IFRS, US GAAP, and local statutory requirements, with automated translation between standards based on configurable mapping rules.

**Intercompany Elimination**

The solution automates intercompany elimination — one of the most time-consuming aspects of group consolidation. It matches intercompany transactions across entities, identifies discrepancies, and generates elimination entries automatically, with exception-based workflows for unmatched items.

**Reporting and Analytics**

Group Reporting integrates with SAP Analytics Cloud for management reporting and analysis, enabling finance teams to drill from consolidated group financials down to individual entity transactions. This transparency is increasingly important for audit purposes and regulatory compliance.`,

  "why-financial-close-is-still-broken": `Despite decades of ERP investment and countless finance transformation initiatives, the financial close process remains one of the most painful and inefficient activities in corporate finance. Understanding why requires looking at both the structural and behavioral factors that perpetuate the problem.

**The Spreadsheet Problem**

The most pervasive issue is the continued reliance on spreadsheets for close management, reconciliation, and reporting. Despite the availability of purpose-built tools, most finance teams still use Excel as their primary close management tool. The reasons are understandable — spreadsheets are flexible, familiar, and free — but the consequences are severe: version control nightmares, formula errors, limited auditability, and no real-time visibility.

**Siloed Systems**

Most organizations have multiple ERP systems, often the result of acquisitions or regional implementations. Each system has its own close calendar, its own data structures, and its own reporting formats. Consolidating data across these systems requires manual extraction, transformation, and loading — a process that is both time-consuming and error-prone.

**Cultural Resistance**

Finance teams are often resistant to process change. The close process has been done the same way for years, and the people who execute it have built their careers around mastering its complexity. Automation threatens this expertise, creating organizational resistance that technology alone cannot overcome.

**The Path Forward**

The organizations that have successfully transformed their close process share several characteristics: strong executive sponsorship, a willingness to invest in change management alongside technology, and a phased approach that delivers quick wins while building toward a comprehensive solution.`,

  "why-cfos-invest-in-finance-transformation": `In today's volatile and highly competitive business environment, finance organizations are facing increasing pressure to deliver more than traditional accounting and reporting functions. Modern CFOs are now expected to provide strategic insight, support business agility, improve operational efficiency, and enable faster decision-making across the enterprise.

Finance transformation represents a broader shift toward building a more agile, data-driven, and intelligent finance function. Key drivers for this investment include:

**Improving Operational Efficiency**: Reducing manual tasks like data reconciliation and spreadsheet consolidation.

**Accelerating Decision-Making**: Enabling real-time reporting and integrated data models.

**Enhancing Governance and Compliance**: Strengthening internal controls and audit traceability.

**Supporting Global Complexity**: Harmonizing operations across different regions and currencies.

Successful transformation requires aligning people, processes, governance, and technology around clear business objectives.`,
};

// Generate generic content for articles without specific content
const articleContentKo: Record<string, string> = {
  "what-is-advanced-financial-closing-afc": `오늘날 점점 더 복잡해지는 비즈니스 환경에서 재무 조직은 더 빠른 장부 마감, 보고 정확도 향상, 글로벌 운영 전반의 컴플라이언스 강화라는 끊임없는 압박에 직면해 있습니다. 그러나 기존의 재무 결산 프로세스는 여러 시스템과 팀에 걸친 수동 조정, 스프레드시트, 이메일, 그리고 단절된 활동에 크게 의존하는 경우가 많습니다. 이는 비효율성을 초래하고, 운영 리스크를 높이며, 재무 사이클에서 가장 중요한 시기 중 하나인 결산 기간의 투명성을 제한합니다.

이러한 과제를 해결하기 위해 SAP는 기업 전반의 기말 결산 활동을 자동화, 표준화 및 가속화하도록 설계된 인텔리전트 재무 결산 오케스트레이션 솔루션인 SAP Advanced Financial Closing (AFC)를 출시했습니다.

**SAP AFC 이해하기**

SAP Advanced Financial Closing (AFC)는 조직이 SAP 환경 내에서 재무 결산 활동을 계획, 모니터링, 자동화 및 관리할 수 있도록 지원하는 중앙 집중식 솔루션입니다. SAP S/4HANA와 원활하게 통합되도록 구축된 AFC는 재무팀이 복잡한 결산 프로세스를 구조화되고 통제된 방식으로 조율할 수 있게 합니다.

스프레드시트나 이메일 기반 커뮤니케이션을 통해 결산 활동을 수동으로 관리하는 대신, AFC는 모든 결산 작업, 종속성, 승인 및 작업 실행을 중앙에서 관리할 수 있는 디지털 프레임워크를 제공합니다.

이 솔루션은 다음을 지원합니다:

월말 결산

분기말 결산

연말 결산

규제 및 법정 보고 활동

내부거래 대조 프로세스

재무 데이터 검증 및 모니터링

자동화 및 워크플로우 기반 실행을 통해 이러한 활동을 오케스트레이션함으로써, AFC는 수동 노력을 크게 줄이는 동시에 운영의 일관성과 투명성을 향상시킵니다.

**SAP AFC의 핵심 역량**

**1. 중앙 집중식 결산 오케스트레이션**

AFC는 재무팀이 모든 결산 활동의 상태를 실시간으로 모니터링할 수 있는 중앙 집중식 콕핏(Cockpit)을 제공합니다. 작업은 특정 사용자나 팀에 할당될 수 있고, 종속성에 따라 조직화되며, 대시보드와 상태 표시기를 통해 모니터링할 수 있습니다.

이를 통해 조직은 다음과 같은 사항에 대해 완전한 가시성을 확보할 수 있습니다:

미결 작업

지연된 활동

종속성 병목 현상

프로세스 완료 상태

엔티티 및 지역별 전체 결산 진행 상황

결과적으로 재무 리더는 결산 프로세스를 더 잘 제어할 수 있으며, 보고 마감 기한에 영향을 미치기 전에 문제를 선제적으로 해결할 수 있습니다.

**2. 반복적인 활동의 자동화**

AFC의 가장 가치 있는 역량 중 하나는 반복적인 재무 결산 작업의 자동화입니다.

SAP AFC는 다음을 트리거할 수 있습니다:

SAP 백그라운드 작업(Jobs)

재무 대조 프로그램

데이터 검증 루틴

배부(Allocation) 실행

외화 평가 실행

연결 준비 활동

이러한 활동은 사전 정의된 일정이나 종속성 로직에 따라 자동으로 실행될 수 있습니다. 예를 들어, 데이터 전기 활동이 완료되면 AFC는 수동 개입 없이 후속 검증 또는 대조 작업을 자동으로 시작할 수 있습니다.

이를 통해 다음을 줄일 수 있습니다:

수동 조정 노력

인적 오류

종속성 관리의 복잡성

운영 지연

**3. 글로벌 운영 전반의 표준화**

대규모 다국적 기업은 자회사, 지역 또는 사업부 간에 불일치하는 결산 절차로 인해 어려움을 겪는 경우가 많습니다.

AFC를 통해 조직은 다음을 표준화할 수 있습니다:

결산 캘린더

작업 템플릿

승인 워크플로우

에스컬레이션 절차

실행 로직

이는 현지의 법적 요구사항에 대한 유연성을 허용하면서도 기업 전반에 일관된 거버넌스 모델을 생성합니다. 또한 표준화는 감사 준비성을 높이고 컴플라이언스 관리를 간소화합니다.

**4. 투명성 및 감사 가능성 향상**

AFC 내에서 실행되는 모든 활동은 기록되며 추적이 가능합니다. 조직은 다음을 보여주는 상세한 감사 추적(Audit trails)을 유지할 수 있습니다:

누가 작업을 실행했는지

언제 완료되었는지

어떤 작업(Job)이나 프로그램이 트리거되었는지

오류 발생 여부

승인 및 사인오프(Sign-off) 이력

이러한 수준의 투명성은 내부 거버넌스와 외부 감사 요구사항을 모두 충족합니다.

**재무 조직을 위한 혜택**

SAP AFC를 도입하는 조직은 일반적으로 다음과 같은 여러 측정 가능한 혜택을 경험하게 됩니다:

재무 결산 주기의 단축

수동 작업 부하의 감소

프로세스 정확도의 향상

컴플라이언스 및 거버넌스 강화

재무팀과 IT팀 간의 협업 개선

결산 실행 상태에 대한 가시성 증대

핵심 보고 기간 동안의 운영 리스크 감소

많은 경우, AFC는 기업이 수동적인(Reactive) 결산 관리에서 보다 주도적이고(Proactive) 통제된 재무 운영 모델로 전환할 수 있도록 돕습니다.

**AFC와 SAP S/4HANA 통합**

SAP AFC는 SAP S/4HANA와 통합될 때 특히나 강력합니다. 네이티브 통합을 통해 AFC는 SAP 트랜잭션, 백그라운드 작업 및 커스텀 ABAP 프로그램을 직접 오케스트레이션할 수 있습니다. 이를 통해 조직은 기존의 SAP 투자와 프로세스를 활용하는 동시에 복잡한 재무 활동을 자동화할 수 있습니다. 그러나 자동화를 완벽하게 구현하기 위해서는 결산 관련 트랜잭션과 프로그램들이 백그라운드 실행, 안정적인 선택 파라미터, 그리고 사전에 정의된 작업 변동사항(Job Variants)을 지원하도록 설계되어야 합니다. 따라서 성공적인 AFC 구현을 위해서는 적절한 기술적 준비가 필수적입니다.

**결론**

SAP Advanced Financial Closing은 단순한 작업 관리 도구 그 이상입니다. 이는 조직이 가장 핵심적인 재무 프로세스 중 하나를 현대화하고 자동화할 수 있게 해주는 전략적 재무 결산 오케스트레이션 플랫폼입니다. 가시성을 개선하고, 수동 작업에 대한 의존도를 낮추며, 지능형 자동화를 가능하게 함으로써, AFC는 재무 조직이 점점 더 요구사항이 많아지는 비즈니스 환경에서 더 빠르고, 더 신뢰할 수 있으며, 더 통제된 재무 결산 운영을 달성하도록 지원합니다.`,

  "why-cfos-invest-in-finance-transformation": `오늘날처럼 변동성이 크고 경쟁이 치열한 비즈니스 환경에서 재무 조직은 전통적인 회계 및 보고 기능을 넘어 더 많은 역할을 수행해야 한다는 압박을 받고 있습니다. 현대의 CFO는 이제 기업 전반에 걸쳐 전략적 통찰력을 제공하고, 비즈니스 민첩성을 지원하며, 운영 효율성을 개선하고, 더 빠른 의사결정을 가능하게 할 것으로 기대받고 있습니다.

재무 혁신은 더 민첩하고 데이터 중심적이며 지능적인 재무 기능을 구축하기 위한 광범위한 변화를 의미합니다. 이러한 투자의 주요 동인은 다음과 같습니다:

**운영 효율성 개선**: 데이터 대조 및 스프레드시트 통합과 같은 수동 작업의 감소

**의사결정 가속화**: 실시간 보고 및 통합 데이터 모델의 구현

**거버넌스 및 컴플라이언스 강화**: 내부 통제 및 감사 추적성 강화

**글로벌 복잡성 대응**: 다양한 지역 및 통화 간의 운영 조화(Harmonization)

성공적인 혁신을 위해서는 명확한 비즈니스 목표를 중심으로 사람, 프로세스, 거버넌스 및 기술을 정렬하는 것이 필요합니다.`,
};

const articleContentJa: Record<string, string> = {
  "what-is-advanced-financial-closing-afc": `今日のますます複雑化するビジネス環境において、財務組織は、帳簿をより迅速に締め、報告の正確性を高め、グローバルな業務全体でコンプライアンスを強化するという絶え間ない圧力にさらされています。しかし、従来の財務決算プロセスは、複数のシステムやチームにわたる手動の調整、スプレッドシート、電子メール、および断絶された活動に大きく依存していることがよくあります。これは非効率性を生み出し、運用リスクを高め、財務サイクルにおける最も重要な期間の一つである決算期における透明性を制限します。

これらの課題に対処するために、SAPは、企業全体の期末決算活動を自動化、標準化、および加速するように設計されたインテリジェントな財務決算オーケストレーションソリューションであるSAP Advanced Financial Closing (AFC) を導入しました。

**SAP AFCの理解**

SAP Advanced Financial Closing (AFC) は、組織がSAP環境内での財務決算活動を計画、監視、自動化、および統制するのに役立つ集中管理型のソリューションです。SAP S/4HANAとシームレスに統合するように構築されたAFCにより、財務チームは複雑な決算プロセスを構造化され制御された方法で調整できます。

スプレッドシートや電子メールベースのコミュニケーションを通じて手動で決算活動を管理する代わりに、AFCはすべての決算タスク、依存関係、承認、およびジョブの実行を集中管理できるデジタルフレームワークを提供します。

このソリューションは以下をサポートします：

月次決算

四半期決算

年次決算

規制および法定報告活動

内部取引照合プロセス

財務データの検証と監視

自動化とワークフロー主導の実行を通じてこれらの活動をオーケストレーションすることにより、AFCは手作業を大幅に削減すると同時に、運用の整合性と透明性を向上させます。

**SAP AFCの主な機能**

**1. 集中管理型の決算オーケストレーション**

AFCは、財務チームがすべての決算活動のステータスをリアルタイムで監視できる集中管理型のコックピットを提供します。タスクは特定のユーザーまたはチームに割り当てることができ、依存関係によって整理され、ダッシュボードやステータスインジケーターを通じて監視できます。

これにより、組織は以下の事項について完全な可視性を得ることができます：

未完了タスク

遅延している活動

依存関係のボトルネック

プロセス完了ステータス

エンティティおよび地域をまたぐ決算全体の進捗状況

その結果、財務リーダーは決算プロセスをより適切に制御できるようになり、報告期限に影響が出る前に問題をプロアクティブに対処できます。

**2. 反復的な活動の自動化**

AFCの最も価値のある機能の一つは、繰り返される財務決算タスクの自動化です。

SAP AFCは以下をトリガーできます：

SAPバックグラウンドジョブ

財務照合プログラム

データ検証ルーチン

配賦（Allocation）の実行

外貨評価の実行

連結準備活動

これらの活動は、事前定義されたスケジュールや依存関係ロジックに基づいて自動的に実行できます。例えば、データ転記活動が完了すると、AFCは手動の介入なしに、後続の検証または照合ジョブを自動的に開始できます。

これにより、以下を削減できます：

手動の調整作業

ヒューマンエラー

依存関係管理の複雑さ

運用の遅延

**3. グローバル業務全体での標準化**

大規模な多国籍企業は、子会社、地域、または事業部門間で決算手順に一貫性がないことに苦労することがよくあります。

AFCにより、組織は以下を標準化できます：

決算カレンダー

タスクテンプレート

承認ワークフロー

エスカレーション手順

実行ロジック

これにより、現地の法的要件に対する柔軟性を維持しながら、企業全体で一貫したガバナンスモデルが構築されます。また、標準化は監査への準備態勢を向上させ、コンプライアンス管理を簡素化します。

**4. 透明性と監査可能性の向上**

AFC内で実行されるすべての活動はログに記録され、追跡可能です。組織は以下を示す詳細な監査証跡（Audit trails）を維持できます：

誰がタスクを実行したか

いつ完了したか

どのジョブまたはプログラムがトリガーされたか

エラーが発生したかどうか

承認およびサインオフ（Sign-off）の履歴

このレベルの透明性は、内部ガバナンスと外部監査の両方の要件をサポートします。

**財務組織にとってのメリット**

SAP AFCを導入する組織は、通常、以下のような複数の測定可能なメリットを享受できます：

財務決算サイクルの短縮

手作業による負荷の軽減

プロセスの正確性の向上

コンプライアンスとガバナンスの強化

財務チームとITチーム間のコラボレーションの改善

決算実行ステータスに対する可視性の向上

重要な報告期間における運用リスクの低減

多くの場合、AFCは企業がリアクティブ（事後対応的）な決算管理から、よりプロアクティブ（先見的）で制御された財務運用モデルへと移行するのを支援します。

**AFCとSAP S/4HANAの統合**

SAP AFCは、SAP S/4HANAと統合された際に特に強力な力を発揮します。ネイティブな統合を通じて、AFCはSAPトランザクション、バックグラウンドジョブ、およびカスタムABAPプログラムを直接オーケストレーションできます。これにより、組織は既存のSAPへの投資とプロセスを活用しながら、複雑な財務活動を自動化することができます。ただし、自動化を完全に実現するためには、決算関連のトランザクションとプログラムが、バックグラウンド実行、安定した選択パラメータ、および事前定義されたジョブバリアント（Job Variants）をサポートするように設計されている必要があります。したがって、AFCを成功させるためには、適切な技術的準備が不可欠です。

**結論**

SAP Advanced Financial Closingは、単なるタスク管理ツールではありません。これは、組織が最も重要な財務プロセスの1つを近代化および自動化することを可能にする、戦略的な財務決算オーケストレーションプラットフォームです。可視性を向上させ、手作業への依存を減らし、インテリジェントな自動化を可能にすることで、AFCは、ますます厳しくなるビジネス環境において、財務組織がより迅速で、より信頼性が高く、より制御された財務決算運用を達成するのを支援します。`,

  "why-cfos-invest-in-finance-transformation": `今日の不安定で競争の激しいビジネス環境において、財務組織は伝統的な会計および報告機能以上の成果を出すよう、かつてない圧力にさらされています。現代のCFOには、戦略的な洞察を提供し、ビジネスの機敏性を支援し、運用効率を向上させ、企業全体の迅速な意思決定を可能にすることが期待されています。

財務変革（ファイナンス・トランスフォーメーション）は、より機敏でデータ駆動型のインテリジェントな財務機能を構築するための広範な転換を意味します。この投資の主な要因は以下の通りです：

**運用効率の向上**: データの照合やスプレッドシートの統合といった手動タスクの削減

**意思決定の迅速化**: リアルタイムレポートと統合データモデルの実現

**ガバナンスとコンプライアンスの強化**: 内部統制と監査証跡の強化

**グローバルな複雑性への対応**: 異なる地域や通貨間での運用の調和

変革を成功させるには、明確なビジネス目標を中心に「人、プロセス、ガバナンス、テクノロジー」を整合させることが不可欠です。`,
};

function generateGenericContent(insight: typeof INSIGHTS[0], language: string): string {
  return `${insight.excerpt}

This insight explores the key dimensions of ${insight.title.toLowerCase()}, drawing on MAVEK BCS's experience delivering finance transformation programs across multiple industries and geographies.

**Key Themes**

${insight.tags.map(tag => `- **${tag}**: Understanding the role of ${tag.toLowerCase()} in modern finance operations`).join('\n')}

**Industry Relevance**

The topics covered in this insight are particularly relevant for organizations in ${insight.relatedIndustries.join(', ')} industries, where the challenges described are most acute.

**MAVEK BCS Perspective**

Our consultants bring deep expertise in implementing the solutions and processes described here. We have helped organizations across multiple industries navigate these challenges and achieve measurable improvements in finance performance.

**Getting Started**

If you would like to discuss how these concepts apply to your organization, please contact our team. We offer complimentary initial consultations to help you understand the opportunity and build a business case for change.`;
}

export default function InsightDetail({ params }: InsightDetailProps) {
  const { language } = useLanguage();
  const { slug } = params;

  const insight = INSIGHTS.find((i) => i.slug === slug);

  if (!insight) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link href="/insights" className="btn-outline-navy no-underline">Back to Insights</Link>
        </div>
      </Layout>
    );
  }

  const title = language === "ko" ? insight.titleKo : language === "ja" ? insight.titleJa : insight.title;
  const content = (language === "ko" ? articleContentKo[slug] : language === "ja" ? articleContentJa[slug] : articleContent[slug]) || generateGenericContent(insight, language);

  // Related insights (same category, exclude current)
  const related = INSIGHTS.filter((i) => i.category === insight.category && i.slug !== slug).slice(0, 3);

  // Related industries
  const relatedIndustries = INDUSTRIES.filter((ind) => insight.relatedIndustries.includes(ind.slug));

  // Related solutions
  const relatedSolutions = SOLUTION_CATEGORIES.flatMap((cat) =>
    cat.solutions.filter((s) => insight.relatedSolutions.includes(s.slug)).map((s) => ({ ...s, categorySlug: cat.slug }))
  );

  // Format content as paragraphs with bold support
  const renderContent = (text: string) => {
    return text.split('\n\n').map((para, idx) => {
      if (para.startsWith('**') && para.endsWith('**') && para.indexOf('**', 2) === para.length - 2) {
        // Heading
        const heading = para.slice(2, -2);
        return <h3 key={idx} className="text-xl font-bold mt-8 mb-4" style={{ color: "var(--navy-dark)" }}>{heading}</h3>;
      }
      if (para.startsWith('- ')) {
        // List
        const items = para.split('\n').filter(l => l.startsWith('- '));
        return (
          <ul key={idx} className="space-y-2 my-4">
            {items.map((item, i) => {
              const content = item.slice(2);
              const parts = content.split('**');
              return (
                <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: "var(--gold)" }} />
                  <span>{parts.map((p, pi) => pi % 2 === 1 ? <strong key={pi}>{p}</strong> : p)}</span>
                </li>
              );
            })}
          </ul>
        );
      }
      // Regular paragraph with inline bold
      const parts = para.split('**');
      return (
        <p key={idx} className="text-gray-600 leading-relaxed mb-4 text-base">
          {parts.map((part, pi) => pi % 2 === 1 ? <strong key={pi} className="font-semibold text-gray-800">{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "var(--navy-dark)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.2) 40px, rgba(255,255,255,0.2) 41px)" }} />
        <div className="container relative z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/insights" className="no-underline hover:text-white transition-colors">Insights</Link>
            <ChevronRight size={12} />
            <span className="text-gray-300">{insight.category}</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5" style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}>
                {insight.category}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={10} /> {insight.readTimeMinutes} {language === "ko" ? "분 읽기" : language === "ja" ? "分で読める" : "min read"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {title}
            </h1>
            <p className="text-gray-300 leading-relaxed text-lg">{language === "ko" && insight.excerptKo ? insight.excerptKo : language === "ja" && insight.excerptJa ? insight.excerptJa : insight.excerpt}</p>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose max-w-none">
                {renderContent(content)}
              </div>

              {/* Tags */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={14} className="text-gray-400" />
                  {insight.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Related Industries */}
              {relatedIndustries.length > 0 && (
                <div>
                  <div className="section-divider" />
                  <h4 className="text-sm font-bold mb-4" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? "관련 산업" : language === "ja" ? "関連業界" : "Related Industries"}
                  </h4>
                  <div className="space-y-2">
                    {relatedIndustries.map((ind) => (
                      <Link
                        key={ind.slug}
                        href={`/industries/${ind.slug}`}
                        className="flex items-center gap-2 text-xs text-gray-600 hover:text-[var(--navy)] transition-colors no-underline"
                      >
                        <span>{ind.icon}</span>
                        <span>{language === "ko" ? ind.nameKo : language === "ja" ? ind.nameJa : ind.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Solutions */}
              {relatedSolutions.length > 0 && (
                <div>
                  <div className="section-divider" />
                  <h4 className="text-sm font-bold mb-4" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? "관련 솔루션" : language === "ja" ? "関連ソリューション" : "Related Solutions"}
                  </h4>
                  <div className="space-y-2">
                    {relatedSolutions.map((sol) => (
                      <Link
                        key={sol.slug}
                        href={`/solutions/${sol.categorySlug}/${sol.slug}`}
                        className="flex items-center gap-2 text-xs text-gray-600 hover:text-[var(--navy)] transition-colors no-underline"
                      >
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 text-white"
                          style={{ backgroundColor: sol.vendor === "SAP" ? "var(--navy)" : sol.vendor === "Oracle" ? "var(--navy-mid)" : "#1a1a2e" }}
                        >
                          {sol.vendor.slice(0, 3)}
                        </span>
                        <span className="line-clamp-1">{language === "ko" ? sol.nameKo : language === "ja" ? sol.nameJa : sol.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="p-5" style={{ backgroundColor: "var(--navy-dark)" }}>
                <h4 className="text-white font-bold text-sm mb-2">
                  {language === "ko" ? "전문가와 상담" : language === "ja" ? "専門家に相談" : "Talk to an Expert"}
                </h4>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                  {language === "ko" ? "이 주제에 대해 더 알고 싶으신가요?" : language === "ja" ? "このトピックについてもっと知りたいですか？" : "Want to explore this topic for your organization?"}
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

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="section-off-white py-16">
          <div className="container">
            <div className="section-divider" />
            <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--navy-dark)" }}>
              {language === "ko" ? "관련 인사이트" : language === "ja" ? "関連インサイト" : "More in This Category"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/insights/${rel.slug}`} className="p-6 bg-white border border-gray-100 card-hover no-underline group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {rel.readTimeMinutes} min
                    </span>
                  </div>
                  <h4 className="text-sm font-bold mb-2 group-hover:text-[var(--navy)] transition-colors" style={{ color: "var(--navy-dark)" }}>
                    {language === "ko" ? rel.titleKo : language === "ja" ? rel.titleJa : rel.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{language === "ko" && rel.excerptKo ? rel.excerptKo : language === "ja" && rel.excerptJa ? rel.excerptJa : rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
