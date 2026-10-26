import React from 'react';
import { SlideConfig, FinancialDataset } from '../types/deck';
import { CheckCircle2, Clock, ShieldCheck, Download, AlertCircle, ArrowRight } from 'lucide-react';

interface FinanceReviewTabProps {
  slides: SlideConfig[];
  dataset: FinancialDataset;
  onUpdateSlide: (slide: SlideConfig) => void;
  onSelectSlide: (slideId: string) => void;
  onExportPPTX: () => void;
  isExporting: boolean;
}

export const FinanceReviewTab: React.FC<FinanceReviewTabProps> = ({
  slides,
  dataset,
  onUpdateSlide,
  onSelectSlide,
  onExportPPTX,
  isExporting,
}) => {
  const approvedCount = slides.filter(s => s.reviewStatus === 'approved').length;
  const isAllApproved = approvedCount === slides.length;

  const handleBulkApprove = () => {
    slides.forEach(s => {
      onUpdateSlide({
        ...s,
        reviewStatus: 'approved',
        reviewedBy: 'FP&A Lead (Sign-off)',
        reviewedAt: new Date().toLocaleDateString(),
      });
    });
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto w-full">
      {/* Top Banner / Progress */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pre-Release Quality Assurance
            </span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">
              {dataset.period}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Board Pack Finance Sign-Off & Verification
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review commentary against general ledger figures prior to board distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {approvedCount} / {slides.length}
            </span>
            <span className="text-[11px] text-slate-500 block">Slides Approved</span>
          </div>

          <button
            onClick={handleBulkApprove}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Approve All Slides
          </button>

          <button
            onClick={onExportPPTX}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0F1E36] hover:bg-[#1E293B] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Export Final PPTX</span>
          </button>
        </div>
      </div>

      {/* Slide Review Cards Grid */}
      <div className="space-y-4">
        {slides.map((slide, idx) => {
          const isApproved = slide.reviewStatus === 'approved';
          return (
            <div
              key={slide.id}
              className={`p-5 rounded-xl border transition-all bg-white ${
                isApproved
                  ? 'border-emerald-200 ring-1 ring-emerald-500/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{slide.title}</h3>
                    <p className="text-xs text-slate-500">{slide.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>GL Reconciled</span>
                  </span>

                  <button
                    onClick={() => {
                      onUpdateSlide({
                        ...slide,
                        reviewStatus: isApproved ? 'draft' : 'approved',
                        reviewedBy: isApproved ? undefined : 'FP&A Analyst',
                        reviewedAt: isApproved ? undefined : new Date().toLocaleDateString(),
                      });
                    }}
                    className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isApproved ? 'Approved' : 'Mark Approved'}</span>
                  </button>

                  <button
                    onClick={() => onSelectSlide(slide.id)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Narrative bullets summary */}
              <div className="pt-3">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Narrative Text Bullets ({slide.narrativeBullets.length}):
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                  {slide.narrativeBullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sign-off footer info */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Tone Rule: {slide.tone.replace('_', ' ')}</span>
                <span>
                  {isApproved
                    ? `Approved by ${slide.reviewedBy || 'Analyst'} on ${slide.reviewedAt || 'Today'}`
                    : 'Awaiting human sign-off'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
