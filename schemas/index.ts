import { z } from 'zod';

export const ProfileItemSchema = z.object({
  name: z.string(),
  role: z.string(),
  tagline: z.string(),
  bio: z.string(),
  location: z.string(),
  email: z.string().email(),
  github: z.string().url(),
  linkedin: z.string().url(),
  philosophy: z.string(),
  skills_summary: z.string(),
  status: z.string(),
  stats: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
  traits: z.array(
    z.object({
      icon: z.string(),
      label: z.string(),
      desc: z.string(),
    })
  ),
});

export const ProfileSchema = z.object({
  es: ProfileItemSchema,
  en: ProfileItemSchema,
});

export const CertificationBadgeSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  name_es: z.string().optional(),
  name_en: z.string().optional(),
  year: z.string(),
  skills_es: z.array(z.string()).optional(),
  skills_en: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  badge: z.string().nullable().optional(),
  pdf: z.string().nullable().optional(),
  url: z.string().optional(),
  credly_badge_id: z.string().optional(),
});

export const CertificationProviderSchema = z.object({
  id: z.string(),
  provider: z.string(),
  color: z.string(),
  icon: z.string(),
  items: z.array(CertificationBadgeSchema),
});

export const CertificationsDataSchema = z.array(CertificationProviderSchema);

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline_es: z.string(),
  tagline_en: z.string(),
  description_es: z.string(),
  description_en: z.string(),
  stack: z.array(z.string()),
  highlights_es: z.array(z.string()),
  highlights_en: z.array(z.string()),
  color: z.string(),
  gradient: z.string(),
  url: z.string().optional(),
  github: z.string().optional(),
});

export const ProjectsDataSchema = z.array(ProjectItemSchema);
