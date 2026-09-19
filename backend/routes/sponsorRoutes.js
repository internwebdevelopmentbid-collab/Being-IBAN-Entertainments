import express from "express";

import {
  getSponsors,
  getActiveSponsors,
  getSponsor,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} from "../controllers/sponsorController.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==================================================
   PUBLIC
================================================== */

/*
 * GET /api/sponsors
 *
 * Public sponsor listing.
 */
router.get("/", getSponsors);

/*
 * IMPORTANT:
 * Keep /active BEFORE /:id.
 */

/*
 * GET /api/sponsors/active
 *
 * Public active sponsors.
 */
router.get("/active", getActiveSponsors);

/*
 * GET /api/sponsors/:id
 *
 * Public sponsor detail.
 */
router.get("/:id", getSponsor);

/* ==================================================
   ADMIN
================================================== */

/*
 * POST /api/sponsors
 *
 * Create sponsor.
 */
router.post("/", requireAdmin, createSponsor);

/*
 * PUT /api/sponsors/:id
 *
 * Update sponsor.
 */
router.put("/:id", requireAdmin, updateSponsor);

/*
 * DELETE /api/sponsors/:id
 *
 * Delete sponsor.
 */
router.delete("/:id", requireAdmin, deleteSponsor);

export default router;
