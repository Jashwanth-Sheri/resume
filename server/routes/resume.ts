import { RequestHandler } from "express";
import { ResumeBuilderResponse, ResumeData } from "@shared/resume-types";
import {
  connectToDatabase,
  isUsingFallback,
  inMemoryResumes,
} from "../db/connection";
import Resume from "../db/resume-model";

// Save or update resume
export const saveResume: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();

    const resumeData: ResumeData = req.body;

    if (isUsingFallback()) {
      // Use in-memory storage
      let resume;
      if (resumeData._id) {
        // Update existing resume
        const index = inMemoryResumes.findIndex(
          (r) => r._id === resumeData._id,
        );
        if (index !== -1) {
          resume = { ...resumeData, updatedAt: new Date() };
          inMemoryResumes[index] = resume;
        } else {
          throw new Error("Resume not found");
        }
      } else {
        // Create new resume
        resume = {
          ...resumeData,
          _id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        inMemoryResumes.push(resume);
      }

      const response: ResumeBuilderResponse = {
        success: true,
        data: resume,
        message: resumeData._id
          ? "Resume updated successfully"
          : "Resume created successfully",
      };

      res.json(response);
    } else {
      // Use MongoDB
      let resume;
      if (resumeData._id) {
        // Update existing resume
        resume = await Resume.findByIdAndUpdate(resumeData._id, resumeData, {
          new: true,
          runValidators: true,
        });
      } else {
        // Create new resume
        resume = new Resume(resumeData);
        await resume.save();
      }

      const response: ResumeBuilderResponse = {
        success: true,
        data: resume.toObject(),
        message: resumeData._id
          ? "Resume updated successfully"
          : "Resume created successfully",
      };

      res.json(response);
    }
  } catch (error) {
    console.error("Error saving resume:", error);
    const response: ResumeBuilderResponse = {
      success: false,
      message: "Failed to save resume: " + (error as Error).message,
    };
    res.status(500).json(response);
  }
};

// Get resume by ID
export const getResume: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();

    const { id } = req.params;

    if (isUsingFallback()) {
      const resume = inMemoryResumes.find((r) => r._id === id);
      if (!resume) {
        const response: ResumeBuilderResponse = {
          success: false,
          message: "Resume not found",
        };
        return res.status(404).json(response);
      }

      const response: ResumeBuilderResponse = {
        success: true,
        data: resume,
      };

      res.json(response);
    } else {
      const resume = await Resume.findById(id);

      if (!resume) {
        const response: ResumeBuilderResponse = {
          success: false,
          message: "Resume not found",
        };
        return res.status(404).json(response);
      }

      const response: ResumeBuilderResponse = {
        success: true,
        data: resume.toObject(),
      };

      res.json(response);
    }
  } catch (error) {
    console.error("Error fetching resume:", error);
    const response: ResumeBuilderResponse = {
      success: false,
      message: "Failed to fetch resume: " + (error as Error).message,
    };
    res.status(500).json(response);
  }
};

// Get all resumes (for listing)
export const getAllResumes: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();

    if (isUsingFallback()) {
      const resumes = inMemoryResumes
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .map((r) => ({
          _id: r._id,
          personalInfo: {
            fullName: r.personalInfo.fullName,
            email: r.personalInfo.email,
          },
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));

      const response: ResumeBuilderResponse = {
        success: true,
        data: resumes as any,
      };

      res.json(response);
    } else {
      const resumes = await Resume.find()
        .sort({ updatedAt: -1 })
        .select("personalInfo.fullName personalInfo.email createdAt updatedAt");

      const response: ResumeBuilderResponse = {
        success: true,
        data: resumes as any,
      };

      res.json(response);
    }
  } catch (error) {
    console.error("Error fetching resumes:", error);
    const response: ResumeBuilderResponse = {
      success: false,
      message: "Failed to fetch resumes: " + (error as Error).message,
    };
    res.status(500).json(response);
  }
};

// Delete resume
export const deleteResume: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();

    const { id } = req.params;

    if (isUsingFallback()) {
      const index = inMemoryResumes.findIndex((r) => r._id === id);
      if (index === -1) {
        const response: ResumeBuilderResponse = {
          success: false,
          message: "Resume not found",
        };
        return res.status(404).json(response);
      }

      inMemoryResumes.splice(index, 1);

      const response: ResumeBuilderResponse = {
        success: true,
        message: "Resume deleted successfully",
      };

      res.json(response);
    } else {
      const resume = await Resume.findByIdAndDelete(id);

      if (!resume) {
        const response: ResumeBuilderResponse = {
          success: false,
          message: "Resume not found",
        };
        return res.status(404).json(response);
      }

      const response: ResumeBuilderResponse = {
        success: true,
        message: "Resume deleted successfully",
      };

      res.json(response);
    }
  } catch (error) {
    console.error("Error deleting resume:", error);
    const response: ResumeBuilderResponse = {
      success: false,
      message: "Failed to delete resume: " + (error as Error).message,
    };
    res.status(500).json(response);
  }
};
