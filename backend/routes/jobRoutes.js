import express from "express";

import {
  getJobs,
  getPublishedJobs,
  getJob,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==================================================
   PUBLIC
================================================== */

/*
 * GET /api/jobs
 *
 * Public job listing.
 */
router.get("/", getJobs);

/*
 * GET /api/jobs/published
 *
 * Public published jobs.
 */
router.get("/published", getPublishedJobs);

/*
 * GET /api/jobs/slug/:slug
 *
 * Public job detail by slug.
 */
router.get("/slug/:slug", getJobBySlug);

/*
 * GET /api/jobs/:id
 *
 * Public job detail by ID.
 */
router.get("/:id", getJob);

/* ==================================================
   ADMIN
================================================== */

/*
 * POST /api/jobs
 *
 * Create a new job.
 */
router.post("/", requireAdmin, createJob);

/*
 * PUT /api/jobs/:id
 *
 * Update a job.
 */
router.put("/:id", requireAdmin, updateJob);

/*
 * DELETE /api/jobs/:id
 *
 * Delete a job.
 */
router.delete("/:id", requireAdmin, deleteJob);

export default router;
