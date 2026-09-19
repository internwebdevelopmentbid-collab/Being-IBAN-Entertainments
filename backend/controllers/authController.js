import bcrypt from "bcryptjs";

import Admin from "../models/Admin.js";
import AdminSession from "../models/AdminSession.js";

import {
  ACCESS_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  clearAuthCookies,
  createAccessToken,
  generateSessionToken,
  getCookieOptions,
  getSessionExpiry,
  hashSessionToken,
  setAuthCookies,
} from "../utils/auth.js";

/* ==================================================
   LOGIN
================================================== */

export const loginAdmin = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email,
    }).select("+password");

    /*
     * Do not reveal whether the email exists.
     */
    if (!admin || !admin.active) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, admin.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /*
     * Create refresh/session token.
     */
    const sessionToken = generateSessionToken();

    const tokenHash = hashSessionToken(sessionToken);

    const expiresAt = getSessionExpiry();

    /*
     * Create server-side session.
     */
    const session = await AdminSession.create({
      admin: admin._id,

      tokenHash,

      previousTokenHash: null,

      userAgent: req.get("user-agent") || "",

      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",

      expiresAt,

      revokedAt: null,

      lastUsedAt: new Date(),
    });

    /*
     * Create short-lived access JWT.
     */
    const accessToken = createAccessToken({
      adminId: admin._id.toString(),

      sessionId: session._id.toString(),
    });

    /*
     * Update login timestamp.
     */
    admin.lastLoginAt = new Date();

    await admin.save();

    /*
     * Set both cookies.
     */
    setAuthCookies(res, accessToken, sessionToken, expiresAt);

    return res.status(200).json({
      success: true,

      message: "Login successful",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },

      session: {
        id: session._id,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/* ==================================================
   REFRESH ACCESS TOKEN
================================================== */

export const refreshAdminAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[SESSION_COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh authentication required",
      });
    }

    const tokenHash = hashSessionToken(refreshToken);

    /*
     * First look for the CURRENT token.
     */
    const session = await AdminSession.findOne({
      tokenHash,

      revokedAt: null,

      expiresAt: {
        $gt: new Date(),
      },
    });

    /*
     * =================================================
     * REFRESH TOKEN IS VALID
     * =================================================
     */

    if (session) {
      const admin = await Admin.findOne({
        _id: session.admin,
        active: true,
      });

      if (!admin) {
        await AdminSession.updateOne(
          {
            _id: session._id,
          },
          {
            $set: {
              revokedAt: new Date(),
            },
          },
        );

        clearAuthCookies(res);

        return res.status(401).json({
          success: false,
          message: "Admin account is inactive",
        });
      }

      /*
       * Generate replacement refresh token.
       */
      const newSessionToken = generateSessionToken();

      const newTokenHash = hashSessionToken(newSessionToken);

      const now = new Date();

      /*
       * IMPORTANT:
       *
       * Rotate the refresh token atomically.
       *
       * The previous token is retained for
       * reuse detection.
       */
      const updatedSession = await AdminSession.findOneAndUpdate(
        {
          _id: session._id,

          tokenHash,

          revokedAt: null,

          expiresAt: {
            $gt: now,
          },
        },
        {
          $set: {
            previousTokenHash: tokenHash,

            tokenHash: newTokenHash,

            lastUsedAt: now,
          },
        },
        {
          new: true,
        },
      );

      /*
       * Another simultaneous request may have
       * already rotated the token.
       */
      if (!updatedSession) {
        return res.status(401).json({
          success: false,
          message: "Refresh token is no longer valid",
        });
      }

      /*
       * Create new access JWT.
       */
      const accessToken = createAccessToken({
        adminId: admin._id.toString(),

        sessionId: session._id.toString(),
      });

      /*
       * Set new cookies.
       */
      setAuthCookies(
        res,
        accessToken,
        newSessionToken,
        updatedSession.expiresAt,
      );

      return res.status(200).json({
        success: true,
        message: "Access token refreshed",
      });
    }

    /*
     * =================================================
     * CURRENT TOKEN DID NOT MATCH
     * =================================================
     *
     * It may be a previously rotated token.
     *
     * If it is, someone is attempting to reuse
     * an old refresh token.
     */

    const reusedSession = await AdminSession.findOne({
      previousTokenHash: tokenHash,

      revokedAt: null,
    });

    if (reusedSession) {
      /*
       * REUSE DETECTED.
       *
       * Revoke the entire session.
       */
      await AdminSession.updateOne(
        {
          _id: reusedSession._id,
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        },
      );

      clearAuthCookies(res);

      console.warn("Admin refresh token reuse detected", {
        sessionId: reusedSession._id.toString(),

        adminId: reusedSession.admin.toString(),

        ip: req.ip,

        userAgent: req.get("user-agent") || "",
      });

      return res.status(401).json({
        success: false,
        message: "Session invalidated. Please login again.",
      });
    }

    /*
     * Token is simply invalid/expired.
     */
    clearAuthCookies(res);

    return res.status(401).json({
      success: false,
      message: "Refresh session expired or invalid",
    });
  } catch (error) {
    console.error("Admin token refresh error:", error);

    return res.status(500).json({
      success: false,
      message: "Token refresh failed",
    });
  }
};

/* ==================================================
   CURRENT ADMIN
================================================== */

export const getCurrentAdmin = async (req, res) => {
  return res.status(200).json({
    success: true,

    authenticated: true,

    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },

    session: {
      id: req.adminSession._id,
      expiresAt: req.adminSession.expiresAt,
    },
  });
};

/* ==================================================
   LOGOUT
================================================== */

export const logoutAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[SESSION_COOKIE_NAME];

    /*
     * Revoke the server-side session
     * using the refresh token.
     *
     * This works even if the access JWT
     * has already expired.
     */
    if (refreshToken) {
      const tokenHash = hashSessionToken(refreshToken);

      await AdminSession.updateOne(
        {
          tokenHash,

          revokedAt: null,
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        },
      );
    }

    /*
     * Always clear client cookies.
     */
    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Admin logout error:", error);

    /*
     * Even if server-side revocation
     * fails, attempt to remove cookies.
     */
    clearAuthCookies(res);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

/* ==================================================
   LOGOUT ALL SESSIONS
================================================== */

export const logoutAllAdminSessions = async (req, res) => {
  try {
    await AdminSession.updateMany(
      {
        admin: req.admin._id,

        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    );

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "All admin sessions logged out",
    });
  } catch (error) {
    console.error("Logout all sessions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to logout sessions",
    });
  }
};
