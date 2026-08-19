// CyberShield NGO - Rule-Based Recommendation Engine
// Generates prioritized recommendations based on assessment answers

import type { AnswerType } from "./scoring";

export interface Recommendation {
  title: string;
  description: string;
  category: string;
  priority: "immediate" | "short_term" | "medium_term" | "long_term";
  risk: "critical" | "high" | "medium" | "low";
  costEstimate: string;
  implementationTime: string;
  businessImpact: number; // 1-5
  implementationEffort: number; // 1-5
  condition: (answers: Record<string, AnswerType>) => boolean;
}

// All possible recommendations with their trigger conditions
export const recommendationRules: Recommendation[] = [
  // ===== MFA Recommendations =====
  {
    title: "Enable Multi-Factor Authentication for Critical Accounts",
    description: "Implement MFA on all email, cloud storage, financial, and administrator accounts. Use authenticator apps or hardware tokens where possible. SMS-based MFA is better than nothing but less secure.",
    category: "Identity & Access Management",
    priority: "immediate",
    risk: "critical",
    costEstimate: "Low (₹0 - ₹500/month)",
    implementationTime: "1-7 days",
    businessImpact: 5,
    implementationEffort: 1,
    condition: (a) => a["iam_1"] === "not_implemented" || a["iam_1"] === "partially_implemented",
  },
  {
    title: "Enable MFA for All Email Accounts",
    description: "Email accounts are a primary attack vector. Enable MFA on every email account to prevent unauthorized access even if passwords are compromised.",
    category: "Email Security",
    priority: "immediate",
    risk: "critical",
    costEstimate: "Low (₹0 - ₹300/month)",
    implementationTime: "1-3 days",
    businessImpact: 5,
    implementationEffort: 1,
    condition: (a) => a["email_1"] === "not_implemented" || a["email_1"] === "partially_implemented",
  },

  // ===== Password & Access Recommendations =====
  {
    title: "Implement and Enforce a Strong Password Policy",
    description: "Establish a password policy requiring minimum 12 characters, complexity requirements, and regular changes. Prevent password reuse across accounts.",
    category: "Identity & Access Management",
    priority: "immediate",
    risk: "high",
    costEstimate: "Low (₹0)",
    implementationTime: "1-3 days",
    businessImpact: 4,
    implementationEffort: 1,
    condition: (a) => a["iam_3"] === "not_implemented",
  },
  {
    title: "Deploy a Password Manager for the Organization",
    description: "Provide a password manager (e.g., Bitwarden free tier, 1Password, Keeper) to all staff. This enables unique, strong passwords for every account without the burden of memorization.",
    category: "Identity & Access Management",
    priority: "short_term",
    risk: "high",
    costEstimate: "Low (₹0 - ₹1,000/month)",
    implementationTime: "1-2 weeks",
    businessImpact: 4,
    implementationEffort: 2,
    condition: (a) => a["iam_4"] === "not_implemented",
  },
  {
    title: "Separate Administrator Accounts from Regular Accounts",
    description: "Create dedicated admin accounts for privileged operations. Admin accounts should not be used for daily tasks like email or web browsing to reduce attack surface.",
    category: "Identity & Access Management",
    priority: "short_term",
    risk: "critical",
    costEstimate: "Low (₹0)",
    implementationTime: "1-3 days",
    businessImpact: 5,
    implementationEffort: 1,
    condition: (a) => a["iam_5"] === "not_implemented",
  },
  {
    title: "Implement Immediate Account Deactivation Process",
    description: "Establish a process to disable all accounts within 24 hours of employee/volunteer departure. Include a checklist for revoking all access (email, cloud, applications, physical).",
    category: "Identity & Access Management",
    priority: "immediate",
    risk: "critical",
    costEstimate: "Low (₹0)",
    implementationTime: "1-3 days",
    businessImpact: 5,
    implementationEffort: 1,
    condition: (a) => a["iam_7"] === "not_implemented",
  },
  {
    title: "Implement Regular User Permission Reviews",
    description: "Schedule quarterly access reviews to ensure users only have permissions needed for their current roles. Remove excessive or unused permissions.",
    category: "Identity & Access Management",
    priority: "medium_term",
    risk: "medium",
    costEstimate: "Low (₹0 - staff time)",
    implementationTime: "2-4 weeks",
    businessImpact: 3,
    implementationEffort: 2,
    condition: (a) => a["iam_6"] === "not_implemented",
  },
  {
    title: "Ensure All Users Have Unique Individual Accounts",
    description: "Eliminate shared accounts. Each person must have their own unique credentials for accountability and to enable proper access controls and audit trails.",
    category: "Identity & Access Management",
    priority: "immediate",
    risk: "high",
    costEstimate: "Low (₹0)",
    implementationTime: "1-5 days",
    businessImpact: 4,
    implementationEffort: 2,
    condition: (a) => a["iam_2"] === "not_implemented",
  },

  // ===== Endpoint Security =====
  {
    title: "Install Endpoint Protection on All Devices",
    description: "Deploy antivirus/anti-malware on all organizational devices. Consider free options like Microsoft Defender (built into Windows) or ClamAV for budget constraints. Ensure real-time scanning is enabled.",
    category: "Endpoint Security",
    priority: "immediate",
    risk: "critical",
    costEstimate: "Low (₹0 - ₹2,000/device/year)",
    implementationTime: "1-7 days",
    businessImpact: 5,
    implementationEffort: 1,
    condition: (a) => a["ep_2"] === "not_implemented",
  },
  {
    title: "Enable Automatic OS and Application Updates",
    description: "Configure automatic updates for operating systems and critical applications. Unpatched systems are the #1 entry point for attackers.",
    category: "Endpoint Security",
    priority: "immediate",
    risk: "critical",
    costEstimate: "Low (₹0)",
    implementationTime: "1-3 days",
    businessImpact: 5,
    implementationEffort: 1,
    condition: (a) => a["ep_1"] === "not_implemented" || a["ep_1"] === "partially_implemented",
  },
  {
    title: "Enable Full-Disk Encryption on All Laptops",
    description: "Enable BitLocker (Windows), FileVault (Mac), or LUKS (Linux) on all portable devices. This protects data if a device is lost or stolen.",
    category: "Endpoint Security",
    priority: "short_term",
    risk: "high",
    costEstimate: "Low (₹0 - built-in OS feature)",
    implementationTime: "1-2 weeks",
    businessImpact: 5,
    implementationEffort: 2,
    condition: (a) => a["ep_4"] === "not_implemented",
  },
  {
    title: "Enable Host-Based Firewalls on All Devices",
    description: "Ensure the built-in firewall is enabled on every device (Windows Defender Firewall, macOS Firewall, iptables on Linux).",
    category: "Endpoint Security",
    priority: "short_term",
    risk: "medium",
    costEstimate: "Low (₹0)",
    implementationTime: "1-3 days",
    businessImpact: 3,
    implementationEffort: 1,
    condition: (a) => a["ep_3"] === "not_implemented",
  },
  {
    title: "Create an Inventory of All Organizational Devices",
    description: "Maintain a spreadsheet or simple asset management system listing all devices, their OS, owner, location, and patch status. You cannot protect what you don't know about.",
    category: "Endpoint Security",
    priority: "short_term",
    risk: "medium",
    costEstimate: "Low (₹0)",
    implementationTime: "1-2 weeks",
    businessImpact: 3,
    implementationEffort: 2,
    condition: (a) => a["ep_5"] === "not_implemented",
  },

  // ===== Network Security =====
  {
    title: "Deploy a Perimeter Firewall",
    description: "Install and configure a network firewall at the internet boundary. Even a basic router with firewall capabilities is better than nothing. Configure rules to block unnecessary inbound traffic.",
    category: "Network Security",
    priority: "immediate",
    risk: "critical",
    costEstimate: "Low-Medium (₹5,000 - ₹50,000)",
    implementationTime: "1-2 weeks",
    businessImpact: 5,
    implementationEffort: 2,
    condition: (a) => a["net_1"] === "not_implemented",
  },
  {
    title: "Secure Wi-Fi with WPA2/WPA3 and Strong Passphrase",
    description: "Ensure all Wi-Fi networks use WPA2 or WPA3 encryption with a strong, unique passphrase (16+ characters). Disable WPS.",
    category: "Network Security",
    priority: "short_term",
    risk: "high",
    costEstimate: "Low (₹0)",
    implementationTime: "1-3 days",
    businessImpact: 4,
    implementationEffort: 1,
    condition: (a) => a["net_2"] === "not_implemented",
  },
  {
    title: "Change All Default Network Device Passwords",
    description: "Change default passwords on routers, switches, and any network devices immediately. Default credentials are widely known and easily exploited.",
    category: "Network Security",
    priority: "immediate",
    risk: "critical",
    costEstimate: "Low (₹0)",
    implementationTime: "1 day",
    businessImpact: 5,
    implementationEffort: 1,
    condition: (a) => a["net_5"] === "not_implemented",
  },
  {
    title: "Implement VPN for Remote Access",
    description: "Set up a VPN for all remote access to organizational resources. Do not expose internal services directly to the internet. WireGuard or OpenVPN are free options.",
    category: "Network Security",
    priority: "medium_term",
    risk: "high",
    costEstimate: "Low-Medium (₹0 - ₹5,000/month)",
    implementationTime: "2-4 weeks",
    businessImpact: 4,
    implementationEffort: 3,
    condition: (a) => a["net_4"] === "not_implemented",
  },

  // ===== Data Protection =====
  {
    title: "Implement Data Classification",
    description: "Classify data into categories (Public, Internal, Confidential, Restricted). Apply appropriate protection controls based on classification. This is foundational for data protection.",
    category: "Data Protection",
    priority: "short_term",
    risk: "medium",
    costEstimate: "Low (₹0 - staff time)",
    implementationTime: "2-4 weeks",
    businessImpact: 4,
    implementationEffort: 3,
    condition: (a) => a["dp_1"] === "not_implemented",
  },
  {
    title: "Encrypt Sensitive Data at Rest and in Transit",
    description: "Enable encryption for sensitive data storage (full-disk, database encryption) and ensure all communications use TLS/HTTPS. This is especially critical for donor and beneficiary data.",
    category: "Data Protection",
    priority: "immediate",
    risk: "critical",
    costEstimate: "Low-Medium (varies by solution)",
    implementationTime: "1-4 weeks",
    businessImpact: 5,
    implementationEffort: 3,
    condition: (a) => a["dp_2"] === "not_implemented",
  },
  {
    title: "Restrict Access to Sensitive Data on Need-to-Know Basis",
    description: "Implement role-based access control for sensitive data (donor records, beneficiary data, financials). Only authorized personnel should have access.",
    category: "Data Protection",
    priority: "short_term",
    risk: "high",
    costEstimate: "Low (₹0 - staff time)",
    implementationTime: "1-2 weeks",
    businessImpact: 5,
    implementationEffort: 2,
    condition: (a) => a["dp_3"] === "not_implemented",
  },
  {
    title: "Create a Data Retention and Disposal Policy",
    description: "Define how long different types of data are retained and how they are securely disposed of when no longer needed. This is important for compliance and minimizing data exposure.",
    category: "Data Protection",
    priority: "medium_term",
    risk: "medium",
    costEstimate: "Low (₹0 - staff time)",
    implementationTime: "2-4 weeks",
    businessImpact: 3,
    implementationEffort: 2,
    condition: (a) => a["dp_5"] === "not_implemented",
  },

  // ===== Backup & Disaster Recovery =====
  {
    title: "Implement Automated Encrypted Backups Using 3-2-1 Strategy",
    description: "Implement the 3-2-1 backup strategy: 3 copies of data, on 2 different media types, with 1 copy off-site/cloud. Automate backups and encrypt them. Free tools like Duplicati or rclone can help.",
    category: "Backup & Disaster Recovery",
    priority: "immediate",
    risk: "critical",
    costEstimate: "Low-Medium (₹500 - ₹5,000/month for cloud)",
    implementationTime: "1-4 weeks",
    businessImpact: 5,
    implementationEffort: 2,
    condition: (a) => a["bdr_1"] === "not_implemented" || a["bdr_6"] === "not_implemented",
  },
  {
    title: "Test Backup Restoration Regularly",
    description: "A backup that hasn't been tested is not a backup. Perform quarterly restoration tests to verify backups are working correctly and data can be recovered within acceptable timeframes.",
    category: "Backup & Disaster Recovery",
    priority: "medium_term",
    risk: "high",
    costEstimate: "Low (staff time only)",
    implementationTime: "1-2 weeks to establish process",
    businessImpact: 4,
    implementationEffort: 2,
    condition: (a) => a["bdr_5"] === "not_implemented",
  },

  // ===== Email Security =====
  {
    title: "Implement Email Authentication (SPF, DKIM, DMARC)",
    description: "Configure SPF, DKIM, and DMARC records for your email domain to prevent spoofing and improve deliverability. This is free and can be configured in your DNS settings.",
    category: "Email Security",
    priority: "medium_term",
    risk: "medium",
    costEstimate: "Low (₹0)",
    implementationTime: "1-2 weeks",
    businessImpact: 3,
    implementationEffort: 2,
    condition: (a) => a["email_4"] === "not_implemented" || a["email_5"] === "not_implemented" || a["email_6"] === "not_implemented",
  },
  {
    title: "Enable Spam and Malware Filtering on Email",
    description: "Ensure spam/malware filtering is enabled and configured properly. Most email providers include this, but verify settings and consider additional filtering if needed.",
    category: "Email Security",
    priority: "short_term",
    risk: "high",
    costEstimate: "Low (₹0 - often included)",
    implementationTime: "1-3 days",
    businessImpact: 4,
    implementationEffort: 1,
    condition: (a) => a["email_2"] === "not_implemented",
  },

  // ===== Awareness =====
  {
    title: "Introduce Monthly Cybersecurity Awareness Training",
    description: "Implement regular security awareness training for all staff and volunteers. Use free resources like KnowBe4's free phishing test, CISA's cyber hygiene resources, or create simple monthly awareness modules.",
    category: "Employee Security Awareness",
    priority: "immediate",
    risk: "high",
    costEstimate: "Low (₹0 - ₹2,000/month)",
    implementationTime: "1-2 weeks",
    businessImpact: 4,
    implementationEffort: 2,
    condition: (a) => a["aware_1"] === "not_implemented",
  },
  {
    title: "Establish a Security Incident Reporting Process",
    description: "Create a clear, simple process for employees to report suspicious emails, potential security incidents, or concerns. Ensure there's a defined contact point and no blame culture.",
    category: "Employee Security Awareness",
    priority: "short_term",
    risk: "high",
    costEstimate: "Low (₹0)",
    implementationTime: "1-2 weeks",
    businessImpact: 4,
    implementationEffort: 1,
    condition: (a) => a["aware_3"] === "not_implemented",
  },
  {
    title: "Include Volunteers in Security Awareness Training",
    description: "Volunteers often have access to sensitive data but are frequently overlooked in security training. Ensure they receive the same baseline security awareness as employees.",
    category: "Employee Security Awareness",
    priority: "short_term",
    risk: "medium",
    costEstimate: "Low (₹0 - same training materials)",
    implementationTime: "1-2 weeks",
    businessImpact: 3,
    implementationEffort: 1,
    condition: (a) => a["aware_4"] === "not_implemented",
  },

  // ===== Incident Response =====
  {
    title: "Create a Documented Incident Response Plan",
    description: "Develop a simple but comprehensive incident response plan covering identification, containment, eradication, recovery, and lessons learned. Define roles, responsibilities, and communication procedures.",
    category: "Incident Response",
    priority: "short_term",
    risk: "high",
    costEstimate: "Low (₹0 - staff time)",
    implementationTime: "2-4 weeks",
    businessImpact: 5,
    implementationEffort: 3,
    condition: (a) => a["ir_1"] === "not_implemented",
  },
  {
    title: "Define Emergency Contacts and Escalation Procedures",
    description: "Create a list of emergency contacts (IT support, management, legal, law enforcement cyber cell, insurance) and clear escalation procedures for different severity levels.",
    category: "Incident Response",
    priority: "short_term",
    risk: "medium",
    costEstimate: "Low (₹0)",
    implementationTime: "1-2 weeks",
    businessImpact: 4,
    implementationEffort: 1,
    condition: (a) => a["ir_4"] === "not_implemented",
  },

  // ===== Security Policies =====
  {
    title: "Develop an Acceptable Use Policy",
    description: "Create a clear policy defining acceptable use of organizational systems, email, and internet. Cover personal device usage, social media, and data handling expectations.",
    category: "Security Policies",
    priority: "short_term",
    risk: "medium",
    costEstimate: "Low (₹0 - staff time)",
    implementationTime: "1-2 weeks",
    businessImpact: 3,
    implementationEffort: 2,
    condition: (a) => a["sp_1"] === "not_implemented",
  },
  {
    title: "Create Employee/Volunteer Offboarding Security Checklist",
    description: "Develop a comprehensive offboarding procedure that includes account deactivation, device collection, access revocation, and data handover. This should be triggered immediately upon departure.",
    category: "Security Policies",
    priority: "immediate",
    risk: "critical",
    costEstimate: "Low (₹0)",
    implementationTime: "1-2 weeks",
    businessImpact: 5,
    implementationEffort: 1,
    condition: (a) => a["sp_3"] === "not_implemented",
  },
  {
    title: "Develop Remote Work and BYOD Security Policy",
    description: "Create a policy covering remote work security requirements and personal device usage. Address VPN usage, device security minimums, and data handling on personal devices.",
    category: "Security Policies",
    priority: "medium_term",
    risk: "medium",
    costEstimate: "Low (₹0 - staff time)",
    implementationTime: "2-4 weeks",
    businessImpact: 3,
    implementationEffort: 2,
    condition: (a) => a["sp_2"] === "not_implemented",
  },

  // ===== Vulnerability Management =====
  {
    title: "Implement Regular Vulnerability Scanning",
    description: "Set up regular vulnerability scans of organizational systems. Use free tools like OpenVAS or Nessus Essentials for internal scanning. Schedule monthly scans at minimum.",
    category: "Vulnerability Management",
    priority: "medium_term",
    risk: "high",
    costEstimate: "Low (₹0 - free tools available)",
    implementationTime: "2-4 weeks",
    businessImpact: 4,
    implementationEffort: 3,
    condition: (a) => a["vm_1"] === "not_implemented",
  },
  {
    title: "Establish a Patch Management Process",
    description: "Create a formal process for tracking and applying security updates across all software and systems. Define timelines: critical patches within 48 hours, high within 2 weeks, others within 30 days.",
    category: "Vulnerability Management",
    priority: "short_term",
    risk: "high",
    costEstimate: "Low (₹0 - staff time)",
    implementationTime: "1-2 weeks",
    businessImpact: 4,
    implementationEffort: 2,
    condition: (a) => a["vm_3"] === "not_implemented",
  },

  // ===== Partial Implementation Improvements =====
  {
    title: "Complete MFA Rollout for Partially Implemented Accounts",
    description: "You've started MFA implementation but some accounts remain unprotected. Identify all accounts without MFA and enable it immediately, prioritizing admin and financial accounts.",
    category: "Identity & Access Management",
    priority: "immediate",
    risk: "critical",
    costEstimate: "Low (₹0 - ₹500/month)",
    implementationTime: "1-3 days",
    businessImpact: 5,
    implementationEffort: 1,
    condition: (a) => a["iam_1"] === "partially_implemented",
  },
  {
    title: "Improve Partial Backup Coverage to Full Implementation",
    description: "Your backups are partially implemented. Identify what's missing (automation, off-site, encryption, or testing) and complete the 3-2-1 backup strategy.",
    category: "Backup & Disaster Recovery",
    priority: "short_term",
    risk: "high",
    costEstimate: "Low-Medium (varies)",
    implementationTime: "1-4 weeks",
    businessImpact: 5,
    implementationEffort: 2,
    condition: (a) => a["bdr_1"] === "partially_implemented",
  },
  {
    title: "Expand Encryption Coverage for Sensitive Data",
    description: "Encryption is partially implemented. Identify all locations where sensitive data resides and ensure encryption is applied comprehensively - at rest, in transit, and in backups.",
    category: "Data Protection",
    priority: "short_term",
    risk: "high",
    costEstimate: "Low-Medium (varies)",
    implementationTime: "1-4 weeks",
    businessImpact: 5,
    implementationEffort: 3,
    condition: (a) => a["dp_2"] === "partially_implemented",
  },
];

// Generate recommendations based on assessment answers
export function generateRecommendations(
  answers: Record<string, AnswerType>
): (Omit<Recommendation, "condition"> & { prioritizationScore: number })[] {
  const triggered = recommendationRules.filter((rule) => rule.condition(answers));

  return triggered
    .map((rec) => {
      // Prioritization Score = (Risk × Business Impact) / Implementation Effort
      const riskWeight = { critical: 5, high: 4, medium: 3, low: 2 };
      const riskValue = riskWeight[rec.risk] || 3;
      const prioritizationScore = (riskValue * rec.businessImpact) / rec.implementationEffort;

      const { condition, ...rest } = rec;
      return {
        ...rest,
        prioritizationScore: Math.round(prioritizationScore * 100) / 100,
      };
    })
    .sort((a, b) => b.prioritizationScore - a.prioritizationScore);
}

// Get gap analysis data
export interface GapAnalysisItem {
  category: string;
  currentState: string;
  expectedState: string;
  gap: string;
  risk: "critical" | "high" | "medium" | "low";
  priority: "immediate" | "short_term" | "medium_term" | "long_term";
  recommendation: string;
}

export function generateGapAnalysis(
  answers: Record<string, AnswerType>,
  questionTexts: Record<string, { question: string; category: string }>
): GapAnalysisItem[] {
  const gaps: GapAnalysisItem[] = [];

  for (const [questionId, answer] of Object.entries(answers)) {
    if (answer === "not_applicable" || answer === "fully_implemented") continue;

    const qInfo = questionTexts[questionId];
    if (!qInfo) continue;

    let currentState: string;
    let expectedState = "Fully implemented and verified";
    let gap: string;
    let risk: "critical" | "high" | "medium" | "low";
    let priority: "immediate" | "short_term" | "medium_term" | "long_term";

    if (answer === "not_implemented") {
      currentState = "Not implemented";
      gap = "This control is completely missing";
      risk = "critical";
      priority = "immediate";
    } else {
      // partially_implemented
      currentState = "Partially implemented";
      gap = "This control is incomplete and needs to be fully deployed";
      risk = "high";
      priority = "short_term";
    }

    gaps.push({
      category: qInfo.category,
      currentState,
      expectedState,
      gap,
      risk,
      priority,
      recommendation: `Implement: ${qInfo.question}`,
    });
  }

  return gaps.sort((a, b) => {
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const priorityOrder = { immediate: 0, short_term: 1, medium_term: 2, long_term: 3 };
    return (riskOrder[a.risk] - riskOrder[b.risk]) || (priorityOrder[a.priority] - priorityOrder[b.priority]);
  });
}
