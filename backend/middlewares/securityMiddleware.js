import rateLimit from "express-rate-limit";

/*
 * ==================================================
 * AUTH RATE LIMITER
 * ==================================================
 *
 * Protects login and refresh endpoints from
 * brute-force / abuse.
 */

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 20,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

/*
 * ==================================================
 * STRICT LOGIN RATE LIMITER
 * ==================================================
 *
 * More restrictive than the general auth limiter.
 */

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

/*
 * ==================================================
 * CSRF / ORIGIN PROTECTION
 * ==================================================
 *
 * Authentication uses cookies, so state-changing
 * requests need CSRF protection.
 *
 * Set:
 *
 * ADMIN_FRONTEND_URL=https://admin.example.com
 *
 * in production.
 */

export const requireSameOrigin = (req, res, next) => {
  /*
   * Only protect state-changing methods.
   */
  const protectedMethods = ["POST", "PUT", "PATCH", "DELETE"];

  if (!protectedMethods.includes(req.method)) {
    return next();
  }

  const configuredOrigin = process.env.ADMIN_FRONTEND_URL;

  /*
   * In production, explicitly configure
   * the allowed frontend origin.
   */
  if (process.env.NODE_ENV === "production" && !configuredOrigin) {
    console.error("ADMIN_FRONTEND_URL is missing in production");

    return res.status(500).json({
      success: false,
      message: "Server security configuration error",
    });
  }

  /*
   * If no origin header exists, reject in
   * production.
   *
   * Browsers normally send Origin for the
   * relevant cross-origin requests.
   */
  const origin = req.get("origin");

  if (process.env.NODE_ENV === "production" && !origin) {
    return res.status(403).json({
      success: false,
      message: "Origin validation failed",
    });
  }

  /*
   * Development can be more permissive.
   */
  if (process.env.NODE_ENV !== "production" && !origin) {
    return next();
  }

  if (configuredOrigin && origin !== configuredOrigin) {
    return res.status(403).json({
      success: false,
      message: "Invalid request origin",
    });
  }

  return next();
};
