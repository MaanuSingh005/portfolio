import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from "nodemailer";

export async function registerRoutes(app: Express): Promise<Server> {
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
