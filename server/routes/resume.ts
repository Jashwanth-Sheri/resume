import { RequestHandler } from "express";
import { ResumeBuilderResponse, ResumeData } from "@shared/resume-types";
import { connectToDatabase } from "../db/connection";
import Resume from "../db/resume-model";

// Save or update resume
export const saveResume: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const resumeData: ResumeData = req.body;
    
    let resume;
    if (resumeData._id) {
      // Update existing resume
      resume = await Resume.findByIdAndUpdate(
        resumeData._id,
        resumeData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new resume
      resume = new Resume(resumeData);
      await resume.save();
    }

    const response: ResumeBuilderResponse = {
      success: true,
      data: resume.toObject(),
      message: resumeData._id ? 'Resume updated successfully' : 'Resume created successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error saving resume:', error);
    const response: ResumeBuilderResponse = {
      success: false,
      message: 'Failed to save resume: ' + (error as Error).message
    };
    res.status(500).json(response);
  }
};

// Get resume by ID
export const getResume: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { id } = req.params;
    const resume = await Resume.findById(id);
    
    if (!resume) {
      const response: ResumeBuilderResponse = {
        success: false,
        message: 'Resume not found'
      };
      return res.status(404).json(response);
    }

    const response: ResumeBuilderResponse = {
      success: true,
      data: resume.toObject()
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching resume:', error);
    const response: ResumeBuilderResponse = {
      success: false,
      message: 'Failed to fetch resume: ' + (error as Error).message
    };
    res.status(500).json(response);
  }
};

// Get all resumes (for listing)
export const getAllResumes: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const resumes = await Resume.find()
      .sort({ updatedAt: -1 })
      .select('personalInfo.fullName personalInfo.email createdAt updatedAt');

    const response: ResumeBuilderResponse = {
      success: true,
      data: resumes as any
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    const response: ResumeBuilderResponse = {
      success: false,
      message: 'Failed to fetch resumes: ' + (error as Error).message
    };
    res.status(500).json(response);
  }
};

// Delete resume
export const deleteResume: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { id } = req.params;
    const resume = await Resume.findByIdAndDelete(id);
    
    if (!resume) {
      const response: ResumeBuilderResponse = {
        success: false,
        message: 'Resume not found'
      };
      return res.status(404).json(response);
    }

    const response: ResumeBuilderResponse = {
      success: true,
      message: 'Resume deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting resume:', error);
    const response: ResumeBuilderResponse = {
      success: false,
      message: 'Failed to delete resume: ' + (error as Error).message
    };
    res.status(500).json(response);
  }
};
