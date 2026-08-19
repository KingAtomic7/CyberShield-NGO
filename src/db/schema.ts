import { pgTable, uuid, varchar, integer, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["ngo_admin", "sys_admin"]);
export const assessmentStatusEnum = pgEnum("assessment_status", ["in_progress", "completed"]);
export const answerEnum = pgEnum("answer", ["fully_implemented", "partially_implemented", "not_implemented", "not_applicable"]);
export const riskLevelEnum = pgEnum("risk_level", ["low", "medium", "high", "critical"]);
export const priorityEnum = pgEnum("priority", ["immediate", "short_term", "medium_term", "long_term"]);
export const roadmapStatusEnum = pgEnum("roadmap_status", ["not_started", "in_progress", "completed"]);
export const roadmapPhaseEnum = pgEnum("roadmap_phase", ["first_30_days", "30_to_90_days", "3_to_6_months", "6_to_12_months"]);
export const incidentSeverityEnum = pgEnum("incident_severity", ["low", "medium", "high", "critical"]);
export const incidentStatusEnum = pgEnum("incident_status", ["identified", "containing", "eradicating", "recovering", "reviewing", "improved"]);
export const incidentTypeEnum = pgEnum("incident_type", ["phishing", "malware", "ransomware", "account_compromise", "data_leakage", "lost_device", "unauthorized_access", "other"]);
export const recStatusEnum = pgEnum("rec_status", ["pending", "in_progress", "completed", "deferred"]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: roleEnum("role").notNull().default("ngo_admin"),
  organizationId: uuid("organization_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Organizations table
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }),
  numEmployees: integer("num_employees").default(0),
  numVolunteers: integer("num_volunteers").default(0),
  numLocations: integer("num_locations").default(1),
  annualItBudget: integer("annual_it_budget").default(0),
  itStaffCount: integer("it_staff_count").default(0),
  usesCloudServices: boolean("uses_cloud_services").default(false),
  usesOnlineBanking: boolean("uses_online_banking").default(false),
  storesDonorData: boolean("stores_donor_data").default(false),
  storesBeneficiaryData: boolean("stores_beneficiary_data").default(false),
  storesEmployeeData: boolean("stores_employee_data").default(false),
  usesThirdPartyVendors: boolean("uses_third_party_vendors").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Assessments table
export const assessments = pgTable("assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  status: assessmentStatusEnum("status").notNull().default("in_progress"),
  overallScore: integer("overall_score").default(0),
  riskLevel: riskLevelEnum("risk_level").default("medium"),
  maturityLevel: integer("maturity_level").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Assessment answers table
export const assessmentAnswers = pgTable("assessment_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  assessmentId: uuid("assessment_id").notNull(),
  questionId: varchar("question_id", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  questionText: text("question_text").notNull(),
  answer: answerEnum("answer").notNull(),
  score: integer("score").default(0),
  likelihood: integer("likelihood").default(3),
  impact: integer("impact").default(3),
  riskScore: integer("risk_score").default(9),
  riskLevel: riskLevelEnum("risk_level").default("medium"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Risk results table (category-level aggregated)
export const riskResults = pgTable("risk_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  assessmentId: uuid("assessment_id").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  categoryScore: integer("category_score").default(0),
  riskScore: integer("risk_score").default(0),
  riskLevel: riskLevelEnum("risk_level").default("medium"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Recommendations table
export const recommendations = pgTable("recommendations", {
  id: uuid("id").primaryKey().defaultRandom(),
  assessmentId: uuid("assessment_id"),
  organizationId: uuid("organization_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }),
  priority: priorityEnum("priority").notNull().default("short_term"),
  costEstimate: varchar("cost_estimate", { length: 100 }),
  implementationTime: varchar("implementation_time", { length: 100 }),
  risk: riskLevelEnum("risk").default("medium"),
  businessImpact: integer("business_impact").default(3),
  implementationEffort: integer("implementation_effort").default(3),
  status: recStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Roadmap items table
export const roadmapItems = pgTable("roadmap_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  phase: roadmapPhaseEnum("phase").notNull(),
  category: varchar("category", { length: 100 }),
  status: roadmapStatusEnum("status").notNull().default("not_started"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Incidents table
export const incidents = pgTable("incidents", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  type: incidentTypeEnum("type").notNull(),
  incidentDate: varchar("incident_date", { length: 20 }).notNull(),
  severity: incidentSeverityEnum("severity").notNull(),
  description: text("description").notNull(),
  affectedSystem: varchar("affected_system", { length: 255 }),
  status: incidentStatusEnum("status").notNull().default("identified"),
  responseActions: text("response_actions"),
  lessonsLearned: text("lessons_learned"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Security policies table
export const securityPolicies = pgTable("security_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// KPIs table
export const kpis = pgTable("kpis", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  currentValue: integer("current_value").default(0),
  targetValue: integer("target_value").default(100),
  unit: varchar("unit", { length: 20 }).default("%"),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Audit log table
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
