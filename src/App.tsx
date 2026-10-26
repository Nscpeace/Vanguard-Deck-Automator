import React, { useState } from 'react';
import { Header } from './components/Header';
import { DatasetToolbar } from './components/DatasetToolbar';
import { SlideThumbnailList } from './components/SlideThumbnailList';
import { SlideViewer } from './components/SlideViewer';
import { FinanceReviewTab } from './components/FinanceReviewTab';
import { BeforeAfterShowcase } from './components/BeforeAfterShowcase';
import { SafeguardsTab } from './components/SafeguardsTab';
import { OneClickDemoTour } from './components/OneClickDemoTour';
import { saasDataset, initialSlides, brandThemes } from './data/sampleDatasets';
import { FinancialDataset, SlideConfig, BrandTheme } from './types/deck';
import { generateBoardDeckPPTX } from './services/pptxGenerator';
import { CheckCircle2, FileDown, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'review' | 'before_after' | 'safeguards'>('studio');
  const [currentDataset, setCurrentDataset] = useState<FinancialDataset>(saasDataset);
  const [slides, setSlides] = useState<SlideConfig[]>(initialSlides);
  const [activeSlideId, setActiveSlideId] = useState<string>('slide_1');
  const [selectedTheme, setSelectedTheme] = useState<BrandTheme>(brandThemes[0]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showDemoTour, setShowDemoTour] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const activeSlideIndex = slides.findIndex((s) => s.id === activeSlideId);
  const activeSlide = slides[activeSlideIndex] || slides[0];

  const approvedCount = slides.filter((s) => s.reviewStatus === 'approved').length;

  const handleUpdateSlide = (updatedSlide: SlideConfig) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === updatedSlide.id ? updatedSlide : s))
    );
  };

  const handleSelectDataset = (newDataset: FinancialDataset) => {
    setCurrentDataset(newDataset);
    // Update slide titles and headline numbers to match dataset
    setSlides((prev) =>
      prev.map((slide) => {
        if (slide.type === 'executive_summary') {
          return {
            ...slide,
            subtitle: `${newDataset.companyName} · ${newDataset.period}`,
            narrativeBullets: [
              `Top-line revenue closed at ${newDataset.headlineRevenue} for ${newDataset.period}, tracking against management target plan.`,
              `Gross margin achieved ${newDataset.grossMarginPct}, demonstrating operational cost leverage across key cost centers.`,
              `Operating EBITDA reached ${newDataset.headlineEBITDA}, extending balance sheet liquidity to ${newDataset.cashRunwayMonths} months.`,
            ],
          };
        }
        return slide;
      })
    );
  };

  const handleExportPPTX = async () => {
    try {
      setIsExporting(true);
      const filename = await generateBoardDeckPPTX(currentDataset, slides, selectedTheme);
      setExportNotice(filename);
    } catch (err) {
      console.error('Failed to generate PPTX deck:', err);
      alert('Error generating PowerPoint file. Please ensure browser download permissions are enabled.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col font-sans text-slate-900">
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportPPTX={handleExportPPTX}
        isExporting={isExporting}
        approvedCount={approvedCount}
        totalSlides={slides.length}
      />

      {/* Dataset Selection & Brand Theme Toolbar */}
      <DatasetToolbar
        currentDataset={currentDataset}
        onSelectDataset={handleSelectDataset}
        selectedTheme={selectedTheme}
        onSelectTheme={setSelectedTheme}
        onRunDemoFlow={() => setShowDemoTour(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'studio' && (
          <div className="flex-1 flex overflow-hidden">
            <SlideThumbnailList
              slides={slides}
              activeSlideId={activeSlideId}
              onSelectSlide={(id) => setActiveSlideId(id)}
              theme={selectedTheme}
            />
            <SlideViewer
              slide={activeSlide}
              dataset={currentDataset}
              theme={selectedTheme}
              onUpdateSlide={handleUpdateSlide}
              slideIndex={activeSlideIndex >= 0 ? activeSlideIndex : 0}
              totalSlides={slides.length}
            />
          </div>
        )}

        {activeTab === 'review' && (
          <FinanceReviewTab
            slides={slides}
            dataset={currentDataset}
            onUpdateSlide={handleUpdateSlide}
            onSelectSlide={(id) => {
              setActiveSlideId(id);
              setActiveTab('studio');
            }}
            onExportPPTX={handleExportPPTX}
            isExporting={isExporting}
          />
        )}

        {activeTab === 'before_after' && <BeforeAfterShowcase />}

        {activeTab === 'safeguards' && <SafeguardsTab />}
      </main>

      {/* 1-Click Interactive Demo Tour */}
      <OneClickDemoTour
        isOpen={showDemoTour}
        onClose={() => setShowDemoTour(false)}
        onTriggerRealExport={handleExportPPTX}
      />

      {/* Export Success Notification Toast */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F1E36] text-white p-4 rounded-xl shadow-xl border border-slate-700 max-w-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <FileDown className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>PowerPoint Deck Exported!</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Downloaded <strong className="text-white font-mono">{exportNotice}</strong> with native editable Office charts and locked brand formatting.
            </p>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            aria-label="Dismiss export notice"
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
