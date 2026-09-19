import Sponsor from "../models/Sponsor.js";

/* ==================================================
   GET ALL SPONSORS
================================================== */

export const getSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find()
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: sponsors.length,
      sponsors,
    });
  } catch (error) {
    console.error("Get sponsors error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sponsors.",
      error: error.message,
    });
  }
};

/* ==================================================
   GET ACTIVE SPONSORS
================================================== */

export const getActiveSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find({
      active: true,
    })
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: sponsors.length,
      sponsors,
    });
  } catch (error) {
    console.error("Get active sponsors error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active sponsors.",
      error: error.message,
    });
  }
};

/* ==================================================
   GET SINGLE SPONSOR
================================================== */

export const getSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id).lean();

    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      sponsor,
    });
  } catch (error) {
    console.error("Get sponsor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sponsor.",
      error: error.message,
    });
  }
};

/* ==================================================
   CREATE SPONSOR
================================================== */

export const createSponsor = async (req, res) => {
  try {
    const { name, logo, website, active, order } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Sponsor name is required.",
      });
    }

    if (!logo?.url) {
      return res.status(400).json({
        success: false,
        message: "Sponsor logo is required.",
      });
    }

    const sponsor = await Sponsor.create({
      name: name.trim(),

      logo: {
        url: logo.url,
        publicId: logo.publicId || "",
      },

      website: website?.trim() || "",

      active: typeof active === "boolean" ? active : true,

      order: Number.isFinite(Number(order)) ? Number(order) : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Sponsor created successfully.",
      sponsor,
    });
  } catch (error) {
    console.error("Create sponsor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create sponsor.",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE SPONSOR
================================================== */

export const updateSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found.",
      });
    }

    const { name, logo, website, active, order } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Sponsor name is required.",
      });
    }

    if (!logo?.url) {
      return res.status(400).json({
        success: false,
        message: "Sponsor logo is required.",
      });
    }

    sponsor.name = name.trim();

    sponsor.logo = {
      url: logo.url,
      publicId: logo.publicId || "",
    };

    sponsor.website = website?.trim() || "";

    sponsor.active = typeof active === "boolean" ? active : sponsor.active;

    sponsor.order = Number.isFinite(Number(order))
      ? Number(order)
      : sponsor.order;

    const updatedSponsor = await sponsor.save();

    return res.status(200).json({
      success: true,
      message: "Sponsor updated successfully.",
      sponsor: updatedSponsor,
    });
  } catch (error) {
    console.error("Update sponsor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update sponsor.",
      error: error.message,
    });
  }
};

/* ==================================================
   DELETE SPONSOR
================================================== */

export const deleteSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);

    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sponsor deleted successfully.",
    });
  } catch (error) {
    console.error("Delete sponsor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete sponsor.",
      error: error.message,
    });
  }
};
