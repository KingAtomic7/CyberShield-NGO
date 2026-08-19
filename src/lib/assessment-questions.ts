// Assessment questions for CyberShield NGO
// Each question belongs to a category and has risk parameters

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  likelihood: number; // 1-5 if not implemented
  impact: number; // 1-5 if not implemented
}

export const categories = [
  "Identity & Access Management",
  "Endpoint Security",
  "Network Security",
  "Data Protection",
  "Backup & Disaster Recovery",
  "Email Security",
  "Employee Security Awareness",
  "Incident Response",
  "Security Policies",
  "Vulnerability Management",
] as const;

export type Category = (typeof categories)[number];

export const assessmentQuestions: AssessmentQuestion[] = [
  // ===== 1. Identity & Access Management (7 questions) =====
  {
    id: "iam_1",
    category: "Identity & Access Management",
    question: "Is multi-factor authentication (MFA) enabled for critical accounts (email, cloud storage, financial)?",
    likelihood: 5,
    impact: 5,
  },
  {
    id: "iam_2",
    category: "Identity & Access Management",
    question: "Are all employees using unique, individual user accounts (no shared accounts)?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "iam_3",
    category: "Identity & Access Management",
    question: "Is there an enforced password policy (minimum length, complexity, expiration)?",
    likelihood: 4,
    impact: 3,
  },
  {
    id: "iam_4",
    category: "Identity & Access Management",
    question: "Is a password manager used and promoted within the organization?",
    likelihood: 3,
    impact: 3,
  },
  {
    id: "iam_5",
    category: "Identity & Access Management",
    question: "Are administrator/privileged accounts separated from normal user accounts?",
    likelihood: 4,
    impact: 5,
  },
  {
    id: "iam_6",
    category: "Identity & Access Management",
    question: "Are user permissions reviewed regularly (at least quarterly)?",
    likelihood: 3,
    impact: 4,
  },
  {
    id: "iam_7",
    category: "Identity & Access Management",
    question: "Are former employee/volunteer accounts disabled immediately upon departure?",
    likelihood: 5,
    impact: 5,
  },

  // ===== 2. Endpoint Security (6 questions) =====
  {
    id: "ep_1",
    category: "Endpoint Security",
    question: "Are operating systems and applications regularly updated with security patches?",
    likelihood: 5,
    impact: 5,
  },
  {
    id: "ep_2",
    category: "Endpoint Security",
    question: "Is endpoint protection (antivirus/EDR) installed and active on all devices?",
    likelihood: 5,
    impact: 4,
  },
  {
    id: "ep_3",
    category: "Endpoint Security",
    question: "Is the host-based firewall enabled on all organizational devices?",
    likelihood: 4,
    impact: 3,
  },
  {
    id: "ep_4",
    category: "Endpoint Security",
    question: "Are laptops and portable devices encrypted (full-disk encryption)?",
    likelihood: 4,
    impact: 5,
  },
  {
    id: "ep_5",
    category: "Endpoint Security",
    question: "Is there a current inventory of all organizational devices?",
    likelihood: 3,
    impact: 3,
  },
  {
    id: "ep_6",
    category: "Endpoint Security",
    question: "Are unauthorized software applications restricted from installation?",
    likelihood: 3,
    impact: 3,
  },

  // ===== 3. Network Security (5 questions) =====
  {
    id: "net_1",
    category: "Network Security",
    question: "Is a firewall deployed at the network perimeter?",
    likelihood: 5,
    impact: 5,
  },
  {
    id: "net_2",
    category: "Network Security",
    question: "Is Wi-Fi secured with WPA2/WPA3 and a strong passphrase?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "net_3",
    category: "Network Security",
    question: "Is guest Wi-Fi separated from the organizational network?",
    likelihood: 3,
    impact: 4,
  },
  {
    id: "net_4",
    category: "Network Security",
    question: "Is a VPN used for remote access to organizational resources?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "net_5",
    category: "Network Security",
    question: "Are default router/network device passwords changed?",
    likelihood: 5,
    impact: 5,
  },

  // ===== 4. Data Protection (6 questions) =====
  {
    id: "dp_1",
    category: "Data Protection",
    question: "Is sensitive information classified based on sensitivity levels?",
    likelihood: 3,
    impact: 4,
  },
  {
    id: "dp_2",
    category: "Data Protection",
    question: "Is sensitive data encrypted at rest and in transit?",
    likelihood: 5,
    impact: 5,
  },
  {
    id: "dp_3",
    category: "Data Protection",
    question: "Is access to sensitive data restricted on a need-to-know basis?",
    likelihood: 4,
    impact: 5,
  },
  {
    id: "dp_4",
    category: "Data Protection",
    question: "Is data securely deleted when no longer needed (secure erasure)?",
    likelihood: 3,
    impact: 4,
  },
  {
    id: "dp_5",
    category: "Data Protection",
    question: "Is there a documented data retention and disposal policy?",
    likelihood: 3,
    impact: 3,
  },
  {
    id: "dp_6",
    category: "Data Protection",
    question: "Are data sharing agreements in place with third parties?",
    likelihood: 3,
    impact: 4,
  },

  // ===== 5. Backup & Disaster Recovery (6 questions) =====
  {
    id: "bdr_1",
    category: "Backup & Disaster Recovery",
    question: "Are important files and databases backed up regularly?",
    likelihood: 5,
    impact: 5,
  },
  {
    id: "bdr_2",
    category: "Backup & Disaster Recovery",
    question: "Are backups automated and scheduled?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "bdr_3",
    category: "Backup & Disaster Recovery",
    question: "Is an off-site or cloud backup maintained?",
    likelihood: 4,
    impact: 5,
  },
  {
    id: "bdr_4",
    category: "Backup & Disaster Recovery",
    question: "Are backups encrypted to protect data at rest?",
    likelihood: 3,
    impact: 4,
  },
  {
    id: "bdr_5",
    category: "Backup & Disaster Recovery",
    question: "Are backup restores tested regularly (at least quarterly)?",
    likelihood: 3,
    impact: 4,
  },
  {
    id: "bdr_6",
    category: "Backup & Disaster Recovery",
    question: "Is a 3-2-1 backup strategy implemented (3 copies, 2 media, 1 off-site)?",
    likelihood: 3,
    impact: 5,
  },

  // ===== 6. Email Security (6 questions) =====
  {
    id: "email_1",
    category: "Email Security",
    question: "Is MFA enabled for all email accounts?",
    likelihood: 5,
    impact: 5,
  },
  {
    id: "email_2",
    category: "Email Security",
    question: "Is spam and malware filtering enabled on email?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "email_3",
    category: "Email Security",
    question: "Is phishing awareness training conducted for all staff?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "email_4",
    category: "Email Security",
    question: "Is SPF (Sender Policy Framework) configured for your domain?",
    likelihood: 3,
    impact: 3,
  },
  {
    id: "email_5",
    category: "Email Security",
    question: "Is DKIM (DomainKeys Identified Mail) configured?",
    likelihood: 3,
    impact: 3,
  },
  {
    id: "email_6",
    category: "Email Security",
    question: "Is DMARC (Domain-based Message Authentication) configured?",
    likelihood: 3,
    impact: 3,
  },

  // ===== 7. Employee Security Awareness (5 questions) =====
  {
    id: "aware_1",
    category: "Employee Security Awareness",
    question: "Do all employees receive cybersecurity awareness training upon onboarding?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "aware_2",
    category: "Employee Security Awareness",
    question: "Are phishing simulation exercises conducted periodically?",
    likelihood: 3,
    impact: 3,
  },
  {
    id: "aware_3",
    category: "Employee Security Awareness",
    question: "Do employees know how to report suspicious emails or security incidents?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "aware_4",
    category: "Employee Security Awareness",
    question: "Are volunteers included in security awareness training?",
    likelihood: 3,
    impact: 3,
  },
  {
    id: "aware_5",
    category: "Employee Security Awareness",
    question: "Is security awareness training refreshed at least annually?",
    likelihood: 3,
    impact: 3,
  },

  // ===== 8. Incident Response (5 questions) =====
  {
    id: "ir_1",
    category: "Incident Response",
    question: "Is there a documented incident response plan?",
    likelihood: 4,
    impact: 5,
  },
  {
    id: "ir_2",
    category: "Incident Response",
    question: "Is a clear incident reporting process defined and communicated to all staff?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "ir_3",
    category: "Incident Response",
    question: "Are security incidents documented and tracked?",
    likelihood: 3,
    impact: 4,
  },
  {
    id: "ir_4",
    category: "Incident Response",
    question: "Are emergency contacts and escalation procedures defined?",
    likelihood: 3,
    impact: 4,
  },
  {
    id: "ir_5",
    category: "Incident Response",
    question: "Are incident response procedures tested through tabletop exercises?",
    likelihood: 3,
    impact: 4,
  },

  // ===== 9. Security Policies (5 questions) =====
  {
    id: "sp_1",
    category: "Security Policies",
    question: "Is there an acceptable use policy for organizational systems and data?",
    likelihood: 3,
    impact: 3,
  },
  {
    id: "sp_2",
    category: "Security Policies",
    question: "Is there a clear policy for remote work and use of personal devices (BYOD)?",
    likelihood: 3,
    impact: 4,
  },
  {
    id: "sp_3",
    category: "Security Policies",
    question: "Is there an employee/volunteer offboarding procedure that includes access revocation?",
    likelihood: 4,
    impact: 5,
  },
  {
    id: "sp_4",
    category: "Security Policies",
    question: "Are security policies reviewed and updated at least annually?",
    likelihood: 3,
    impact: 3,
  },
  {
    id: "sp_5",
    category: "Security Policies",
    question: "Have all employees acknowledged and signed the security policies?",
    likelihood: 3,
    impact: 3,
  },

  // ===== 10. Vulnerability Management (4 questions) =====
  {
    id: "vm_1",
    category: "Vulnerability Management",
    question: "Are vulnerability scans performed on organizational systems?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "vm_2",
    category: "Vulnerability Management",
    question: "Are identified vulnerabilities prioritized and remediated within defined timelines?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "vm_3",
    category: "Vulnerability Management",
    question: "Is there a process to track and apply security updates for all software?",
    likelihood: 4,
    impact: 4,
  },
  {
    id: "vm_4",
    category: "Vulnerability Management",
    question: "Are third-party applications and plugins monitored for security updates?",
    likelihood: 3,
    impact: 3,
  },
];

export function getQuestionsByCategory(category: string): AssessmentQuestion[] {
  return assessmentQuestions.filter((q) => q.category === category);
}

export function getQuestionById(id: string): AssessmentQuestion | undefined {
  return assessmentQuestions.find((q) => q.id === id);
}
