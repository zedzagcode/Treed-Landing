import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// ─── PRICING REQUEST ─────────────────────────────────────────────────────────

export interface PricingRequest {
  id: string;
  submittedAt: string;
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization: string;
  jobTitle?: string;
  // Step 2
  country: string;
  countryCode?: string;
  city: string;
  usageTypes: string[];
  otherUsage?: string;
  annualVisitors: string;
  currentSolutions: string[];
  otherSolution?: string;
  // Step 3
  numGuides: string;
  numArtifacts: string;
  numLanguages: number;
  launchTimeline?: string;
  // Step 4
  commercialModel: string;
  additionalInfo?: string;
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Pricing requests
  createPricingRequest(data: Omit<PricingRequest, "id" | "submittedAt">): Promise<PricingRequest>;
  getAllPricingRequests(): Promise<PricingRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private pricingRequests: PricingRequest[];

  constructor() {
    this.users = new Map();
    this.pricingRequests = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPricingRequest(
    data: Omit<PricingRequest, "id" | "submittedAt">
  ): Promise<PricingRequest> {
    const request: PricingRequest = {
      ...data,
      id: randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    this.pricingRequests.push(request);
    return request;
  }

  async getAllPricingRequests(): Promise<PricingRequest[]> {
    return [...this.pricingRequests];
  }
}

export const storage = new MemStorage();
