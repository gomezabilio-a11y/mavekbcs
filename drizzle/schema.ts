import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
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
