import fs from "fs/promises";

import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const uploadMedia = async (req, res) => {
  let uploadedFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    uploadedFilePath = req.file.path;

    const folder = req.body.folder || "general";

    const resourceType = req.file.mimetype.startsWith("video/")
      ? "video"
      : "image";

    const result = await uploadToCloudinary(
      req.file.path,
      folder,
      resourceType,
    );

    // Delete temporary local file
    try {
      await fs.unlink(req.file.path);
    } catch (deleteError) {
      console.error("Could not delete temporary file:", deleteError.message);
    }

    uploadedFilePath = null;

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully.",
      data: {
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
    console.error("Cloudinary upload error:", error);

    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
      } catch {
        // Ignore cleanup errors
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload file.",
      error: error.message,
    });
  }
};
