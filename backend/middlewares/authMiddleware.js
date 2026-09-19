import AdminSession from "../models/AdminSession.js";
import Admin from "../models/Admin.js";

import { ACCESS_COOKIE_NAME, verifyAccessToken } from "../utils/auth.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.[ACCESS_COOKIE_NAME];

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    let decoded;

    try {
      decoded = verifyAccessToken(accessToken);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Access token expired or invalid",
      });
    }

    /*
     * Validate JWT payload.
     */
    if (!decoded.adminId || !decoded.sessionId || decoded.type !== "access") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    /*
     * Validate server-side session.
     *
     * This means an otherwise-valid JWT
     * becomes useless when the session is revoked.
     */
    const session = await AdminSession.findOne({
      _id: decoded.sessionId,

      admin: decoded.adminId,

      revokedAt: null,

      expiresAt: {
        $gt: new Date(),
      },
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired or revoked",
      });
    }

    /*
     * Validate admin account.
     */
    const admin = await Admin.findOne({
      _id: decoded.adminId,

      active: true,
    });

    if (!admin) {
      /*
       * Optionally revoke the session
       * immediately if the account has been disabled.
       */
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

      return res.status(401).json({
        success: false,
        message: "Admin account is inactive or does not exist",
      });
    }

    req.admin = admin;

    req.adminSession = session;

    return next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
