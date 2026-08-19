#!/usr/bin/env node
/**
 * CyberShield NGO - Report Charts Generator
 * Generates PNG charts for the assessment report using chartjs-node-canvas
 * Following dataviz methodology: form → color → validate → marks → interaction → accessibility
 */

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const path = require('path');

// Chart dimensions
const WIDTH = 1000;
const HEIGHT = 600;
const CHART_DIR = path.join(__dirname, '..', 'public', 'charts');

// Ensure chart directory exists
if (!fs.existsSync(CHART_DIR)) {
  fs.mkdirSync(CHART_DIR, { recursive: true });
}

// ============================================
// COLOR PALETTE (validated per dataviz methodology)
// ============================================
// Categorical palette - validated for both light and dark modes
const CATEGORICAL_LIGHT = [
  '#2a78d6', // blue - slot 1
  '#eb6834', // orange - slot 2
  '#1baf7a', // aqua - slot 3
  '#eda100', // yellow - slot 4
  '#e87ba4', // magenta - slot 5
  '#008300', // green - slot 6
  '#4a3aa7', // violet - slot 7
  '#e34948', // red - slot 8
];

const CATEGORICAL_DARK = [
  '#3987e5', // blue
  '#d95926', // orange
  '#199e70', // aqua
  '#c98500', // yellow
  '#d55181', // magenta
  '#008300', // green
  '#9085e9', // violet
  '#e66767', // red
];

// Sequential blue ramp (for KPIs)
const SEQUENTIAL_BLUE = {
  light: ['#cde2fb', '#b7d3f6', '#9ec5f4', '#86b6ef', '#6da7ec', '#5598e7', '#3987e5', '#2a78d6', '#256abf', '#1c5cab', '#184f95', '#104281', '#0d366b'],
  dark: ['#0d366b', '#104281', '#184f95', '#1c5cab', '#256abf', '#2a78d6', '#3987e5', '#5598e7', '#6da7ec', '#86b6ef', '#9ec5f4', '#b7d3f6', '#cde2fb']
};

// Status palette (fixed - never themed)
const STATUS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
};

// Risk level colors
const RISK_COLORS = {
  critical: '#d03b3b',
  high: '#ec835a',
  medium: '#fab219',
  low: '#0ca30c',
};

// Priority colors
const PRIORITY_COLORS = {
  immediate: '#d03b3b',
  short_term: '#ec835a',
  medium_term: '#fab219',
  long_term: '#0ca30c',
};

// Surfaces
const SURFACE_LIGHT = '#fcfcfb';
const SURFACE_DARK = '#1a1a19';
const TEXT_PRIMARY_LIGHT = '#0b0b0b';
const TEXT_PRIMARY_DARK = '#ffffff';
const TEXT_SECONDARY_LIGHT = '#52514e';
const TEXT_SECONDARY_DARK = '#c3c2b7';
const GRID_LIGHT = '#e1e0d9';
const GRID_DARK = '#2c2c2a';
const AXIS_LIGHT = '#c3c2b7';
const AXIS_DARK = '#383835';

// ============================================
// CHART DATA
// ============================================

// Category scores from assessment
const categoryScores = [
  { category: 'Identity & Access Management', score: 29, risk: 'medium' },
  { category: 'Endpoint Security', score: 25, risk: 'medium' },
  { category: 'Network Security', score: 30, risk: 'medium' },
  { category: 'Data Protection', score: 17, risk: 'medium' },
  { category: 'Backup & Disaster Recovery', score: 8, risk: 'medium' },
  { category: 'Email Security', score: 17, risk: 'medium' },
  { category: 'Employee Security Awareness', score: 0, risk: 'medium' },
  { category: 'Incident Response', score: 0, risk: 'medium' },
  { category: 'Security Policies', score: 20, risk: 'medium' },
  { category: 'Vulnerability Management', score: 13, risk: 'medium' },
];

// Risk distribution
const riskDistribution = [
  { level: 'Critical', count: 0 },
  { level: 'High', count: 0 },
  { level: 'Medium', count: 10 },
  { level: 'Low', count: 0 },
];

// Recommendations by priority
const recommendationsByPriority = [
  { priority: 'Immediate', count: 6, color: PRIORITY_COLORS.immediate },
  { priority: 'Short-term', count: 10, color: PRIORITY_COLORS.short_term },
  { priority: 'Medium-term', count: 7, color: PRIORITY_COLORS.medium_term },
  { priority: 'Long-term', count: 0, color: PRIORITY_COLORS.long_term },
];

// KPIs
const kpis = [
  { name: 'Patch Compliance', current: 60, target: 95, unit: '%' },
  { name: 'Backup Success Rate', current: 50, target: 100, unit: '%' },
  { name: 'Employee Training Completion', current: 0, target: 100, unit: '%' },
  { name: 'Phishing Click Rate', current: 15, target: 3, unit: '%' },
  { name: 'Critical Vulnerabilities', current: 0, target: 0, unit: 'count' },
  { name: 'Open Security Gaps', current: 55, target: 0, unit: 'count' },
  { name: 'Completed Recommendations', current: 0, target: 100, unit: '%' },
  { name: 'MFA Coverage', current: 50, target: 100, unit: '%' },
];

// Overall score
const overallScore = 16;
const riskLevel = 'critical';
const maturityLevel = 1;

// ============================================
// CHART CREATOR CLASS
// ============================================

class ChartGenerator {
  constructor(mode = 'light') {
    this.mode = mode;
    this.surface = mode === 'light' ? SURFACE_LIGHT : SURFACE_DARK;
    this.textPrimary = mode === 'light' ? TEXT_PRIMARY_LIGHT : TEXT_PRIMARY_DARK;
    this.textSecondary = mode === 'light' ? TEXT_SECONDARY_LIGHT : TEXT_SECONDARY_DARK;
    this.grid = mode === 'light' ? GRID_LIGHT : GRID_DARK;
    this.axis = mode === 'light' ? AXIS_LIGHT : AXIS_DARK;
    this.categorical = mode === 'light' ? CATEGORICAL_LIGHT : CATEGORICAL_DARK;
    this.sequential = mode === 'light' ? SEQUENTIAL_BLUE.light : SEQUENTIAL_BLUE.dark;

    this.chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: WIDTH,
      height: HEIGHT,
      backgroundColour: this.surface,
      chartCallback: (ChartJS) => {
        // Register any custom plugins here
      },
    });
  }

  getBaseOptions() {
    return {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: this.textPrimary,
            font: { family: 'system-ui, -apple-system, "Segoe UI", sans-serif', size: 12 },
            padding: 16,
            usePointStyle: true,
            pointStyle: 'rectRounded',
          },
        },
        title: {
          display: true,
          color: this.textPrimary,
          font: { family: 'system-ui, -apple-system, "Segoe UI", sans-serif', size: 18, weight: '600' },
          padding: { bottom: 16 },
        },
        subtitle: {
          display: true,
          color: this.textSecondary,
          font: { family: 'system-ui, -apple-system, "Segoe UI", sans-serif', size: 13 },
          padding: { bottom: 20 },
        },
        tooltip: {
          backgroundColor: this.mode === 'light' ? 'rgba(11,11,11,0.9)' : 'rgba(255,255,255,0.9)',
          titleColor: this.mode === 'light' ? '#ffffff' : '#0b0b0b',
          bodyColor: this.mode === 'light' ? '#ffffff' : '#0b0b0b',
          borderColor: this.axis,
          borderWidth: 1,
          padding: 12,
          cornerRadius: 6,
          displayColors: true,
        },
      },
      scales: {
        x: {
          grid: { color: this.grid, lineWidth: 1 },
          ticks: { color: this.textSecondary, font: { family: 'system-ui, -apple-system, "Segoe UI", sans-serif', size: 11 }, maxRotation: 45, minRotation: 0 },
          title: { display: true, color: this.textSecondary, font: { family: 'system-ui, -apple-system, "Segoe UI", sans-serif', size: 12 } },
        },
        y: {
          grid: { color: this.grid, lineWidth: 1 },
          ticks: { color: this.textSecondary, font: { family: 'system-ui, -apple-system, "Segoe UI", sans-serif', size: 11 } },
          title: { display: true, color: this.textSecondary, font: { family: 'system-ui, -apple-system, "Segoe UI", sans-serif', size: 12 } },
          beginAtZero: true,
        },
      },
      layout: {
        padding: { top: 10, right: 20, bottom: 10, left: 10 },
      },
      elements: {
        bar: { borderRadius: 4, borderSkipped: false },
        line: { tension: 0.3, borderWidth: 2, pointRadius: 5, pointHoverRadius: 7 },
      },
    };
  }

  async generateBarChart(config, filename) {
    const configuration = {
      type: 'bar',
      data: config.data,
      options: {
        ...this.getBaseOptions(),
        ...config.options,
        plugins: {
          ...this.getBaseOptions().plugins,
          ...config.options?.plugins,
        },
        scales: {
          ...this.getBaseOptions().scales,
          ...config.options?.scales,
        },
      },
    };

    const buffer = await this.chartJSNodeCanvas.renderToBuffer(configuration);
    fs.writeFileSync(path.join(CHART_DIR, filename), buffer);
    console.log(`✓ Generated ${filename} (${this.mode})`);
  }

  async generateHorizontalBarChart(config, filename) {
    const configuration = {
      type: 'bar',
      data: config.data,
      options: {
        ...this.getBaseOptions(),
        indexAxis: 'y',
        ...config.options,
        plugins: {
          ...this.getBaseOptions().plugins,
          ...config.options?.plugins,
        },
        scales: {
          x: { ...this.getBaseOptions().scales.x, ...config.options?.scales?.x },
          y: { ...this.getBaseOptions().scales.y, ...config.options?.scales?.y },
        },
      },
    };

    const buffer = await this.chartJSNodeCanvas.renderToBuffer(configuration);
    fs.writeFileSync(path.join(CHART_DIR, filename), buffer);
    console.log(`✓ Generated ${filename} (${this.mode})`);
  }

  async generateDoughnutChart(config, filename) {
    const configuration = {
      type: 'doughnut',
      data: config.data,
      options: {
        ...this.getBaseOptions(),
        ...config.options,
        plugins: {
          ...this.getBaseOptions().plugins,
          legend: { ...this.getBaseOptions().plugins.legend, position: 'right' },
          ...config.options?.plugins,
        },
        cutout: '60%',
      },
    };

    const buffer = await this.chartJSNodeCanvas.renderToBuffer(configuration);
    fs.writeFileSync(path.join(CHART_DIR, filename), buffer);
    console.log(`✓ Generated ${filename} (${this.mode})`);
  }

  async generateStatTile(filename) {
    // Create a stat tile using HTML canvas directly for better control
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(500, 300);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = this.surface;
    ctx.fillRect(0, 0, 500, 300);

    // Border
    ctx.strokeStyle = this.axis;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 498, 298);

    // Risk level badge
    const riskColor = RISK_COLORS[riskLevel];
    ctx.fillStyle = riskColor;
    ctx.beginPath();
    ctx.roundRect(30, 30, 140, 40, 6);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 14px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(riskLevel.toUpperCase(), 100, 56);

    // Overall score - large
    ctx.fillStyle = this.textPrimary;
    ctx.font = '700 96px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(overallScore.toString(), 250, 140);

    // Score label
    ctx.fillStyle = this.textSecondary;
    ctx.font = '400 16px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillText('Overall Security Score', 250, 170);

    // Maturity
    ctx.fillStyle = this.textPrimary;
    ctx.font = '500 18px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillText(`Maturity Level ${maturityLevel} — Initial`, 250, 210);

    // Target
    ctx.fillStyle = this.textSecondary;
    ctx.font = '400 14px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillText('Target: Level 2 — Basic', 250, 235);

    // Organization
    ctx.fillStyle = this.textPrimary;
    ctx.font = '500 16px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillText('Helping Hands Foundation', 250, 270);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(CHART_DIR, filename), buffer);
    console.log(`✓ Generated ${filename} (${this.mode})`);
  }
}

// ============================================
// CHART 1: Category Scores (Horizontal Bar)
// ============================================
async function generateCategoryScoresChart(mode) {
  const gen = new ChartGenerator(mode);
  const sorted = [...categoryScores].sort((a, b) => a.score - b.score);

  const data = {
    labels: sorted.map(d => d.category),
    datasets: [{
      label: 'Category Score (%)',
      data: sorted.map(d => d.score),
      backgroundColor: sorted.map((_, i) => {
        // Use sequential blue for magnitude - darker = higher score
        const idx = Math.floor((i / sorted.length) * (gen.sequential.length - 1));
        return gen.sequential[idx];
      }),
      borderColor: sorted.map((_, i) => {
        const idx = Math.floor((i / sorted.length) * (gen.sequential.length - 1));
        return gen.sequential[Math.min(idx + 2, gen.sequential.length - 1)];
      }),
      borderWidth: 2,
      borderRadius: 4,
    }],
  };

  const options = {
    plugins: {
      title: { display: true, text: 'Category Scores by Security Domain' },
      subtitle: { display: true, text: 'Helping Hands Foundation — Assessment Score: 16/100' },
      tooltip: {
        callbacks: {
          label: (ctx) => `Score: ${ctx.raw}%`,
        },
      },
    },
    scales: {
      x: { ...gen.getBaseOptions().scales.x, max: 100, title: { display: true, text: 'Score (%)' } },
      y: { ...gen.getBaseOptions().scales.y, title: { display: false } },
    },
  };

  await gen.generateHorizontalBarChart({ data, options }, `category-scores-${mode}.png`);
}

// ============================================
// CHART 2: Risk Distribution (Doughnut)
// ============================================
async function generateRiskDistributionChart(mode) {
  const gen = new ChartGenerator(mode);

  const data = {
    labels: riskDistribution.map(d => d.level),
    datasets: [{
      data: riskDistribution.map(d => d.count),
      backgroundColor: [
        RISK_COLORS.critical,
        RISK_COLORS.high,
        RISK_COLORS.medium,
        RISK_COLORS.low,
      ],
      borderColor: gen.surface,
      borderWidth: 3,
      borderRadius: 4,
    }],
  };

  const options = {
    plugins: {
      title: { display: true, text: 'Risk Distribution Across Categories' },
      subtitle: { display: true, text: '10 categories assessed — all currently at Medium risk' },
      legend: { position: 'right', labels: { padding: 16 } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} categories`,
        },
      },
    },
  };

  await gen.generateDoughnutChart({ data, options }, `risk-distribution-${mode}.png`);
}

// ============================================
// CHART 3: Recommendations by Priority (Horizontal Bar)
// ============================================
async function generateRecommendationsChart(mode) {
  const gen = new ChartGenerator(mode);

  const data = {
    labels: recommendationsByPriority.map(d => d.priority),
    datasets: [{
      label: 'Number of Recommendations',
      data: recommendationsByPriority.map(d => d.count),
      backgroundColor: recommendationsByPriority.map(d => d.color),
      borderColor: recommendationsByPriority.map(d => d.color),
      borderWidth: 2,
      borderRadius: 4,
    }],
  };

  const options = {
    plugins: {
      title: { display: true, text: 'Recommendations by Priority' },
      subtitle: { display: true, text: '24 total recommendations generated' },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} recommendations`,
        },
      },
    },
    scales: {
      x: { ...gen.getBaseOptions().scales.x, max: 12, title: { display: true, text: 'Count' } },
      y: { ...gen.getBaseOptions().scales.y, title: { display: false } },
    },
  };

  await gen.generateHorizontalBarChart({ data, options }, `recommendations-by-priority-${mode}.png`);
}

// ============================================
// CHART 4: KPI Progress (Grouped Bar)
// ============================================
async function generateKPIChart(mode) {
  const gen = new ChartGenerator(mode);

  const data = {
    labels: kpis.map(d => d.name),
    datasets: [
      {
        label: 'Current',
        data: kpis.map(d => d.current),
        backgroundColor: gen.categorical[0],
        borderColor: gen.categorical[0],
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Target',
        data: kpis.map(d => d.target),
        backgroundColor: gen.categorical[2],
        borderColor: gen.categorical[2],
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    plugins: {
      title: { display: true, text: 'Security KPIs — Current vs Target' },
      subtitle: { display: true, text: 'Key performance indicators for cybersecurity posture' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}${kpis[ctx.dataIndex].unit}`,
        },
      },
    },
    scales: {
      x: { ...gen.getBaseOptions().scales.x, title: { display: false } },
      y: { ...gen.getBaseOptions().scales.y, max: 120, title: { display: true, text: 'Value' } },
    },
  };

  await gen.generateBarChart({ data, options }, `kpi-progress-${mode}.png`);
}

// ============================================
// CHART 5: Category Score Heatmap (Radar)
// ============================================
async function generateRadarChart(mode) {
  const gen = new ChartGenerator(mode);

  const sorted = [...categoryScores].sort((a, b) => a.category.localeCompare(b.category));

  const data = {
    labels: sorted.map(d => d.category),
    datasets: [
      {
        label: 'Category Score',
        data: sorted.map(d => d.score),
        backgroundColor: gen.mode === 'light' ? 'rgba(42, 120, 214, 0.2)' : 'rgba(57, 135, 229, 0.2)',
        borderColor: gen.categorical[0],
        borderWidth: 2,
        pointBackgroundColor: gen.categorical[0],
        pointBorderColor: gen.surface,
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const configuration = {
    type: 'radar',
    data,
    options: {
      ...gen.getBaseOptions(),
      plugins: {
        ...gen.getBaseOptions().plugins,
        title: { display: true, text: 'Security Maturity Radar' },
        subtitle: { display: true, text: 'Category scores showing strengths and gaps' },
      },
      scales: {
        r: {
          angleLines: { color: gen.grid },
          grid: { color: gen.grid },
          pointLabels: { color: gen.textSecondary, font: { family: 'system-ui, -apple-system, "Segoe UI", sans-serif', size: 11 } },
          ticks: { color: gen.textSecondary, font: { size: 10 }, stepSize: 20, backdropColor: 'transparent' },
          min: 0,
          max: 100,
        },
      },
      elements: {
        line: { tension: 0.1 },
      },
    },
  };

  const buffer = await gen.chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(path.join(CHART_DIR, `radar-${mode}.png`), buffer);
  console.log(`✓ Generated radar-${mode}.png`);
}

// ============================================
// CHART 6: Gap Analysis by Category (Stacked Bar)
// ============================================
async function generateGapChart(mode) {
  const gen = new ChartGenerator(mode);

  // Calculate gaps per category (100 - score)
  const gaps = categoryScores.map(d => ({
    category: d.category,
    implemented: d.score,
    gap: 100 - d.score,
  })).sort((a, b) => b.gap - a.gap);

  const data = {
    labels: gaps.map(d => d.category),
    datasets: [
      {
        label: 'Implemented (%)',
        data: gaps.map(d => d.implemented),
        backgroundColor: gen.categorical[2],
        borderColor: gen.categorical[2],
        borderWidth: 1,
      },
      {
        label: 'Gap (%)',
        data: gaps.map(d => d.gap),
        backgroundColor: gen.mode === 'light' ? 'rgba(208, 59, 59, 0.4)' : 'rgba(230, 103, 103, 0.4)',
        borderColor: STATUS.critical,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    ...gen.getBaseOptions(),
    plugins: {
      ...gen.getBaseOptions().plugins,
      title: { display: true, text: 'Implementation Gaps by Category' },
      subtitle: { display: true, text: 'Blue = Implemented, Red = Remaining Gap' },
    },
    scales: {
      x: { ...gen.getBaseOptions().scales.x, stacked: true, title: { display: false } },
      y: { ...gen.getBaseOptions().scales.y, stacked: true, max: 100, title: { display: true, text: 'Percentage' } },
    },
  };

  const configuration = {
    type: 'bar',
    data,
    options,
  };

  const buffer = await gen.chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(path.join(CHART_DIR, `gap-analysis-${mode}.png`), buffer);
  console.log(`✓ Generated gap-analysis-${mode}.png`);
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('📊 Generating CyberShield NGO Report Charts...\n');
  console.log(`Output directory: ${CHART_DIR}\n`);

  for (const mode of ['light', 'dark']) {
    console.log(`\n=== Generating ${mode.toUpperCase()} mode charts ===`);

    await generateCategoryScoresChart(mode);
    await generateRiskDistributionChart(mode);
    await generateRecommendationsChart(mode);
    await generateKPIChart(mode);
    await generateRadarChart(mode);
    await generateGapChart(mode);

    // Stat tile (same for both modes, just different colors)
    const gen = new ChartGenerator(mode);
    await gen.generateStatTile(`stat-tile-${mode}.png`);
  }

  console.log('\n✅ All charts generated successfully!');
  console.log(`\nCharts saved to: ${CHART_DIR}`);

  // List generated files
  const files = fs.readdirSync(CHART_DIR).filter(f => f.endsWith('.png'));
  console.log('\nGenerated files:');
  files.forEach(f => {
    const stats = fs.statSync(path.join(CHART_DIR, f));
    console.log(`  ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
}

main().catch(err => {
  console.error('❌ Error generating charts:', err);
  process.exit(1);
});