import React, { useState } from 'react';
import { ArrowLeftRight, Check, X, Sparkles, Clock, AlertTriangle, FileSpreadsheet, Layers } from 'lucide-react';

export const BeforeAfterShowcase: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'split' | 'before' | 'after'>('split');
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <div className="flex-1 p-8 overflow-y-auto max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
          Portfolio Transformation Showcase
        </span>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Manual PowerPoint Deck Rebuild vs. Brand Deck Automation
        </h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          See how replacing monthly copy-pasting with locked data templates and constrained AI narrative saves 15+ hours per close and eliminates board-room errors.
        </p>

        {/* View Switcher */}
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 mt-4 text-xs">
          <button
            onClick={() => setActiveMode('split')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeMode === 'split' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            Interactive Split Slider
          </button>
          <button
            onClick={() => setActiveMode('before')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeMode === 'before' ? 'bg-white text-red-700 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            Before (Manual Drift)
          </button>
          <button
            onClick={() => setActiveMode('after')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeMode === 'after' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            After (Automated Master)
          </button>
        </div>
      </div>

      {/* Main Comparison Canvas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        {activeMode === 'split' ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden select-none bg-slate-100">
            {/* "After" Layer (Full width underneath) */}
            <div className="absolute inset-0 bg-white flex flex-col p-6">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#C59B27] bg-[#0F1E36] -mx-6 -mt-6 p-4 text-white">
                <div>
                  <h3 className="font-bold text-base text-white">Q3 Financial Performance & Scorecard</h3>
                  <span className="text-xs text-slate-300">Nexus Cloud Corp · Brand Master Template v4.2</span>
                </div>
                <span className="text-xs bg-emerald-600/30 text-emerald-300 border border-emerald-400 px-2 py-0.5 rounded font-mono">
                  AUTOMATED · GL LOCKED
                </span>
              </div>

              <div className="flex-1 grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-8 flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Revenue ARR</span>
                      <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">$52.4M</div>
                      <span className="text-[11px] text-emerald-700 font-semibold">+26.2% YoY</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Gross Margin</span>
                      <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">71.2%</div>
                      <span className="text-[11px] text-emerald-700 font-semibold">+180 bps</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Adjusted EBITDA</span>
                      <div className="text-xl font-bold text-emerald-700 font-mono tabular-nums">$3.18M</div>
                      <span className="text-[11px] text-emerald-700 font-semibold">22.3% Margin</span>
                    </div>
                  </div>

                  {/* Clean sharp vector bar representation */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex-1 mt-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>Monthly Net Revenue ($k) · Native Office Chart Object</span>
                      <span className="text-[10px] text-slate-500">Fully Editable in PowerPoint</span>
                    </div>
                    <div className="flex items-end justify-between gap-4 h-28 pt-2">
                      {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((mo, i) => (
                        <div key={mo} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            style={{ height: `${60 + i * 7}%` }}
                            className="w-full bg-[#0F1E36] rounded-t-xs"
                          />
                          <span className="text-[10px] font-semibold text-slate-600 font-mono">{mo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1.5 mb-2">
                      Executive Narrative
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside leading-relaxed">
                      <li>Top-line revenue reached $14.2M for Q3 2026, tracking +4.2% ahead of budget plan.</li>
                      <li>Gross margin expanded 180bps to 71.2%, absorbing cloud infrastructure scale.</li>
                      <li>Sustained 18.4 months of zero-dilution runway with operating cash flow of $3.1M.</li>
                    </ul>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium pt-2 border-t border-slate-200">
                    ✓ Verified by FP&A Lead · Audit Trail Sealed
                  </div>
                </div>
              </div>
            </div>

            {/* "Before" Layer (Clipped by slider position) */}
            <div
              className="absolute inset-0 bg-[#FFFDF9] flex flex-col p-6 overflow-hidden border-r-2 border-slate-900 shadow-xl"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="flex items-center justify-between pb-3 bg-blue-900 -mx-6 -mt-6 p-4 text-white">
                <div>
                  <h3 className="font-bold text-base font-serif text-white">Q3 FINANCIAL UPDATE - DRAFT_final_v3.pptx</h3>
                  <span className="text-xs text-yellow-200">Misaligned Fonts (Times New Roman / Calibri mixed)</span>
                </div>
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-mono">
                  MANUAL COPY-PASTE
                </span>
              </div>

              <div className="flex-1 grid grid-cols-12 gap-4 mt-4 opacity-90">
                <div className="col-span-8 flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-yellow-50 border border-yellow-300 rounded">
                      <span className="text-[10px] text-gray-600">Revenue (est)</span>
                      <div className="text-lg font-bold text-gray-800">$51.8M?</div>
                      <span className="text-[10px] text-red-600">Stale formula cell</span>
                    </div>
                    <div className="p-2 bg-gray-100 border border-gray-300 rounded">
                      <span className="text-[10px] text-gray-600">Margin</span>
                      <div className="text-lg font-bold text-gray-800">70.8%</div>
                      <span className="text-[10px] text-gray-500">Unrounded decimal</span>
                    </div>
                    <div className="p-2 bg-red-50 border border-red-300 rounded">
                      <span className="text-[10px] text-gray-600">EBITDA</span>
                      <div className="text-lg font-bold text-red-700">#REF! ERROR</div>
                      <span className="text-[10px] text-red-500">Broken VLOOKUP link</span>
                    </div>
                  </div>

                  {/* Pixelated low-res chart simulation */}
                  <div className="p-2 bg-white border border-dashed border-red-400 rounded flex-1 mt-2 flex flex-col justify-center items-center text-center">
                    <div className="w-48 h-20 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-500 blur-[0.6px]">
                      [Pixelated JPEG pasted from Excel - Cannot edit in PPT]
                    </div>
                    <span className="text-[10px] text-red-600 mt-1">
                      ⚠️ Static image. Board members cannot click to view underlying series data.
                    </span>
                  </div>
                </div>

                <div className="col-span-4 bg-yellow-50/50 border border-dashed border-yellow-400 rounded p-3">
                  <h4 className="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200">
                    Analyst Notes (Inconsistent Tone)
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                    Things were generally good this month. Sales went up a bit because of some big deals. We hope next quarter is even better if pipeline holds...
                  </p>
                  <span className="text-[10px] text-red-600 block mt-2">
                    ⚠️ Generic prose with no defined word bounds or variance specifics.
                  </span>
                </div>
              </div>
            </div>

            {/* Draggable Slider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-slate-900 cursor-ew-resize z-20 flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg text-xs font-bold border-2 border-white">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Slider Range Control for accessibility */}
            <input
              type="range"
              min="10"
              max="90"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Drag before and after split slider"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 opacity-40 hover:opacity-100 transition-opacity z-30"
            />
          </div>
        ) : activeMode === 'before' ? (
          <div className="p-8 bg-amber-50/30">
            <div className="max-w-xl mx-auto bg-white border-2 border-dashed border-red-300 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>The Manual Monthly Rebuild Nightmare</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Formatting Drift:</strong> Analysts alter font sizes (Arial, Calibri), stretch logos, and misalign slide master margins.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Static Picture Charts:</strong> Charts are screenshot from Excel and pasted as fuzzy raster images that board members cannot adjust.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Copy-Paste Errors:</strong> 1 in 4 manual decks contains an inverted delta sign (+ vs -) or outdated prior-month balance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Analyst Burnout:</strong> Takes 15 to 20 analyst hours each month just formatting PowerPoint boxes.</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-emerald-50/30">
            <div className="max-w-xl mx-auto bg-white border border-emerald-300 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>The Automated Board Deck Standard</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Locked Brand Structure:</strong> Master slide layout, corporate color palette, and type hierarchy cannot be accidentally broken.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Native Office Charts:</strong> Generates real PowerPoint charts and tables with underlying Excel XML so data remains editable.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Ledger-Locked Numbers:</strong> Figures come straight from verified data models. AI is never allowed to hallucinate financial figures.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1-Click in 4 Seconds:</strong> Deck builds instantly, giving the finance team time to review strategic implications.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Time to Generate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-700 font-mono">4 Seconds</span>
            <span className="text-slate-400 line-through text-xs">16 Hours</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">99.8% reduction in deck assembly overhead.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Chart Format</span>
          <div className="text-xl font-bold text-slate-900">Native Office XML</div>
          <p className="text-[11px] text-slate-500 mt-1">Editable Office charts, never static blurry JPGs.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Data Accuracy</span>
          <div className="text-xl font-bold text-emerald-700">100% Reconciled</div>
          <p className="text-[11px] text-slate-500 mt-1">Formula-locked directly to GL ledger tables.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Governance Step</span>
          <div className="text-xl font-bold text-slate-900">Mandatory Gate</div>
          <p className="text-[11px] text-slate-500 mt-1">Human-in-the-loop review before final release.</p>
        </div>
      </div>
    </div>
  );
};
