-- ==============================================================================
-- ASHRUT TIWARI PORTFOLIO — INITIAL SCHEMA MIGRATION
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILE SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL DEFAULT 'Ashrut Tiwari',
    headline TEXT NOT NULL DEFAULT 'Game Developer & Cinematographer',
    bio TEXT NOT NULL DEFAULT 'I craft immersive 3D worlds, design memorable characters, and build robust gameplay systems. Proficient in Unreal 5, Godot, Blender, C++, and Python.',
    specialties TEXT[] NOT NULL DEFAULT ARRAY['Game Development', '3D Modeling', 'Character Art', 'Cinematography & VFX'],
    location TEXT NOT NULL DEFAULT 'India · Open to Remote Opportunities Worldwide',
    freelance_status TEXT NOT NULL DEFAULT 'Open for Freelance & Commissions',
    email TEXT NOT NULL DEFAULT 'ashrut.tiwari.work@gmail.com',
    social_links JSONB NOT NULL DEFAULT '{
        "github": "https://github.com",
        "linkedin": "https://linkedin.com",
        "artstation": "https://artstation.com",
        "youtube": "https://youtube.com",
        "twitter": "https://x.com"
    }'::jsonb,
    resume_url TEXT DEFAULT '/resume-ashrut-tiwari.pdf',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('game-dev', '3d-art', 'character-design', 'cinematography', 'other')),
    cover_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    technologies TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Completed',
    demo_url TEXT,
    github_url TEXT,
    video_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for fast querying & filtering
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(order_index ASC);

-- ------------------------------------------------------------------------------
-- 3. SKILLS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('engine', '3d', 'programming', 'cinematography', 'tools')),
    icon_name TEXT NOT NULL DEFAULT 'Sparkles',
    proficiency_level TEXT NOT NULL DEFAULT 'Advanced',
    is_highlight BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_order ON public.skills(order_index ASC);

-- ------------------------------------------------------------------------------
-- 4. ACHIEVEMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_or_source TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Trophy',
    date_label TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. CONTACT INQUIRIES TABLE (PRIVATE!)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    project_type TEXT NOT NULL,
    budget_range TEXT,
    timeline TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    ip_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_read ON public.contact_inquiries(is_read);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON public.contact_inquiries(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 1. Profile Settings RLS:
-- Anyone can view profile settings
CREATE POLICY "Public can view profile settings"
    ON public.profile_settings FOR SELECT
    USING (true);

-- Only authenticated users (admin) can update profile settings
CREATE POLICY "Admin can update profile settings"
    ON public.profile_settings FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Projects RLS:
-- Anyone can view published projects
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    USING (is_published = true);

-- Authenticated admins can view all projects (including drafts)
CREATE POLICY "Admin can view all projects"
    ON public.projects FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated admins can insert, update, delete projects
CREATE POLICY "Admin can insert projects"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admin can update projects"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin can delete projects"
    ON public.projects FOR DELETE
    TO authenticated
    USING (true);

-- 3. Skills RLS:
CREATE POLICY "Public can view skills"
    ON public.skills FOR SELECT
    USING (true);

CREATE POLICY "Admin can insert skills"
    ON public.skills FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admin can update skills"
    ON public.skills FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin can delete skills"
    ON public.skills FOR DELETE
    TO authenticated
    USING (true);

-- 4. Achievements RLS:
CREATE POLICY "Public can view achievements"
    ON public.achievements FOR SELECT
    USING (true);

CREATE POLICY "Admin full manage achievements"
    ON public.achievements FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Contact Inquiries RLS (CRITICAL PRIVACY SAFEGUARD):
-- Public visitors CANNOT read contact inquiries (prevents data harvesting)
-- Public visitors CAN insert new inquiries
CREATE POLICY "Public can submit contact inquiries"
    ON public.contact_inquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Authenticated admins can view inquiries
CREATE POLICY "Admin can view inquiries"
    ON public.contact_inquiries FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated admins can update read status or delete inquiries
CREATE POLICY "Admin can update inquiries"
    ON public.contact_inquiries FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin can delete inquiries"
    ON public.contact_inquiries FOR DELETE
    TO authenticated
    USING (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- (Real, accurate starter data reflecting Ashrut Tiwari's skill set)
-- ==============================================================================

-- Profile
INSERT INTO public.profile_settings (
    full_name, headline, bio, specialties, location, freelance_status, email
) VALUES (
    'Ashrut Tiwari',
    'Game Developer · 3D Artist · Cinematographer',
    'I craft immersive 3D worlds, design memorable characters, and build responsive gameplay mechanics. Proficient in Unreal Engine 5, Godot, Blender, C++, and Python with an eye for cinematic lighting and visual storytelling.',
    ARRAY['Unreal Engine 5 & Godot', '3D Character Art & Rigging', 'C++ & Python Systems', 'Cinematography & Color Grading'],
    'India · Available for Remote Collaborations Worldwide',
    'Open for Freelance & Custom Commissions',
    'ashrut.tiwari.work@gmail.com'
) ON CONFLICT DO NOTHING;

-- Initial Skills
INSERT INTO public.skills (name, category, icon_name, proficiency_level, is_highlight, order_index) VALUES
('Unreal Engine 5', 'engine', 'Flame', 'Advanced (Blueprints, C++, Lumen)', true, 1),
('Godot 4', 'engine', 'Box', 'Proficient (GDScript, Physics)', true, 2),
('Blender', '3d', 'BoxSelect', 'Expert (Hard Surface, Sculpting, Geometry Nodes)', true, 3),
('ZBrush', '3d', 'Sparkles', 'Advanced (Organic & Creature Sculpting)', true, 4),
('Substance 3D', '3d', 'Palette', 'Advanced (PBR Texturing & Smart Materials)', true, 5),
('C++', 'programming', 'Code', 'Advanced (Engine Architecture & Optimization)', true, 6),
('Python', 'programming', 'Terminal', 'Proficient (Automation, Blender Scripting, AI Tools)', true, 7),
('DaVinci Resolve', 'cinematography', 'Video', 'Advanced (Color Grading, ACES, Editing)', true, 8)
ON CONFLICT DO NOTHING;

-- Initial Projects
INSERT INTO public.projects (
    title, slug, tagline, description, category, cover_image, technologies, role, status, is_featured, order_index
) VALUES
(
    'ZodiacX',
    'zodiacx',
    'Mythological Sci-Fi Action RPG with Custom Stylized Characters',
    'An ambitious sci-fi action RPG weaving celestial mythology with modern high-octane combat mechanics. Built with custom low-poly and high-fidelity characters, stylized shaders, and a dynamic real-time combo system in Unreal Engine 5.',
    'game-dev',
    '/projects/zodiacx.png',
    ARRAY['Unreal Engine 5', 'C++', 'Blender', 'Substance Painter'],
    'Lead Developer, 3D Character Artist & Technical Designer',
    'Active Production',
    true,
    1
),
(
    'Lost Horizon',
    'lost-horizon',
    'Atmospheric Exploration & Environmental Storytelling Adventure',
    'A serene, mood-driven exploration title featuring volumetric atmospheric fog, custom terrain shaders, and minimalist audio design developed in Godot 4.',
    'game-dev',
    '/projects/lost-horizon.png',
    ARRAY['Godot 4', 'Blender', 'GDScript', 'FMOD'],
    'Solo Game Developer & Environment Artist',
    'Playable Demo Available',
    true,
    2
),
(
    'Echoes',
    'echoes',
    'Live-Action & CGI Hybrid Short Film featuring Creature VFX',
    'A cinematic proof-of-concept short exploring isolation and mystery. Features realistic 3D creature integration, camera tracking, matchmoving, and dramatic ACES color grading in DaVinci Resolve.',
    'cinematography',
    '/projects/echoes.png',
    ARRAY['DaVinci Resolve', 'Blender', 'ZBrush', 'ACES Workflow'],
    'Director, Cinematographer & VFX Supervisor',
    'Completed',
    true,
    3
)
ON CONFLICT DO NOTHING;

-- Initial Achievements
INSERT INTO public.achievements (title, description, event_or_source, icon_name, date_label, order_index) VALUES
('Game Jam Winner', 'Awarded Best Art Direction for an atmospheric low-poly narrative entry.', 'Global Game Jam 2024', 'Trophy', '2024', 1),
('Character Showcase Feature', '3D stylized character model featured on the community spotlight.', 'Blender Artists Forum', 'Award', '2024', 2),
('Short Film Festival Selection', 'Official selection for cinematography and hybrid visual effects.', 'IndieCade Short Selection', 'Film', '2023', 3)
ON CONFLICT DO NOTHING;
