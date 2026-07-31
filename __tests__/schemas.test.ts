import { describe, it, expect } from 'vitest';
import { ProfileSchema, CertificationsDataSchema, ProjectsDataSchema } from '@/schemas';

import PROFILE from '@/data/profile.json';
import CERTIFICATIONS from '@/data/certifications.json';
import PROJECTS from '@/data/projects.json';

describe('Zod Data Validation Schemas', () => {
  it('should validate profile.json schema correctly', () => {
    const result = ProfileSchema.safeParse(PROFILE);
    if (!result.success) {
      console.log('Profile Schema Validation Errors:', result.error.format());
    }
    expect(result.success).toBe(true);
  });

  it('should validate certifications.json schema correctly', () => {
    const result = CertificationsDataSchema.safeParse(CERTIFICATIONS);
    if (!result.success) {
      console.log('Certifications Schema Validation Errors:', result.error.format());
    }
    expect(result.success).toBe(true);
  });

  it('should validate projects.json schema correctly', () => {
    const result = ProjectsDataSchema.safeParse(PROJECTS);
    expect(result.success).toBe(true);
  });
});
