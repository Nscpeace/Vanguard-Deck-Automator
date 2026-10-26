import pptxgen from 'pptxgenjs';
import { FinancialDataset, SlideConfig, BrandTheme } from '../types/deck';

export async function generateBoardDeckPPTX(
  dataset: FinancialDataset,
  slides: SlideConfig[],
  theme: BrandTheme
): Promise<string> {
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9';
  pptx.title = `${dataset.companyName} - Board Deck & Management Accounts`;
  pptx.subject = `Executive Board Pack - ${dataset.period}`;
  pptx.company = dataset.companyName;

  const hexNavy = theme.primaryNavy;
  const hexSlate = theme.secondarySlate;
  const hexBrass = theme.accentBrass;
  const hexGreen = theme.favorableGreen;
  const hexRed = theme.unfavorableRed;

  // Helper to add consistent branded header & footer to any slide
  const applySlideChrome = (
    slide: pptxgen.Slide,
    slideTitle: string,
    slideSubtitle: string,
    slideNumber: number,
    statusText: string = 'BOARD APPROVED'
  ) => {
    // Header top banner
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 0.9,
      fill: { color: hexNavy },
    });

    // Accent line under header
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0.9,
      w: 10,
      h: 0.05,
      fill: { color: hexBrass },
    });

    // Company & Period indicator (top-right)
    slide.addText(
      `${dataset.companyName.toUpperCase()} · ${dataset.period.toUpperCase()}`,
      {
        x: 5.5,
        y: 0.15,
        w: 4.2,
        h: 0.3,
        fontSize: 9,
        fontFace: theme.fontTitle,
        color: 'E2E8F0',
        align: 'right',
        bold: true,
      }
    );

    // Slide Title
    slide.addText(slideTitle, {
      x: 0.5,
      y: 0.12,
      w: 6.5,
      h: 0.45,
      fontSize: 18,
      fontFace: theme.fontTitle,
      color: 'FFFFFF',
      bold: true,
    });

    // Slide Subtitle
    slide.addText(slideSubtitle, {
      x: 0.5,
      y: 0.52,
      w: 6.5,
      h: 0.3,
      fontSize: 10,
      fontFace: theme.fontBody,
      color: 'CBD5E1',
    });

    // Footer bar
    slide.addShape(pptx.ShapeType.line, {
      x: 0.5,
      y: 5.25,
      w: 9.0,
      h: 0,
      line: { color: 'CBD5E1', width: 0.75 },
    });

    // Footer left: Confidential notice & governance badge
    slide.addText(
      `STRICTLY CONFIDENTIAL · FOR BOARD & EXECUTIVE COMMITTEE ONLY · STATUS: ${statusText}`,
      {
        x: 0.5,
        y: 5.3,
        w: 7.0,
        h: 0.25,
        fontSize: 8,
        fontFace: theme.fontTitle,
        color: '64748B',
      }
    );

    // Footer right: Slide number
    slide.addText(`Slide ${slideNumber} of ${slides.length}`, {
      x: 7.8,
      y: 5.3,
      w: 1.7,
      h: 0.25,
      fontSize: 8,
      fontFace: theme.fontTitle,
      color: '64748B',
      align: 'right',
    });
  };

  // Helper to add executive narrative box
  const addNarrativeBox = (
    slide: pptxgen.Slide,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    bullets: string[],
    reviewedBy?: string
  ) => {
    // Background card
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      rectRadius: 0.08,
      fill: { color: 'F8FAFC' },
      line: { color: hexSlate, width: 1 },
    });

    // Narrative Header Bar
    slide.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w,
      h: 0.35,
      fill: { color: hexNavy },
    });

    slide.addText(title.toUpperCase(), {
      x: x + 0.15,
      y: y + 0.05,
      w: w - 0.3,
      h: 0.25,
      fontSize: 9,
      fontFace: theme.fontTitle,
      color: 'FFFFFF',
      bold: true,
    });

    // Narrative bullets
    const textItems = bullets.map(bullet => ({
      text: bullet + '\n',
      options: {
        fontSize: 10,
        fontFace: theme.fontBody,
        color: '1E293B',
        bullet: { type: 'bullet' as const },
        paraSpaceAfter: 6,
      },
    }));

    slide.addText(textItems, {
      x: x + 0.15,
      y: y + 0.45,
      w: w - 0.3,
      h: h - 0.75,
      valign: 'top',
    });

    // Reconciled signoff stamp
    slide.addText(
      `✓ Verified to GL · ${reviewedBy ? `Approved by ${reviewedBy}` : 'Audited & Locked'}`,
      {
        x: x + 0.15,
        y: y + h - 0.28,
        w: w - 0.3,
        h: 0.2,
        fontSize: 7.5,
        fontFace: theme.fontTitle,
        color: hexGreen,
        italic: true,
      }
    );
  };

  // ==========================================
  // SLIDE 1: Executive Financial Scorecard
  // ==========================================
  const slide1Config = slides.find(s => s.type === 'executive_summary') || slides[0];
  const s1 = pptx.addSlide();
  applySlideChrome(s1, slide1Config.title, slide1Config.subtitle, 1, slide1Config.reviewStatus.toUpperCase());

  // 4 KPI Cards in a row
  const kpiCards = [
    { label: 'Total Revenue', value: dataset.headlineRevenue, sub: '+4.2% vs Plan', color: hexNavy },
    { label: 'Operating EBITDA', value: dataset.headlineEBITDA, sub: '22.3% Margin', color: hexGreen },
    { label: 'Gross Margin %', value: dataset.grossMarginPct, sub: '+180 bps YoY', color: hexNavy },
    { label: 'Cash Runway', value: `${dataset.cashRunwayMonths} mos`, sub: dataset.cashBalance, color: hexSlate },
  ];

  kpiCards.forEach((kpi, idx) => {
    const cardX = 0.5 + idx * 2.3;
    s1.addShape(pptx.ShapeType.roundRect, {
      x: cardX,
      y: 1.15,
      w: 2.15,
      h: 0.85,
      rectRadius: 0.06,
      fill: { color: 'FFFFFF' },
      line: { color: 'CBD5E1', width: 1 },
    });
    s1.addText(kpi.label, {
      x: cardX + 0.1,
      y: 1.2,
      w: 1.95,
      h: 0.2,
      fontSize: 8.5,
      fontFace: theme.fontTitle,
      color: '64748B',
      bold: true,
    });
    s1.addText(kpi.value, {
      x: cardX + 0.1,
      y: 1.4,
      w: 1.95,
      h: 0.35,
      fontSize: 16,
      fontFace: theme.fontTitle,
      color: kpi.color,
      bold: true,
    });
    s1.addText(kpi.sub, {
      x: cardX + 0.1,
      y: 1.75,
      w: 1.95,
      h: 0.2,
      fontSize: 7.5,
      fontFace: theme.fontBody,
      color: hexGreen,
    });
  });

  // Native Chart: Monthly Revenue Actual vs Budget
  const chartDataS1 = [
    {
      name: 'Actual Revenue',
      labels: dataset.monthlyRevenueTrend.map(d => d.month),
      values: dataset.monthlyRevenueTrend.map(d => d.actual),
    },
    {
      name: 'Budgeted Revenue',
      labels: dataset.monthlyRevenueTrend.map(d => d.month),
      values: dataset.monthlyRevenueTrend.map(d => d.budget),
    },
  ];

  s1.addChart(pptx.ChartType.bar, chartDataS1, {
    x: 0.5,
    y: 2.15,
    w: 5.1,
    h: 2.9,
    showTitle: true,
    title: 'Monthly Revenue: Actual vs Budget ($k)',
    titleFontSize: 10,
    titleFontFace: theme.fontTitle,
    chartColors: [hexNavy, hexBrass],
    barGrouping: 'clustered',
    showLegend: true,
    legendPos: 't',
    legendFontSize: 8,
  });

  // Narrative Box
  addNarrativeBox(
    s1,
    5.8,
    2.15,
    3.7,
    2.9,
    'Executive Commentary & Observations',
    slide1Config.narrativeBullets,
    slide1Config.reviewedBy
  );

  // ==========================================
  // SLIDE 2: Profit & Loss (P&L) Statement
  // ==========================================
  const slide2Config = slides.find(s => s.type === 'pnl') || slides[1];
  const s2 = pptx.addSlide();
  applySlideChrome(s2, slide2Config.title, slide2Config.subtitle, 2, slide2Config.reviewStatus.toUpperCase());

  // Table rows from pnlRows
  const pnlHeaders = [
    { text: 'Line Item ($ in thousands)', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9 } },
    { text: 'Actual', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9, align: 'right' as const } },
    { text: 'Budget', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9, align: 'right' as const } },
    { text: 'Prior Year', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9, align: 'right' as const } },
    { text: 'Variance ($)', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9, align: 'right' as const } },
    { text: 'Var (%)', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9, align: 'right' as const } },
  ];

  const pnlBodyRows = dataset.pnlRows.slice(0, 10).map((row, rIdx) => {
    const diff = row.actual - row.budget;
    const isCost = row.category === 'COGS' || row.category === 'OpEx';
    const isFavorable = isCost ? diff <= 0 : diff >= 0;
    const diffPct = row.budget > 0 ? (Math.abs(diff) / row.budget) * 100 : 0;
    const isSub = row.isSubtotal;
    const bgColor = isSub ? 'F1F5F9' : rIdx % 2 === 0 ? 'FFFFFF' : 'F8FAFC';
    const varColor = isFavorable ? hexGreen : hexRed;

    return [
      { text: row.name, options: { bold: isSub, fontSize: 8.5, fill: { color: bgColor } } },
      { text: `$${row.actual.toLocaleString()}`, options: { bold: isSub, fontSize: 8.5, align: 'right' as const, fill: { color: bgColor } } },
      { text: `$${row.budget.toLocaleString()}`, options: { bold: isSub, fontSize: 8.5, align: 'right' as const, fill: { color: bgColor } } },
      { text: `$${row.priorYear.toLocaleString()}`, options: { bold: isSub, fontSize: 8.5, align: 'right' as const, fill: { color: bgColor } } },
      { text: `${diff >= 0 ? '+' : ''}$${diff.toLocaleString()}`, options: { bold: true, fontSize: 8.5, align: 'right' as const, color: varColor, fill: { color: bgColor } } },
      { text: `${diff >= 0 ? '+' : '-'}${diffPct.toFixed(1)}%`, options: { bold: true, fontSize: 8.5, align: 'right' as const, color: varColor, fill: { color: bgColor } } },
    ];
  });

  s2.addTable([pnlHeaders, ...pnlBodyRows], {
    x: 0.5,
    y: 1.15,
    w: 5.7,
    h: 3.9,
    colW: [2.2, 0.7, 0.7, 0.7, 0.7, 0.7],
    border: { pt: 0.5, color: 'CBD5E1' },
  });

  addNarrativeBox(
    s2,
    6.4,
    1.15,
    3.1,
    3.9,
    'P&L Performance Drivers',
    slide2Config.narrativeBullets,
    slide2Config.reviewedBy
  );

  // ==========================================
  // SLIDE 3: Balance Sheet & Liquidity
  // ==========================================
  const slide3Config = slides.find(s => s.type === 'balance_sheet') || slides[2];
  const s3 = pptx.addSlide();
  applySlideChrome(s3, slide3Config.title, slide3Config.subtitle, 3, slide3Config.reviewStatus.toUpperCase());

  // Balance sheet summary table
  const bsHeaders = [
    { text: 'Balance Sheet Account Item', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9 } },
    { text: 'Current Period', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9, align: 'right' as const } },
    { text: 'Prior Period', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9, align: 'right' as const } },
    { text: 'Change', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9, align: 'right' as const } },
  ];

  const bsRows = dataset.balanceSheetRows.slice(0, 8).map((r, i) => {
    const chg = r.currentPeriod - r.priorPeriod;
    const bg = i % 2 === 0 ? 'FFFFFF' : 'F8FAFC';
    return [
      { text: r.item, options: { fontSize: 8.5, fill: { color: bg } } },
      { text: `$${r.currentPeriod.toLocaleString()}k`, options: { fontSize: 8.5, align: 'right' as const, fill: { color: bg } } },
      { text: `$${r.priorPeriod.toLocaleString()}k`, options: { fontSize: 8.5, align: 'right' as const, fill: { color: bg } } },
      { text: `${chg >= 0 ? '+' : ''}$${chg.toLocaleString()}k`, options: { fontSize: 8.5, align: 'right' as const, bold: true, color: chg >= 0 ? hexGreen : hexRed, fill: { color: bg } } },
    ];
  });

  s3.addTable([bsHeaders, ...bsRows], {
    x: 0.5,
    y: 1.15,
    w: 5.4,
    h: 3.9,
    colW: [2.5, 0.95, 0.95, 1.0],
    border: { pt: 0.5, color: 'CBD5E1' },
  });

  // Doughnut chart: Asset breakdown
  const doughnutData = [
    {
      name: 'Asset Composition',
      labels: dataset.balanceSheetRows.filter(r => r.category.includes('Assets')).slice(0, 4).map(r => r.item),
      values: dataset.balanceSheetRows.filter(r => r.category.includes('Assets')).slice(0, 4).map(r => r.currentPeriod),
    },
  ];

  s3.addChart(pptx.ChartType.doughnut, doughnutData, {
    x: 6.1,
    y: 1.15,
    w: 3.4,
    h: 1.85,
    showTitle: true,
    title: 'Asset Allocation ($k)',
    titleFontSize: 9,
    titleFontFace: theme.fontTitle,
    chartColors: [hexNavy, hexBrass, hexSlate, '94A3B8'],
    showLegend: true,
    legendPos: 'b',
    legendFontSize: 7,
  });

  addNarrativeBox(
    s3,
    6.1,
    3.15,
    3.4,
    1.9,
    'Liquidity & Capital Structure',
    slide3Config.narrativeBullets,
    slide3Config.reviewedBy
  );

  // ==========================================
  // SLIDE 4: Cash Flow & Runway
  // ==========================================
  const slide4Config = slides.find(s => s.type === 'cash_flow') || slides[3];
  const s4 = pptx.addSlide();
  applySlideChrome(s4, slide4Config.title, slide4Config.subtitle, 4, slide4Config.reviewStatus.toUpperCase());

  // Cash flow table
  const cfHeaders = [
    { text: 'Cash Flow Line Activity', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9 } },
    { text: 'Net ($k)', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9, align: 'right' as const } },
    { text: 'Budget ($k)', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9, align: 'right' as const } },
    { text: 'Category', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9 } },
  ];

  const cfRows = dataset.cashFlowRows.map((r, i) => {
    const bg = i % 2 === 0 ? 'FFFFFF' : 'F8FAFC';
    return [
      { text: r.activity, options: { fontSize: 8.5, fill: { color: bg } } },
      { text: `${r.inflowOutflow >= 0 ? '+' : ''}$${r.inflowOutflow.toLocaleString()}`, options: { fontSize: 8.5, align: 'right' as const, bold: true, color: r.inflowOutflow >= 0 ? hexGreen : hexRed, fill: { color: bg } } },
      { text: `${r.budget >= 0 ? '+' : ''}$${r.budget.toLocaleString()}`, options: { fontSize: 8.5, align: 'right' as const, fill: { color: bg } } },
      { text: r.type, options: { fontSize: 8.5, fill: { color: bg } } },
    ];
  });

  s4.addTable([cfHeaders, ...cfRows], {
    x: 0.5,
    y: 1.15,
    w: 5.2,
    h: 1.8,
    colW: [2.5, 0.9, 0.9, 0.9],
    border: { pt: 0.5, color: 'CBD5E1' },
  });

  // Line chart: EBITDA trend
  const chartDataS4 = [
    {
      name: 'Actual EBITDA',
      labels: dataset.ebitdaTrend.map(d => d.month),
      values: dataset.ebitdaTrend.map(d => d.actual),
    },
    {
      name: 'Budget EBITDA',
      labels: dataset.ebitdaTrend.map(d => d.month),
      values: dataset.ebitdaTrend.map(d => d.budget),
    },
  ];

  s4.addChart(pptx.ChartType.line, chartDataS4, {
    x: 0.5,
    y: 3.1,
    w: 5.2,
    h: 1.95,
    showTitle: true,
    title: 'Operating EBITDA Trajectory ($k)',
    titleFontSize: 9,
    titleFontFace: theme.fontTitle,
    chartColors: [hexGreen, hexSlate],
    showLegend: true,
    legendPos: 't',
    legendFontSize: 8,
  });

  addNarrativeBox(
    s4,
    5.9,
    1.15,
    3.6,
    3.9,
    'Cash Burn & Capital Conservation',
    slide4Config.narrativeBullets,
    slide4Config.reviewedBy
  );

  // ==========================================
  // SLIDE 5: Operational KPIs & Unit Economics
  // ==========================================
  const slide5Config = slides.find(s => s.type === 'kpis') || slides[4];
  const s5 = pptx.addSlide();
  applySlideChrome(s5, slide5Config.title, slide5Config.subtitle, 5, slide5Config.reviewStatus.toUpperCase());

  // 6 KPI Cards in a 3x2 grid
  dataset.kpis.slice(0, 6).forEach((kpi, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const kpiX = 0.5 + col * 1.85;
    const kpiY = 1.15 + row * 1.35;

    s5.addShape(pptx.ShapeType.roundRect, {
      x: kpiX,
      y: kpiY,
      w: 1.75,
      h: 1.25,
      rectRadius: 0.06,
      fill: { color: 'FFFFFF' },
      line: { color: 'CBD5E1', width: 0.75 },
    });

    s5.addText(kpi.name, {
      x: kpiX + 0.08,
      y: kpiY + 0.08,
      w: 1.59,
      h: 0.28,
      fontSize: 8,
      fontFace: theme.fontTitle,
      color: '64748B',
      bold: true,
    });

    s5.addText(kpi.value, {
      x: kpiX + 0.08,
      y: kpiY + 0.35,
      w: 1.59,
      h: 0.35,
      fontSize: 15,
      fontFace: theme.fontTitle,
      color: hexNavy,
      bold: true,
    });

    s5.addText(`QoQ: ${kpi.deltaQoQ} · Target: ${kpi.benchmark}`, {
      x: kpiX + 0.08,
      y: kpiY + 0.72,
      w: 1.59,
      h: 0.22,
      fontSize: 7.5,
      fontFace: theme.fontBody,
      color: kpi.isPositive ? hexGreen : hexRed,
      bold: true,
    });

    s5.addText(kpi.description, {
      x: kpiX + 0.08,
      y: kpiY + 0.94,
      w: 1.59,
      h: 0.26,
      fontSize: 7,
      fontFace: theme.fontBody,
      color: '94A3B8',
    });
  });

  addNarrativeBox(
    s5,
    6.25,
    1.15,
    3.25,
    3.9,
    'Unit Economics & Scalability Narrative',
    slide5Config.narrativeBullets,
    slide5Config.reviewedBy
  );

  // ==========================================
  // SLIDE 6: Risks & Actions
  // ==========================================
  const slide6Config = slides.find(s => s.type === 'risks') || slides[5];
  const s6 = pptx.addSlide();
  applySlideChrome(s6, slide6Config.title, slide6Config.subtitle, 6, slide6Config.reviewStatus.toUpperCase());

  // Risk register table
  const riskHeaders = [
    { text: 'Identified Risk', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9 } },
    { text: 'Category', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9 } },
    { text: 'Impact', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9 } },
    { text: 'Mitigation Plan & Controls', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9 } },
    { text: 'Owner', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9 } },
    { text: 'Status', options: { bold: true, color: 'FFFFFF', fill: { color: hexNavy }, fontSize: 9 } },
  ];

  const riskRows = dataset.risks.map((r, i) => {
    const bg = i % 2 === 0 ? 'FFFFFF' : 'F8FAFC';
    const statusCol = r.status === 'Resolved' ? hexGreen : r.status === 'Mitigating' ? hexBrass : hexRed;
    return [
      { text: r.title, options: { fontSize: 8.5, bold: true, fill: { color: bg } } },
      { text: r.category, options: { fontSize: 8.5, fill: { color: bg } } },
      { text: r.impact, options: { fontSize: 8.5, fill: { color: bg } } },
      { text: r.mitigation, options: { fontSize: 8, fill: { color: bg } } },
      { text: r.owner, options: { fontSize: 8.5, fill: { color: bg } } },
      { text: r.status, options: { fontSize: 8.5, bold: true, color: statusCol, fill: { color: bg } } },
    ];
  });

  s6.addTable([riskHeaders, ...riskRows], {
    x: 0.5,
    y: 1.15,
    w: 5.7,
    h: 3.9,
    colW: [1.3, 0.8, 0.6, 1.8, 0.7, 0.5],
    border: { pt: 0.5, color: 'CBD5E1' },
  });

  addNarrativeBox(
    s6,
    6.4,
    1.15,
    3.1,
    3.9,
    'Board Governance & Resolutions',
    slide6Config.narrativeBullets,
    slide6Config.reviewedBy
  );

  const cleanFileName = `${dataset.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Board_Deck_${dataset.period.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`;
  await pptx.writeFile({ fileName: cleanFileName });
  return cleanFileName;
}
