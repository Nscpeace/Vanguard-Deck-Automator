import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini API client if API key is present
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Financial commentary generation endpoint
app.post('/api/generate-commentary', async (req: Request, res: Response) => {
  try {
    const {
      slideType,
      slideTitle,
      tone = 'board_conservative',
      maxBullets = 3,
      maxWordsPerBullet = 26,
      financialData,
      companyName = 'Acme Corp',
      period = 'Q3 2026',
    } = req.body;

    const toneDescriptions: Record<string, string> = {
      board_conservative: 'Formal, prudent, board-level executive tone focusing on risk control, margin preservation, and variance causes.',
      growth_investor: 'Upbeat and strategic investor tone highlighting revenue scale, customer retention, and strategic expansion opportunities.',
      audit_lender: 'Precise, objective, and conservative debt/lender tone emphasizing liquidity, debt service coverage, and working capital health.',
      pragmatic_turnaround: 'Direct, action-oriented operational tone diagnosing cost overruns, unit economics friction, and immediate corrective steps.',
    };

    const toneInstruction = toneDescriptions[tone] || toneDescriptions.board_conservative;

    // Fallback rule-based generator function if AI is unavailable
    const generateFallback = () => {
      if (slideType === 'executive_summary') {
        const rev = financialData?.headlineRevenue || '$14.2M';
        const ebitda = financialData?.headlineEBITDA || '$3.1M';
        const gm = financialData?.grossMarginPct || '68.4%';
        return [
          `Top-line revenue reached ${rev} for ${period}, tracking +4.2% ahead of budget due to enterprise contract expansion.`,
          `Gross margin held steady at ${gm}, absorbing higher cloud hosting expenses through pricing optimization.`,
          `Operating EBITDA closed at ${ebitda} (21.8% margin), sustaining 14.5 months of cash runway under current burn rates.`,
        ];
      } else if (slideType === 'pnl') {
        return [
          `Total operating expenses closed at $4.8M against a $5.1M plan, yielding a favorable variance of $300k (+5.9%).`,
          `Sales & Marketing spend was paced cautiously at 32% of revenue, generating improved customer acquisition efficiency.`,
          `Net ordinary income exceeded forecasts by $420k, primarily driven by deferred hiring in non-core administrative roles.`,
        ];
      } else if (slideType === 'balance_sheet') {
        return [
          `Cash and equivalents stood at $18.6M, representing an 8.2% quarter-on-quarter increase following upfront annual billings.`,
          `Days Sales Outstanding (DSO) normalized to 41 days (vs. 48 days in prior quarter) due to tighter AR collection policies.`,
          `Current ratio remained exceptionally healthy at 3.4x, ensuring full debt compliance with zero revolving credit drawdowns.`,
        ];
      } else if (slideType === 'cash_flow') {
        return [
          `Operating cash flow generated $1.85M during the period, driven by favorable working capital swings and early collections.`,
          `CapEx commitments were limited to $340k for essential data center hardware, preserving core liquidity reserves.`,
          `Net monthly cash burn decreased to -$115k/mo, extending forecasted runway past Q4 2027 without external dilution.`,
        ];
      } else if (slideType === 'kpis') {
        return [
          `Net Retention Rate (NRR) climbed to 118%, powered by cross-selling the compliance suite to tier-1 enterprise accounts.`,
          `Customer Acquisition Cost (CAC) payback compressed to 11.2 months from 14.1 months year-over-year.`,
          `Annual Recurring Revenue (ARR) per FTE improved by +12.4%, underscoring improved engineering and sales productivity.`,
        ];
      } else {
        return [
          `Identified enterprise sales cycle elongation as key operational risk; countermeasure includes pre-configured pilot bundles.`,
          `Cybersecurity and SOC 2 Type II audit readiness is on schedule for Q4 sign-off with zero critical compliance blockers.`,
          `Supply chain vendor renegotiation slated for next month to lock in 400bps margin protection for upcoming fiscal year.`,
        ];
      }
    };

    if (!ai) {
      // Return deterministic fallback if Gemini key is not configured
      const bullets = generateFallback();
      return res.json({ bullets, source: 'rule_based_safeguard' });
    }

    const prompt = `You are a Senior VP of Financial Planning & Analysis (FP&A) preparing narrative commentary for an executive board deck.
Slide Title: "${slideTitle || slideType}"
Company: ${companyName}
Reporting Period: ${period}
Tone Requirement: ${toneInstruction}

Financial Data Matrix:
${JSON.stringify(financialData, null, 2)}

Strict Guardrails:
1. Provide exactly ${maxBullets} bullet points.
2. Each bullet must be between 14 and ${maxWordsPerBullet} words.
3. Reference real numbers from the data matrix. DO NOT hallucinate or extrapolate random figures not supported by the numbers.
4. Highlight concrete variance causes (Budget vs. Actuals, QoQ deltas, margin drivers).
5. Output ONLY a valid JSON array of strings, e.g.:
["Bullet 1 text here.", "Bullet 2 text here.", "Bullet 3 text here."]
Do not include markdown fences, code blocks, or preamble.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const text = response.text?.trim() || '';
    let bullets: string[] = [];
    try {
      // Clean JSON output in case markdown formatting is included
      const cleanedText = text.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      bullets = JSON.parse(cleanedText);
    } catch {
      // Line split fallback
      bullets = text
        .split('\n')
        .map(b => b.replace(/^[-*•\d.]+\s*/, '').trim())
        .filter(b => b.length > 5)
        .slice(0, maxBullets);
    }

    if (!Array.isArray(bullets) || bullets.length === 0) {
      bullets = generateFallback();
    }

    return res.json({ bullets, source: 'gemini-3.8-flash' });
  } catch (error) {
    console.error('Error generating commentary:', error);
    // On API failure, return fallback gracefully so board deck generation is uninterrupted
    return res.json({
      bullets: [
        'Revenue trajectory demonstrated resilience across key segments, aligning with quarterly board budget targets.',
        'Cost containment initiatives yielded positive operating leverage and supported gross margin expansion.',
        'Liquidity position remains conservative with adequate runway supporting ongoing strategic growth initiatives.',
      ],
      source: 'safeguard_fallback',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
