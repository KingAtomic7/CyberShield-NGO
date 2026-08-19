// CyberShield NGO - Default Roadmap Items and Security Policy Templates

export interface RoadmapItemDefault {
  title: string;
  description: string;
  phase: "first_30_days" | "30_to_90_days" | "3_to_6_months" | "6_to_12_months";
  category: string;
}

export const defaultRoadmapItems: RoadmapItemDefault[] = [
  // FIRST 30 DAYS
  { title: "Enable MFA on all critical accounts", description: "Enable multi-factor authentication for email, cloud storage, financial, and admin accounts", phase: "first_30_days", category: "Identity & Access Management" },
  { title: "Strengthen password policies", description: "Enforce minimum 12-character passwords with complexity requirements", phase: "first_30_days", category: "Identity & Access Management" },
  { title: "Enable automatic OS updates", description: "Configure automatic updates for Windows, macOS, and all critical applications", phase: "first_30_days", category: "Endpoint Security" },
  { title: "Verify and test backups", description: "Verify existing backups are working and perform test restoration", phase: "first_30_days", category: "Backup & Disaster Recovery" },
  { title: "Install/update endpoint protection", description: "Ensure antivirus/anti-malware is installed and up-to-date on all devices", phase: "first_30_days", category: "Endpoint Security" },
  { title: "Change default passwords", description: "Change all default passwords on routers, switches, and network devices", phase: "first_30_days", category: "Network Security" },
  { title: "Conduct basic security awareness training", description: "Deliver cybersecurity awareness session to all employees and volunteers", phase: "first_30_days", category: "Employee Security Awareness" },
  { title: "Secure Wi-Fi configuration", description: "Ensure WPA2/WPA3 is enabled and guest Wi-Fi is separated", phase: "first_30_days", category: "Network Security" },

  // 30-90 DAYS
  { title: "Develop security policies", description: "Create acceptable use, password, and data protection policies", phase: "30_to_90_days", category: "Security Policies" },
  { title: "Implement data classification", description: "Classify data into Public, Internal, Confidential, and Restricted categories", phase: "30_to_90_days", category: "Data Protection" },
  { title: "Conduct access reviews", description: "Review all user permissions and remove excessive access", phase: "30_to_90_days", category: "Identity & Access Management" },
  { title: "Improve email security", description: "Configure SPF, DKIM, DMARC records and enhance spam filtering", phase: "30_to_90_days", category: "Email Security" },
  { title: "Test backup restoration", description: "Perform and document quarterly backup restoration tests", phase: "30_to_90_days", category: "Backup & Disaster Recovery" },
  { title: "Create incident response plan", description: "Develop and document a basic incident response plan", phase: "30_to_90_days", category: "Incident Response" },
  { title: "Enable full-disk encryption", description: "Enable BitLocker/FileVault on all laptops and portable devices", phase: "30_to_90_days", category: "Endpoint Security" },
  { title: "Deploy password manager", description: "Provide and configure a password manager for all staff", phase: "30_to_90_days", category: "Identity & Access Management" },

  // 3-6 MONTHS
  { title: "Implement vulnerability scanning", description: "Set up regular vulnerability scans using free tools (OpenVAS, Nessus Essentials)", phase: "3_to_6_months", category: "Vulnerability Management" },
  { title: "Deploy centralized logging", description: "Implement centralized log collection and basic monitoring", phase: "3_to_6_months", category: "Network Security" },
  { title: "Conduct phishing simulations", description: "Run regular phishing simulation exercises to test employee awareness", phase: "3_to_6_months", category: "Employee Security Awareness" },
  { title: "Perform security assessment", description: "Conduct internal security assessment or arrange for external review", phase: "3_to_6_months", category: "Vulnerability Management" },
  { title: "Develop business continuity plan", description: "Create a business continuity and disaster recovery plan", phase: "3_to_6_months", category: "Backup & Disaster Recovery" },
  { title: "Implement VPN for remote access", description: "Set up VPN for all remote access to organizational resources", phase: "3_to_6_months", category: "Network Security" },

  // 6-12 MONTHS
  { title: "Advanced endpoint monitoring", description: "Evaluate and deploy EDR or advanced endpoint monitoring solutions", phase: "6_to_12_months", category: "Endpoint Security" },
  { title: "External security assessment", description: "Engage a third party for an independent security assessment", phase: "6_to_12_months", category: "Vulnerability Management" },
  { title: "Penetration testing", description: "Conduct penetration testing on external-facing systems where appropriate", phase: "6_to_12_months", category: "Vulnerability Management" },
  { title: "Continuous improvement program", description: "Establish ongoing security metrics, review cycle, and improvement process", phase: "6_to_12_months", category: "Security Policies" },
  { title: "Security automation", description: "Automate routine security tasks (patching, monitoring, alerting)", phase: "6_to_12_months", category: "Vulnerability Management" },
];

// Security Policy Templates
export interface SecurityPolicyTemplate {
  title: string;
  description: string;
  category: string;
  content: string;
}

export const policyTemplates: SecurityPolicyTemplate[] = [
  {
    title: "Password Policy",
    description: "Defines requirements for password creation, management, and protection across all organizational systems.",
    category: "Identity & Access Management",
    content: `PASSWORD POLICY

1. PURPOSE
This policy establishes minimum requirements for password creation, management, and protection to safeguard organizational systems and data.

2. SCOPE
This policy applies to all employees, volunteers, contractors, and any individual with access to organizational systems.

3. POLICY REQUIREMENTS

3.1 Password Complexity
- Minimum length: 12 characters
- Must contain at least one uppercase letter (A-Z)
- Must contain at least one lowercase letter (a-z)
- Must contain at least one digit (0-9)
- Must contain at least one special character (!@#$%^&*)
- Must not contain the user's name, username, or organization name

3.2 Password Management
- Passwords must be unique for each account (no reuse)
- Passwords must be changed at least every 90 days
- Previous 12 passwords cannot be reused
- Passwords must not be shared with anyone, including IT staff
- Passwords must not be written down in plain text or stored in unprotected documents

3.3 Password Storage
- A password manager must be used for storing all passwords
- The password manager itself must be protected with a strong master password and MFA
- Passwords must never be stored in email, chat, or unencrypted files

3.4 Multi-Factor Authentication
- MFA is required for all critical accounts (email, cloud, financial, admin)
- Authenticator apps are preferred over SMS for MFA
- MFA recovery codes must be stored securely

3.5 Account Lockout
- Accounts will be locked after 5 failed login attempts
- Lockout duration: 30 minutes
- IT must be notified of repeated lockout events

3.6 Default Passwords
- All default passwords must be changed upon initial system setup
- No system may use default or well-known passwords

4. ENFORCEMENT
Violations of this policy may result in disciplinary action and access revocation.

5. REVIEW
This policy will be reviewed annually and updated as needed.

Document Version: 1.0
Last Reviewed: [Date]
Next Review: [Date + 1 year]`,
  },
  {
    title: "MFA Policy",
    description: "Defines requirements for multi-factor authentication across all organizational accounts and systems.",
    category: "Identity & Access Management",
    content: `MULTI-FACTOR AUTHENTICATION (MFA) POLICY

1. PURPOSE
This policy mandates the use of multi-factor authentication to protect against unauthorized access due to compromised passwords.

2. SCOPE
Applies to all users with access to organizational systems, applications, and data.

3. MFA REQUIREMENTS

3.1 Mandatory MFA Accounts
- All email accounts
- All cloud storage and application accounts
- All financial and banking accounts
- All administrator and privileged accounts
- VPN and remote access systems
- Any system containing sensitive data

3.2 Approved MFA Methods (in order of preference)
1. Hardware security keys (YubiKey, etc.) - STRONGLY RECOMMENDED
2. Authenticator applications (Google Authenticator, Microsoft Authenticator, Authy) - RECOMMENDED
3. SMS-based MFA - ACCEPTABLE (less secure, use only where other methods unavailable)
4. Email-based verification - NOT ACCEPTABLE as sole second factor

3.3 MFA Enrollment
- All new accounts must have MFA enabled before access is granted
- Existing accounts must have MFA enabled within 7 days of policy adoption
- MFA setup assistance is available from IT support

3.4 MFA Recovery
- Backup/recovery codes must be generated during MFA setup
- Recovery codes must be stored securely (printed and locked, or in password manager)
- Lost MFA devices must be reported to IT immediately
- IT may temporarily bypass MFA with management approval and identity verification

4. ENFORCEMENT
Accounts without MFA enabled will have access restricted until MFA is configured.

5. REVIEW
This policy will be reviewed annually.

Document Version: 1.0`,
  },
  {
    title: "Acceptable Use Policy",
    description: "Defines acceptable and unacceptable use of organizational technology resources, systems, and data.",
    category: "Security Policies",
    content: `ACCEPTABLE USE POLICY

1. PURPOSE
This policy defines acceptable use of organizational technology resources to protect systems, data, and the organization's reputation.

2. SCOPE
All employees, volunteers, contractors, and partners with access to organizational resources.

3. ACCEPTABLE USE

3.1 General Principles
- Use organizational resources primarily for organizational purposes
- Respect the privacy and data of donors, beneficiaries, and colleagues
- Report any suspected security incidents immediately
- Follow all related security policies and procedures

3.2 Email and Communications
- Do not open suspicious emails or click unknown links
- Do not send sensitive data via unencrypted email
- Use organizational email for organizational business
- Do not auto-forward organizational email to personal accounts

3.3 Internet Use
- Access to illegal, inappropriate, or malicious websites is prohibited
- Downloading unauthorized software is prohibited
- Streaming non-work-related media is discouraged during work hours

3.4 Device Use
- Keep devices physically secure at all times
- Lock devices when unattended (Win+L, or Ctrl+Cmd+Q on Mac)
- Do not lend organizational devices to others
- Report lost or stolen devices immediately

3.5 Data Handling
- Do not copy organizational data to personal devices or cloud storage
- Do not share organizational data with unauthorized parties
- Follow data classification and handling procedures
- Securely delete data when no longer needed

4. PROHIBITED ACTIVITIES
- Attempting to bypass security controls
- Accessing systems or data without authorization
- Installing unapproved software or hardware
- Sharing login credentials
- Using organizational resources for personal business ventures
- Deliberately introducing malware or malicious code

5. PERSONAL DEVICES (BYOD)
- Personal devices used for work must have current OS updates
- MFA must be enabled on all work accounts accessed from personal devices
- Organizational data on personal devices must be encrypted
- IT may require security software on personal devices used for work

6. ENFORCEMENT
Violations may result in access revocation and/or disciplinary action.

Document Version: 1.0`,
  },
  {
    title: "Data Protection Policy",
    description: "Defines how organizational data is classified, handled, stored, and protected throughout its lifecycle.",
    category: "Data Protection",
    content: `DATA PROTECTION POLICY

1. PURPOSE
This policy establishes requirements for protecting organizational data, particularly sensitive donor, beneficiary, employee, and financial information.

2. DATA CLASSIFICATION
- PUBLIC: Information that can be freely shared (marketing materials, public reports)
- INTERNAL: General business information not intended for public release
- CONFIDENTIAL: Sensitive business data (financial details, HR records, donor lists)
- RESTRICTED: Highly sensitive data (beneficiary personal data, banking credentials, medical info)

3. HANDLING REQUIREMENTS

3.1 PUBLIC Data
- No special handling required beyond accuracy

3.2 INTERNAL Data
- Share only within the organization
- Do not post publicly without approval

3.3 CONFIDENTIAL Data
- Encrypt in transit and at rest
- Access on need-to-know basis only
- Do not store on personal devices without encryption
- Log access and modifications

3.4 RESTRICTED Data
- Mandatory encryption at rest and in transit
- Strict need-to-know access with MFA
- Regular access reviews (monthly)
- Detailed access logging and monitoring
- Must not be stored on personal devices

4. DATA LIFECYCLE

4.1 Collection
- Collect only data that is necessary for stated purpose
- Inform individuals of data collection and purpose
- Obtain consent where required

4.2 Storage
- Store data in approved organizational systems only
- Encrypt sensitive data
- Maintain backups per backup policy
- Document data locations

4.3 Sharing
- Share only with authorized parties
- Use secure transfer methods (encrypted email, secure portals)
- Data sharing agreements required for third parties
- Log all data sharing activities

4.4 Retention and Disposal
- Retain data only as long as necessary
- Follow retention schedule
- Securely delete/destroy data when no longer needed
- Document disposal

5. INCIDENT RESPONSE
Any suspected data breach must be reported immediately per the Incident Response Plan.

Document Version: 1.0`,
  },
  {
    title: "Backup Policy",
    description: "Defines requirements for data backup, testing, and disaster recovery to ensure organizational data resilience.",
    category: "Backup & Disaster Recovery",
    content: `BACKUP AND DISASTER RECOVERY POLICY

1. PURPOSE
This policy ensures organizational data is protected against loss through regular, tested backups and documented recovery procedures.

2. BACKUP STRATEGY - 3-2-1 RULE
- 3 copies of all important data (production + 2 backups)
- 2 different storage media (e.g., local disk + cloud)
- 1 copy off-site/cloud

3. BACKUP REQUIREMENTS

3.1 What to Back Up
- All databases and critical application data
- Email and communication records
- Document repositories and file shares
- System configurations
- Donor and beneficiary databases (highest priority)

3.2 Backup Frequency
- Critical data: Daily (automated)
- Important data: Daily or weekly
- System configurations: After changes and weekly
- Full system images: Monthly

3.3 Backup Security
- All backups must be encrypted (AES-256 or equivalent)
- Backup encryption keys must be stored separately from backups
- Access to backup systems must require MFA
- Backup locations must be documented and secured

3.4 Testing
- Backup restoration must be tested quarterly
- Test results must be documented
- Recovery Time Objective (RTO) and Recovery Point Objective (RPO) must be defined
- Full disaster recovery test annually

3.5 Monitoring
- Backup success/failure must be monitored
- Failed backups must trigger immediate alert and remediation
- Backup storage capacity must be monitored

4. DISASTER RECOVERY
- Document recovery procedures for all critical systems
- Define RTO and RPO for each system
- Identify alternative processing capabilities
- Test recovery procedures at least annually

5. RETENTION
- Daily backups retained for 30 days
- Weekly backups retained for 3 months
- Monthly backups retained for 12 months
- Annual backups retained per data retention policy

Document Version: 1.0`,
  },
  {
    title: "Incident Reporting Policy",
    description: "Defines procedures for identifying, reporting, and responding to cybersecurity incidents.",
    category: "Incident Response",
    content: `INCIDENT REPORTING AND RESPONSE POLICY

1. PURPOSE
This policy establishes procedures for identifying, reporting, and responding to cybersecurity incidents to minimize impact and prevent recurrence.

2. INCIDENT DEFINITION
A security incident is any event that potentially compromises the confidentiality, integrity, or availability of organizational data or systems.

3. EXAMPLES OF INCIDENTS
- Phishing emails (especially if credentials were entered)
- Malware or ransomware infection
- Unauthorized access to systems or data
- Lost or stolen devices containing organizational data
- Data leakage or accidental disclosure
- Website defacement or service disruption
- Suspicious account activity

4. REPORTING

4.1 Who Should Report
- ALL employees, volunteers, and contractors must report suspected incidents
- There is NO penalty for reporting potential incidents in good faith
- Early reporting significantly reduces potential damage

4.2 How to Report
- Email: security@[organization].org
- Phone: [IT Security Contact Number]
- In person: Report to IT or management immediately
- Use the CyberShield incident reporting form

4.3 When to Report
- IMMEDIATELY upon suspecting an incident
- Do not attempt to investigate or remediate alone
- Do not power off affected devices (may destroy evidence)

5. INCIDENT RESPONSE LIFECYCLE
1. IDENTIFY - Detect and confirm the incident
2. CONTAIN - Limit the scope and impact
3. ERADICATE - Remove the cause of the incident
4. RECOVER - Restore normal operations
5. REVIEW - Analyze what happened
6. IMPROVE - Implement changes to prevent recurrence

6. SEVERITY LEVELS
- CRITICAL: Active data breach, ransomware, total system compromise
- HIGH: Compromised accounts, malware detected, significant data exposure
- MEDIUM: Phishing attempt, policy violation, minor system issue
- LOW: Suspicious email (not clicked), minor policy deviation

7. COMMUNICATION
- Notify affected parties within 24 hours for data breaches
- Follow legal and regulatory notification requirements
- Use pre-approved communication templates
- Do not discuss incident details on social media or with press

Document Version: 1.0`,
  },
  {
    title: "Employee Offboarding Policy",
    description: "Defines security procedures for employee and volunteer departure to ensure complete access revocation.",
    category: "Security Policies",
    content: `EMPLOYEE/VOLUNTEER OFFBOARDING POLICY

1. PURPOSE
This policy ensures that all access to organizational systems and data is properly revoked when an individual leaves the organization.

2. SCOPE
Applies to all departing employees, volunteers, contractors, and partners.

3. TIMELINE
All access revocation must be completed within 24 hours of departure notification.

4. OFFBOARDING CHECKLIST

4.1 Access Revocation
- [ ] Disable all user accounts (email, applications, cloud services)
- [ ] Revoke VPN access
- [ ] Remove from all distribution lists and shared folders
- [ ] Revoke API keys and service account access
- [ ] Change shared passwords that the individual had access to
- [ ] Review and remove any SSH keys or certificate-based access

4.2 Device Recovery
- [ ] Collect all organizational devices (laptop, phone, tablet)
- [ ] Collect physical keys and access cards
- [ ] Verify all devices are returned
- [ ] Wipe organizational data from any personal devices

4.3 Data and Knowledge Transfer
- [ ] Ensure work is handed over to designated successor
- [ ] Transfer ownership of critical documents and files
- [ ] Document any unique knowledge or access requirements
- [ ] Update emergency contact lists

4.4 Administrative
- [ ] Process final payroll/payments
- [ ] Collect signed acknowledgment of continuing confidentiality obligations
- [ ] Remove from organizational directories and websites
- [ ] Archive user records per retention policy

5. VOLUNTEERS
- Volunteer offboarding follows the same access revocation procedures
- Pay special attention to volunteer access as they may have been granted access informally
- Audit all systems for any volunteer accounts that may have been overlooked

6. EMERGENCY DEPARTURES
- If departure is involuntary or concerning, immediately disable all access BEFORE exit interview
- Change all administrative passwords the individual had access to
- Review access logs for unusual activity in the prior 30 days

Document Version: 1.0`,
  },
  {
    title: "Remote Work Security Policy",
    description: "Defines security requirements for remote work and use of personal devices to access organizational resources.",
    category: "Security Policies",
    content: `REMOTE WORK SECURITY POLICY

1. PURPOSE
This policy establishes security requirements for employees and volunteers working remotely or using personal devices to access organizational resources.

2. SCOPE
All personnel who work remotely or access organizational systems from outside the office.

3. REMOTE WORK REQUIREMENTS

3.1 Network Security
- Use VPN when accessing organizational resources remotely
- Do not use public Wi-Fi without VPN
- Ensure home Wi-Fi uses WPA2/WPA3 with a strong passphrase
- Do not allow others to use devices that are logged into organizational systems

3.2 Device Security
- Keep operating system and applications updated
- Enable automatic updates where possible
- Use endpoint protection/antivirus (must be current)
- Enable full-disk encryption on laptops
- Enable screen lock (auto-lock after 5 minutes of inactivity)
- Do not let family members use work devices

3.3 Data Protection
- Do not store sensitive data on personal devices without encryption
- Use organizational cloud storage rather than local storage
- Securely delete any organizational data on personal devices when no longer needed
- Do not print sensitive documents at home unless you can securely dispose of them

3.4 Physical Security
- Work in a private area where screens cannot be overlooked
- Lock devices when stepping away
- Do not leave devices unattended in vehicles or public places
- Securely store any printed organizational documents

4. PERSONAL DEVICE (BYOD) REQUIREMENTS

4.1 Minimum Security Requirements
- Current operating system with security updates applied
- Antivirus/endpoint protection installed and active
- Full-disk encryption enabled
- Device lock enabled (PIN, password, or biometric)
- MFA enabled on all organizational accounts

4.2 Allowed Activities
- Accessing organizational email and calendar
- Using organizational cloud applications
- Video conferencing for organizational meetings
- Accessing organizational VPN

4.3 Prohibited Activities
- Storing unencrypted organizational data locally
- Using personal devices for restricted data without explicit approval
- Installing unauthorized organizational applications

5. INCIDENT RESPONSE
If a personal device used for work is lost, stolen, or compromised:
- Report immediately to IT/security
- Do not attempt to recover the device yourself if stolen
- IT may initiate remote wipe of organizational data

Document Version: 1.0`,
  },
];

// Default KPIs
export interface KPIDefault {
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: string;
}

export const defaultKPIs: KPIDefault[] = [
  { name: "MFA Coverage", currentValue: 0, targetValue: 100, unit: "%", category: "Identity & Access Management" },
  { name: "Patch Compliance", currentValue: 0, targetValue: 95, unit: "%", category: "Vulnerability Management" },
  { name: "Backup Success Rate", currentValue: 0, targetValue: 100, unit: "%", category: "Backup & Disaster Recovery" },
  { name: "Employee Training Completion", currentValue: 0, targetValue: 100, unit: "%", category: "Employee Security Awareness" },
  { name: "Phishing Click Rate", currentValue: 100, targetValue: 3, unit: "%", category: "Employee Security Awareness" },
  { name: "Critical Vulnerabilities", currentValue: 0, targetValue: 0, unit: "count", category: "Vulnerability Management" },
  { name: "Open Security Gaps", currentValue: 0, targetValue: 0, unit: "count", category: "Security Policies" },
  { name: "Completed Recommendations", currentValue: 0, targetValue: 100, unit: "%", category: "Security Policies" },
];

// Cost estimation categories
export interface CostCategory {
  name: string;
  estimatedInitialCost: number;
  estimatedAnnualCost: number;
  description: string;
}

export const defaultCostCategories: CostCategory[] = [
  { name: "Identity & MFA", estimatedInitialCost: 5000, estimatedAnnualCost: 12000, description: "MFA solution, password manager, access management tools" },
  { name: "Endpoint Security", estimatedInitialCost: 3000, estimatedAnnualCost: 25000, description: "Antivirus/EDR, device encryption, device management" },
  { name: "Backup Solutions", estimatedInitialCost: 5000, estimatedAnnualCost: 18000, description: "Backup software, cloud storage, testing tools" },
  { name: "Password Manager", estimatedInitialCost: 2000, estimatedAnnualCost: 6000, description: "Organization-wide password manager licenses" },
  { name: "Security Awareness", estimatedInitialCost: 3000, estimatedAnnualCost: 12000, description: "Training platform, phishing simulations, materials" },
  { name: "Security Assessment", estimatedInitialCost: 25000, estimatedAnnualCost: 15000, description: "External assessment, vulnerability scanning tools" },
  { name: "Incident Response", estimatedInitialCost: 5000, estimatedAnnualCost: 5000, description: "IR plan development, testing, tools" },
  { name: "Network Monitoring", estimatedInitialCost: 10000, estimatedAnnualCost: 18000, description: "Firewall, VPN, monitoring, logging" },
  { name: "Contingency (15%)", estimatedInitialCost: 9000, estimatedAnnualCost: 12000, description: "Buffer for unexpected costs and emerging needs" },
];
