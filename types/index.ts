export type Language = 'es' | 'en';

export interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

export interface ProfileStat {
  value: string;
  label: string;
}

export interface ProfilePhilosophy {
  title_es: string;
  title_en: string;
  desc_es: string;
  desc_en: string;
}

export interface ProfileData {
  name: string;
  role_es: string;
  role_en: string;
  tagline_es: string;
  tagline_en: string;
  available: boolean;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  stats: ProfileStat[];
  philosophy: ProfilePhilosophy[];
  about_es: string;
  about_en: string;
}

export interface TechStackItem {
  name: string;
  cat: 'Frontend' | 'Backend' | 'Infra / Ops' | 'Security' | 'Database' | 'DevOps / Tools' | 'AI / Automation';
  level: number;
  color: string;
}

export interface HardSkillItem {
  name: string;
  level: number;
}

export interface SkillsData {
  tech_stack: TechStackItem[];
  hard_skills: HardSkillItem[];
  soft_skills_es: string[];
  soft_skills_en: string[];
  specializations_es: string[];
  specializations_en: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role_es: string;
  role_en: string;
  period: string;
  location: string;
  description_es: string;
  description_en: string;
  stack: string[];
  achievements_es: string[];
  achievements_en: string[];
  color: string;
}

export interface CertificationBadge {
  id: string;
  name: string;
  year: string;
  skills: string[];
  url?: string;
  credly_badge_id?: string;
}

export interface CertificationProvider {
  id: string;
  provider: string;
  color: string;
  icon: string;
  items: CertificationBadge[];
}

export interface ProjectItem {
  id: string;
  name: string;
  tagline_es: string;
  tagline_en: string;
  description_es: string;
  description_en: string;
  stack: string[];
  highlights_es: string[];
  highlights_en: string[];
  color: string;
  gradient: string;
  url?: string;
  github?: string;
  metrics?: {
    label_es: string;
    label_en: string;
    value: string;
  }[];
}

export interface KnowledgeNode {
  id: string;
  label_es: string;
  label_en: string;
  category: 'core' | 'infra' | 'dev' | 'security' | 'database';
  type: 'circle' | 'hexagon' | 'diamond' | 'square';
  size: number;
  color: string;
  summary_es?: string;
  summary_en?: string;
}

export interface KnowledgeLink {
  from: string;
  to: string;
  strength?: number;
  label?: string;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeNode[];
  edges: KnowledgeLink[];
}

export interface TimelineItem {
  id: string;
  year: string;
  type: 'milestone' | 'role' | 'project' | 'certification';
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  icon: string;
  color: string;
}
