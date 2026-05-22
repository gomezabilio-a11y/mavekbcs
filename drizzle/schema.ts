import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
  decimal,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Client contracts for the portal
export const clientContracts = mysqlTable("client_contracts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientName: varchar("clientName", { length: 256 }),
  contractStatus: mysqlEnum("contractStatus", [
    "active",
    "pending",
    "completed",
    "on_hold",
    "expired",
  ])
    .default("active")
    .notNull(),
  remainingHours: int("remainingHours").default(0).notNull(),
  totalHours: int("totalHours").default(0).notNull(),
  contractStartDate: timestamp("contractStartDate"),
  contractEndDate: timestamp("contractEndDate"),
  projectDescription: text("projectDescription"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientContract = typeof clientContracts.$inferSelect;
export type InsertClientContract = typeof clientContracts.$inferInsert;

// ── Portal: Closed-membership customer accounts ──────────────────────────────
// These are separate from Manus OAuth users — admin-created portal accounts
export const portalUsers = mysqlTable("portal_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 128 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 256 }).notNull(),
  companyName: varchar("companyName", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }),
  language: mysqlEnum("language", ["en", "ko", "ja"]).default("en").notNull(),
  timezone: varchar("timezone", { length: 64 }).default("UTC").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortalUser = typeof portalUsers.$inferSelect;
export type InsertPortalUser = typeof portalUsers.$inferInsert;

// ── Portal: Contracts (hours tracking per customer) ──────────────────────────
export const portalContracts = mysqlTable("portal_contracts", {
  id: int("id").autoincrement().primaryKey(),
  portalUserId: int("portalUserId").notNull(),
  totalHours: decimal("totalHours", { precision: 8, scale: 2 }).default("0").notNull(),
  usedHours: decimal("usedHours", { precision: 8, scale: 2 }).default("0").notNull(),
  // remainingHours is computed: totalHours - usedHours (done in app layer)
  contractStartDate: timestamp("contractStartDate"),
  contractEndDate: timestamp("contractEndDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortalContract = typeof portalContracts.$inferSelect;
export type InsertPortalContract = typeof portalContracts.$inferInsert;

// ── Portal: Support Tickets ───────────────────────────────────────────────────
export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  ticketNumber: varchar("ticketNumber", { length: 32 }).notNull().unique(),
  portalUserId: int("portalUserId").notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  description: text("description").notNull(),
  screenshotUrl: varchar("screenshotUrl", { length: 1024 }),  // S3 key/url (legacy, first screenshot)
  screenshotKey: varchar("screenshotKey", { length: 512 }),
  screenshotUrls: text("screenshotUrls"),  // JSON array of {url, key} objects for multiple screenshots
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"])
    .default("open")
    .notNull(),
  adminFeedback: text("adminFeedback"),
  adminScreenshotUrls: text("adminScreenshotUrls"),  // JSON array of {url, key} objects uploaded by admin
  spentHours: decimal("spentHours", { precision: 6, scale: 2 }),  // set by admin on resolve
  hoursDeducted: boolean("hoursDeducted").default(false).notNull(),
  createdAtUtc: timestamp("createdAtUtc").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

// ── Portal: Admin Users (standalone, no Manus OAuth) ─────────────────────────
export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 128 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 256 }).notNull(),
  displayName: varchar("displayName", { length: 256 }).notNull(),
  role: mysqlEnum("role", ["master", "staff"]).default("staff").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

// Industries
export const industries = mysqlTable("industries", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  nameKo: varchar("nameKo", { length: 256 }),
  nameJa: varchar("nameJa", { length: 256 }),
  description: text("description"),
  descriptionKo: text("descriptionKo"),
  descriptionJa: text("descriptionJa"),
  heroContent: text("heroContent"),
  heroContentKo: text("heroContentKo"),
  heroContentJa: text("heroContentJa"),
  imageUrl: varchar("imageUrl", { length: 512 }),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Industry = typeof industries.$inferSelect;

// Solution categories
export const solutionCategories = mysqlTable("solution_categories", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  nameKo: varchar("nameKo", { length: 256 }),
  nameJa: varchar("nameJa", { length: 256 }),
  description: text("description"),
  descriptionKo: text("descriptionKo"),
  descriptionJa: text("descriptionJa"),
  iconName: varchar("iconName", { length: 64 }),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SolutionCategory = typeof solutionCategories.$inferSelect;

// Solutions
export const solutions = mysqlTable("solutions", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  nameKo: varchar("nameKo", { length: 256 }),
  nameJa: varchar("nameJa", { length: 256 }),
  shortDescription: text("shortDescription"),
  shortDescriptionKo: text("shortDescriptionKo"),
  shortDescriptionJa: text("shortDescriptionJa"),
  fullDescription: text("fullDescription"),
  fullDescriptionKo: text("fullDescriptionKo"),
  fullDescriptionJa: text("fullDescriptionJa"),
  keyFeatures: json("keyFeatures"),
  keyFeaturesKo: json("keyFeaturesKo"),
  keyFeaturesJa: json("keyFeaturesJa"),
  benefits: json("benefits"),
  benefitsKo: json("benefitsKo"),
  benefitsJa: json("benefitsJa"),
  youtubeVideoId: varchar("youtubeVideoId", { length: 64 }),
  imageUrl: varchar("imageUrl", { length: 512 }),
  vendor: varchar("vendor", { length: 64 }),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Solution = typeof solutions.$inferSelect;

// Insights / Blog articles
export const insights = mysqlTable("insights", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  title: varchar("title", { length: 512 }).notNull(),
  titleKo: varchar("titleKo", { length: 512 }),
  titleJa: varchar("titleJa", { length: 512 }),
  excerpt: text("excerpt"),
  excerptKo: text("excerptKo"),
  excerptJa: text("excerptJa"),
  content: text("content"),
  contentKo: text("contentKo"),
  contentJa: text("contentJa"),
  category: varchar("category", { length: 128 }),
  tags: json("tags"),
  relatedIndustries: json("relatedIndustries"),
  relatedSolutions: json("relatedSolutions"),
  imageUrl: varchar("imageUrl", { length: 512 }),
  readTimeMinutes: int("readTimeMinutes").default(5),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Insight = typeof insights.$inferSelect;
