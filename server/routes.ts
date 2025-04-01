import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from "nodemailer";
import { z } from "zod";
import {
  insertUserSchema,
  insertPortfolioSettingsSchema,
  insertSkillsCategorySchema,
  insertSkillSchema,
  insertEducationSchema,
  insertExperienceSchema,
  insertProjectSchema,
  insertOpenSourceContributionSchema,
  insertAboutContentSchema,
  insertContactInfoSchema
} from "@shared/schema";
import { setupAuth } from "./auth";

// Middleware to check if user is authenticated
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is an admin
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && (req.user as any).isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden - Admin access required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database with default data
  await storage.initializeDatabase();
  
  // Setup authentication
  setupAuth(app);
  
  // Portfolio settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getPortfolioSettings();
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  
  app.put("/api/settings", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertPortfolioSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updatePortfolioSettings(validatedData);
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });
  
  // Skill categories routes
  app.get("/api/skill-categories", async (req, res) => {
    try {
      const categories = await storage.getSkillCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching skill categories:", error);
      res.status(500).json({ message: "Failed to fetch skill categories" });
    }
  });
  
  app.get("/api/skill-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getSkillCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Skill category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching skill category:", error);
      res.status(500).json({ message: "Failed to fetch skill category" });
    }
  });
  
  app.post("/api/skill-categories", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSkillsCategorySchema.parse(req.body);
      const newCategory = await storage.createSkillCategory(validatedData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error creating skill category:", error);
      res.status(500).json({ message: "Failed to create skill category" });
    }
  });
  
  app.put("/api/skill-categories/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSkillsCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateSkillCategory(id, validatedData);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Skill category not found" });
      }
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error updating skill category:", error);
      res.status(500).json({ message: "Failed to update skill category" });
    }
  });
  
  app.delete("/api/skill-categories/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSkillCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Skill category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting skill category:", error);
      res.status(500).json({ message: "Failed to delete skill category" });
    }
  });
  
  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const skills = await storage.getSkills(categoryId);
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });
  
  app.get("/api/skills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const skill = await storage.getSkill(id);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json(skill);
    } catch (error) {
      console.error("Error fetching skill:", error);
      res.status(500).json({ message: "Failed to fetch skill" });
    }
  });
  
  app.post("/api/skills", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const newSkill = await storage.createSkill(validatedData);
      res.status(201).json(newSkill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error creating skill:", error);
      res.status(500).json({ message: "Failed to create skill" });
    }
  });
  
  app.put("/api/skills/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSkillSchema.partial().parse(req.body);
      const updatedSkill = await storage.updateSkill(id, validatedData);
      if (!updatedSkill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json(updatedSkill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error updating skill:", error);
      res.status(500).json({ message: "Failed to update skill" });
    }
  });
  
  app.delete("/api/skills/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSkill(id);
      if (!success) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });
  
  // Education routes
  app.get("/api/education", async (req, res) => {
    try {
      const educationItems = await storage.getEducationItems();
      res.json(educationItems);
    } catch (error) {
      console.error("Error fetching education items:", error);
      res.status(500).json({ message: "Failed to fetch education items" });
    }
  });
  
  app.get("/api/education/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const educationItem = await storage.getEducationItem(id);
      if (!educationItem) {
        return res.status(404).json({ message: "Education item not found" });
      }
      res.json(educationItem);
    } catch (error) {
      console.error("Error fetching education item:", error);
      res.status(500).json({ message: "Failed to fetch education item" });
    }
  });
  
  app.post("/api/education", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertEducationSchema.parse(req.body);
      const newEducationItem = await storage.createEducationItem(validatedData);
      res.status(201).json(newEducationItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error creating education item:", error);
      res.status(500).json({ message: "Failed to create education item" });
    }
  });
  
  app.put("/api/education/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertEducationSchema.partial().parse(req.body);
      const updatedEducationItem = await storage.updateEducationItem(id, validatedData);
      if (!updatedEducationItem) {
        return res.status(404).json({ message: "Education item not found" });
      }
      res.json(updatedEducationItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error updating education item:", error);
      res.status(500).json({ message: "Failed to update education item" });
    }
  });
  
  app.delete("/api/education/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEducationItem(id);
      if (!success) {
        return res.status(404).json({ message: "Education item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting education item:", error);
      res.status(500).json({ message: "Failed to delete education item" });
    }
  });
  
  // Experience routes
  app.get("/api/experience", async (req, res) => {
    try {
      const experienceItems = await storage.getExperienceItems();
      res.json(experienceItems);
    } catch (error) {
      console.error("Error fetching experience items:", error);
      res.status(500).json({ message: "Failed to fetch experience items" });
    }
  });
  
  app.get("/api/experience/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const experienceItem = await storage.getExperienceItem(id);
      if (!experienceItem) {
        return res.status(404).json({ message: "Experience item not found" });
      }
      res.json(experienceItem);
    } catch (error) {
      console.error("Error fetching experience item:", error);
      res.status(500).json({ message: "Failed to fetch experience item" });
    }
  });
  
  app.post("/api/experience", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertExperienceSchema.parse(req.body);
      const newExperienceItem = await storage.createExperienceItem(validatedData);
      res.status(201).json(newExperienceItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error creating experience item:", error);
      res.status(500).json({ message: "Failed to create experience item" });
    }
  });
  
  app.put("/api/experience/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertExperienceSchema.partial().parse(req.body);
      const updatedExperienceItem = await storage.updateExperienceItem(id, validatedData);
      if (!updatedExperienceItem) {
        return res.status(404).json({ message: "Experience item not found" });
      }
      res.json(updatedExperienceItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error updating experience item:", error);
      res.status(500).json({ message: "Failed to update experience item" });
    }
  });
  
  app.delete("/api/experience/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteExperienceItem(id);
      if (!success) {
        return res.status(404).json({ message: "Experience item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting experience item:", error);
      res.status(500).json({ message: "Failed to delete experience item" });
    }
  });
  
  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  
  app.post("/api/projects", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(validatedData);
      res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  
  app.put("/api/projects/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const updatedProject = await storage.updateProject(id, validatedData);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });
  
  // Project reordering
  app.post("/api/projects/reorder", requireAdmin, async (req, res) => {
    try {
      const { projectIds } = req.body;
      
      if (!Array.isArray(projectIds)) {
        return res.status(400).json({ message: "projectIds must be an array" });
      }
      
      // Validate all projects exist
      const allProjects = await storage.getProjects();
      const projectIdsSet = new Set(allProjects.map((p: any) => p.id));
      
      for (const id of projectIds) {
        if (!projectIdsSet.has(id)) {
          return res.status(404).json({ message: `Project with ID ${id} not found` });
        }
      }
      
      // Update display order for each project
      const updates = [];
      for (let i = 0; i < projectIds.length; i++) {
        updates.push(
          storage.updateProject(projectIds[i], { displayOrder: i })
        );
      }
      
      await Promise.all(updates);
      
      // Return the updated projects
      const updatedProjects = await storage.getProjects();
      res.json(updatedProjects);
    } catch (error) {
      console.error("Error reordering projects:", error);
      res.status(500).json({ message: "Failed to reorder projects" });
    }
  });
  
  app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });
  
  // Open Source Contributions routes
  app.get("/api/open-source", async (req, res) => {
    try {
      const contributions = await storage.getOpenSourceContributions();
      res.json(contributions);
    } catch (error) {
      console.error("Error fetching open source contributions:", error);
      res.status(500).json({ message: "Failed to fetch open source contributions" });
    }
  });
  
  app.get("/api/open-source/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contribution = await storage.getOpenSourceContribution(id);
      if (!contribution) {
        return res.status(404).json({ message: "Open source contribution not found" });
      }
      res.json(contribution);
    } catch (error) {
      console.error("Error fetching open source contribution:", error);
      res.status(500).json({ message: "Failed to fetch open source contribution" });
    }
  });
  
  app.post("/api/open-source", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertOpenSourceContributionSchema.parse(req.body);
      const newContribution = await storage.createOpenSourceContribution(validatedData);
      res.status(201).json(newContribution);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error creating open source contribution:", error);
      res.status(500).json({ message: "Failed to create open source contribution" });
    }
  });
  
  app.put("/api/open-source/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertOpenSourceContributionSchema.partial().parse(req.body);
      const updatedContribution = await storage.updateOpenSourceContribution(id, validatedData);
      if (!updatedContribution) {
        return res.status(404).json({ message: "Open source contribution not found" });
      }
      res.json(updatedContribution);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error updating open source contribution:", error);
      res.status(500).json({ message: "Failed to update open source contribution" });
    }
  });
  
  app.delete("/api/open-source/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteOpenSourceContribution(id);
      if (!success) {
        return res.status(404).json({ message: "Open source contribution not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting open source contribution:", error);
      res.status(500).json({ message: "Failed to delete open source contribution" });
    }
  });
  
  // About content routes
  app.get("/api/about", async (req, res) => {
    try {
      const aboutContent = await storage.getAboutContent();
      res.json(aboutContent || {});
    } catch (error) {
      console.error("Error fetching about content:", error);
      res.status(500).json({ message: "Failed to fetch about content" });
    }
  });
  
  app.put("/api/about", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertAboutContentSchema.parse(req.body);
      const updatedContent = await storage.updateAboutContent(validatedData);
      res.json(updatedContent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error updating about content:", error);
      res.status(500).json({ message: "Failed to update about content" });
    }
  });
  
  // Contact info routes
  app.get("/api/contact-info", async (req, res) => {
    try {
      const contactInfo = await storage.getContactInfo();
      res.json(contactInfo || {});
    } catch (error) {
      console.error("Error fetching contact info:", error);
      res.status(500).json({ message: "Failed to fetch contact info" });
    }
  });
  
  app.put("/api/contact-info", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertContactInfoSchema.parse(req.body);
      const updatedInfo = await storage.updateContactInfo(validatedData);
      res.json(updatedInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data format", errors: error.format() });
      }
      console.error("Error updating contact info:", error);
      res.status(500).json({ message: "Failed to update contact info" });
    }
  });
  
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      // Basic validation
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // In a production environment, we would set up a real email service
      // For this portfolio site, let's create a mock successful response
      // but write the code to use nodemailer in a real application
      
      /*
      // Example nodemailer configuration that would be used in production
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || "example@gmail.com",
          pass: process.env.EMAIL_PASSWORD || "password"
        }
      });
      
      const mailOptions = {
        from: email,
        to: "Maanu6586@gmail.com", // Recipient email
        subject: `Portfolio Contact: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      };
      
      await transporter.sendMail(mailOptions);
      */
      
      // Log the contact form submission for development
      console.log("Contact form submission:", {
        name,
        email,
        subject,
        message
      });
      
      // Return success response
      return res.status(200).json({ 
        success: true, 
        message: "Message received!" 
      });
      
    } catch (error) {
      console.error("Error in contact form submission:", error);
      return res.status(500).json({ 
        message: "Failed to send message. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
