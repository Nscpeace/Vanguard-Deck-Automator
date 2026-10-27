import React, { useRef } from 'react';
import { FinancialDataset, BrandTheme } from '../types/deck';
import { brandThemes } from '../data/sampleDatasets';
import { UploadCloud, Sparkles, Building2, Palette, Plus } from 'lucide-react';

interface DatasetToolbarProps {
  currentDataset: FinancialDataset;
  availableModels: FinancialDataset[];
  onSelectDataset: (dataset: FinancialDataset) => void;
  selectedTheme: BrandTheme;
  onSelectTheme: (theme: BrandTheme) => void;
  onRunDemoFlow: () => void;
  onOpenAddModelModal: () => void;
}

export const DatasetToolbar: React.FC<DatasetToolbarProps> = ({
  currentDataset,
  availableModels,
  onSelectDataset,
  selectedTheme,
  onSelectTheme,
  onRunDemoFlow,
  onOpenAddModelModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Parse CSV or JSON
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          onSelectDataset({
            ...currentDataset,
            ...parsed,
            id: 'custom_upload_' + Date.now(),
            name: `${parsed.companyName || 'Custom Ingestion'} (${parsed.period || 'Custom Period'})`,
          });
        } else {
          // Basic CSV row parsing for P&L lines
          const lines = text.split('\n').filter((l) => l.trim().length > 0);
          const parsedRows = lines.slice(1).map((line, idx) => {
            const cols = line.split(',');
            return {
              id: `custom_row_${idx}`,
              name: cols[0] || `Line Item ${idx + 1}`,
              actual: parseFloat(cols[1]) || 1000,
              budget: parseFloat(cols[2]) || 950,
              priorYear: parseFloat(cols[3]) || 900,
              category: 'Revenue' as const,
            };
          });

          onSelectDataset({
            ...currentDataset,
            id: 'custom_csv_' + Date.now(),
            name: `${file.name.replace('.csv', '')} (Uploaded CSV)`,
            companyName: file.name.replace('.csv', '').toUpperCase(),
            pnlRows: parsedRows.length > 3 ? parsedRows : currentDataset.pnlRows,
          });
        }
      } catch (err) {
        alert('Could not parse file. Using standard enterprise dataset.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
      {/* Left zone: Dataset picker */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          Reporting Model:
        </span>

        {/* Model Dropdown & Add Button */}
        <div className="flex items-center gap-2">
          <select
            value={currentDataset.id}
            onChange={(e) => {
              const found = availableModels.find((m) => m.id === e.target.value);
              if (found) onSelectDataset(found);
            }}
            aria-label="Select financial model"
            className="bg-white border border-slate-200 rounded-md px-3 py-1 font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenAddModelModal}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md font-semibold transition-colors cursor-pointer"
            title="Create a new financial or configure AI model"
          >
            <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Add Model</span>
          </button>
        </div>

        {/* Custom Upload trigger */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md transition-colors hover:border-slate-300 cursor-pointer"
          title="Upload custom CSV or JSON dataset"
        >
          <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
          <span>Upload CSV/JSON</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".csv,.json"
          className="hidden"
        />

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* Brand Theme Selector */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            Brand Theme:
          </span>
          <select
            value={selectedTheme.id}
            onChange={(e) => {
              const theme = brandThemes.find((t) => t.id === e.target.value);
              if (theme) onSelectTheme(theme);
            }}
            aria-label="Select brand theme"
            className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
          >
            {brandThemes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right zone: 1-Click Interactive Walkthrough */}
      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-[11px] hidden lg:inline">
          Company: <strong className="text-slate-700 font-medium">{currentDataset.companyName}</strong> · Period:{' '}
          <strong className="text-slate-700 font-medium">{currentDataset.period}</strong>
        </span>

        <button
          onClick={onRunDemoFlow}
          className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md font-medium hover:bg-amber-100 transition-colors shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>1-Click Demo Tour</span>
        </button>
      </div>
    </div>
  );
};
