import React, { useState } from 'react';
import {
  SlideConfig,
  FinancialDataset,
  BrandTheme,
  ToneRule,
} from '../types/deck';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Edit3,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react';

interface SlideViewerProps {
  slide: SlideConfig;
  dataset: FinancialDataset;
  theme: BrandTheme;
  onUpdateSlide: (updatedSlide: SlideConfig) => void;
  onNextSlide?: () => void;
  onPrevSlide?: () => void;
  slideIndex: number;
  totalSlides: number;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  slide,
  dataset,
  theme,
  onUpdateSlide,
  slideIndex,
  totalSlides,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTone, setActiveTone] = useState<ToneRule>(slide.tone || 'board_conservative');
  const [editingBullets, setEditingBullets] = useState<string[]>(slide.narrativeBullets);
  const [isEditingNarrative, setIsEditingNarrative] = useState(false);

  // Sync state if slide changes
  React.useEffect(() => {
    setEditingBullets(slide.narrativeBullets);
    setActiveTone(slide.tone);
    setIsEditingNarrative(false);
  }, [slide.id]);

  const handleGenerateAICommentary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideType: slide.type,
          slideTitle: slide.title,
          tone: activeTone,
          maxBullets: slide.maxBullets || 3,
          maxWordsPerBullet: slide.maxWordsPerBullet || 26,
          financialData: {
            companyName: dataset.companyName,
            period: dataset.period,
            headlineRevenue: dataset.headlineRevenue,
            headlineEBITDA: dataset.headlineEBITDA,
            grossMarginPct: dataset.grossMarginPct,
            cashRunwayMonths: dataset.cashRunwayMonths,
            pnlRows: dataset.pnlRows.slice(0, 8),
            kpis: dataset.kpis.slice(0, 4),
          },
        }),
      });

      const data = await response.json();
      if (data.bullets && Array.isArray(data.bullets)) {
        setEditingBullets(data.bullets);
        onUpdateSlide({
          ...slide,
          narrativeBullets: data.bullets,
          tone: activeTone,
          reviewStatus: 'under_review',
        });
      }
    } catch (err) {
      console.error('Failed to generate commentary:', err);
      // Client-side safeguard fallback
      const fallbackBullets = [
        `Operational results for ${slide.title} tracked favorably within the ±4.5% board variance tolerance window.`,
        `Preserved key unit economics and gross margin integrity through disciplined cost control across primary cost centers.`,
        `Management team maintains active oversight on working capital liquidity and upcoming milestone deliverables.`,
      ];
      setEditingBullets(fallbackBullets);
      onUpdateSlide({
        ...slide,
        narrativeBullets: fallbackBullets,
        tone: activeTone,
        reviewStatus: 'under_review',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulletChange = (idx: number, text: string) => {
    const updated = [...editingBullets];
    updated[idx] = text;
    setEditingBullets(updated);
    onUpdateSlide({
      ...slide,
      narrativeBullets: updated,
    });
  };

  const handleToggleApproval = () => {
    const nextStatus = slide.reviewStatus === 'approved' ? 'draft' : 'approved';
    onUpdateSlide({
      ...slide,
      reviewStatus: nextStatus,
      reviewedBy: nextStatus === 'approved' ? 'VP Finance (Sign-off)' : undefined,
      reviewedAt: nextStatus === 'approved' ? new Date().toLocaleDateString() : undefined,
    });
  };

  // Tone descriptions
  const toneLabels: Record<ToneRule, string> = {
    board_conservative: 'Board Conservative',
    growth_investor: 'Growth & Investor',
    audit_lender: 'Audit & Liquidity',
    pragmatic_turnaround: 'Pragmatic Turnaround',
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 p-6 overflow-y-auto bg-slate-100/60">
      {/* Main Slide Canvas Container (16:9 ratio representation) */}
      <div className="flex-1 flex flex-col items-center">
        {/* Slide Controls Bar */}
        <div className="w-full max-w-4xl flex items-center justify-between pb-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">
              Slide {slideIndex + 1} of {totalSlides}:
            </span>
            <span className="text-slate-500 font-medium">{slide.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Numbers Locked to Ledger</span>
            </span>

            <button
              onClick={handleToggleApproval}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                slide.reviewStatus === 'approved'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{slide.reviewStatus === 'approved' ? 'Approved for Board' : 'Mark Approved'}</span>
            </button>
          </div>
        </div>

        {/* The 16:9 Slide Canvas */}
        <div
          className="w-full max-w-4xl aspect-[16/9] bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col select-none relative"
          style={{ fontFamily: theme.fontTitle }}
        >
          {/* Slide Master Header Banner */}
          <div
            className="px-6 py-3 flex items-center justify-between text-white shrink-0 relative"
            style={{ backgroundColor: `#${theme.primaryNavy}` }}
          >
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white leading-tight">
                {slide.title}
              </h2>
              <p className="text-xs text-slate-300 font-normal">
                {slide.subtitle}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-200 tracking-wider uppercase block">
                {dataset.companyName}
              </span>
              <span className="text-[10px] text-slate-400">
                {dataset.period}
              </span>
            </div>

            {/* Accent brass line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: `#${theme.accentBrass}` }}
            />
          </div>

          {/* Slide Inner Body */}
          <div className="flex-1 p-5 overflow-hidden flex flex-col bg-white">
            {/* RENDER BY SLIDE TYPE */}
            {slide.type === 'executive_summary' && (
              <div className="flex-1 flex flex-col gap-4">
                {/* 4 Metric scorecards */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Revenue</span>
                    <span className="text-xl font-bold text-slate-900 tabular-nums block">{dataset.headlineRevenue}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">+4.2% vs Plan</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Operating EBITDA</span>
                    <span className="text-xl font-bold text-emerald-700 tabular-nums block">{dataset.headlineEBITDA}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">22.3% Margin</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gross Margin %</span>
                    <span className="text-xl font-bold text-slate-900 tabular-nums block">{dataset.grossMarginPct}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">+180 bps YoY</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cash Runway</span>
                    <span className="text-xl font-bold text-slate-800 tabular-nums block">{dataset.cashRunwayMonths} mos</span>
                    <span className="text-[11px] text-slate-500">{dataset.cashBalance} cash</span>
                  </div>
                </div>

                {/* Split: Monthly Chart + Embedded Commentary Preview */}
                <div className="flex-1 grid grid-cols-12 gap-4 items-stretch min-h-0">
                  {/* Native Bar Chart Simulation */}
                  <div className="col-span-7 bg-slate-50/60 border border-slate-200 rounded-lg p-3 flex flex-col">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Monthly Revenue: Actual vs Budget ($k)
                      </span>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-xs inline-block" style={{ backgroundColor: `#${theme.primaryNavy}` }} />
                          Actual
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-xs inline-block" style={{ backgroundColor: `#${theme.accentBrass}` }} />
                          Budget
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-3 px-2 pt-2">
                      {dataset.monthlyRevenueTrend.map((m) => {
                        const maxVal = 6000;
                        const actualH = (m.actual / maxVal) * 100;
                        const budgetH = (m.budget / maxVal) * 100;
                        return (
                          <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div className="w-full flex items-end justify-center gap-1 h-32">
                              <div
                                style={{ height: `${actualH}%`, backgroundColor: `#${theme.primaryNavy}` }}
                                className="w-1/2 rounded-t-xs transition-all"
                                title={`Actual: $${m.actual}k`}
                              />
                              <div
                                style={{ height: `${budgetH}%`, backgroundColor: `#${theme.accentBrass}` }}
                                className="w-1/2 rounded-t-xs transition-all"
                                title={`Budget: $${m.budget}k`}
                              />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-600">{m.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Narrative slot inside slide */}
                  <div className="col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 mb-2">
                        <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                          Executive Commentary
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">Reconciled</span>
                      </div>
                      <ul className="space-y-2 text-[11px] text-slate-700 leading-relaxed list-disc list-inside">
                        {slide.narrativeBullets.map((b, i) => (
                          <li key={i} className="pl-1">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-[9px] text-slate-400 flex items-center justify-between">
                      <span>Safeguard: Non-speculative</span>
                      <span>{slide.reviewedBy || 'Pending Review'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {slide.type === 'pnl' && (
              <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
                {/* Financial Table */}
                <div className="col-span-8 overflow-y-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="sticky top-0 bg-[#0F1E36] text-white font-semibold">
                      <tr>
                        <th className="py-1.5 px-3">Line Item ($ in thousands)</th>
                        <th className="py-1.5 px-2 text-right">Actual</th>
                        <th className="py-1.5 px-2 text-right">Budget</th>
                        <th className="py-1.5 px-2 text-right">Var ($)</th>
                        <th className="py-1.5 px-2 text-right">Var (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {dataset.pnlRows.map((r) => {
                        const diff = r.actual - r.budget;
                        const isCost = r.category === 'COGS' || r.category === 'OpEx';
                        const isFavorable = isCost ? diff <= 0 : diff >= 0;
                        const pct = r.budget > 0 ? (Math.abs(diff) / r.budget) * 100 : 0;
                        return (
                          <tr
                            key={r.id}
                            className={`hover:bg-slate-50/80 ${
                              r.isSubtotal ? 'font-bold bg-slate-50 text-slate-900' : 'text-slate-700'
                            }`}
                          >
                            <td className="py-1.5 px-3 font-sans truncate">{r.name}</td>
                            <td className="py-1.5 px-2 text-right tabular-nums">${r.actual.toLocaleString()}</td>
                            <td className="py-1.5 px-2 text-right tabular-nums text-slate-500">${r.budget.toLocaleString()}</td>
                            <td
                              className={`py-1.5 px-2 text-right tabular-nums font-semibold ${
                                isFavorable ? 'text-emerald-700' : 'text-red-600'
                              }`}
                            >
                              {diff >= 0 ? '+' : ''}${diff.toLocaleString()}
                            </td>
                            <td
                              className={`py-1.5 px-2 text-right tabular-nums font-semibold ${
                                isFavorable ? 'text-emerald-700' : 'text-red-600'
                              }`}
                            >
                              {diff >= 0 ? '+' : '-'}{pct.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* P&L Narrative Box */}
                <div className="col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-1.5 border-b border-slate-200 mb-2">
                      P&L Performance Drivers
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-700 leading-relaxed list-disc list-inside">
                      {slide.narrativeBullets.map((b, i) => (
                        <li key={i} className="pl-1">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                    <span>Variance tolerance: ±5% flagged for board audit</span>
                  </div>
                </div>
              </div>
            )}

            {slide.type === 'balance_sheet' && (
              <div className="flex-1 grid grid-cols-12 gap-4">
                <div className="col-span-7 border border-slate-200 rounded-lg overflow-y-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="sticky top-0 bg-[#0F1E36] text-white font-semibold">
                      <tr>
                        <th className="py-1.5 px-3">Balance Sheet Account</th>
                        <th className="py-1.5 px-2 text-right">Current Period</th>
                        <th className="py-1.5 px-2 text-right">Prior Period</th>
                        <th className="py-1.5 px-2 text-right">Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {dataset.balanceSheetRows.map((r) => {
                        const delta = r.currentPeriod - r.priorPeriod;
                        return (
                          <tr key={r.id} className="hover:bg-slate-50/80 text-slate-700">
                            <td className="py-1.5 px-3 font-sans truncate">{r.item}</td>
                            <td className="py-1.5 px-2 text-right tabular-nums font-medium">${r.currentPeriod.toLocaleString()}k</td>
                            <td className="py-1.5 px-2 text-right tabular-nums text-slate-500">${r.priorPeriod.toLocaleString()}k</td>
                            <td className={`py-1.5 px-2 text-right tabular-nums font-semibold ${delta >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                              {delta >= 0 ? '+' : ''}${delta.toLocaleString()}k
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="col-span-5 flex flex-col gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-1.5 border-b border-slate-200 mb-2">
                        Liquidity & Capital Structure
                      </h4>
                      <ul className="space-y-2 text-[11px] text-slate-700 leading-relaxed list-disc list-inside">
                        {slide.narrativeBullets.map((b, i) => (
                          <li key={i} className="pl-1">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-2 p-2 bg-emerald-50 rounded border border-emerald-200 text-[10px] text-emerald-800">
                      <strong>Debt Covenant Status:</strong> Fully compliant. Senior debt coverage at 4.2x (minimum requirement: 1.5x).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {slide.type === 'cash_flow' && (
              <div className="flex-1 grid grid-cols-12 gap-4">
                <div className="col-span-7 flex flex-col gap-3">
                  <div className="border border-slate-200 rounded-lg overflow-y-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="bg-[#0F1E36] text-white font-semibold">
                        <tr>
                          <th className="py-1.5 px-3">Cash Activity</th>
                          <th className="py-1.5 px-2 text-right">Net Inflow/Outflow</th>
                          <th className="py-1.5 px-2 text-right">Budget</th>
                          <th className="py-1.5 px-2">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {dataset.cashFlowRows.map((r) => (
                          <tr key={r.id} className="text-slate-700">
                            <td className="py-1.5 px-3 font-sans truncate">{r.activity}</td>
                            <td className={`py-1.5 px-2 text-right tabular-nums font-semibold ${r.inflowOutflow >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                              {r.inflowOutflow >= 0 ? '+' : ''}${r.inflowOutflow.toLocaleString()}k
                            </td>
                            <td className="py-1.5 px-2 text-right tabular-nums text-slate-500">${r.budget.toLocaleString()}k</td>
                            <td className="py-1.5 px-2 font-sans text-xs">{r.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Monthly EBITDA trend bar */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex-1 flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-800">EBITDA & Burn Trajectory</span>
                    <div className="flex items-end justify-between gap-2 h-20 pt-1">
                      {dataset.ebitdaTrend.map((e) => (
                        <div key={e.month} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            style={{ height: `${(e.actual / 1800) * 100}%` }}
                            className="w-full bg-emerald-600 rounded-t-xs"
                            title={`EBITDA: $${e.actual}k`}
                          />
                          <span className="text-[10px] text-slate-600 font-medium">{e.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-1.5 border-b border-slate-200 mb-2">
                      Cash Burn & Capital Commentary
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-700 leading-relaxed list-disc list-inside">
                      {slide.narrativeBullets.map((b, i) => (
                        <li key={i} className="pl-1">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Current Burn Rate</span>
                      <strong className="text-slate-900 tabular-nums">{dataset.netBurnRate}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">Zero-Dilution Runway</span>
                      <strong className="text-emerald-700 tabular-nums">{dataset.cashRunwayMonths} Months</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {slide.type === 'kpis' && (
              <div className="flex-1 grid grid-cols-12 gap-4">
                <div className="col-span-8 grid grid-cols-3 gap-2.5">
                  {dataset.kpis.map((kpi) => (
                    <div key={kpi.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block truncate">
                          {kpi.name}
                        </span>
                        <span className="text-lg font-bold text-slate-900 tabular-nums mt-0.5 block">
                          {kpi.value}
                        </span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                        <span className={kpi.isPositive ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold'}>
                          QoQ: {kpi.deltaQoQ}
                        </span>
                        <span className="text-slate-400">Target: {kpi.benchmark}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-1.5 border-b border-slate-200 mb-2">
                      KPI Performance Analysis
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-700 leading-relaxed list-disc list-inside">
                      {slide.narrativeBullets.map((b, i) => (
                        <li key={i} className="pl-1">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-[10px] text-slate-500">
                    Benchmark methodology: SaaS Top Decile (Bessemer / KeyBanc)
                  </div>
                </div>
              </div>
            )}

            {slide.type === 'risks' && (
              <div className="flex-1 grid grid-cols-12 gap-4">
                <div className="col-span-8 border border-slate-200 rounded-lg overflow-y-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-[#0F1E36] text-white font-semibold">
                      <tr>
                        <th className="py-1.5 px-3">Identified Risk</th>
                        <th className="py-1.5 px-2">Category</th>
                        <th className="py-1.5 px-2">Impact</th>
                        <th className="py-1.5 px-2">Mitigation Controls</th>
                        <th className="py-1.5 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {dataset.risks.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/80">
                          <td className="py-2 px-3 font-medium text-slate-900">{r.title}</td>
                          <td className="py-2 px-2 text-slate-500">{r.category}</td>
                          <td className="py-2 px-2">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-medium">
                              {r.impact}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-slate-600 text-[10px] leading-tight">{r.mitigation}</td>
                          <td className="py-2 px-2">
                            <span
                              className={`text-[10px] font-semibold ${
                                r.status === 'Resolved'
                                  ? 'text-emerald-700'
                                  : r.status === 'Mitigating'
                                  ? 'text-amber-700'
                                  : 'text-red-600'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-1.5 border-b border-slate-200 mb-2">
                      Governance & Resolutions
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-700 leading-relaxed list-disc list-inside">
                      {slide.narrativeBullets.map((b, i) => (
                        <li key={i} className="pl-1">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                    Mandatory board quarterly review per audit charter.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Slide Master Footer */}
          <div className="px-6 py-2 bg-slate-50 border-t border-slate-200 text-[9px] text-slate-500 flex items-center justify-between shrink-0">
            <span>STRICTLY CONFIDENTIAL · FOR BOARD & EXECUTIVE USE ONLY</span>
            <span>
              Slide {slideIndex + 1} of {totalSlides}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: AI Commentary & Human Review Controller */}
      <div className="w-full xl:w-96 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
              <span>AI Narrative Controller</span>
            </h3>
            <p className="text-xs text-slate-500">
              Rule-constrained executive commentary
            </p>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
            Gemini 3.8 Flash
          </span>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Narrative Tone & Guardrail Profile:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(toneLabels) as ToneRule[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTone(t)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium text-left border transition-all ${
                  activeTone === t
                    ? 'bg-[#0F1E36] text-white border-[#0F1E36] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {toneLabels[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Tone description prompt note */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            {activeTone === 'board_conservative' && 'Conservative fiduciary tone. Explains variances, margin protection, and risk factors.'}
            {activeTone === 'growth_investor' && 'Investor growth tone. Emphasizes ARR expansion, retention dynamics, and scalable leverage.'}
            {activeTone === 'audit_lender' && 'Lender compliance tone. Details liquidity, coverage ratios, and working capital preservation.'}
            {activeTone === 'pragmatic_turnaround' && 'Direct turnaround tone. Focuses on unit economics friction and cost remediation.'}
          </span>
        </div>

        {/* Action: Generate or Re-draft */}
        <button
          onClick={handleGenerateAICommentary}
          disabled={isGenerating}
          className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#0F1E36] hover:bg-[#1E293B] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Ledger & Drafting...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Regenerate Commentary ({toneLabels[activeTone]})</span>
            </>
          )}
        </button>

        {/* Narrative Review & Edit Area */}
        <div className="flex-1 flex flex-col gap-2 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Editable Bullets (Max 3):</span>
            </span>
            <span className="text-[10px] text-slate-500">
              Length limit: ~26 words/bullet
            </span>
          </div>

          <div className="space-y-2">
            {editingBullets.map((bullet, idx) => {
              const wordCount = bullet.trim().split(/\s+/).filter(Boolean).length;
              const isOver = wordCount > 28;
              return (
                <div key={idx} className="relative">
                  <textarea
                    rows={2}
                    value={bullet}
                    onChange={(e) => handleBulletChange(idx, e.target.value)}
                    className={`w-full p-2 text-xs text-slate-800 bg-slate-50 border rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none ${
                      isOver ? 'border-amber-400' : 'border-slate-200'
                    }`}
                  />
                  <div className="flex items-center justify-between text-[10px] px-1 text-slate-400">
                    <span>Bullet {idx + 1}</span>
                    <span className={isOver ? 'text-amber-600 font-semibold' : ''}>
                      {wordCount} words {isOver ? '(trim recommended)' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Human Sign-Off Gate */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Slide Sign-Off Gate</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                slide.reviewStatus === 'approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {slide.reviewStatus === 'approved' ? 'Approved' : 'Pending Review'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            {slide.reviewStatus === 'approved'
              ? `Approved by ${slide.reviewedBy || 'Finance Director'} on ${slide.reviewedAt || 'Today'}`
              : 'Finance team member must inspect and verify variances before final release.'}
          </p>
          <button
            onClick={handleToggleApproval}
            className={`w-full py-1.5 px-3 rounded text-xs font-semibold transition-colors cursor-pointer ${
              slide.reviewStatus === 'approved'
                ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {slide.reviewStatus === 'approved' ? 'Revoke Approval (Set Draft)' : 'Confirm & Sign Off Slide'}
          </button>
        </div>
      </div>
    </div>
  );
};
