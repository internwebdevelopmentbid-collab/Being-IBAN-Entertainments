import express from "express";

import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
 * ==================================================
 * PUBLIC
 * ==================================================
 */

/*
 * POST /api/contact
 *
 * Public contact form submission.
 */
router.post("/", createContact);

/*
 * ==================================================
 * ADMIN
 * ==================================================
 */

/*
 * GET /api/contact
 *
 * Get all contact inquiries.
 */
router.get("/", requireAdmin, getContacts);

/*
 * GET /api/contact/:id
 *
 * Get one contact inquiry.
 */
router.get("/:id", requireAdmin, getContactById);

/*
 * PATCH /api/contact/:id
 *
 * Update contact status / tags.
 */
router.patch("/:id", requireAdmin, updateContact);

/*
 * DELETE /api/contact/:id
 *
 * Delete contact inquiry.
 */
router.delete("/:id", requireAdmin, deleteContact);

export default router;
