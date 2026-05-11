import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatbotResponse, type PersonalityTone } from "./chatbot";
import nodemailer from "nodemailer";

// ─── EMAIL HELPER ─────────────────────────────────────────────────────────────
// Set these environment variables to enable email notifications:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
//
// Example for Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587,
//   SMTP_USER=your@gmail.com, SMTP_PASS=your-app-password
// Example for Resend: SMTP_HOST=smtp.resend.com, SMTP_PORT=587,
//   SMTP_USER=resend, SMTP_PASS=your-resend-api-key

function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendEmail(subject: string, text: string) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[email] SMTP not configured — skipping email notification. Set SMTP_HOST, SMTP_USER, SMTP_PASS to enable.");
    return;
  }
  const fromAddress = process.env.MAIL_FROM;
  if (!fromAddress) {
    console.warn("[email] MAIL_FROM not set — skipping email notification. Set MAIL_FROM to a verified sender address.");
    return;
  }
  await transporter.sendMail({
    from: fromAddress,
    to: process.env.MAIL_TO || "hello@treed.co",
    subject,
    text,
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/chatbot", async (req, res) => {
    try {
      const { message, history = [], personality = "friendly" } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      const validPersonalities: PersonalityTone[] = ["friendly", "professional", "playful", "concise"];
      const tone: PersonalityTone = validPersonalities.includes(personality) ? personality : "friendly";
      const response = await getChatbotResponse(message, history, tone);
      res.json({ response });
    } catch (error) {
      console.error("Chatbot error:", error);
      res.status(500).json({ error: "Failed to get response" });
    }
  });

  // ─── PRICING REQUESTS ──────────────────────────────────────────────────────

  app.post("/api/pricing-requests", async (req, res) => {
    try {
      const body = req.body as Record<string, unknown>;

      // Basic server-side validation
      const required = ["firstName", "lastName", "email", "organization", "country", "city", "annualVisitors", "numGuides", "numArtifacts", "commercialModel"];
      const missing = required.filter((k) => !body[k] || String(body[k]).trim() === "");
      if (missing.length > 0) {
        return res.status(400).json({ error: "Missing required fields", fields: missing });
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(String(body.email))) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      const request = await storage.createPricingRequest({
        firstName: String(body.firstName ?? ""),
        lastName: String(body.lastName ?? ""),
        email: String(body.email ?? ""),
        phone: body.phone ? String(body.phone) : undefined,
        organization: String(body.organization ?? ""),
        jobTitle: body.jobTitle ? String(body.jobTitle) : undefined,
        country: String(body.country ?? ""),
        countryCode: body.countryCode ? String(body.countryCode) : undefined,
        city: String(body.city ?? ""),
        usageTypes: Array.isArray(body.usageTypes) ? body.usageTypes.map(String) : [],
        otherUsage: body.otherUsage ? String(body.otherUsage) : undefined,
        annualVisitors: String(body.annualVisitors ?? ""),
        currentSolutions: Array.isArray(body.currentSolutions) ? body.currentSolutions.map(String) : [],
        otherSolution: body.otherSolution ? String(body.otherSolution) : undefined,
        numGuides: String(body.numGuides ?? ""),
        numArtifacts: String(body.numArtifacts ?? ""),
        numLanguages: Number(body.numLanguages) || 1,
        launchTimeline: body.launchTimeline ? String(body.launchTimeline) : undefined,
        commercialModel: String(body.commercialModel ?? ""),
        additionalInfo: body.additionalInfo ? String(body.additionalInfo) : undefined,
      });

      console.log(`[pricing-request] New submission #${request.id} — ${request.organization} (${request.country}) — ${request.email}`);

      await sendEmail(
        `New Pricing Request — ${request.organization} (${request.country})`,
        `New pricing request received:\n\n${JSON.stringify(request, null, 2)}`
      );

      res.status(201).json({ success: true, id: request.id });
    } catch (error) {
      console.error("Pricing request error:", error);
      res.status(500).json({ error: "Failed to save pricing request" });
    }
  });

  // Internal endpoint to retrieve all submissions (no auth — add auth before going to production)
  app.get("/api/pricing-requests", async (_req, res) => {
    try {
      const requests = await storage.getAllPricingRequests();
      res.json({ count: requests.length, requests });
    } catch (error) {
      console.error("Pricing requests fetch error:", error);
      res.status(500).json({ error: "Failed to retrieve pricing requests" });
    }
  });

  // ─── CONTACT FORM ──────────────────────────────────────────────────────────

  app.post("/api/contact", async (req, res) => {
    try {
      const body = req.body as Record<string, unknown>;

      const required = ["firstName", "email", "message"];
      const missing = required.filter((k) => !body[k] || String(body[k]).trim() === "");
      if (missing.length > 0) {
        return res.status(400).json({ error: "Missing required fields", fields: missing });
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(String(body.email))) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      const name = [body.firstName, body.lastName].filter(Boolean).join(" ");
      console.log(`[contact] New message from ${name} <${body.email}> — ${body.museum ?? "no museum"}`);

      await sendEmail(
        `New Contact Message — ${name}${body.museum ? ` (${body.museum})` : ""}`,
        `New contact form submission:\n\nName: ${name}\nEmail: ${body.email}\nMuseum: ${body.museum ?? "—"}\n\nMessage:\n${body.message}`
      );

      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/cart", (req, res) => {
    res.redirect(301, "/");
  });

  return httpServer;
}