import mongoose from 'mongoose';
import { ResumeData } from '@shared/resume-types';

const PersonalInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  linkedin: { type: String },
  website: { type: String },
  summary: { type: String },
  profilePicture: { type: String }
});

const ExperienceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  isCurrentJob: { type: Boolean, default: false },
  description: { type: String }
});

const EducationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String },
  graduationDate: { type: String, required: true },
  gpa: { type: String },
  honors: { type: String }
});

const SkillSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  }
});

const ResumeSchema = new mongoose.Schema({
  personalInfo: { type: PersonalInfoSchema, required: true },
  experience: { type: [ExperienceSchema], default: [] },
  education: { type: [EducationSchema], default: [] },
  skills: { type: [SkillSchema], default: [] }
}, {
  timestamps: true
});

// Create the model with proper typing
export const Resume = mongoose.models.Resume || mongoose.model<ResumeData & mongoose.Document>('Resume', ResumeSchema);

export default Resume;
