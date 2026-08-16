import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(2).max(160),
  clientName: z.string().max(160).optional().or(z.literal("")),
  location: z.string().max(160).optional().or(z.literal("")),
  year: z.string().max(20).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(10000).optional().or(z.literal("")),
  categoryId: z.string().min(1),
  isFeatured: z.coerce.boolean().optional(),
  isEnabled: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().optional(),
  isEnabled: z.coerce.boolean().optional(),
});

export const teamSchema = z.object({
  name: z.string().min(2).max(120),
  role: z.string().min(2).max(160),
  bio: z.string().max(4000).optional().or(z.literal("")),
  education: z.string().max(500).optional().or(z.literal("")),
  experience: z.string().max(500).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().optional(),
  isEnabled: z.coerce.boolean().optional(),
});

export const sliderSchema = z.object({
  title: z.string().max(160).optional().or(z.literal("")),
  subtitle: z.string().max(240).optional().or(z.literal("")),
  linkUrl: z.string().max(300).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().optional(),
  isEnabled: z.coerce.boolean().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(10).max(4000),
});

export const settingsSchema = z.object({
  site_name: z.string().min(2).max(120),
  tagline: z.string().max(240).optional().or(z.literal("")),
  about: z.string().max(10000).optional().or(z.literal("")),
  address: z.string().max(300).optional().or(z.literal("")),
  phone: z.string().max(80).optional().or(z.literal("")),
  email: z.string().email().max(160).optional().or(z.literal("")),
  isdn: z.string().max(80).optional().or(z.literal("")),
});

export const homeSectionSchema = z.object({
  type: z.enum(["practice", "featured", "services", "custom"]),
  key: z.string().min(2).max(80).optional().or(z.literal("")),
  eyebrow: z.string().max(80).optional().or(z.literal("")),
  title: z.string().min(2).max(200),
  body: z.string().max(10000).optional().or(z.literal("")),
  ctaLabel: z.string().max(80).optional().or(z.literal("")),
  ctaUrl: z.string().max(300).optional().or(z.literal("")),
  bgStyle: z.enum(["paper", "stone", "ink"]).optional(),
  sortOrder: z.coerce.number().int().optional(),
  isEnabled: z.coerce.boolean().optional(),
});

export const userSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  role: z.enum(["admin", "editor", "messages"]),
  password: z.string().min(8).max(128).optional().or(z.literal("")),
  isActive: z.coerce.boolean().optional(),
});
