import mongoose from "mongoose";

const adminSessionSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    /*
     * SHA-256 hash of the refresh/session token.
     *
     * The raw token exists only inside the
     * HttpOnly browser cookie.
     */
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userAgent: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    /*
     * Absolute session expiration.
     *
     * Refreshing the access token does NOT
     * extend this date.
     */
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    /*
     * Server-side session revocation.
     */
    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },

    /*
     * Last time this session successfully
     * refreshed an access token.
     */
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * MongoDB automatically removes sessions
 * after expiresAt.
 */
adminSessionSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  },
);

const AdminSession = mongoose.model("AdminSession", adminSessionSchema);

export default AdminSession;
