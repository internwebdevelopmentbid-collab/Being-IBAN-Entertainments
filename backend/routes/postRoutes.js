import express from "express";

import {
  getPosts,
  getAdminPosts,
  getPublishedPosts,
  getFeaturedPosts,
  getPost,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==================================================
   PUBLIC
================================================== */

/*
 * GET /api/blog
 *
 * Returns only Published posts.
 */
router.get("/", getPosts);

/*
 * GET /api/blog/published
 */
router.get("/published", getPublishedPosts);

/*
 * GET /api/blog/featured
 */
router.get("/featured", getFeaturedPosts);

/*
 * GET /api/blog/slug/:slug
 */
router.get("/slug/:slug", getPostBySlug);

/* ==================================================
   ADMIN
================================================== */

/*
 * IMPORTANT:
 * This must come BEFORE /:id
 *
 * GET /api/blog/admin
 */
router.get("/admin", requireAdmin, getAdminPosts);

/*
 * POST /api/blog
 */
router.post("/", requireAdmin, createPost);

/*
 * PUT /api/blog/:id
 */
router.put("/:id", requireAdmin, updatePost);

/*
 * DELETE /api/blog/:id
 */
router.delete("/:id", requireAdmin, deletePost);

/* ==================================================
   SINGLE PUBLIC POST
================================================== */

/*
 * GET /api/blog/:id
 */
router.get("/:id", getPost);

export default router;
