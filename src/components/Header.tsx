import React from 'react';
import { Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'review' | 'before_after' | 'safeguards';
  setActiveTab: (tab: 'studio' | 'review' | 'before_after' | 'safeguards') => void;
  onExportPPTX: () => void;
  isExporting: boolean;
  approvedCount: number;
  totalSlides: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExportPPTX,
  isExporting,
  approvedCount,
  totalSlides,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Zone 1: Brand wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#0F1E36] flex items-center justify-center text-[#C59B27] font-bold text-base shadow-xs">
          V
        </div>
        <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
          Vanguard Deck Automator
        </span>
      </div>

      {/* Zone 2: 4 clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('studio')}
          className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
            activeTab === 'studio'
              ? 'text-slate-900 border-[#0F1E36] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Deck Studio & Canvas
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'review'
              ? 'text-slate-900 border-[#0F1E36] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Finance Review</span>
          <span className="text-xs px-1.5 py-0.2 bg-slate-100 rounded text-slate-700 font-mono tabular-nums">
            {approvedCount}/{totalSlides}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('before_after')}
          className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
            activeTab === 'before_after'
              ? 'text-slate-900 border-[#0F1E36] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Before & After Analysis
        </button>
        <button
          onClick={() => setActiveTab('safeguards')}
          className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
            activeTab === 'safeguards'
              ? 'text-slate-900 border-[#0F1E36] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Safeguards & Methodology
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onExportPPTX}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0F1E36] hover:bg-[#1E293B] active:bg-[#0A101D] transition-colors rounded-lg shadow-xs whitespace-nowrap shrink-0 disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Generating Deck...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Export Branded PPTX</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
