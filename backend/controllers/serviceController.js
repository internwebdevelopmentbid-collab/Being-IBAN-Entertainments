import Service from "../models/Service.js";

/* ==================================================
   HELPERS
================================================== */

/**
 * Parse JSON when the value arrives as a string.
 * Also supports already-parsed objects/arrays.
 */
const parseJson = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

/**
 * Convert common boolean representations to Boolean.
 */
const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
};

/**
 * Normalize one image.
 *
 * Supports:
 *
 * "https://..."
 *
 * {
 *   url: "...",
 *   publicId: "..."
 * }
 */
const normalizeImage = (image) => {
  if (typeof image === "string") {
    const url = image.trim();

    if (!url) {
      return null;
    }

    return {
      url,
      publicId: "",
    };
  }

  if (image && typeof image === "object") {
    const url = typeof image.url === "string" ? image.url.trim() : "";

    if (!url) {
      return null;
    }

    return {
      url,
      publicId: typeof image.publicId === "string" ? image.publicId.trim() : "",
    };
  }

  return null;
};

/**
 * Normalize images array.
 */
const normalizeImages = (images) => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map(normalizeImage).filter(Boolean);
};

/**
 * Normalize brochure.
 *
 * Supports both:
 *
 * "https://..."
 *
 * and:
 *
 * {
 *   url: "...",
 *   publicId: "..."
 * }
 */
const normalizeBrochure = (brochure) => {
  if (typeof brochure === "string") {
    return {
      url: brochure.trim(),
      publicId: "",
    };
  }

  if (brochure && typeof brochure === "object") {
    return {
      url: typeof brochure.url === "string" ? brochure.url.trim() : "",

      publicId:
        typeof brochure.publicId === "string" ? brochure.publicId.trim() : "",
    };
  }

  return {
    url: "",
    publicId: "",
  };
};

/**
 * Normalize features.
 */
const normalizeFeatures = (features) => {
  if (!Array.isArray(features)) {
    return [];
  }

  return features
    .filter((feature) => typeof feature === "string")
    .map((feature) => feature.trim())
    .filter(Boolean);
};

/* ==================================================
   GET ALL SERVICES
================================================== */

export const getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

/* ==================================================
   GET ACTIVE SERVICES
================================================== */

export const getActiveServices = async (req, res) => {
  try {
    const services = await Service.find({
      active: true,
    })
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get active services error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active services",
      error: error.message,
    });
  }
};

/* ==================================================
   GET FEATURED SERVICES
================================================== */

export const getFeaturedServices = async (req, res) => {
  try {
    const services = await Service.find({
      active: true,
      featured: true,
    })
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get featured services error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured services",
      error: error.message,
    });
  }
};

/* ==================================================
   GET SINGLE SERVICE
================================================== */

export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};

/* ==================================================
   CREATE SERVICE
================================================== */

export const createService = async (req, res) => {
  try {
    const {
      title,
      slug,
      showcaseTitle,
      shortDescription,
      description,
      brochure,
      images,
      features,
      active,
      featured,
      order,
    } = req.body;

    /* ----------------------------------------------
       TITLE
    ---------------------------------------------- */

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    /* ----------------------------------------------
       SLUG
    ---------------------------------------------- */

    if (!slug || typeof slug !== "string" || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const normalizedSlug = slug.toLowerCase().trim();

    /* ----------------------------------------------
       CHECK DUPLICATE SLUG
    ---------------------------------------------- */

    const existingService = await Service.findOne({
      slug: normalizedSlug,
    });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "A service with this slug already exists",
      });
    }

    /* ----------------------------------------------
       PARSE DATA
    ---------------------------------------------- */

    const parsedImages = parseJson(images, []);

    const parsedFeatures = parseJson(features, []);

    const parsedBrochure = parseJson(brochure, {
      url: "",
      publicId: "",
    });

    /* ----------------------------------------------
       VALIDATE IMAGES
    ---------------------------------------------- */

    if (!Array.isArray(parsedImages)) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array",
      });
    }

    /* ----------------------------------------------
       VALIDATE FEATURES
    ---------------------------------------------- */

    if (!Array.isArray(parsedFeatures)) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array",
      });
    }

    /* ----------------------------------------------
       NORMALIZE
    ---------------------------------------------- */

    const normalizedImages = normalizeImages(parsedImages);

    const normalizedFeatures = normalizeFeatures(parsedFeatures);

    const normalizedBrochure = normalizeBrochure(parsedBrochure);

    /* ----------------------------------------------
       CREATE
    ---------------------------------------------- */

    const service = await Service.create({
      title: title.trim(),

      slug: normalizedSlug,

      showcaseTitle:
        typeof showcaseTitle === "string" ? showcaseTitle.trim() : "",

      shortDescription:
        typeof shortDescription === "string" ? shortDescription.trim() : "",

      description: typeof description === "string" ? description : "",

      brochure: normalizedBrochure,

      images: normalizedImages,

      features: normalizedFeatures,

      active: parseBoolean(active, true),

      featured: parseBoolean(featured, false),

      order: Number(order) || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    /* Duplicate key safety */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A service with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE SERVICE
================================================== */

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const {
      title,
      slug,
      showcaseTitle,
      shortDescription,
      description,
      brochure,
      images,
      features,
      active,
      featured,
      order,
    } = req.body;

    /* ----------------------------------------------
       TITLE
    ---------------------------------------------- */

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      service.title = title.trim();
    }

    /* ----------------------------------------------
       SLUG
    ---------------------------------------------- */

    if (slug !== undefined) {
      if (typeof slug !== "string" || !slug.trim()) {
        return res.status(400).json({
          success: false,
          message: "Slug is required",
        });
      }

      const normalizedSlug = slug.toLowerCase().trim();

      const existingService = await Service.findOne({
        slug: normalizedSlug,

        _id: {
          $ne: service._id,
        },
      });

      if (existingService) {
        return res.status(409).json({
          success: false,
          message: "A service with this slug already exists",
        });
      }

      service.slug = normalizedSlug;
    }

    /* ----------------------------------------------
       TEXT FIELDS
    ---------------------------------------------- */

    if (showcaseTitle !== undefined) {
      service.showcaseTitle =
        typeof showcaseTitle === "string" ? showcaseTitle.trim() : "";
    }

    if (shortDescription !== undefined) {
      service.shortDescription =
        typeof shortDescription === "string" ? shortDescription.trim() : "";
    }

    if (description !== undefined) {
      service.description = typeof description === "string" ? description : "";
    }

    /* ----------------------------------------------
       BROCHURE
    ---------------------------------------------- */

    if (brochure !== undefined) {
      const parsedBrochure = parseJson(brochure, {
        url: "",
        publicId: "",
      });

      service.brochure = normalizeBrochure(parsedBrochure);
    }

    /* ----------------------------------------------
       IMAGES
    ---------------------------------------------- */

    if (images !== undefined) {
      const parsedImages = parseJson(images, []);

      if (!Array.isArray(parsedImages)) {
        return res.status(400).json({
          success: false,
          message: "Images must be an array",
        });
      }

      service.images = normalizeImages(parsedImages);
    }

    /* ----------------------------------------------
       FEATURES
    ---------------------------------------------- */

    if (features !== undefined) {
      const parsedFeatures = parseJson(features, []);

      if (!Array.isArray(parsedFeatures)) {
        return res.status(400).json({
          success: false,
          message: "Features must be an array",
        });
      }

      service.features = normalizeFeatures(parsedFeatures);
    }

    /* ----------------------------------------------
       STATUS
    ---------------------------------------------- */

    if (active !== undefined) {
      service.active = parseBoolean(active, false);
    }

    /* ----------------------------------------------
       FEATURED
    ---------------------------------------------- */

    if (featured !== undefined) {
      service.featured = parseBoolean(featured, false);
    }

    /* ----------------------------------------------
       ORDER
    ---------------------------------------------- */

    if (order !== undefined) {
      service.order = Number(order) || 0;
    }

    /* ----------------------------------------------
       SAVE
    ---------------------------------------------- */

    const updatedService = await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Update service error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A service with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
};

/* ==================================================
   DELETE SERVICE
================================================== */

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
};
