import express from "express";
import fs from "fs/promises";

import upload from "../middlewares/uploadMiddleware.js";
import { uploadToCloudinary } from "../utils/uploadCloudinary.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==================================================
   ADMIN FILE UPLOAD
================================================== */

/*
 * POST /api/upload
 *
 * Protected admin endpoint.
 *
 * multipart/form-data:
 *
 * file
 * folder -> optional
 *
 * Authentication:
 * adminAccessToken HTTP-only cookie
 */

router.post(
  "/",
  requireAdmin,
  upload.single("file"),

  async (req, res) => {
    let uploadedFilePath = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
        });
      }

      uploadedFilePath = req.file.path;

      console.log("=================================");
      console.log("FILE RECEIVED");
      console.log("Name:", req.file.originalname);
      console.log("MIME:", req.file.mimetype);
      console.log("SIZE:", req.file.size);
      console.log("PATH:", req.file.path);
      console.log("=================================");

      const isVideo = req.file.mimetype.startsWith("video/");
      const isPdf = req.file.mimetype === "application/pdf";

      let resourceType = "image";

      if (isVideo) {
        resourceType = "video";
      }

      if (isPdf) {
        resourceType = "raw";
      }

      const folder = req.body.folder || "general";

      console.log("FOLDER:", folder);
      console.log("RESOURCE TYPE:", resourceType);
      console.log("UPLOADING TO CLOUDINARY...");

      const result = await uploadToCloudinary(
        req.file.path,
        folder,
        resourceType,
      );

      console.log("CLOUDINARY UPLOAD SUCCESSFUL");

      /*
       * Delete temporary local file.
       */

      try {
        await fs.unlink(uploadedFilePath);

        console.log("TEMPORARY FILE DELETED");
      } catch (deleteError) {
        console.error("Could not delete temporary file:", deleteError.message);
      }

      uploadedFilePath = null;

      return res.status(201).json({
        success: true,
        message: "File uploaded successfully.",

        file: {
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          width: result.width || null,
          height: result.height || null,
          bytes: result.bytes || null,
          duration: result.duration || null,
          playbackUrl: result.playback_url || null,
        },
      });
    } catch (error) {
      console.error("=================================");
      console.error("UPLOAD ERROR:", error);
      console.error("=================================");

      /*
       * Cleanup temporary file if upload failed.
       */

      if (uploadedFilePath) {
        try {
          await fs.unlink(uploadedFilePath);
        } catch {
          // Ignore cleanup errors.
        }
      }

      return res.status(500).json({
        success: false,
        message: "File upload failed.",
        error: error.message,
      });
    }
  },
);

export default router;
