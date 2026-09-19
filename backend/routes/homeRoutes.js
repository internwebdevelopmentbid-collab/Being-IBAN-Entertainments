import express from "express";

import {
  getHome,
  updateHome,
  updateHero,
  updateHeroVideo,
  updateHeroPoster,
  updateSocials,
  updateAbout,
} from "../controllers/homeController.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==================================================
   PUBLIC
================================================== */

/*
 * GET /api/home
 *
 * Public homepage data.
 */
router.get("/", getHome);

/* ==================================================
   ADMIN
================================================== */

/*
 * PUT /api/home
 *
 * Update complete homepage.
 */
router.put("/", requireAdmin, updateHome);

/*
 * PUT /api/home/hero
 *
 * Update hero content.
 */
router.put("/hero", requireAdmin, updateHero);

/*
 * PUT /api/home/hero/video
 *
 * Update hero video.
 */
router.put("/hero/video", requireAdmin, updateHeroVideo);

/*
 * PUT /api/home/hero/poster
 *
 * Update hero poster.
 */
router.put("/hero/poster", requireAdmin, updateHeroPoster);

/*
 * PUT /api/home/socials
 *
 * Update social links.
 */
router.put("/socials", requireAdmin, updateSocials);

/*
 * PUT /api/home/about
 *
 * Update homepage about section.
 */
router.put("/about", requireAdmin, updateAbout);

export default router;
