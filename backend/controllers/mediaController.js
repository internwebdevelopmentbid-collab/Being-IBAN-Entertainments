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

/*
GET /api/media

Optional:

GET /api/media?page=about

GET /api/media?page=portfolio

GET /api/media?page=portfolio&type=cover

GET /api/media?page=portfolio&type=gallery
*/

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

      /*
       * Gallery is only valid for portfolio.
       */
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

    const media = await Media.find(filter).sort({
      type: 1,
      order: 1,
      createdAt: 1,
    });

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
      error: error.message,
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
      error: error.message,
    });
  }
};

/* ==================================================
   CREATE MEDIA
================================================== */

/*
POST /api/media

multipart/form-data

file
page
type
title
alt

For non-portfolio pages:

type is automatically forced to "cover".

For portfolio:

type can be:

cover
gallery
*/

export const createMedia = async (req, res) => {
  let temporaryFile = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    temporaryFile = req.file.path;

    const page = normalizePage(req.body.page);

    if (!ALLOWED_PAGES.includes(page)) {
      await cleanupTempFile(temporaryFile);

      return res.status(400).json({
        success: false,
        message: "Invalid media page.",
      });
    }

    /*
     * IMPORTANT:
     *
     * Only portfolio can choose the media type.
     *
     * Every other page is automatically cover.
     */
    let type = "cover";

    if (page === "portfolio") {
      type = normalizeType(req.body.type || "cover");

      if (!ALLOWED_TYPES.includes(type)) {
        await cleanupTempFile(temporaryFile);

        return res.status(400).json({
          success: false,
          message: "Invalid portfolio media type.",
        });
      }
    }

    /*
     * Cover images must be unique per page.
     *
     * If a cover already exists, reject creation.
     *
     * The frontend should use UPDATE when replacing it.
     */
    if (type === "cover") {
      const existingCover = await Media.findOne({
        page,
        type: "cover",
      });

      if (existingCover) {
        await cleanupTempFile(temporaryFile);

        return res.status(409).json({
          success: false,
          message:
            "A cover image already exists for this page. Update the existing cover image instead.",
        });
      }
    }

    /*
     * Gallery images are unlimited.
     *
     * Put the next gallery image at the end.
     */
    let order = 0;

    if (type === "gallery") {
      const lastGallery = await Media.findOne({
        page: "portfolio",
        type: "gallery",
      }).sort({
        order: -1,
      });

      order = lastGallery ? lastGallery.order + 1 : 0;
    }

    const resourceType = req.file.mimetype.startsWith("video/")
      ? "video"
      : "image";

    const folder = `media/${page}/${type}`;

    const result = await uploadToCloudinary(
      temporaryFile,
      folder,
      resourceType,
    );

    const media = await Media.create({
      page,
      type,

      title: req.body.title || "",
      alt: req.body.alt || "",

      url: result.secure_url,
      publicId: result.public_id,

      resourceType: result.resource_type || resourceType,
      format: result.format || "",

      width: result.width || null,
      height: result.height || null,
      bytes: result.bytes || null,

      active: true,
      order,
    });

    await cleanupTempFile(temporaryFile);
    temporaryFile = null;

    return res.status(201).json({
      success: true,
      message:
        type === "gallery"
          ? "Gallery image added successfully."
          : "Cover image created successfully.",

      data: media,
    });
  } catch (error) {
    console.error("Create media error:", error);

    await cleanupTempFile(temporaryFile);

    return res.status(500).json({
      success: false,
      message: "Failed to create media.",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE MEDIA
================================================== */

/*
PUT /api/media/:id

multipart/form-data

file       optional
title      optional
alt        optional
active     optional

The page/type normally should not be changed here.
*/

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

    /*
     * Update text fields.
     */
    if (req.body.title !== undefined) {
      media.title = req.body.title;
    }

    if (req.body.alt !== undefined) {
      media.alt = req.body.alt;
    }

    if (req.body.active !== undefined) {
      media.active = req.body.active === true || req.body.active === "true";
    }

    /*
     * Replace image if a new file was supplied.
     */
    if (req.file) {
      const resourceType = req.file.mimetype.startsWith("video/")
        ? "video"
        : "image";

      const folder = `media/${media.page}/${media.type}`;

      const result = await uploadToCloudinary(
        req.file.path,
        folder,
        resourceType,
      );

      /*
       * Delete previous Cloudinary file only after
       * the replacement upload succeeded.
       */
      await deleteCloudinaryAsset(
        media.publicId,
        media.resourceType || "image",
      );

      media.url = result.secure_url;
      media.publicId = result.public_id;

      media.resourceType = result.resource_type || resourceType;

      media.format = result.format || "";

      media.width = result.width || null;
      media.height = result.height || null;
      media.bytes = result.bytes || null;
    }

    await media.save();

    await cleanupTempFile(temporaryFile);
    temporaryFile = null;

    return res.status(200).json({
      success: true,
      message: "Media updated successfully.",
      data: media,
    });
  } catch (error) {
    console.error("Update media error:", error);

    await cleanupTempFile(temporaryFile);

    return res.status(500).json({
      success: false,
      message: "Failed to update media.",
      error: error.message,
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

    /*
     * Delete from Cloudinary.
     */
    await deleteCloudinaryAsset(media.publicId, media.resourceType || "image");

    /*
     * Delete database record.
     */
    await Media.findByIdAndDelete(req.params.id);

    /*
     * Re-number portfolio gallery after deletion.
     */
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
            order: index,
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
      message: "Failed to delete media.",
      error: error.message,
    });
  }
};

/* ==================================================
   REORDER PORTFOLIO GALLERY
================================================== */

/*
PATCH /api/media/reorder

Body:

{
  "items": [
    {
      "id": "media-id-1",
      "order": 0
    },
    {
      "id": "media-id-2",
      "order": 1
    }
  ]
}
*/

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

    /*
     * Make sure only portfolio gallery media
     * can be reordered.
     */
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
      message: "Failed to reorder gallery.",
      error: error.message,
    });
  }
};
