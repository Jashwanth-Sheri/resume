import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { saveResume, getResume, getAllResumes, deleteResume } from "./routes/resume";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Resume API routes
  app.post("/api/resume", saveResume);
  app.get("/api/resume/:id", getResume);
  app.get("/api/resumes", getAllResumes);
  app.delete("/api/resume/:id", deleteResume);

  return app;
}
