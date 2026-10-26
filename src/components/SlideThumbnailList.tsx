import React from 'react';
import { SlideConfig, BrandTheme } from '../types/deck';
import { CheckCircle2, Clock, FileEdit, ShieldCheck } from 'lucide-react';

interface SlideThumbnailListProps {
  slides: SlideConfig[];
  activeSlideId: string;
  onSelectSlide: (slideId: string) => void;
  theme: BrandTheme;
}

export const SlideThumbnailList: React.FC<SlideThumbnailListProps> = ({
  slides,
  activeSlideId,
  onSelectSlide,
  theme,
}) => {
  return (
    <aside className="w-72 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-3 overflow-y-auto shrink-0">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Slide Library ({slides.length})
        </span>
        <span className="text-[11px] text-slate-500 font-mono">16:9 Master</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {slides.map((slide, index) => {
          const isActive = slide.id === activeSlideId;
          const isApproved = slide.reviewStatus === 'approved';
          const isUnderReview = slide.reviewStatus === 'under_review';

          return (
            <div
              key={slide.id}
              onClick={() => onSelectSlide(slide.id)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer text-left relative ${
                isActive
                  ? 'bg-white border-[#0F1E36] shadow-sm ring-1 ring-[#0F1E36]/10'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {/* Thumbnail mini preview wireframe */}
              <div className="w-full aspect-video bg-slate-100 rounded border border-slate-200 overflow-hidden mb-2 relative flex flex-col">
                {/* Mini Header */}
                <div
                  className="h-2 w-full shrink-0"
                  style={{ backgroundColor: `#${theme.primaryNavy}` }}
                />
                <div
                  className="h-0.5 w-full shrink-0"
                  style={{ backgroundColor: `#${theme.accentBrass}` }}
                />
                {/* Mini Wireframe Content */}
                <div className="p-1.5 flex-1 flex gap-1 items-center justify-center">
                  <div className="flex-1 h-full bg-slate-200/70 rounded-xs flex flex-col justify-around p-0.5">
                    <div className="h-1 bg-slate-300 rounded-xs w-3/4" />
                    <div className="h-2 bg-slate-300/80 rounded-xs w-full" />
                    <div className="h-1 bg-slate-300/60 rounded-xs w-1/2" />
                  </div>
                  <div className="w-1/3 h-full bg-slate-200/50 rounded-xs p-0.5 flex flex-col gap-0.5">
                    <div className="h-1 bg-slate-300/80 rounded-xs w-full" />
                    <div className="h-1 bg-slate-300/40 rounded-xs w-4/5" />
                  </div>
                </div>

                {/* Slide Number Badge */}
                <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-slate-900/70 text-white text-[9px] rounded font-mono">
                  #{index + 1}
                </span>
              </div>

              {/* Title & Status */}
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-800 truncate leading-snug">
                    {slide.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {slide.subtitle}
                  </p>
                </div>
              </div>

              {/* Status pill & safeguard badge */}
              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Ledger-Locked</span>
                </span>

                <span
                  className={`inline-flex items-center gap-0.5 font-medium ${
                    isApproved
                      ? 'text-emerald-700'
                      : isUnderReview
                      ? 'text-amber-700'
                      : 'text-slate-600'
                  }`}
                >
                  {isApproved ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Approved</span>
                    </>
                  ) : isUnderReview ? (
                    <>
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Reviewing</span>
                    </>
                  ) : (
                    <>
                      <FileEdit className="w-3 h-3 text-slate-400" />
                      <span>Draft</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
