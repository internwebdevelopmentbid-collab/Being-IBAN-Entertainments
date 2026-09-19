import express from "express";

import {
  getServices,
  getActiveServices,
  getFeaturedServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==================================================
   PUBLIC
================================================== */

/*
 * GET /api/services
 *
 * Public services listing.
 */
router.get("/", getServices);

/*
 * GET /api/services/active
 *
 * Public active services.
 */
router.get("/active", getActiveServices);

/*
 * GET /api/services/featured
 *
 * Public featured services.
 */
router.get("/featured", getFeaturedServices);

/*
 * GET /api/services/:id
 *
 * Public service detail.
 */
router.get("/:id", getService);

/* ==================================================
   ADMIN
================================================== */

/*
 * POST /api/services
 *
 * Create a service.
 */
router.post("/", requireAdmin, createService);

/*
 * PUT /api/services/:id
 *
 * Update a service.
 */
router.put("/:id", requireAdmin, updateService);

/*
 * DELETE /api/services/:id
 *
 * Delete a service.
 */
router.delete("/:id", requireAdmin, deleteService);

export default router;
