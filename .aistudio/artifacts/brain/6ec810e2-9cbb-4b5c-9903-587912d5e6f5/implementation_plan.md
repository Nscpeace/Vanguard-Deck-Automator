# Automated Board Deck & Management Accounts Generator

A production-grade, brand-governed financial deck generator that transforms structured financial data (P&L, Balance Sheet, Cash Flow, KPIs, and Risks) into native, editable PowerPoint presentations (`.pptx`) and presentation decks, augmented with auditable AI executive commentary governed by firm-defined tone and length rules.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Key Architecture Decisions for Review:**
> - **Native Presentation Engine**: We will implement client-side native PowerPoint generation using `PptxGenJS`. This generates true editable PowerPoint shapes, native Microsoft Office charts (bar, line, waterfall, and donut), and styled data tables—avoiding static screenshot images or rasterized slides.
> - **Accuracy & Safeguard Guarantee**: Financial figures are mapped directly from validated input models into fixed template positions. AI commentary is strictly isolated to designated narrative boxes with configurable tone rules (e.g., Board Conservative, Investor Growth, Bank/Lender Audit) and token length limits. Numbers in charts and tables are never generated or modified by AI.
> - **Preloaded Models & Custom File Ingestion**: Out of the box, the app provides two comprehensive demo models (B2B Enterprise SaaS and Advanced Manufacturing & Supply Chain) with complete monthly P&L, balance sheet, cash runway, and variance datasets, alongside drag-and-drop CSV/JSON upload and interactive grid editing.
> - **Portfolio Showcase**: Includes a "Before & After" comparison tool (demonstrating human analyst formatting drift vs. standardized automated decks), an interactive slide viewer with live narrative editing, and a 1-click generation simulation recording/tour.

---

## 1. Overview & Core Concept

### What It Does
The platform replaces the tedious, error-prone monthly routine of manually rebuilding 30+ slide board packs in PowerPoint. Finance analysts and CFOs connect their monthly numbers (or upload an Excel/CSV export), review and edit automated slide layouts in real time, generate constrained executive narrative bullets, and export a ready-to-present, brand-compliant PowerPoint (`.pptx`) deck with native editable charts.

### Target Audience / Persona
- **Chief Financial Officers (CFOs) & VPs of Finance**: Needing rapid, error-free deck generation before monthly board meetings.
- **Financial Planning & Analysis (FP&A) Leads & Analysts**: Eliminating 15–20 hours of manual formatting, copy-pasting, and chart re-alignment every month.
- **Private Equity / Venture Capital Operating Partners**: Requiring standardized portfolio company reporting across disparate accounting tools.

### Key Value Delivered
- **Zero Formatting Drift**: Brand typography, color palette, logo lockups, padding, and layout geometries are enforced programmatically.
- **True Editable Office Objects**: Output slides contain real PowerPoint charts and tables that board members can inspect and edit in desktop PowerPoint.
- **Human-in-the-Loop Review**: Designated narrative approval step where finance professionals review, refine, and sign off on commentary before final export.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│ 1. Data Ingestion│ ──> │ 2. Template & Brand  │ ──> │ 3. Deck Preview &    │ ──> │ 4. Final Review &   │
│   & Preset Select│     │    Configuration     │     │    AI Commentary Gen │     │    Native PPTX Export│
└─────────────────┘     └──────────────────────┘     └──────────────────────┘     └─────────────────────┘
```

1. **Workspace Hub & Dataset Selection**:
   - Header with firm selector, reporting period switcher (e.g., *Q3 2026 / September Close*), and workflow status indicator.
   - Quick selector for pre-built industry datasets (*Enterprise B2B SaaS*, *Industrial Robotics Manufacturing*, or *Custom CSV / Excel Upload*).
   - "Before vs. After" toggle showcasing analyst pain points (misaligned charts, font inconsistencies, formula drift) versus the automated standard.

2. **Slide Library & Master Layout Inspector**:
   - Grid or split-pane view displaying the 6 canonical board pack slides:
     1. **Executive Summary & Financial Scorecard**: High-level revenue, gross margin, EBITDA, net cash burn, and headline bullets.
     2. **Profit & Loss (P&L) Statement**: Full variance table (Budget vs. Actual vs. Prior Year) with colored delta markers.
     3. **Balance Sheet & Liquidity**: Working capital, cash runway runway waterfall, asset/liability composition.
     4. **Cash Flow & Burn Analysis**: Operating, investing, and financing cash flows with monthly trend line.
     5. **Operational KPIs & Unit Economics**: CAC, LTV, Net Retention Rate (SaaS) or Capacity Utilization & Scrap Rate (Manufacturing).
     6. **Risks, Mitigations & Next Actions**: Structured board governance matrix with owners, impact ratings, and deadlines.

3. **Slide Builder & Human-in-the-Loop Review**:
   - Live 16:9 interactive slide canvas rendering exact slide geometry, brand typography, and live data charts.
   - Clickable AI Narrative slots: Finance team can click "Generate Commentary" with custom tone controls (Conservative, Pragmatic, Expansionary), modify prompt instructions, or directly edit text inline.
   - Safeguard audit badge: Displays confirmation that all tabular figures match source ledger figures.

4. **1-Click Generation & Export**:
   - Multi-format exporter:
     - **Native PPTX**: Full Microsoft Office `.pptx` download with editable chart objects.
     - **PDF Print View**: Clean print-optimized document view.
     - **Google Slides Compatible**: Formatted shapes and tables ready for Google Drive import.
   - Generation summary report showing time saved and slides produced.

### Visual Identity & Theme
- **Aesthetic Direction**: High-trust executive financial terminal. Clean slate neutrals, deep obsidian navy, razor-sharp tabular spacing, and subtle gold/brass accents reminiscent of top-tier investment banking materials.
- **Color Palette**:
  - Dominant Canvas: Crisp clean off-white / dark slate workspace background (`#F8FAFC` in light mode, `#0B0F19` in executive dark mode).
  - Primary Corporate Navy: `#0F1E36` (deep board navy for slide master headers and primary buttons).
  - Accent Brass / Gold: `#C59B27` (refined executive accent for highlights and active tab indicators).
  - Semantic Status:
    - Favorable Variance / Normal: `#15803D` (muted forest green).
    - Unfavorable Variance / Alert: `#B91C1C` (classic crimson).
    - Neutral / Watch: `#B45309` (amber).
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` or `Manrope` for crisp, contemporary executive headers.
  - Body & Commentary: `DM Sans` for comfortable reading density.
  - Data, Ledger & Tables: Tabular numbers strictly enforced (`tabular-nums font-mono`) for precision alignment.
- **Anti-Slop Discipline**:
  - No decorative floating purple bubbles or AI sparkles.
  - No pill badges on static metadata (clean unboxed text with typographic `·` separators).
  - Zero mock status tickers or fake telemetry footers.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Client-Side PptxGenJS vs. Server-Side Python-PPTX
- **Chosen Approach**: `PptxGenJS` integrated directly in the browser and TypeScript build.
- **Why**: Zero external Python daemon or microservice dependencies; instant zero-latency `.pptx` generation directly in the browser session with no file system permission complications.
- **Capabilities**: Supports native PowerPoint bar charts, line graphs, pie/doughnut charts, shaped cards, master slide templates, speaker notes, and multi-column tables.

### Decision 2: Rule-Constrained AI Commentary via Gemini 3.8 Flash
- **Chosen Approach**: Server-side proxy endpoint `/api/generate-commentary` utilizing `@google/genai` with `gemini-3.8-flash`.
- **Why**: `gemini-3.8-flash` delivers sub-second response times, precise financial reasoning, and strict adherence to structured length rules (e.g., "exactly 3 executive bullet points, max 25 words per bullet, highlighting $ and % variances without speculation").
- **Audit Safeguard**: The client validates that commentary only describes the supplied financial delta matrix without fabricating numbers outside the ledger.

### Decision 3: Realistic Multi-Industry Financial Datasets
- **Chosen Approach**: Comprehensive typed data models for SaaS (ARR, MRR, Churn, CAC, Magic Number) and Manufacturing (Gross Output, Yield, COGS breakdown, CapEx), with a live formula and variance calculation engine.
- **Why**: Demonstrates real FP&A workflow fidelity rather than generic placeholder lorem-ipsum decks.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Automated Board Deck UI                         │
│                                                                        │
│ ┌───────────────────────────┐  ┌─────────────────────────────────────┐ │
│ │  Data Ingestion & Presets │  │  Template Brand Controls (Themes)   │ │
│ │  - SaaS B2B Model         │  │  - Master Slide Colors & Fonts      │ │
│ │  - Manufacturing Model    │  │  - Logo & Layout Grids              │ │
│ │  - Custom CSV/JSON Parser │  │  - Narrative Rules & Word Limits    │ │
│ └─────────────┬─────────────┘  └──────────────────┬──────────────────┘ │
│               │                                   │                    │
│               ▼                                   ▼                    │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │              Central Financial Data & Variance Engine              │ │
│ │  - Actuals vs Budget vs Prior Year calculations                    │ │
│ │  - Financial Ratios (Gross Margin %, EBITDA %, Runway months)       │ │
│ └─────────────────────────────┬──────────────────────────────────────┘ │
│                               │                                        │
│               ┌───────────────┴───────────────┐                        │
│               ▼                               ▼                        │
│ ┌───────────────────────────┐   ┌────────────────────────────────────┐ │
│ │ Live Interactive Slide    │   │ AI Commentary Controller           │ │
│ │ Canvas Preview (16:9)     │   │ - Server Proxy (/api/commentary)   │ │
│ │ - Executive Summary       │   │ - Gemini 3.8 Flash Engine          │ │
│ │ - P&L Variance Table      │   │ - Word Count & Tone Enforcement    │ │
│ │ - Balance Sheet / Runway  │   │ - Human Editing & Approval State   │ │
│ │ - Cash Flow Waterfall     │   └────────────────────────────────────┘ │
│ │ - KPI Scorecard           │                     │                    │
│ │ - Risks & Actions         │ <───────────────────┘                    │
│ └─────────────┬─────────────┘                                          │
│               │                                                        │
│               ▼                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │                    Export & Production Pipeline                    │ │
│ │ - PptxGenJS Native PPTX Exporter (Office Charts, Tables, Masters)  │ │
│ │ - Clean PDF / Print Slide Deck Exporter                            │ │
│ │ - Before vs After Analyst Comparison Showcase                      │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Data Models
- `FinancialDataset`: Contains metadata (company name, period, currency), `pnl` (revenue line items, COGS, OpEx, EBITDA, Net Income), `balanceSheet` (current/non-current assets, liabilities, equity, cash balance), `cashFlow` (operating, investing, financing, net change), and `kpis` (domain-specific metrics).
- `SlideConfig`: Defines slide type, title, subtitle, data bindings, active commentary text, review status (`Draft`, `Under Review`, `Approved`), and narrative constraints (max bullets, tone).
- `BrandTheme`: Primary color, secondary color, accent color, background color, card background, font family, and logo placement.

### Key Sequences & Integrations
1. **Financial Loading**: Client selects preset or uploads CSV -> central engine verifies totals, computes variances ($\Delta$ and $\Delta\%$), and initializes the 6 slide decks.
2. **AI Commentary Generation**:
   - Client sends extracted variance rows and tone selection to `/api/generate-commentary`.
   - Backend calls `@google/genai` with `gemini-3.8-flash` using a strict system instruction: "You are a senior VP of FP&A drafting board narrative. Report facts from the supplied financial table only. Obey length limit."
   - AI draft is populated into the slide's narrative slot with an "Unreviewed" badge.
3. **Finance Review**: User reviews numbers and edits bullet points directly. Status flips to "Approved".
4. **PptxGenJS Export**:
   - Initializes a 16:9 widescreen presentation with master slide layouts.
   - Inserts native PowerPoint chart shapes (e.g. `pptx.charts.BAR`, `pptx.charts.LINE`) with raw series data.
   - Inserts formatted financial tables with alternate row shading and right-aligned tabular numerals.
   - Inserts approved commentary text boxes and footer metadata.
   - Downloads `[Company]_Board_Deck_[Period].pptx` directly to the user's browser.
