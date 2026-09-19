import express from "express";

import {
  getActivePoster,
  getPosters,
  getPoster,
  createPoster,
  updatePoster,
  deletePoster,
} from "../controllers/posterController.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==================================================
   PUBLIC
================================================== */

/*
 * GET /api/posters/active?page=about
 *
 * Public website uses this.
 *
 * NO AUTH REQUIRED.
 */
router.get("/active", getActivePoster);

/* ==================================================
   ADMIN
================================================== */

/*
 * GET /api/posters
 *
 * Returns the one poster.
 */
router.get("/", requireAdmin, getPosters);

/*
 * GET /api/posters/:id
 */
router.get("/:id", requireAdmin, getPoster);

/*
 * POST /api/posters
 *
 * Creates the poster only if one doesn't already exist.
 */
router.post("/", requireAdmin, createPoster);

/*
 * PUT /api/posters/:id
 *
 * Updates the existing poster.
 */
router.put("/:id", requireAdmin, updatePoster);

/*
 * DELETE /api/posters/:id
 */
router.delete("/:id", requireAdmin, deletePoster);

export default router;
