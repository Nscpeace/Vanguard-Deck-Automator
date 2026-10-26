import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Sparkles, Download, Layers, ShieldCheck } from 'lucide-react';

interface OneClickDemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerRealExport: () => void;
}

export const OneClickDemoTour: React.FC<OneClickDemoTourProps> = ({
  isOpen,
  onClose,
  onTriggerRealExport,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [isOpen, isPlaying, currentStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F1E36] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C59B27]" />
            <h3 className="font-bold text-sm text-white">
              One-Click Board Deck Generation Simulation
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close simulation"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                onClick={() => {
                  setCurrentStep(step);
                  setIsPlaying(false);
                }}
                className={`flex items-center gap-1.5 font-semibold transition-colors ${
                  currentStep === step
                    ? 'text-[#0F1E36]'
                    : currentStep > step
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${
                    currentStep === step
                      ? 'bg-[#0F1E36] text-white'
                      : currentStep > step
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep > step ? '✓' : step}
                </span>
                <span>
                  {step === 1 && 'Data Ingestion'}
                  {step === 2 && 'Template Placement'}
                  {step === 3 && 'AI Commentary'}
                  {step === 4 && 'Deck Finalized'}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
              className="p-1 rounded text-slate-500 hover:text-slate-800 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setCurrentStep(1);
                setIsPlaying(true);
              }}
              aria-label="Reset simulation"
              className="p-1 rounded text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Simulation Body */}
        <div className="p-8 min-h-[300px] flex flex-col justify-center items-center text-center">
          {currentStep === 1 && (
            <div className="max-w-md space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mx-auto shadow-xs">
                <Layers className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1 of 4</span>
                <h4 className="text-lg font-bold text-slate-900 mt-0.5">Ingesting Financial Ledger Rows</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Parsing monthly closed trial balance, P&L hierarchy, and balance sheet accounts for <strong>Nexus Cloud Corp (Q3 2026)</strong>.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-left text-xs text-slate-700 space-y-1">
                <div className="flex justify-between"><span>Total Revenue:</span> <strong className="text-slate-900">$14,240,000 (Act) vs $13,550,000 (Bud)</strong></div>
                <div className="flex justify-between"><span>Variance Delta:</span> <strong className="text-emerald-700">+$690,000 (+5.1% favorable)</strong></div>
                <div className="flex justify-between"><span>EBITDA Margin:</span> <strong className="text-slate-900">22.3% ($3,180k)</strong></div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-md space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 2 of 4</span>
                <h4 className="text-lg font-bold text-slate-900 mt-0.5">Mapping Into Master Brand Template</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Placing exact coordinates into 16:9 widescreen layout. Rendering native PowerPoint chart objects and locked formatting.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Brand Palette</span>
                  <strong className="text-slate-800">Executive Navy #0F1E36</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Office Charts</span>
                  <strong className="text-emerald-700">Native Vector XML</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Drift Protection</span>
                  <strong className="text-slate-800">100% Geometry Lock</strong>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-md space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 3 of 4</span>
                <h4 className="text-lg font-bold text-slate-900 mt-0.5">Constrained AI Commentary Synthesis</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Drafting 3 fiduciary bullet points strictly from variance math. Max 26 words per bullet. Zero hallucinated numbers.
                </p>
              </div>
              <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-200 text-left text-xs text-purple-900 space-y-2">
                <div className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Top-line revenue reached $14.2M for Q3 2026, tracking +4.2% ahead of budget due to enterprise expansion.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Gross margin held steady at 71.2%, absorbing higher cloud hosting through pricing leverage.</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="max-w-md space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 4 of 4 · Complete</span>
                <h4 className="text-lg font-bold text-slate-900 mt-0.5">Presentation Deck Verified & Assembled</h4>
                <p className="text-xs text-slate-500 mt-1">
                  All 6 slides passed audit rules. Ready for final board distribution or immediate PPTX download.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onTriggerRealExport();
                  }}
                  className="px-5 py-2.5 bg-[#0F1E36] hover:bg-[#1E293B] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#C59B27]" />
                  <span>Download Generated PPTX</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Demonstration of Automated Board Deck Generator workflow</span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Close Tour
          </button>
        </div>
      </div>
    </div>
  );
};
