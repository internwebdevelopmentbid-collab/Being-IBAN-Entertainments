import Poster from "../models/Poster.js";

/* ==================================================
   HELPERS
================================================== */

const PAGE_KEYS = [
  "home",
  "about",
  "services",
  "portfolio",
  "careers",
  "blog",
  "contact",
  "terms",
  "privacy",
];

const normalizePages = (pages = {}) => {
  const normalized = {};

  for (const page of PAGE_KEYS) {
    normalized[page] = Boolean(pages?.[page]);
  }

  return normalized;
};

/*
 * Convert database poster into the format expected
 * by the frontend.
 *
 * Database:
 *   active
 *
 * Frontend:
 *   enabled
 */
const serializePoster = (poster) => {
  if (!poster) {
    return null;
  }

  const data =
    typeof poster.toObject === "function" ? poster.toObject() : { ...poster };

  return {
    ...data,

    // Frontend uses "enabled"
    enabled: Boolean(data.active),

    // Keep active available too if needed
    active: Boolean(data.active),
  };
};

/* ==================================================
   GET ACTIVE POSTER
================================================== */

/*
 * PUBLIC
 *
 * GET /api/posters/active?page=about
 *
 * Poster appears only when:
 *
 * active === true
 * AND
 * pages[page] === true
 */

export const getActivePoster = async (req, res) => {
  try {
    const page = String(req.query.page || "").toLowerCase();

    if (!PAGE_KEYS.includes(page)) {
      return res.status(200).json({
        success: true,
        poster: null,
      });
    }

    const poster = await Poster.findOne({
      key: "main",
      active: true,
      [`pages.${page}`]: true,
    }).lean();

    if (!poster) {
      return res.status(200).json({
        success: true,
        poster: null,
      });
    }

    return res.status(200).json({
      success: true,
      poster: serializePoster(poster),
    });
  } catch (error) {
    console.error("Get active poster error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load active poster.",
    });
  }
};

/* ==================================================
   GET POSTER
================================================== */

/*
 * ADMIN
 *
 * GET /api/posters
 */

export const getPosters = async (req, res) => {
  try {
    const poster = await Poster.findOne({
      key: "main",
    }).lean();

    return res.status(200).json({
      success: true,
      poster: serializePoster(poster),
    });
  } catch (error) {
    console.error("Get posters error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load poster.",
    });
  }
};

/* ==================================================
   GET SINGLE POSTER
================================================== */

export const getPoster = async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id).lean();

    if (!poster) {
      return res.status(404).json({
        success: false,
        message: "Poster not found.",
      });
    }

    return res.status(200).json({
      success: true,
      poster: serializePoster(poster),
    });
  } catch (error) {
    console.error("Get poster error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load poster.",
    });
  }
};

/* ==================================================
   CREATE POSTER
================================================== */

/*
 * ADMIN
 *
 * POST /api/posters
 *
 * Only one poster is allowed.
 */

export const createPoster = async (req, res) => {
  try {
    const existingPoster = await Poster.findOne({
      key: "main",
    });

    if (existingPoster) {
      return res.status(409).json({
        success: false,
        message: "A poster already exists. Update the existing poster instead.",
        poster: serializePoster(existingPoster),
      });
    }

    const { title = "", image, link = "", pages = {} } = req.body;

    /*
     * IMPORTANT
     *
     * Frontend sends:
     *
     * enabled: true/false
     *
     * We convert that to:
     *
     * active: true/false
     */

    const enabled =
      typeof req.body.enabled === "boolean"
        ? req.body.enabled
        : Boolean(req.body.active);

    if (!image?.url) {
      return res.status(400).json({
        success: false,
        message: "Poster image is required.",
      });
    }

    const poster = await Poster.create({
      key: "main",

      title,

      image: {
        url: image.url,
        publicId: image.publicId || "",
        resourceType: image.resourceType || "image",
        format: image.format || "",
        width: image.width || null,
        height: image.height || null,
      },

      link: String(link || "").trim(),

      /*
       * MASTER TOGGLE
       */
      active: enabled,

      pages: normalizePages(pages),
    });

    return res.status(201).json({
      success: true,
      message: "Poster created successfully.",
      poster: serializePoster(poster),
    });
  } catch (error) {
    console.error("Create poster error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A poster already exists. Update the existing poster instead.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create poster.",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE POSTER
================================================== */

/*
 * ADMIN
 *
 * PUT /api/posters/:id
 */

export const updatePoster = async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id);

    if (!poster) {
      return res.status(404).json({
        success: false,
        message: "Poster not found.",
      });
    }

    const { title, image, link, pages } = req.body;

    /* -----------------------------------------------
       TITLE
    ------------------------------------------------ */

    if (title !== undefined) {
      poster.title = title;
    }

    /* -----------------------------------------------
       IMAGE
    ------------------------------------------------ */

    if (image !== undefined) {
      if (!image?.url) {
        return res.status(400).json({
          success: false,
          message: "Poster image URL is required.",
        });
      }

      poster.image = {
        url: image.url,
        publicId: image.publicId || "",
        resourceType: image.resourceType || "image",
        format: image.format || "",
        width: image.width || null,
        height: image.height || null,
      };
    }

    /* -----------------------------------------------
       LINK
    ------------------------------------------------ */

    if (link !== undefined) {
      poster.link = String(link || "").trim();
    }

    /* -----------------------------------------------
       MASTER TOGGLE
    ------------------------------------------------ */

    /*
     * THIS IS THE IMPORTANT FIX.
     *
     * Frontend sends:
     *
     * enabled: false
     *
     * We MUST explicitly save false.
     *
     * Do NOT use:
     *
     * poster.active = req.body.enabled || true
     *
     * because false would become true.
     */

    if (typeof req.body.enabled === "boolean") {
      poster.active = req.body.enabled;
    } else if (typeof req.body.active === "boolean") {
      poster.active = req.body.active;
    }

    /* -----------------------------------------------
       PAGE VISIBILITY
    ------------------------------------------------ */

    if (pages !== undefined) {
      poster.pages = normalizePages(pages);
    }

    await poster.save();

    return res.status(200).json({
      success: true,
      message: "Poster updated successfully.",
      poster: serializePoster(poster),
    });
  } catch (error) {
    console.error("Update poster error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update poster.",
      error: error.message,
    });
  }
};

/* ==================================================
   DELETE POSTER
================================================== */

/*
 * ADMIN
 *
 * DELETE /api/posters/:id
 */

export const deletePoster = async (req, res) => {
  try {
    const poster = await Poster.findByIdAndDelete(req.params.id);

    if (!poster) {
      return res.status(404).json({
        success: false,
        message: "Poster not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Poster deleted successfully.",
    });
  } catch (error) {
    console.error("Delete poster error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete poster.",
    });
  }
};
