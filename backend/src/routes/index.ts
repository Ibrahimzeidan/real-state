import { Router } from "express";

import auditRoutes from "./audit";
import authRoutes from "./auth";
import blogRoutes from "./blogs";
import contactRoutes from "./contact";
import contentRoutes from "./content";
import projectRoutes from "./projects";

const router = Router();

router.use("/auth", authRoutes);
router.use("/blogs", blogRoutes);
router.use("/projects", projectRoutes);
router.use("/content", contentRoutes);
router.use("/contact", contactRoutes);
router.use("/audit", auditRoutes);

export default router;
