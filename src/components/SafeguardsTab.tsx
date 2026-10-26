import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, UserCheck, Cpu, FileCheck2, Database } from 'lucide-react';

export const SafeguardsTab: React.FC = () => {
  return (
    <div className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
          Governance & Compliance Architecture
        </span>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Financial Accuracy & Security Safeguards
        </h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          How this automated system guarantees that board decks remain 100% faithful to the accounting general ledger while leveraging AI for high-velocity narrative synthesis.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Pillar 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              1. Numbers Inserted Directly From Data (Never AI Generated)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every financial figure in the presentation (P&L line items, EBITDA percentages, cash burn rates, and balance sheet balances) originates from validated accounting inputs. AI has zero permission to synthesize, estimate, or modify numeric figures in charts or tables.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero Hallucination Guarantee on Financial Ledgers</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
              <Database className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              2. Fixed Brand Template Geometry & Typography Locking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Layout, margins, headers, logo placements, color palettes, and fonts are programmatically locked to the firm's master PowerPoint template. Formatting drift, accidental font alterations, and misaligned margins are physically impossible.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-blue-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Programmatic Brand Discipline (16:9 Standard)</span>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              3. Constrained AI Narrative Slots with Tone Rules
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI commentary is constrained to designated narrative boxes with strict token caps (max 26 words/bullet, exactly 3 bullets per slide) and tone guardrails (Board Conservative, Investor Growth, or Lender Audit). It explains variance drivers without speculation.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-amber-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strict Length & Fiduciary Tone Boundaries</span>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center mb-4">
              <UserCheck className="w-5 h-5 text-purple-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              4. Mandatory Human Review & Sign-Off Gate
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Before a deck is marked ready for distribution, a finance team member conducts an interactive review. Any bullet can be edited inline or regenerated. The audit trail logs the reviewer's identity and timestamp.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-purple-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Audited Human-in-the-Loop Release Gate</span>
          </div>
        </div>
      </div>

      {/* 4-Step Technical Workflow Diagram */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
          The 4-Step Production Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono text-xs font-bold text-[#C59B27] block mb-1">STEP 01</span>
            <strong className="text-slate-900 block mb-1">Data Ingestion</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Financial data received from ERP (NetSuite, QuickBooks) or structured Excel/CSV input.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono text-xs font-bold text-[#C59B27] block mb-1">STEP 02</span>
            <strong className="text-slate-900 block mb-1">Template Placement</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Slide builder mounts figures, variances, and native charts into fixed template coordinates.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono text-xs font-bold text-[#C59B27] block mb-1">STEP 03</span>
            <strong className="text-slate-900 block mb-1">AI Commentary Draft</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Language model generates executive commentary within strict word, bullet, and tone limits.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono text-xs font-bold text-[#C59B27] block mb-1">STEP 04</span>
            <strong className="text-slate-900 block mb-1">Review & PPTX Export</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Finance team reviews commentary, signs off, and exports native Office `.pptx` presentations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
