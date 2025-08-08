import { ResumeTemplate, ResumeSection } from './resume-types';

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout with clean typography',
    preview: '/templates/classic-preview.jpg',
    style: 'classic'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with accent colors and modern spacing',
    preview: '/templates/modern-preview.jpg',
    style: 'modern'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design with creative elements and visual hierarchy',
    preview: '/templates/creative-preview.jpg',
    style: 'creative'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple layout focusing on content',
    preview: '/templates/minimal-preview.jpg',
    style: 'minimal'
  }
];

export const DEFAULT_SECTION_ORDER: ResumeSection[] = [
  {
    id: 'personal',
    type: 'personal',
    title: 'Personal Information',
    visible: true
  },
  {
    id: 'summary',
    type: 'summary',
    title: 'Professional Summary',
    visible: true
  },
  {
    id: 'experience',
    type: 'experience',
    title: 'Work Experience',
    visible: true
  },
  {
    id: 'education',
    type: 'education',
    title: 'Education',
    visible: true
  },
  {
    id: 'skills',
    type: 'skills',
    title: 'Skills',
    visible: true
  }
];
