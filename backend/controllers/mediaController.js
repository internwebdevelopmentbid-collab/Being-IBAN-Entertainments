import fs from "fs/promises";

import Media from "../models/Media.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadCloudinary.js";

/* ==================================================
   CONSTANTS
================================================== */

const ALLOWED_PAGES = [
  "about",
  "services",
  "portfolio",
  "careers",
  "blog",
  "contact",
];

const ALLOWED_TYPES = ["cover", "gallery"];

/* ==================================================
   HELPERS
================================================== */

const cleanupTempFile = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore cleanup errors.
  }
};

const deleteCloudinaryAsset = async (publicId, resourceType = "image") => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error?.message || error);
  }
};

const normalizePage = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

const normalizeType = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

/* ==================================================
   GET ALL MEDIA
================================================== */

export const getMedia = async (req, res) => {
  try {
    const { page, type, active } = req.query;

    const filter = {};

    if (page) {
      const normalizedPage = normalizePage(page);

      if (!ALLOWED_PAGES.includes(normalizedPage)) {
        return res.status(400).json({
          success: false,
          message: "Invalid media page.",
        });
      }

      filter.page = normalizedPage;
    }

    if (type) {
      const normalizedType = normalizeType(type);

      if (!ALLOWED_TYPES.includes(normalizedType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid media type.",
        });
      }

      if (
        normalizedType === "gallery" &&
        filter.page &&
        filter.page !== "portfolio"
      ) {
        return res.status(400).json({
          success: false,
          message: "Gallery media is only available for portfolio.",
        });
      }

      filter.type = normalizedType;
    }

    if (active !== undefined) {
      filter.active = active === "true";
    }

    const media = await Media.find(filter)
      .sort({
        type: 1,
        order: 1,
        createdAt: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: media.length,
      data: media,
    });
  } catch (error) {
    console.error("Get media error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch media.",
      error: error?.message || "Unknown server error.",
    });
  }
};

/* ==================================================
   GET SINGLE MEDIA
================================================== */

export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error("Get media by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch media.",
      error: error?.message || "Unknown server error.",
    });
  }
};

/* ==================================================
   CREATE MEDIA
================================================== */

export const createMedia = async (req, res) => {
  let temporaryFile = null;

  let uploadedPublicId = null;
  let uploadedResourceType = "image";

  try {
    console.log("========================================");
    console.log("CREATE MEDIA");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("========================================");

    /* --------------------------------------------------
       FILE CHECK
    -------------------------------------------------- */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    temporaryFile = req.file.path;

    /* --------------------------------------------------
       PAGE
    -------------------------------------------------- */

    const page = normalizePage(req.body.page);

    if (!ALLOWED_PAGES.includes(page)) {
      await cleanupTempFile(temporaryFile);
      temporaryFile = null;

      return res.status(400).json({
        success: false,
        message: `Invalid media page: ${page}`,
      });
    }

    /* --------------------------------------------------
       TYPE
    -------------------------------------------------- */

    /*
     * Every non-portfolio page can only have a cover.
     */

    let type = "cover";

    if (page === "portfolio") {
      type = normalizeType(req.body.type || "cover");

      if (!ALLOWED_TYPES.includes(type)) {
        await cleanupTempFile(temporaryFile);
        temporaryFile = null;

        return res.status(400).json({
          success: false,
          message: `Invalid portfolio media type: ${type}`,
        });
      }
    }

    /* --------------------------------------------------
       DUPLICATE COVER CHECK
    -------------------------------------------------- */

    if (type === "cover") {
      const existingCover = await Media.findOne({
        page,
        type: "cover",
      })
        .select("_id page type title url")
        .lean();

      if (existingCover) {
        await cleanupTempFile(temporaryFile);
        temporaryFile = null;

        return res.status(409).json({
          success: false,
          message:
            `A cover image already exists for "${page}". ` +
            "Edit the existing cover image instead of creating another one.",
          existingId: existingCover._id,
        });
      }
    }

    /* --------------------------------------------------
       GALLERY ORDER
    -------------------------------------------------- */

    let order = 0;

    if (type === "gallery") {
      const lastGallery = await Media.findOne({
        page: "portfolio",
        type: "gallery",
      })
        .sort({
          order: -1,
        })
        .lean();

      order = lastGallery ? Number(lastGallery.order || 0) + 1 : 0;
    }

    /* --------------------------------------------------
       CLOUDINARY RESOURCE TYPE
    -------------------------------------------------- */

    uploadedResourceType = req.file.mimetype?.startsWith("video/")
      ? "video"
      : "image";

    const folder = `media/${page}/${type}`;

    console.log("Uploading media to Cloudinary:");
    console.log({
      folder,
      resourceType: uploadedResourceType,
      filePath: temporaryFile,
    });

    /* --------------------------------------------------
       CLOUDINARY UPLOAD
    -------------------------------------------------- */

    const result = await uploadToCloudinary(
      temporaryFile,
      folder,
      uploadedResourceType,
    );

    console.log("Cloudinary upload result:", result);

    if (!result) {
      throw new Error("Cloudinary returned no upload result.");
    }

    if (!result.secure_url) {
      throw new Error("Cloudinary upload succeeded but secure_url is missing.");
    }

    if (!result.public_id) {
      throw new Error("Cloudinary upload succeeded but public_id is missing.");
    }

    uploadedPublicId = result.public_id;

    /* --------------------------------------------------
       DATABASE RECORD
    -------------------------------------------------- */

    const mediaData = {
      page,
      type,

      title: String(req.body.title || "").trim(),

      alt: String(req.body.alt || "").trim(),

      url: result.secure_url,

      publicId: result.public_id,

      resourceType: result.resource_type || uploadedResourceType,

      format: result.format || "",

      width: result.width !== undefined ? result.width : null,

      height: result.height !== undefined ? result.height : null,

      bytes: result.bytes !== undefined ? result.bytes : null,

      active: true,

      order,
    };

    console.log("Creating Media document:");
    console.log(mediaData);

    const media = await Media.create(mediaData);

    /* --------------------------------------------------
       CLEAN TEMP FILE
    -------------------------------------------------- */

    await cleanupTempFile(temporaryFile);
    temporaryFile = null;

    console.log("Media created successfully:", media._id.toString());

    return res.status(201).json({
      success: true,

      message:
        type === "gallery"
          ? "Gallery image added successfully."
          : "Cover image created successfully.",

      data: media,
    });
  } catch (error) {
    console.error("========================================");
    console.error("CREATE MEDIA ERROR");
    console.error("name:", error?.name);
    console.error("message:", error?.message);
    console.error("code:", error?.code);
    console.error("keyPattern:", error?.keyPattern);
    console.error("keyValue:", error?.keyValue);
    console.error("stack:", error?.stack);
    console.error("========================================");

    /* --------------------------------------------------
       CLEAN CLOUDINARY ASSET IF DB CREATION FAILED
    -------------------------------------------------- */

    if (uploadedPublicId) {
      await deleteCloudinaryAsset(uploadedPublicId, uploadedResourceType);
    }

    /* --------------------------------------------------
       CLEAN TEMP FILE
    -------------------------------------------------- */

    await cleanupTempFile(temporaryFile);

    /* --------------------------------------------------
       DUPLICATE KEY
    -------------------------------------------------- */

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A media item with this page/type already exists. " +
          "For cover images, edit the existing image instead.",
        error: error.message,
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
      });
    }

    /* --------------------------------------------------
       MONGOOSE VALIDATION
    -------------------------------------------------- */

    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Media validation failed.",
        error: error.message,
        errors: error.errors,
      });
    }

    /* --------------------------------------------------
       GENERAL ERROR
    -------------------------------------------------- */

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to create media.",
      error: error?.message || "Unknown server error.",
    });
  }
};

/* ==================================================
   UPDATE MEDIA
================================================== */

export const updateMedia = async (req, res) => {
  let temporaryFile = null;

  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found.",
      });
    }

    temporaryFile = req.file?.path || null;

    /* --------------------------------------------------
       TEXT FIELDS
    -------------------------------------------------- */

    if (req.body.title !== undefined) {
      media.title = String(req.body.title).trim();
    }

    if (req.body.alt !== undefined) {
      media.alt = String(req.body.alt).trim();
    }

    if (req.body.active !== undefined) {
      media.active = req.body.active === true || req.body.active === "true";
    }

    /* --------------------------------------------------
       REPLACE FILE
    -------------------------------------------------- */

    if (req.file) {
      const resourceType = req.file.mimetype?.startsWith("video/")
        ? "video"
        : "image";

      const folder = `media/${media.page}/${media.type}`;

      const result = await uploadToCloudinary(
        req.file.path,
        folder,
        resourceType,
      );

      if (!result?.secure_url || !result?.public_id) {
        throw new Error(
          "Cloudinary replacement upload did not return valid asset information.",
        );
      }

      /*
       * Delete old asset only after the new upload
       * succeeds.
       */

      await deleteCloudinaryAsset(
        media.publicId,
        media.resourceType || "image",
      );

      media.url = result.secure_url;

      media.publicId = result.public_id;

      media.resourceType = result.resource_type || resourceType;

      media.format = result.format || "";

      media.width = result.width !== undefined ? result.width : null;

      media.height = result.height !== undefined ? result.height : null;

      media.bytes = result.bytes !== undefined ? result.bytes : null;
    }

    /* --------------------------------------------------
       SAVE
    -------------------------------------------------- */

    const updatedMedia = await media.save();

    await cleanupTempFile(temporaryFile);
    temporaryFile = null;

    return res.status(200).json({
      success: true,
      message: "Media updated successfully.",
      data: updatedMedia,
    });
  } catch (error) {
    console.error("Update media error:", error);

    await cleanupTempFile(temporaryFile);

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A media item with these values already exists.",
        error: error.message,
      });
    }

    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Media validation failed.",
        error: error.message,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to update media.",
      error: error?.message || "Unknown server error.",
    });
  }
};

/* ==================================================
   DELETE MEDIA
================================================== */

export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found.",
      });
    }

    /* --------------------------------------------------
       CLOUDINARY
    -------------------------------------------------- */

    await deleteCloudinaryAsset(media.publicId, media.resourceType || "image");

    /* --------------------------------------------------
       DATABASE
    -------------------------------------------------- */

    await Media.findByIdAndDelete(req.params.id);

    /* --------------------------------------------------
       REORDER GALLERY
    -------------------------------------------------- */

    if (media.page === "portfolio" && media.type === "gallery") {
      const gallery = await Media.find({
        page: "portfolio",
        type: "gallery",
      }).sort({
        order: 1,
        createdAt: 1,
      });

      await Promise.all(
        gallery.map((item, index) =>
          Media.findByIdAndUpdate(item._id, {
            $set: {
              order: index,
            },
          }),
        ),
      );
    }

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully.",
    });
  } catch (error) {
    console.error("Delete media error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to delete media.",
      error: error?.message || "Unknown server error.",
    });
  }
};

/* ==================================================
   REORDER PORTFOLIO GALLERY
================================================== */

export const reorderMedia = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "items must be an array.",
      });
    }

    for (const item of items) {
      if (!item.id || typeof item.order !== "number") {
        return res.status(400).json({
          success: false,
          message: "Each reorder item must contain id and numeric order.",
        });
      }
    }

    const ids = items.map((item) => item.id);

    const galleryItems = await Media.find({
      _id: {
        $in: ids,
      },

      page: "portfolio",

      type: "gallery",
    });

    if (galleryItems.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: "Only portfolio gallery images can be reordered.",
      });
    }

    await Promise.all(
      items.map((item) =>
        Media.findByIdAndUpdate(item.id, {
          $set: {
            order: item.order,
          },
        }),
      ),
    );

    const updatedGallery = await Media.find({
      page: "portfolio",
      type: "gallery",
    }).sort({
      order: 1,
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Portfolio gallery reordered successfully.",
      data: updatedGallery,
    });
  } catch (error) {
    console.error("Reorder media error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to reorder gallery.",
      error: error?.message || "Unknown server error.",
    });
  }
};
