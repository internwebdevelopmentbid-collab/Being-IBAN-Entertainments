import express from "express";

import {
  getMembers,
  getActiveMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==================================================
   PUBLIC
================================================== */

/*
 * GET /api/members
 *
 * Public member listing.
 */
router.get("/", getMembers);

/*
 * GET /api/members/active
 *
 * Public active members.
 */
router.get("/active", getActiveMembers);

/*
 * GET /api/members/:id
 *
 * Public member detail.
 */
router.get("/:id", getMember);

/* ==================================================
   ADMIN
================================================== */

/*
 * POST /api/members
 *
 * Create member.
 */
router.post("/", requireAdmin, createMember);

/*
 * PUT /api/members/:id
 *
 * Update member.
 */
router.put("/:id", requireAdmin, updateMember);

/*
 * DELETE /api/members/:id
 *
 * Delete member.
 */
router.delete("/:id", requireAdmin, deleteMember);

export default router;
