import express from "express";

import {
  getProjects,
  getFeaturedProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==================================================
   PUBLIC
================================================== */

/*
 * GET /api/projects
 *
 * Public portfolio projects.
 */
router.get("/", getProjects);

/*
 * GET /api/projects/featured
 *
 * Public featured projects.
 */
router.get("/featured", getFeaturedProjects);

/*
 * GET /api/projects/:slug
 *
 * Public project detail.
 */
router.get("/:slug", getProject);

/* ==================================================
   ADMIN CRUD
================================================== */

/*
 * POST /api/projects
 *
 * Create a project.
 */
router.post("/", requireAdmin, createProject);

/*
 * PUT /api/projects/:id
 *
 * Update a project.
 */
router.put("/:id", requireAdmin, updateProject);

/*
 * DELETE /api/projects/:id
 *
 * Delete a project.
 */
router.delete("/:id", requireAdmin, deleteProject);

export default router;
