# MAVEK BCS Website TODO

## Phase 2: Foundation
- [x] Global CSS: dark blue & white corporate theme, typography (Inter/Playfair)
- [x] Database schema: users, clientContracts tables
- [x] i18n context and language switcher (EN/KO/JA)
- [x] Top navigation with mega-menu (Industries, Solutions, Insights)
- [x] Footer with sitemap links and language selector
- [x] App.tsx routing for all pages

## Phase 3: Core Pages
- [x] Homepage: hero, value proposition, featured industries, solutions overview, latest insights
- [x] About page: company overview
- [x] CSR sub-page
- [x] Contact page
- [x] Careers page

## Phase 4: Industries (12 pages)
- [x] Automotive
- [x] Semiconductors
- [x] Pharmaceuticals
- [x] Telecommunications
- [x] Oil & Gas
- [x] Renewable Energy
- [x] Financial Services
- [x] Real Estate
- [x] Retail
- [x] Energy
- [x] Utilities
- [x] Electronics Manufacturing

## Phase 5: Solutions (8 categories, 16 solution pages)
- [x] Closing category page + SAP AFC, SAP Group Reporting, Oracle FCCS, Oracle ARCS, Oracle Close Manager, Blackline
- [x] Tax category page + SAP DRC
- [x] Treasury category page + SAP TRM, SAP Cash Management, SAP MBC
- [x] Financial Supply Chain category page + SAP FSCM
- [x] Billing category page + SAP BRIM
- [x] Risk category page + SAP GRC
- [x] Planning category page + SAP Analytics Cloud, Oracle PBCS
- [x] Lease category page + SAP RE-FX

## Phase 6: Insights (60 articles)
- [x] Insights listing page with category filtering and search
- [x] All 60 articles pre-populated in siteData with tags and cross-references
- [x] Individual article detail pages

## Phase 7: Client Portal
- [x] Client portal login page
- [x] Protected dashboard: Remaining Service Hours display
- [x] Protected dashboard: Contract Status display
- [x] Admin portal: manage client contracts (hours + status) at /admin

## Phase 8: Multi-Language Support
- [x] English translations (primary)
- [x] Korean translations
- [x] Japanese translations
- [x] Language switcher in nav and footer

## Phase 9: Polish
- [x] Responsive design (mobile/tablet/desktop)
- [x] Mega-menu dropdowns for Industries, Solutions
- [x] Cross-reference links between insights, industries, and solutions
- [x] Zero TypeScript errors
- [x] All vitest tests passing
- [x] CSS @import ordering fixed

## Phase 10: Industry Page Content (English)
- [x] Populate all 12 industry pages with provided English professional content (overview + 4 key challenges)
- [x] Maintain narrative/consulting tone (no bullet points)
- [x] Keep existing corporate design consistent

## Phase 11: Layout Architecture & Multi-Language Design
- [x] Upgrade global typography: Noto Sans KR + Noto Sans JP for Korean/Japanese, premium serif for EN headings
- [x] Add CJK-specific line-height and font-feature-settings for premium rendering
- [x] Make industry page overview container flexible (no fixed height, auto-expand for long CJK text)
- [x] Make Key Challenges grid flexible (wrap gracefully for longer Korean/Japanese bullet text)
- [x] Header language switcher: always visible, accessible on all screen sizes
- [x] Footer language switcher: visible and accessible
- [x] Source and add Hero image to IndustryDetail hero section (responsive, overlay-safe)
- [x] Source and add Macro image (wide context shot) to each industry page
- [x] Source and add Detail image (close-up/specific shot) to each industry page
- [x] Ensure all images are responsive (object-cover, aspect-ratio containers)

## Phase 12: Solution Page Content (English)
- [x] SAP AFC: update overview and key features with provided English content
- [x] SAP Group Reporting: update overview and key features with provided English content
- [x] Oracle FCCS: update overview and key features with provided English content
- [x] Oracle ARCS: update overview and key features with provided English content
- [x] Blackline: update overview and key features with provided English content
- [x] SAP DRC: update overview and key features with provided English content
- [x] SAP TRM: update overview and key features with provided English content
- [x] SAP MBC: update overview and key features with provided English content

## Phase 13: Remaining Solution Page Content (English)
- [x] Oracle Close Manager: update overview and key features with provided English content
- [x] SAP Cash Management: update overview and key features with provided English content
- [x] SAP FSCM: update overview and key features with provided English content
- [x] SAP BRIM: update overview and key features with provided English content
- [x] SAP GRC: update overview and key features with provided English content
- [x] SAP Analytics Cloud: update overview and key features with provided English content
- [x] Oracle PBCS: update overview and key features with provided English content
- [x] SAP RE-FX: update overview and key features with provided English content

## Phase 14: Solution Page YouTube Videos
- [x] Replace all 16 solution YouTube video IDs with correct provided URLs

## Phase 15: Remove Oracle Close Manager & Korean Solution Translations
- [x] Remove Oracle Close Manager from siteData.ts (solutions list)
- [x] Remove Oracle Close Manager from SolutionDetail.tsx data
- [x] Verify no broken links or references to oracle-close-manager remain
- [x] Update all 15 solution pages with Korean overviewKo and keyFeaturesKo

## Phase 16: Solution Pages - Rich English Content & Layout
- [x] Remove Oracle Close Manager from siteData.ts and SolutionDetail.tsx
- [x] Apply Korean translations for all 15 solutions (overviewKo, keyFeaturesKo)
- [x] Update SolutionDetail layout: rich narrative overview, structured key features with icons, Why MAVEK BCS CTA section
- [x] Populate all 15 solutions with provided English narrative content
- [x] Ensure layout is flexible for future KO/JA text length variations

## Phase 17: Solution Pages - English Content Update (8 solutions)
- [x] SAP AFC: update overview and key features with exact provided content
- [x] SAP Group Reporting: update overview and key features with exact provided content
- [x] Oracle FCCS: update overview and key features with exact provided content
- [x] Oracle ARCS: update overview and key features with exact provided content
- [x] Blackline: update overview and key features with exact provided content
- [x] SAP DRC: update overview and key features with exact provided content
- [x] SAP TRM: update overview and key features with exact provided content
- [x] SAP Cash Management: update overview and key features with exact provided content

## Phase 18: Solution Pages - English Content Update (7 remaining solutions)
- [x] SAP MBC: update overview and key features with exact provided content
- [x] SAP FSCM: update overview and key features with exact provided content
- [x] SAP BRIM: update overview and key features with exact provided content
- [x] SAP GRC: update overview and key features with exact provided content
- [x] SAP Analytics Cloud: update overview and key features with exact provided content
- [x] Oracle PBCS: update overview and key features with exact provided content
- [x] SAP RE-FX: update overview and key features with exact provided content

## Phase 19: Solution Pages - Japanese Content Update (all 15 solutions)
- [x] SAP AFC: update overviewJa and keyFeaturesJa with exact provided content
- [x] SAP Group Reporting: update overviewJa and keyFeaturesJa with exact provided content
- [x] Oracle FCCS: update overviewJa and keyFeaturesJa with exact provided content
- [x] Oracle ARCS: update overviewJa and keyFeaturesJa with exact provided content
- [x] Blackline: update overviewJa and keyFeaturesJa with exact provided content
- [x] SAP DRC: update overviewJa and keyFeaturesJa with exact provided content
- [x] SAP TRM: update overviewJa and keyFeaturesJa with exact provided content
- [x] SAP Cash Management: update overviewJa and keyFeaturesJa with exact provided content
- [x] SAP MBC: update overviewJa and keyFeaturesJa with exact provided content
- [x] SAP FSCM: update overviewJa and keyFeaturesJa with exact provided content
- [x] SAP BRIM: update overviewJa and keyFeaturesJa with exact provided content
- [x] SAP GRC: update overviewJa and keyFeaturesJa with exact provided content
- [x] SAP Analytics Cloud: update overviewJa and keyFeaturesJa with exact provided content
- [x] Oracle PBCS: update overviewJa and keyFeaturesJa with exact provided content
- [x] SAP RE-FX: update overviewJa and keyFeaturesJa with exact provided content

## Phase 20: Solution Pages - Why MAVEK BCS Japanese Section
- [x] Update Japanese "Why MAVEK BCS" section title, heading, body text, and CTA button labels in SolutionDetail.tsx

## Phase 21: Solution Pages - Korean Content Update (all 15 solutions)
- [x] SAP AFC: update overviewKo and keyFeaturesKo with exact provided content
- [x] SAP Group Reporting: update overviewKo and keyFeaturesKo with exact provided content
- [x] Oracle FCCS: update overviewKo and keyFeaturesKo with exact provided content
- [x] Oracle ARCS: update overviewKo and keyFeaturesKo with exact provided content
- [x] Blackline: update overviewKo and keyFeaturesKo with exact provided content
- [x] SAP DRC: update overviewKo and keyFeaturesKo with exact provided content
- [x] SAP TRM: update overviewKo and keyFeaturesKo with exact provided content
- [x] SAP Cash Management: update overviewKo and keyFeaturesKo with exact provided content
- [x] SAP MBC: update overviewKo and keyFeaturesKo with exact provided content
- [x] SAP FSCM: update overviewKo and keyFeaturesKo with exact provided content
- [x] SAP BRIM: update overviewKo and keyFeaturesKo with exact provided content
- [x] SAP GRC: update overviewKo and keyFeaturesKo with exact provided content
- [x] SAP Analytics Cloud: update overviewKo and keyFeaturesKo with exact provided content
- [x] Oracle PBCS: update overviewKo and keyFeaturesKo with exact provided content
- [x] SAP RE-FX: update overviewKo and keyFeaturesKo with exact provided content

## Phase 22: About Page - Korean and Japanese Company Introduction
- [x] Update Korean company introduction text (3 paragraphs) in About page
- [x] Update Japanese company introduction text (3 paragraphs) in About page

## Phase 23: CSR Page Full Rewrite (Artistic Excellence Theme)
- [x] Rewrite CSR hero section with bilingual EN/KO content (Artistic Excellence headline)
- [x] Add Monthly Engagement section with bilingual EN/KO content
- [x] Add Four Pillars grid (Classical Music, Artist Development, Cultural Exchange, Community Access) with bilingual EN/KO
- [x] Add Japanese (JA) translations for all CSR sections
- [x] Add CTA section inviting partners to join cultural journey
- [x] Update LanguageContext.tsx csr.title and csr.subtitle for KO and JA

## Phase 24: CSR Page - Korean Translation Update
- [x] Update heroBody1Ko and heroBody2Ko with provided single-paragraph Korean text
- [x] Update monthlyBody1Ko and monthlyBody2Ko (merge into single paragraph)
- [x] Update all 4 pillars: titleKo, visionKo, initiativesKo (4 items each)

## Phase 25: CSR Page - Japanese Translation Update
- [x] Update heroHeadlineJa, heroBody1Ja, heroBody2Ja with provided Japanese text
- [x] Update monthlyHeadlineJa, monthlyBody1Ja with provided Japanese text
- [x] Update all 4 pillars: titleJa, visionJa, initiativesJa (4 items each)

## Phase 26: Homepage Updates
- [x] Rename "CERTIFIED PARTNER:" label to "Technology Platforms We Support" (trilingual)
- [x] Add trilingual description under the platform names
- [x] Update key metrics: values (15+, 200+, 4, 12) and trilingual labels

## Phase 27: Office Address Updates
- [x] Update Japan office address (EN/KO/JA) in Contact page and all other locations
- [x] Update Korea office address (EN/KO/JA) in Contact page and all other locations
- [x] Update Hong Kong office address (EN/KO/JA) in Contact page and all other locations
- [x] Simplify Philippines office to "Taguig, Metro Manila, Philippines" in all locations

## Phase 28: Footer & Terminology Fixes
- [x] Fix footer Korea address: Seoul → Incheon NEATT (EN/KO/JA)
- [x] Fix footer Philippines address: Makati → Taguig, Metro Manila
- [x] Change language selector order: EN → JA → KO (currently EN → KO → JA)
- [x] Replace all "금융 솔루션" with "재무 솔루션" across all Korean text
- [x] Replace all "金融ソリューション" with "財務ソリューション" across all Japanese text

## Phase 29: Contact Page Phone Number Removal
- [x] Remove all phone number fields and displays from Contact.tsx

## Phase 30: Blog Article Update - SAP AFC
- [x] Update SAP AFC article English content with new provided text
- [x] Add Korean translation for SAP AFC article
- [x] Add Japanese translation for SAP AFC article
- [x] Add multilingual article body support (articleContentKo, articleContentJa Records) to InsightDetail.tsx
