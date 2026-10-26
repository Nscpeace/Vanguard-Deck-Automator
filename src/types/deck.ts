export type SlideType =
  | 'executive_summary'
  | 'pnl'
  | 'balance_sheet'
  | 'cash_flow'
  | 'kpis'
  | 'risks';

export type ToneRule =
  | 'board_conservative'
  | 'growth_investor'
  | 'audit_lender'
  | 'pragmatic_turnaround';

export type ReviewStatus = 'draft' | 'under_review' | 'approved';

export interface FinancialMetric {
  id: string;
  label: string;
  actual: number;
  budget: number;
  priorYear: number;
  unit: '$' | '%' | 'x' | 'days' | 'months' | 'count';
  format?: 'currency' | 'percent' | 'decimal' | 'integer';
  isFavorableIfHigher?: boolean;
}

export interface PnLRow {
  id: string;
  name: string;
  actual: number;
  budget: number;
  priorYear: number;
  category: 'Revenue' | 'COGS' | 'OpEx' | 'Tax' | 'EBITDA';
  isSubtotal?: boolean;
}

export interface BalanceSheetRow {
  id: string;
  item: string;
  currentPeriod: number;
  priorPeriod: number;
  category: 'Current Assets' | 'Non-Current Assets' | 'Current Liabilities' | 'Long-Term Debt' | 'Equity';
}

export interface CashFlowRow {
  id: string;
  activity: string;
  inflowOutflow: number;
  budget: number;
  type: 'Operating' | 'Investing' | 'Financing';
}

export interface RiskItem {
  id: string;
  title: string;
  category: 'Commercial' | 'Operational' | 'Regulatory' | 'Financial';
  impact: 'High' | 'Medium' | 'Low';
  likelihood: 'High' | 'Medium' | 'Low';
  mitigation: string;
  owner: string;
  status: 'Open' | 'Mitigating' | 'Resolved';
}

export interface KPIMetric {
  id: string;
  name: string;
  value: string;
  deltaQoQ: string;
  deltaYoY: string;
  isPositive: boolean;
  benchmark: string;
  description: string;
}

export interface FinancialDataset {
  id: string;
  name: string;
  companyName: string;
  industry: 'B2B Enterprise SaaS' | 'Advanced Manufacturing' | 'Custom Ingestion';
  period: string;
  currency: string;
  headlineRevenue: string;
  headlineEBITDA: string;
  grossMarginPct: string;
  cashRunwayMonths: number;
  cashBalance: string;
  netBurnRate: string;
  pnlRows: PnLRow[];
  balanceSheetRows: BalanceSheetRow[];
  cashFlowRows: CashFlowRow[];
  kpis: KPIMetric[];
  risks: RiskItem[];
  monthlyRevenueTrend: { month: string; actual: number; budget: number }[];
  ebitdaTrend: { month: string; actual: number; budget: number }[];
}

export interface SlideConfig {
  id: string;
  type: SlideType;
  slideNumber: number;
  title: string;
  subtitle: string;
  narrativeBullets: string[];
  tone: ToneRule;
  maxBullets: number;
  maxWordsPerBullet: number;
  reviewStatus: ReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  safeguardVerified: boolean;
  notes?: string;
}

export interface BrandTheme {
  id: string;
  name: string;
  primaryNavy: string;    // e.g. "0F1E36"
  secondarySlate: string; // e.g. "334155"
  accentBrass: string;    // e.g. "C59B27"
  favorableGreen: string; // e.g. "15803D"
  unfavorableRed: string; // e.g. "B91C1C"
  canvasBg: string;       // e.g. "F8FAFC"
  cardBg: string;         // e.g. "FFFFFF"
  fontTitle: string;      // e.g. "Plus Jakarta Sans"
  fontBody: string;       // e.g. "DM Sans"
  fontMono: string;       // e.g. "JetBrains Mono"
}
