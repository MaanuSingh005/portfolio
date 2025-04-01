import { 
  users, type User, type InsertUser,
  portfolioSettings, type PortfolioSettings, type InsertPortfolioSettings,
  skillsCategories, type SkillsCategory, type InsertSkillsCategory,
  skills, type Skill, type InsertSkill,
  education, type Education, type InsertEducation,
  experiences, type Experience, type InsertExperience,
  projects, type Project, type InsertProject,
  openSourceContributions, type OpenSourceContribution, type InsertOpenSourceContribution,
  aboutContent, type AboutContent, type InsertAboutContent,
  contactInfo, type ContactInfo, type InsertContactInfo
} from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, desc } from "drizzle-orm";
import postgres from "postgres";
import bcrypt from "bcryptjs";

// Define the storage interface
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | null>;
  
  // Portfolio settings
  getPortfolioSettings(): Promise<PortfolioSettings | undefined>;
  updatePortfolioSettings(settings: InsertPortfolioSettings): Promise<PortfolioSettings>;
  
  // Skills management
  getSkillCategories(): Promise<SkillsCategory[]>;
  getSkillCategory(id: number): Promise<SkillsCategory | undefined>;
  createSkillCategory(category: InsertSkillsCategory): Promise<SkillsCategory>;
  updateSkillCategory(id: number, category: Partial<InsertSkillsCategory>): Promise<SkillsCategory | undefined>;
  deleteSkillCategory(id: number): Promise<boolean>;
  
  getSkills(categoryId?: number): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;
  
  // Education
  getEducationItems(): Promise<Education[]>;
  getEducationItem(id: number): Promise<Education | undefined>;
  createEducationItem(educationItem: InsertEducation): Promise<Education>;
  updateEducationItem(id: number, educationItem: Partial<InsertEducation>): Promise<Education | undefined>;
  deleteEducationItem(id: number): Promise<boolean>;
  
  // Experience
  getExperienceItems(): Promise<Experience[]>;
  getExperienceItem(id: number): Promise<Experience | undefined>;
  createExperienceItem(experienceItem: InsertExperience): Promise<Experience>;
  updateExperienceItem(id: number, experienceItem: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperienceItem(id: number): Promise<boolean>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Open Source Contributions
  getOpenSourceContributions(): Promise<OpenSourceContribution[]>;
  getOpenSourceContribution(id: number): Promise<OpenSourceContribution | undefined>;
  createOpenSourceContribution(contribution: InsertOpenSourceContribution): Promise<OpenSourceContribution>;
  updateOpenSourceContribution(id: number, contribution: Partial<InsertOpenSourceContribution>): Promise<OpenSourceContribution | undefined>;
  deleteOpenSourceContribution(id: number): Promise<boolean>;
  
  // About content
  getAboutContent(): Promise<AboutContent | undefined>;
  updateAboutContent(content: InsertAboutContent): Promise<AboutContent>;
  
  // Contact information
  getContactInfo(): Promise<ContactInfo | undefined>;
  updateContactInfo(info: InsertContactInfo): Promise<ContactInfo>;
  
  // Database initialization
  initializeDatabase(): Promise<void>;
}

// In-memory storage implementation (for development/testing)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private portfolioSettingsData: Map<number, PortfolioSettings>;
  private skillCategoriesData: Map<number, SkillsCategory>;
  private skillsData: Map<number, Skill>;
  private educationData: Map<number, Education>;
  private experienceData: Map<number, Experience>;
  private projectsData: Map<number, Project>;
  private openSourceData: Map<number, OpenSourceContribution>;
  private aboutContentData: Map<number, AboutContent>;
  private contactInfoData: Map<number, ContactInfo>;
  
  private currentId: {
    users: number;
    portfolioSettings: number;
    skillCategories: number;
    skills: number;
    education: number;
    experience: number;
    projects: number;
    openSource: number;
    aboutContent: number;
    contactInfo: number;
  };

  constructor() {
    this.users = new Map();
    this.portfolioSettingsData = new Map();
    this.skillCategoriesData = new Map();
    this.skillsData = new Map();
    this.educationData = new Map();
    this.experienceData = new Map();
    this.projectsData = new Map();
    this.openSourceData = new Map();
    this.aboutContentData = new Map();
    this.contactInfoData = new Map();
    
    this.currentId = {
      users: 1,
      portfolioSettings: 1,
      skillCategories: 1,
      skills: 1,
      education: 1,
      experience: 1,
      projects: 1,
      openSource: 1,
      aboutContent: 1,
      contactInfo: 1
    };
  }

  // User management methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      isAdmin: insertUser.isAdmin ?? false
    };
    this.users.set(id, user);
    return user;
  }
  
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    // Simple password comparison for memory storage
    return user.password === password ? user : null;
  }
  
  // Portfolio settings methods
  async getPortfolioSettings(): Promise<PortfolioSettings | undefined> {
    // Return the first settings object or undefined
    return Array.from(this.portfolioSettingsData.values())[0];
  }
  
  async updatePortfolioSettings(settings: InsertPortfolioSettings): Promise<PortfolioSettings> {
    const existingSettings = await this.getPortfolioSettings();
    
    if (existingSettings) {
      const updatedSettings: PortfolioSettings = {
        ...existingSettings,
        ...settings,
        updatedAt: new Date()
      };
      this.portfolioSettingsData.set(existingSettings.id, updatedSettings);
      return updatedSettings;
    } else {
      const id = this.currentId.portfolioSettings++;
      const newSettings: PortfolioSettings = {
        primary: settings.primary ?? "#3b82f6",
        variant: settings.variant ?? "professional",
        appearance: settings.appearance ?? "system",
        radius: settings.radius ?? 8,
        siteTitle: settings.siteTitle ?? "Kamal Jeet - Software Developer",
        logo: settings.logo ?? null,
        id,
        updatedAt: new Date()
      };
      this.portfolioSettingsData.set(id, newSettings);
      return newSettings;
    }
  }
  
  // Skills management methods
  async getSkillCategories(): Promise<SkillsCategory[]> {
    return Array.from(this.skillCategoriesData.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getSkillCategory(id: number): Promise<SkillsCategory | undefined> {
    return this.skillCategoriesData.get(id);
  }
  
  async createSkillCategory(category: InsertSkillsCategory): Promise<SkillsCategory> {
    const id = this.currentId.skillCategories++;
    const newCategory: SkillsCategory = {
      name: category.name,
      icon: category.icon,
      displayOrder: category.displayOrder ?? 0,
      id
    };
    this.skillCategoriesData.set(id, newCategory);
    return newCategory;
  }
  
  async updateSkillCategory(
    id: number, 
    category: Partial<InsertSkillsCategory>
  ): Promise<SkillsCategory | undefined> {
    const existingCategory = this.skillCategoriesData.get(id);
    if (!existingCategory) return undefined;
    
    const updatedCategory: SkillsCategory = {
      ...existingCategory,
      ...category
    };
    this.skillCategoriesData.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteSkillCategory(id: number): Promise<boolean> {
    const deleted = this.skillCategoriesData.delete(id);
    
    // Delete associated skills
    if (deleted) {
      Array.from(this.skillsData.entries())
        .filter(([, skill]) => skill.categoryId === id)
        .forEach(([skillId]) => this.skillsData.delete(skillId));
    }
    
    return deleted;
  }
  
  async getSkills(categoryId?: number): Promise<Skill[]> {
    const allSkills = Array.from(this.skillsData.values());
    return categoryId 
      ? allSkills.filter(skill => skill.categoryId === categoryId)
      : allSkills;
  }
  
  async getSkill(id: number): Promise<Skill | undefined> {
    return this.skillsData.get(id);
  }
  
  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = this.currentId.skills++;
    const newSkill: Skill = {
      ...skill,
      id
    };
    this.skillsData.set(id, newSkill);
    return newSkill;
  }
  
  async updateSkill(
    id: number, 
    skill: Partial<InsertSkill>
  ): Promise<Skill | undefined> {
    const existingSkill = this.skillsData.get(id);
    if (!existingSkill) return undefined;
    
    const updatedSkill: Skill = {
      ...existingSkill,
      ...skill
    };
    this.skillsData.set(id, updatedSkill);
    return updatedSkill;
  }
  
  async deleteSkill(id: number): Promise<boolean> {
    return this.skillsData.delete(id);
  }
  
  // Education methods
  async getEducationItems(): Promise<Education[]> {
    return Array.from(this.educationData.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getEducationItem(id: number): Promise<Education | undefined> {
    return this.educationData.get(id);
  }
  
  async createEducationItem(educationItem: InsertEducation): Promise<Education> {
    const id = this.currentId.education++;
    const newEducation: Education = {
      degree: educationItem.degree,
      institution: educationItem.institution,
      displayOrder: educationItem.displayOrder ?? 0,
      location: educationItem.location ?? null,
      period: educationItem.period ?? null,
      description: educationItem.description ?? null,
      courses: educationItem.courses ?? [],
      achievements: educationItem.achievements ?? null,
      id
    };
    this.educationData.set(id, newEducation);
    return newEducation;
  }
  
  async updateEducationItem(
    id: number, 
    educationItem: Partial<InsertEducation>
  ): Promise<Education | undefined> {
    const existingEducation = this.educationData.get(id);
    if (!existingEducation) return undefined;
    
    const updatedEducation: Education = {
      ...existingEducation,
      ...educationItem
    };
    this.educationData.set(id, updatedEducation);
    return updatedEducation;
  }
  
  async deleteEducationItem(id: number): Promise<boolean> {
    return this.educationData.delete(id);
  }
  
  // Experience methods
  async getExperienceItems(): Promise<Experience[]> {
    return Array.from(this.experienceData.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getExperienceItem(id: number): Promise<Experience | undefined> {
    return this.experienceData.get(id);
  }
  
  async createExperienceItem(experienceItem: InsertExperience): Promise<Experience> {
    const id = this.currentId.experience++;
    const newExperience: Experience = {
      title: experienceItem.title,
      company: experienceItem.company,
      displayOrder: experienceItem.displayOrder ?? 0,
      period: experienceItem.period ?? null,
      responsibilities: experienceItem.responsibilities ?? [],
      id
    };
    this.experienceData.set(id, newExperience);
    return newExperience;
  }
  
  async updateExperienceItem(
    id: number, 
    experienceItem: Partial<InsertExperience>
  ): Promise<Experience | undefined> {
    const existingExperience = this.experienceData.get(id);
    if (!existingExperience) return undefined;
    
    const updatedExperience: Experience = {
      ...existingExperience,
      ...experienceItem
    };
    this.experienceData.set(id, updatedExperience);
    return updatedExperience;
  }
  
  async deleteExperienceItem(id: number): Promise<boolean> {
    return this.experienceData.delete(id);
  }
  
  // Projects methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projectsData.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projectsData.get(id);
  }
  
  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentId.projects++;
    const newProject: Project = {
      title: project.title,
      displayOrder: project.displayOrder ?? 0,
      period: project.period ?? null,
      description: project.description ?? null,
      technologies: project.technologies ?? [],
      image: project.image ?? null,
      demoLink: project.demoLink ?? null,
      codeLink: project.codeLink ?? null,
      id
    };
    this.projectsData.set(id, newProject);
    return newProject;
  }
  
  async updateProject(
    id: number, 
    project: Partial<InsertProject>
  ): Promise<Project | undefined> {
    const existingProject = this.projectsData.get(id);
    if (!existingProject) return undefined;
    
    const updatedProject: Project = {
      ...existingProject,
      ...project
    };
    this.projectsData.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projectsData.delete(id);
  }
  
  // Open Source Contributions methods
  async getOpenSourceContributions(): Promise<OpenSourceContribution[]> {
    return Array.from(this.openSourceData.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getOpenSourceContribution(id: number): Promise<OpenSourceContribution | undefined> {
    return this.openSourceData.get(id);
  }
  
  async createOpenSourceContribution(contribution: InsertOpenSourceContribution): Promise<OpenSourceContribution> {
    const id = this.currentId.openSource++;
    const newContribution: OpenSourceContribution = {
      title: contribution.title,
      link: contribution.link ?? null,
      icon: contribution.icon ?? null,
      displayOrder: contribution.displayOrder ?? 0,
      description: contribution.description ?? null,
      linkText: contribution.linkText ?? null,
      id
    };
    this.openSourceData.set(id, newContribution);
    return newContribution;
  }
  
  async updateOpenSourceContribution(
    id: number, 
    contribution: Partial<InsertOpenSourceContribution>
  ): Promise<OpenSourceContribution | undefined> {
    const existingContribution = this.openSourceData.get(id);
    if (!existingContribution) return undefined;
    
    const updatedContribution: OpenSourceContribution = {
      ...existingContribution,
      ...contribution
    };
    this.openSourceData.set(id, updatedContribution);
    return updatedContribution;
  }
  
  async deleteOpenSourceContribution(id: number): Promise<boolean> {
    return this.openSourceData.delete(id);
  }
  
  // About content methods
  async getAboutContent(): Promise<AboutContent | undefined> {
    return Array.from(this.aboutContentData.values())[0];
  }
  
  async updateAboutContent(content: InsertAboutContent): Promise<AboutContent> {
    const existingContent = await this.getAboutContent();
    
    if (existingContent) {
      const updatedContent: AboutContent = {
        ...existingContent,
        journeyText: content.journeyText ?? existingContent.journeyText,
        quote: content.quote ?? existingContent.quote,
        expertiseItems: content.expertiseItems ?? existingContent.expertiseItems,
        traits: content.traits ?? existingContent.traits
      };
      this.aboutContentData.set(existingContent.id, updatedContent);
      return updatedContent;
    } else {
      const id = this.currentId.aboutContent++;
      const newContent: AboutContent = {
        journeyText: content.journeyText ?? null,
        quote: content.quote ?? null,
        expertiseItems: content.expertiseItems ?? [],
        traits: content.traits ?? [],
        id
      };
      this.aboutContentData.set(id, newContent);
      return newContent;
    }
  }
  
  // Contact information methods
  async getContactInfo(): Promise<ContactInfo | undefined> {
    return Array.from(this.contactInfoData.values())[0];
  }
  
  async updateContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    const existingInfo = await this.getContactInfo();
    
    if (existingInfo) {
      const updatedInfo: ContactInfo = {
        ...existingInfo,
        email: info.email ?? existingInfo.email,
        location: info.location ?? existingInfo.location,
        phone: info.phone ?? existingInfo.phone,
        github: info.github ?? existingInfo.github,
        linkedin: info.linkedin ?? existingInfo.linkedin,
        stackoverflow: info.stackoverflow ?? existingInfo.stackoverflow
      };
      this.contactInfoData.set(existingInfo.id, updatedInfo);
      return updatedInfo;
    } else {
      const id = this.currentId.contactInfo++;
      const newInfo: ContactInfo = {
        email: info.email ?? null,
        location: info.location ?? null,
        phone: info.phone ?? null,
        github: info.github ?? null,
        linkedin: info.linkedin ?? null,
        stackoverflow: info.stackoverflow ?? null,
        id
      };
      this.contactInfoData.set(id, newInfo);
      return newInfo;
    }
  }
  
  // Initialize the database with default data
  async initializeDatabase(): Promise<void> {
    // No initialization needed for memory storage
  }
}

// PostgreSQL storage implementation
export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private client: ReturnType<typeof postgres>;
  
  constructor() {
    // Initialize the PostgreSQL client
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable not set");
    }
    
    this.client = postgres(connectionString);
    this.db = drizzle(this.client);
  }
  
  // User management methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.id, id));
    return results[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.username, username));
    return results[0];
  }
  
  async createUser(user: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userWithHashedPassword = {
      ...user,
      password: hashedPassword
    };
    
    const results = await this.db.insert(users).values(userWithHashedPassword).returning();
    return results[0];
  }
  
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    // Compare the provided password with the hashed password
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
  
  // Portfolio settings methods
  async getPortfolioSettings(): Promise<PortfolioSettings | undefined> {
    const results = await this.db.select().from(portfolioSettings).limit(1);
    return results[0];
  }
  
  async updatePortfolioSettings(settings: InsertPortfolioSettings): Promise<PortfolioSettings> {
    const existingSettings = await this.getPortfolioSettings();
    
    if (existingSettings) {
      const results = await this.db
        .update(portfolioSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(portfolioSettings.id, existingSettings.id))
        .returning();
      return results[0];
    } else {
      const results = await this.db
        .insert(portfolioSettings)
        .values({ ...settings, updatedAt: new Date() })
        .returning();
      return results[0];
    }
  }
  
  // Skills management methods
  async getSkillCategories(): Promise<SkillsCategory[]> {
    return await this.db
      .select()
      .from(skillsCategories)
      .orderBy(skillsCategories.displayOrder);
  }
  
  async getSkillCategory(id: number): Promise<SkillsCategory | undefined> {
    const results = await this.db
      .select()
      .from(skillsCategories)
      .where(eq(skillsCategories.id, id));
    return results[0];
  }
  
  async createSkillCategory(category: InsertSkillsCategory): Promise<SkillsCategory> {
    const results = await this.db
      .insert(skillsCategories)
      .values(category)
      .returning();
    return results[0];
  }
  
  async updateSkillCategory(
    id: number, 
    category: Partial<InsertSkillsCategory>
  ): Promise<SkillsCategory | undefined> {
    const results = await this.db
      .update(skillsCategories)
      .set(category)
      .where(eq(skillsCategories.id, id))
      .returning();
    return results[0];
  }
  
  async deleteSkillCategory(id: number): Promise<boolean> {
    const results = await this.db
      .delete(skillsCategories)
      .where(eq(skillsCategories.id, id))
      .returning();
    return results.length > 0;
  }
  
  async getSkills(categoryId?: number): Promise<Skill[]> {
    if (categoryId) {
      return await this.db
        .select()
        .from(skills)
        .where(eq(skills.categoryId, categoryId));
    } else {
      return await this.db
        .select()
        .from(skills);
    }
  }
  
  async getSkill(id: number): Promise<Skill | undefined> {
    const results = await this.db
      .select()
      .from(skills)
      .where(eq(skills.id, id));
    return results[0];
  }
  
  async createSkill(skill: InsertSkill): Promise<Skill> {
    const results = await this.db
      .insert(skills)
      .values(skill)
      .returning();
    return results[0];
  }
  
  async updateSkill(
    id: number, 
    skill: Partial<InsertSkill>
  ): Promise<Skill | undefined> {
    const results = await this.db
      .update(skills)
      .set(skill)
      .where(eq(skills.id, id))
      .returning();
    return results[0];
  }
  
  async deleteSkill(id: number): Promise<boolean> {
    const results = await this.db
      .delete(skills)
      .where(eq(skills.id, id))
      .returning();
    return results.length > 0;
  }
  
  // Education methods
  async getEducationItems(): Promise<Education[]> {
    return await this.db
      .select()
      .from(education)
      .orderBy(education.displayOrder);
  }
  
  async getEducationItem(id: number): Promise<Education | undefined> {
    const results = await this.db
      .select()
      .from(education)
      .where(eq(education.id, id));
    return results[0];
  }
  
  async createEducationItem(educationItem: InsertEducation): Promise<Education> {
    const results = await this.db
      .insert(education)
      .values(educationItem)
      .returning();
    return results[0];
  }
  
  async updateEducationItem(
    id: number, 
    educationItem: Partial<InsertEducation>
  ): Promise<Education | undefined> {
    const results = await this.db
      .update(education)
      .set(educationItem)
      .where(eq(education.id, id))
      .returning();
    return results[0];
  }
  
  async deleteEducationItem(id: number): Promise<boolean> {
    const results = await this.db
      .delete(education)
      .where(eq(education.id, id))
      .returning();
    return results.length > 0;
  }
  
  // Experience methods
  async getExperienceItems(): Promise<Experience[]> {
    return await this.db
      .select()
      .from(experiences)
      .orderBy(experiences.displayOrder);
  }
  
  async getExperienceItem(id: number): Promise<Experience | undefined> {
    const results = await this.db
      .select()
      .from(experiences)
      .where(eq(experiences.id, id));
    return results[0];
  }
  
  async createExperienceItem(experienceItem: InsertExperience): Promise<Experience> {
    const results = await this.db
      .insert(experiences)
      .values(experienceItem)
      .returning();
    return results[0];
  }
  
  async updateExperienceItem(
    id: number, 
    experienceItem: Partial<InsertExperience>
  ): Promise<Experience | undefined> {
    const results = await this.db
      .update(experiences)
      .set(experienceItem)
      .where(eq(experiences.id, id))
      .returning();
    return results[0];
  }
  
  async deleteExperienceItem(id: number): Promise<boolean> {
    const results = await this.db
      .delete(experiences)
      .where(eq(experiences.id, id))
      .returning();
    return results.length > 0;
  }
  
  // Projects methods
  async getProjects(): Promise<Project[]> {
    return await this.db
      .select()
      .from(projects)
      .orderBy(projects.displayOrder);
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    const results = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return results[0];
  }
  
  async createProject(project: InsertProject): Promise<Project> {
    const results = await this.db
      .insert(projects)
      .values(project)
      .returning();
    return results[0];
  }
  
  async updateProject(
    id: number, 
    project: Partial<InsertProject>
  ): Promise<Project | undefined> {
    const results = await this.db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return results[0];
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const results = await this.db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return results.length > 0;
  }
  
  // Open Source Contributions methods
  async getOpenSourceContributions(): Promise<OpenSourceContribution[]> {
    return await this.db
      .select()
      .from(openSourceContributions)
      .orderBy(openSourceContributions.displayOrder);
  }
  
  async getOpenSourceContribution(id: number): Promise<OpenSourceContribution | undefined> {
    const results = await this.db
      .select()
      .from(openSourceContributions)
      .where(eq(openSourceContributions.id, id));
    return results[0];
  }
  
  async createOpenSourceContribution(contribution: InsertOpenSourceContribution): Promise<OpenSourceContribution> {
    const results = await this.db
      .insert(openSourceContributions)
      .values(contribution)
      .returning();
    return results[0];
  }
  
  async updateOpenSourceContribution(
    id: number, 
    contribution: Partial<InsertOpenSourceContribution>
  ): Promise<OpenSourceContribution | undefined> {
    const results = await this.db
      .update(openSourceContributions)
      .set(contribution)
      .where(eq(openSourceContributions.id, id))
      .returning();
    return results[0];
  }
  
  async deleteOpenSourceContribution(id: number): Promise<boolean> {
    const results = await this.db
      .delete(openSourceContributions)
      .where(eq(openSourceContributions.id, id))
      .returning();
    return results.length > 0;
  }
  
  // About content methods
  async getAboutContent(): Promise<AboutContent | undefined> {
    const results = await this.db
      .select()
      .from(aboutContent)
      .limit(1);
    return results[0];
  }
  
  async updateAboutContent(content: InsertAboutContent): Promise<AboutContent> {
    const existingContent = await this.getAboutContent();
    
    if (existingContent) {
      const results = await this.db
        .update(aboutContent)
        .set(content)
        .where(eq(aboutContent.id, existingContent.id))
        .returning();
      return results[0];
    } else {
      const results = await this.db
        .insert(aboutContent)
        .values(content)
        .returning();
      return results[0];
    }
  }
  
  // Contact information methods
  async getContactInfo(): Promise<ContactInfo | undefined> {
    const results = await this.db
      .select()
      .from(contactInfo)
      .limit(1);
    return results[0];
  }
  
  async updateContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    const existingInfo = await this.getContactInfo();
    
    if (existingInfo) {
      const results = await this.db
        .update(contactInfo)
        .set(info)
        .where(eq(contactInfo.id, existingInfo.id))
        .returning();
      return results[0];
    } else {
      const results = await this.db
        .insert(contactInfo)
        .values(info)
        .returning();
      return results[0];
    }
  }
  
  // Initialize database with default admin user and settings
  async initializeDatabase(): Promise<void> {
    try {
      // Create admin user if none exists
      const existingAdmin = await this.db
        .select()
        .from(users)
        .where(eq(users.isAdmin, true))
        .limit(1);
      
      if (existingAdmin.length === 0) {
        // Create default admin user
        await this.createUser({
          username: "admin",
          password: "admin123", // Will be hashed in createUser
          isAdmin: true,
        });
        console.log("Created default admin user. Username: admin, Password: admin123");
      }
      
      // Create default portfolio settings if none exist
      const existingSettings = await this.getPortfolioSettings();
      if (!existingSettings) {
        await this.updatePortfolioSettings({
          primary: "#3b82f6",
          variant: "professional",
          appearance: "system",
          radius: 8,
          siteTitle: "Kamal Jeet - Software Developer",
        });
        console.log("Created default portfolio settings");
      }
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }
}

// Determine which storage implementation to use
export const storage = process.env.DATABASE_URL 
  ? new PostgresStorage() 
  : new MemStorage();
