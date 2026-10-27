import React, { useState } from 'react';
import { FinancialDataset } from '../types/deck';
import { saasDataset } from '../data/sampleDatasets';
import { X, Plus, Sparkles, Building2, Sliders, CheckCircle2, Cpu } from 'lucide-react';

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveModel: (newModel: FinancialDataset) => void;
}

export const AddModelModal: React.FC<AddModelModalProps> = ({
  isOpen,
  onClose,
  onSaveModel,
}) => {
  const [tab, setTab] = useState<'financial' | 'ai'>('financial');

  // Form State for Financial Model
  const [companyName, setCompanyName] = useState('Apex Technologies Inc.');
  const [modelName, setModelName] = useState('Apex Technologies (Q4 2026 Model)');
  const [industry, setIndustry] = useState<'B2B Enterprise SaaS' | 'Advanced Manufacturing' | 'Custom Ingestion'>('B2B Enterprise SaaS');
  const [period, setPeriod] = useState('Q4 2026 (Close)');
  const [currency, setCurrency] = useState('USD ($ in thousands)');
  const [revenue, setRevenue] = useState('$18,500k');
  const [ebitda, setEbitda] = useState('$4,100k');
  const [grossMargin, setGrossMargin] = useState('74.5%');
  const [runwayMonths, setRunwayMonths] = useState(22);
  const [cashBalance, setCashBalance] = useState('$31,200k');
  const [burnRate, setBurnRate] = useState('+$120k/mo (Positive)');

  // AI Model Selection display state
  const [selectedAIModel, setSelectedAIModel] = useState('gemini-3.8-flash');

  if (!isOpen) return null;

  const handleCreateFinancialModel = (e: React.FormEvent) => {
    e.preventDefault();

    const numericRev = parseFloat(revenue.replace(/[^0-9.]/g, '')) || 18500;
    const numericEbitda = parseFloat(ebitda.replace(/[^0-9.]/g, '')) || 4100;

    const newDataset: FinancialDataset = {
      ...saasDataset,
      id: 'custom_model_' + Date.now(),
      name: modelName,
      companyName: companyName,
      industry: industry,
      period: period,
      currency: currency,
      headlineRevenue: revenue,
      headlineEBITDA: ebitda,
      grossMarginPct: grossMargin,
      cashRunwayMonths: Number(runwayMonths),
      cashBalance: cashBalance,
      netBurnRate: burnRate,
      pnlRows: [
        { id: 'c_rev_core', name: 'Core Product Revenue', actual: Math.round(numericRev * 0.85), budget: Math.round(numericRev * 0.8), priorYear: Math.round(numericRev * 0.7), category: 'Revenue' },
        { id: 'c_rev_serv', name: 'Services & Implementation', actual: Math.round(numericRev * 0.15), budget: Math.round(numericRev * 0.12), priorYear: Math.round(numericRev * 0.1), category: 'Revenue' },
        { id: 'c_rev_total', name: 'Total Revenue', actual: numericRev, budget: Math.round(numericRev * 0.92), priorYear: Math.round(numericRev * 0.8), category: 'Revenue', isSubtotal: true },
        { id: 'c_cogs', name: 'Direct Cost of Revenue', actual: Math.round(numericRev * 0.25), budget: Math.round(numericRev * 0.26), priorYear: Math.round(numericRev * 0.28), category: 'COGS', isSubtotal: true },
        { id: 'c_gm', name: `Gross Profit (${grossMargin})`, actual: Math.round(numericRev * 0.75), budget: Math.round(numericRev * 0.66), priorYear: Math.round(numericRev * 0.52), category: 'Revenue', isSubtotal: true },
        { id: 'c_opex_rd', name: 'R&D / Product Engineering', actual: Math.round(numericRev * 0.28), budget: Math.round(numericRev * 0.3), priorYear: Math.round(numericRev * 0.25), category: 'OpEx' },
        { id: 'c_opex_sm', name: 'Sales & Go-to-Market', actual: Math.round(numericRev * 0.22), budget: Math.round(numericRev * 0.24), priorYear: Math.round(numericRev * 0.2), category: 'OpEx' },
        { id: 'c_opex_ga', name: 'General & Administrative', actual: Math.round(numericRev * 0.08), budget: Math.round(numericRev * 0.09), priorYear: Math.round(numericRev * 0.08), category: 'OpEx' },
        { id: 'c_ebitda', name: 'Adjusted Operating EBITDA', actual: numericEbitda, budget: Math.round(numericEbitda * 0.85), priorYear: Math.round(numericEbitda * 0.65), category: 'EBITDA', isSubtotal: true },
      ],
      monthlyRevenueTrend: [
        { month: 'Jul', actual: Math.round(numericRev * 0.3), budget: Math.round(numericRev * 0.29) },
        { month: 'Aug', actual: Math.round(numericRev * 0.33), budget: Math.round(numericRev * 0.31) },
        { month: 'Sep', actual: Math.round(numericRev * 0.37), budget: Math.round(numericRev * 0.33) },
      ],
      ebitdaTrend: [
        { month: 'Jul', actual: Math.round(numericEbitda * 0.29), budget: Math.round(numericEbitda * 0.26) },
        { month: 'Aug', actual: Math.round(numericEbitda * 0.33), budget: Math.round(numericEbitda * 0.28) },
        { month: 'Sep', actual: Math.round(numericEbitda * 0.38), budget: Math.round(numericEbitda * 0.31) },
      ],
    };

    onSaveModel(newDataset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F1E36] text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C59B27]" />
              <span>Add & Configure Models</span>
            </h3>
            <p className="text-xs text-slate-300">
              Configure financial reporting datasets or AI commentary generation models
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 text-xs font-semibold">
          <button
            onClick={() => setTab('financial')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              tab === 'financial'
                ? 'border-[#0F1E36] text-[#0F1E36]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Financial Reporting Model</span>
          </button>
          <button
            onClick={() => setTab('ai')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              tab === 'ai'
                ? 'border-[#0F1E36] text-[#0F1E36]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Commentary Model</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {tab === 'financial' ? (
            <form onSubmit={handleCreateFinancialModel} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company / Entity Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                    placeholder="e.g. Apex Health Corp."
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Model Label</label>
                  <input
                    type="text"
                    required
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                    placeholder="e.g. Apex Q4 2026 Model"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Industry Template</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                  >
                    <option value="B2B Enterprise SaaS">B2B Enterprise SaaS</option>
                    <option value="Advanced Manufacturing">Manufacturing & Hardware</option>
                    <option value="Custom Ingestion">Custom / Retail / Services</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Reporting Period</label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Reporting Currency</label>
                  <input
                    type="text"
                    required
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
                  Headline Board Metrics
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Total Revenue</label>
                    <input
                      type="text"
                      required
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Operating EBITDA</label>
                    <input
                      type="text"
                      required
                      value={ebitda}
                      onChange={(e) => setEbitda(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Gross Margin %</label>
                    <input
                      type="text"
                      required
                      value={grossMargin}
                      onChange={(e) => setGrossMargin(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 font-mono tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Cash Runway (Months)</label>
                    <input
                      type="number"
                      required
                      value={runwayMonths}
                      onChange={(e) => setRunwayMonths(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Cash Balance</label>
                    <input
                      type="text"
                      required
                      value={cashBalance}
                      onChange={(e) => setCashBalance(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Net Monthly Burn</label>
                    <input
                      type="text"
                      required
                      value={burnRate}
                      onChange={(e) => setBurnRate(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 font-mono tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F1E36] hover:bg-[#1E293B] text-white rounded-lg font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C59B27]" />
                  <span>Create & Activate Model</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">AI Commentary Engine Configuration</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  The application routes executive narrative drafting requests through <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">/api/generate-commentary</code> in <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">server.ts</code>.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'gemini-3.8-flash',
                    name: 'Gemini 3.8 Flash (Active Default)',
                    desc: 'High-speed, low-latency financial reasoning model. Optimized for strict rule following, token constraints, and structured JSON variance extraction.',
                    active: true,
                  },
                  {
                    id: 'gemini-4-argon',
                    name: 'Gemini 4 Argon (Advanced Deep FP&A)',
                    desc: 'Deep reasoning model for multi-entity consolidations, complex debt covenant calculations, and audit reconciliations.',
                    active: false,
                  },
                  {
                    id: 'claude-or-custom',
                    name: 'Claude / Custom LLM Microservice',
                    desc: 'Supported via custom backend proxy or microservice. Easily configurable in server.ts with Anthropic SDK or REST endpoint.',
                    active: false,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAIModel(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedAIModel === item.id
                        ? 'border-[#0F1E36] bg-slate-50 ring-1 ring-[#0F1E36]/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{item.name}</span>
                      {selectedAIModel === item.id && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                <strong>Configuring in Code:</strong> To switch or customize the AI model in the codebase, edit line 109 in <code className="font-mono bg-white px-1 py-0.2 rounded border border-amber-300">server.ts</code> where <code className="font-mono">model: 'gemini-3.8-flash'</code> is specified.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
