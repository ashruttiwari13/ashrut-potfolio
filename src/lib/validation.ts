import { z } from 'zod';

export const attachmentSchema = z.object({
  fileName: z.string().max(255),
  fileSize: z.number().max(15 * 1024 * 1024, 'File size must be under 15MB'),
  fileType: z.string().max(100),
  base64: z.string(),
}).optional();

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name must be under 80 characters'),
  email: z.string().trim().email('Please enter a valid email address').max(120, 'Email must be under 120 characters'),
  company: z.string().trim().max(100).optional(),
  contact_handle: z.string().trim().max(100).optional(),
  project_type: z.enum([
    'Game Development',
    '3D Character Art',
    'Environment / Level Art',
    'Cinematography & VFX',
    'Full-Time / Contract Role',
    'Other Creative Project'
  ], {
    errorMap: () => ({ message: 'Please select a valid project category' }),
  }),
  target_platform: z.string().max(80).optional(),
  budget_range: z.string().max(60).optional(),
  timeline: z.string().max(60).optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be under 5000 characters'),
  attachment: attachmentSchema,
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and dashes'),
  tagline: z.string().trim().min(5).max(200),
  description: z.string().trim().min(10).max(5000),
  category: z.enum(['game-dev', '3d-art', 'character-design', 'cinematography', 'other']),
  cover_image: z.string().trim().min(1, 'Cover image is required'),
  gallery_images: z.array(z.string()).default([]),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  role: z.string().trim().min(2).max(100),
  status: z.string().trim().min(2).max(50),
  demo_url: z.string().url().nullable().optional().or(z.literal('')),
  github_url: z.string().url().nullable().optional().or(z.literal('')),
  video_url: z.string().url().nullable().optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  order_index: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(50),
  category: z.enum(['engine', '3d', 'programming', 'cinematography', 'tools']),
  icon_name: z.string().trim().min(1).max(30),
  proficiency_level: z.string().trim().min(2).max(100),
  is_highlight: z.boolean().default(true),
  order_index: z.number().int().default(0),
});

export const profileSchema = z.object({
  full_name: z.string().trim().min(2).max(80),
  headline: z.string().trim().min(2).max(150),
  bio: z.string().trim().min(10).max(3000),
  specialties: z.array(z.string()),
  location: z.string().trim().min(2).max(120),
  freelance_status: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  social_links: z.record(z.string()),
  resume_url: z.string().trim().min(1),
});

export const adminLoginSchema = z.object({
  passcode: z.string().min(1, 'Please enter administrator passcode'),
});
