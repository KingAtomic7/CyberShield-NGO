// CyberShield NGO - Risk Scoring Engine & Maturity Model
// Transparent scoring algorithm for cybersecurity posture assessment

import { categories } from "./assessment-questions";

// ===== RISK SCORING =====
// Risk = Likelihood × Impact (1-5 scale each)
// Risk Score ranges:
//   1-4   = Low
//   5-9   = Medium
//   10-15 = High
//   16-25 = Critical

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type AnswerType = "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable";

export interface RiskResult {
  riskScore: number;
  riskLevel: RiskLevel;
  likelihood: number;
  impact: number;
}

export interface CategoryScore {
  category: string;
  score: number; // 0-100
  maxScore: number;
  answerCount: number;
  riskLevel: RiskLevel;
}

export interface OverallResult {
  overallScore: number; // 0-100
  riskLevel: RiskLevel;
  maturityLevel: number; // 1-5
  maturityLabel: string;
  targetMaturityLevel: number;
  targetMaturityLabel: string;
  categoryScores: CategoryScore[];
  riskDistribution: { critical: number; high: number; medium: number; low: number };
  totalQuestions: number;
  answeredQuestions: number;
}

// Calculate risk level from risk score
export function getRiskLevel(riskScore: number): RiskLevel {
  if (riskScore >= 16) return "critical";
  if (riskScore >= 10) return "high";
  if (riskScore >= 5) return "medium";
  return "low";
}

// Calculate risk score for a single answer
export function calculateQuestionRisk(
  answer: AnswerType,
  baseLikelihood: number,
  baseImpact: number
): RiskResult {
  let likelihood: number;
  let impact: number;

  switch (answer) {
    case "fully_implemented":
      // Control fully in place - minimal residual risk
      likelihood = 1;
      impact = Math.max(1, Math.round(baseImpact * 0.2));
      break;
    case "partially_implemented":
      // Control partially in place - reduced but significant risk
      likelihood = Math.max(2, Math.round(baseLikelihood * 0.6));
      impact = Math.max(2, Math.round(baseImpact * 0.7));
      break;
    case "not_implemented":
      // No control - full risk
      likelihood = baseLikelihood;
      impact = baseImpact;
      break;
    case "not_applicable":
      // Not applicable - no risk
      likelihood = 1;
      impact = 1;
      break;
    default:
      likelihood = baseLikelihood;
      impact = baseImpact;
  }

  const riskScore = likelihood * impact;
  return {
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    likelihood,
    impact,
  };
}

// Calculate score contribution from an answer (0-100 per question)
export function calculateAnswerScore(answer: AnswerType): number {
  switch (answer) {
    case "fully_implemented": return 100;
    case "partially_implemented": return 50;
    case "not_implemented": return 0;
    case "not_applicable": return -1; // Excluded from scoring
    default: return 0;
  }
}

// Calculate category scores
export function calculateCategoryScores(
  answers: { questionId: string; category: string; answer: AnswerType }[]
): CategoryScore[] {
  const results: CategoryScore[] = [];

  for (const category of categories) {
    const categoryAnswers = answers.filter((a) => a.category === category);
    if (categoryAnswers.length === 0) {
      results.push({
        category,
        score: 0,
        maxScore: 100,
        answerCount: 0,
        riskLevel: "medium",
      });
      continue;
    }

    let totalScore = 0;
    let applicableCount = 0;
    let totalRiskScore = 0;

    for (const answer of categoryAnswers) {
      const score = calculateAnswerScore(answer.answer);
      if (score >= 0) {
        totalScore += score;
        applicableCount++;
      }
      // Calculate risk for category-level assessment
      const risk = calculateQuestionRisk(answer.answer, 3, 3);
      totalRiskScore += risk.riskScore;
    }

    const avgScore = applicableCount > 0 ? Math.round(totalScore / applicableCount) : 0;
    const avgRisk = categoryAnswers.length > 0 ? totalRiskScore / categoryAnswers.length : 0;

    results.push({
      category,
      score: avgScore,
      maxScore: 100,
      answerCount: categoryAnswers.length,
      riskLevel: getRiskLevel(Math.round(avgRisk)),
    });
  }

  return results;
}

// Calculate overall assessment result
export function calculateOverallResult(
  answers: { questionId: string; category: string; answer: AnswerType }[],
  totalQuestions: number
): OverallResult {
  const categoryScores = calculateCategoryScores(answers);

  // Overall score is weighted average of category scores
  const applicableCategories = categoryScores.filter((c) => c.answerCount > 0);
  const overallScore =
    applicableCategories.length > 0
      ? Math.round(
          applicableCategories.reduce((sum, c) => sum + c.score, 0) / applicableCategories.length
        )
      : 0;

  // Determine overall risk level based on score
  let riskLevel: RiskLevel;
  if (overallScore >= 80) riskLevel = "low";
  else if (overallScore >= 60) riskLevel = "medium";
  else if (overallScore >= 40) riskLevel = "high";
  else riskLevel = "critical";

  // Maturity level based on overall score
  const { level: maturityLevel, label: maturityLabel } = getMaturityLevel(overallScore);
  const { level: targetMaturityLevel, label: targetMaturityLabel } = getTargetMaturity(maturityLevel);

  // Risk distribution across all answers
  const riskDistribution = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const answer of answers) {
    const risk = calculateQuestionRisk(answer.answer, 3, 3);
    riskDistribution[risk.riskLevel]++;
  }

  return {
    overallScore,
    riskLevel,
    maturityLevel,
    maturityLabel,
    targetMaturityLevel,
    targetMaturityLabel,
    categoryScores,
    riskDistribution,
    totalQuestions,
    answeredQuestions: answers.length,
  };
}

// ===== MATURITY MODEL =====
// Level 1 – Initial (0-19)
// Level 2 – Basic (20-39)
// Level 3 – Managed (40-59)
// Level 4 – Advanced (60-79)
// Level 5 – Optimized (80-100)

export interface MaturityInfo {
  level: number;
  label: string;
  description: string;
  scoreRange: string;
}

export const maturityLevels: MaturityInfo[] = [
  {
    level: 1,
    label: "Initial",
    description: "No formal cybersecurity practices. Ad-hoc and reactive approach. Significant risk exposure.",
    scoreRange: "0-19",
  },
  {
    level: 2,
    label: "Basic",
    description: "Some basic controls in place but inconsistent. Limited awareness and no formal policies.",
    scoreRange: "20-39",
  },
  {
    level: 3,
    label: "Managed",
    description: "Formal policies and procedures established. Consistent application of key controls.",
    scoreRange: "40-59",
  },
  {
    level: 4,
    label: "Advanced",
    description: "Proactive security measures. Regular testing and monitoring. Continuous improvement processes.",
    scoreRange: "60-79",
  },
  {
    level: 5,
    label: "Optimized",
    description: "Mature, optimized security program. Threat intelligence integration. Automation and metrics-driven.",
    scoreRange: "80-100",
  },
];

export function getMaturityLevel(score: number): { level: number; label: string } {
  if (score >= 80) return { level: 5, label: "Optimized" };
  if (score >= 60) return { level: 4, label: "Advanced" };
  if (score >= 40) return { level: 3, label: "Managed" };
  if (score >= 20) return { level: 2, label: "Basic" };
  return { level: 1, label: "Initial" };
}

export function getTargetMaturity(currentLevel: number): { level: number; label: string } {
  const targetLevel = Math.min(currentLevel + 1, 5);
  const labels = ["", "Initial", "Basic", "Managed", "Advanced", "Optimized"];
  return { level: targetLevel, label: labels[targetLevel] };
}

export function getMaturityImprovementSteps(currentLevel: number): string[] {
  const steps: Record<number, string[]> = {
    1: [
      "Enable MFA on all critical accounts immediately",
      "Install and configure endpoint protection on all devices",
      "Implement basic password policies",
      "Set up automated backups for critical data",
      "Change all default passwords on network devices",
      "Conduct basic security awareness training for all staff",
    ],
    2: [
      "Develop and formalize security policies",
      "Implement data classification and handling procedures",
      "Conduct regular access reviews and permission audits",
      "Improve email security (SPF, DKIM, DMARC)",
      "Test backup restoration procedures",
      "Create a basic incident response plan",
    ],
    3: [
      "Implement vulnerability scanning and management",
      "Deploy centralized logging and monitoring",
      "Conduct regular phishing simulation exercises",
      "Perform periodic security assessments/audits",
      "Develop business continuity and disaster recovery plans",
      "Implement network segmentation",
    ],
    4: [
      "Deploy advanced endpoint detection and response (EDR)",
      "Engage external security assessment services",
      "Conduct penetration testing where appropriate",
      "Implement security automation and orchestration",
      "Establish threat intelligence feeds",
      "Develop security metrics and reporting program",
    ],
    5: [
      "Maintain continuous security improvement cycle",
      "Integrate security into development processes (DevSecOps)",
      "Automate compliance monitoring and reporting",
      "Participate in industry threat sharing",
      "Regularly benchmark against industry frameworks",
    ],
  };
  return steps[currentLevel] || steps[1];
}

// Likelihood labels for display
export const likelihoodLabels: Record<number, string> = {
  1: "Rare",
  2: "Unlikely",
  3: "Possible",
  4: "Likely",
  5: "Almost Certain",
};

// Impact labels for display
export const impactLabels: Record<number, string> = {
  1: "Minimal",
  2: "Minor",
  3: "Moderate",
  4: "Major",
  5: "Severe",
};

// Risk level colors for UI
export const riskColors: Record<RiskLevel, string> = {
  critical: "#dc3545",
  high: "#fd7e14",
  medium: "#ffc107",
  low: "#198754",
};

export const riskBgColors: Record<RiskLevel, string> = {
  critical: "bg-red-600",
  high: "bg-orange-500",
  medium: "bg-yellow-400",
  low: "bg-green-600",
};
