import express from "express";

import {
  loginAdmin,
  refreshAdminAccessToken,
  getCurrentAdmin,
  logoutAdmin,
  logoutAllAdminSessions,
} from "../controllers/authController.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

import {
  loginRateLimiter,
  authRateLimiter,
  requireSameOrigin,
} from "../middlewares/securityMiddleware.js";

const router = express.Router();

/* ==================================================
   LOGIN

   POST /api/auth/login
================================================== */

router.post(
  "/login",

  requireSameOrigin,

  loginRateLimiter,

  loginAdmin,
);

/* ==================================================
   REFRESH

   POST /api/auth/refresh

   Does NOT require requireAdmin because the
   access token may already be expired.

   It authenticates using the refresh/session cookie.
================================================== */

router.post(
  "/refresh",

  requireSameOrigin,

  authRateLimiter,

  refreshAdminAccessToken,
);

/* ==================================================
   CURRENT ADMIN

   GET /api/auth/me
================================================== */

router.get(
  "/me",

  requireAdmin,

  getCurrentAdmin,
);

/* ==================================================
   LOGOUT

   POST /api/auth/logout
================================================== */

router.post(
  "/logout",

  requireSameOrigin,

  logoutAdmin,
);

/* ==================================================
   LOGOUT ALL SESSIONS

   POST /api/auth/logout-all
================================================== */

router.post(
  "/logout-all",

  requireSameOrigin,

  requireAdmin,

  logoutAllAdminSessions,
);

export default router;
