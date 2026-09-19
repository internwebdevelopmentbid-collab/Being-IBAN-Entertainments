import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables");
}

export const ACCESS_COOKIE_NAME = "adminAccessToken";
export const SESSION_COOKIE_NAME = "adminSessionToken";

export const createAccessToken = ({ adminId, sessionId }) => {
  return jwt.sign(
    {
      adminId,
      sessionId,
      type: "access",
    },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    },
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/*
 * Generates a cryptographically secure refresh token.
 */
export const generateSessionToken = () => {
  return crypto.randomBytes(48).toString("hex");
};

/*
 * Only the hash is stored in MongoDB.
 *
 * The raw refresh token exists only in the browser cookie.
 */
export const hashSessionToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/*
 * Absolute session lifetime.
 *
 * Default: 7 days.
 */
export const getSessionExpiry = () => {
  const days = Number(process.env.SESSION_EXPIRES_IN_DAYS || 7);

  if (!Number.isFinite(days) || days <= 0) {
    throw new Error("SESSION_EXPIRES_IN_DAYS must be a positive number");
  }

  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

/*
 * Cookie SameSite can be configured:
 *
 * COOKIE_SAME_SITE=lax
 * COOKIE_SAME_SITE=strict
 * COOKIE_SAME_SITE=none
 *
 * Default: lax
 */
export const getCookieOptions = () => {
  const sameSite = String(process.env.COOKIE_SAME_SITE || "lax").toLowerCase();

  const allowedSameSite = ["lax", "strict", "none"];

  if (!allowedSameSite.includes(sameSite)) {
    throw new Error("COOKIE_SAME_SITE must be lax, strict, or none");
  }

  const isProduction = process.env.NODE_ENV === "production";

  /*
   * SameSite=None requires Secure cookies.
   */
  if (sameSite === "none" && !isProduction) {
    throw new Error("COOKIE_SAME_SITE=none requires production HTTPS");
  }

  return {
    httpOnly: true,

    secure: isProduction || sameSite === "none",

    sameSite,

    path: "/",
  };
};

export const setAuthCookies = (
  res,
  accessToken,
  sessionToken,
  sessionExpiry,
) => {
  const options = getCookieOptions();

  /*
   * Short-lived access token.
   */
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    ...options,
    maxAge: 15 * 60 * 1000,
  });

  /*
   * Long-lived refresh/session token.
   *
   * IMPORTANT:
   * The maxAge is based on the absolute session
   * expiration, not another 7 days.
   */
  const remainingSessionTime = Math.max(
    sessionExpiry.getTime() - Date.now(),
    0,
  );

  res.cookie(SESSION_COOKIE_NAME, sessionToken, {
    ...options,
    maxAge: remainingSessionTime,
  });
};

export const clearAuthCookies = (res) => {
  const options = getCookieOptions();

  res.clearCookie(ACCESS_COOKIE_NAME, options);

  res.clearCookie(SESSION_COOKIE_NAME, options);
};
