import { pgTable, serial, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Portfolio settings table for theme and general configurations
export const portfolioSettings = pgTable("portfolio_settings", {
  id: serial("id").primaryKey(),
  primary: varchar("primary", { length: 50 }).notNull().default("#3b82f6"),
  variant: varchar("variant", { length: 50 }).notNull().default("professional"),
  appearance: varchar("appearance", { length: 20 }).notNull().default("system"),
  radius: integer("radius").notNull().default(8),
  siteTitle: varchar("site_title", { length: 100 }).notNull().default("Kamal Jeet - Software Developer"),
  logo: varchar("logo", { length: 255 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Skills table
export const skillsCategories = pgTable("skills_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  displayOrder: integer("display_order").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  level: integer("level").notNull(),
  categoryId: integer("category_id").notNull().references(() => skillsCategories.id, { onDelete: "cascade" }),
});

// Education table
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  degree: varchar("degree", { length: 150 }).notNull(),
  institution: varchar("institution", { length: 150 }).notNull(),
  location: varchar("location", { length: 100 }),
  period: varchar("period", { length: 50 }),
  description: text("description"),
  courses: json("courses").default([]),
  achievements: text("achievements"),
  displayOrder: integer("display_order").notNull().default(0),
});

// Experience table
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  company: varchar("company", { length: 150 }).notNull(),
  period: varchar("period", { length: 50 }),
  responsibilities: json("responsibilities").default([]),
  displayOrder: integer("display_order").notNull().default(0),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  period: varchar("period", { length: 50 }),
  description: text("description"),
  technologies: json("technologies").default([]),
  image: varchar("image", { length: 255 }),
  demoLink: varchar("demo_link", { length: 255 }),
  codeLink: varchar("code_link", { length: 255 }),
  displayOrder: integer("display_order").notNull().default(0),
});

// Open source contributions table
export const openSourceContributions = pgTable("open_source_contributions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  link: varchar("link", { length: 255 }),
  linkText: varchar("link_text", { length: 100 }),
  icon: varchar("icon", { length: 50 }),
  displayOrder: integer("display_order").notNull().default(0),
});

// About section content
export const aboutContent = pgTable("about_content", {
  id: serial("id").primaryKey(),
  journeyText: text("journey_text"),
  quote: text("quote"),
  expertiseItems: json("expertise_items").default([]),
  traits: json("traits").default([]),
});

// Contact information
export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 150 }),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 150 }),
  github: varchar("github", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  stackoverflow: varchar("stackoverflow", { length: 255 }),
});

// Define insert schemas for each table
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export const insertPortfolioSettingsSchema = createInsertSchema(portfolioSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertSkillsCategorySchema = createInsertSchema(skillsCategories).omit({
  id: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

export const insertEducationSchema = createInsertSchema(education).omit({
  id: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertOpenSourceContributionSchema = createInsertSchema(openSourceContributions).omit({
  id: true,
});

export const insertAboutContentSchema = createInsertSchema(aboutContent).omit({
  id: true,
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
});

// Export types for each schema
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPortfolioSettings = z.infer<typeof insertPortfolioSettingsSchema>;
export type PortfolioSettings = typeof portfolioSettings.$inferSelect;

export type InsertSkillsCategory = z.infer<typeof insertSkillsCategorySchema>;
export type SkillsCategory = typeof skillsCategories.$inferSelect;

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof education.$inferSelect;

export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertOpenSourceContribution = z.infer<typeof insertOpenSourceContributionSchema>;
export type OpenSourceContribution = typeof openSourceContributions.$inferSelect;

export type InsertAboutContent = z.infer<typeof insertAboutContentSchema>;
export type AboutContent = typeof aboutContent.$inferSelect;

export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;
