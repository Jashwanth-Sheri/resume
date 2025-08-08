export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary: string;
  profilePicture?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ResumeSection {
  id: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills';
  title: string;
  visible: boolean;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  style: 'classic' | 'modern' | 'creative' | 'minimal';
}

export interface ResumeData {
  _id?: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  template: string;
  sectionOrder: ResumeSection[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResumeBuilderResponse {
  success: boolean;
  data?: ResumeData;
  message?: string;
}
