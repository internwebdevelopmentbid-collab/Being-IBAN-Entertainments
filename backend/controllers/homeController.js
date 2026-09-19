import Home from "../models/Home.js";
import cloudinary from "../config/cloudinary.js";

/* ==================================================
   GET HOME
================================================== */

export const getHome = async (req, res) => {
  try {
    let home = await Home.findOne();

    if (!home) {
      home = await Home.create({});
    }

    return res.status(200).json({
      success: true,
      home,
    });
  } catch (error) {
    console.error("Get home error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch home data",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE COMPLETE HOME
================================================== */

export const updateHome = async (req, res) => {
  try {
    let home = await Home.findOne();

    if (!home) {
      home = new Home();
    }

    /* ==================================================
       HERO
    ================================================== */

    if (req.body.hero) {
      const hero = req.body.hero;

      if (hero.title !== undefined) {
        home.hero.title = hero.title;
      }

      if (hero.subtitle !== undefined) {
        home.hero.subtitle = hero.subtitle;
      }

      if (hero.accent !== undefined) {
        home.hero.accent = hero.accent;
      }

      if (hero.description !== undefined) {
        home.hero.description = hero.description;
      }

      if (hero.video !== undefined) {
        home.hero.video = {
          ...(home.hero.video?.toObject?.() || {}),
          ...hero.video,
        };
      }

      if (hero.poster !== undefined) {
        home.hero.poster = {
          ...(home.hero.poster?.toObject?.() || {}),
          ...hero.poster,
        };
      }
    }

    /* ==================================================
       SOCIALS
    ================================================== */

    if (req.body.socials) {
      const socials = req.body.socials;

      if (socials.instagram !== undefined) {
        home.socials.instagram = socials.instagram;
      }

      if (socials.facebook !== undefined) {
        home.socials.facebook = socials.facebook;
      }

      if (socials.linkedin !== undefined) {
        home.socials.linkedin = socials.linkedin;
      }

      if (socials.twitter !== undefined) {
        home.socials.twitter = socials.twitter;
      }
    }

    /* ==================================================
       ABOUT
    ================================================== */

    if (req.body.about) {
      const about = req.body.about;

      if (about.title !== undefined) {
        home.about.title = about.title;
      }

      if (about.description !== undefined) {
        home.about.description = about.description;
      }

      if (about.image !== undefined) {
        home.about.image = {
          ...(home.about.image?.toObject?.() || {}),
          ...about.image,
        };
      }
    }

    /* ==================================================
       SEO
    ================================================== */

    if (req.body.seo) {
      const seo = req.body.seo;

      if (seo.title !== undefined) {
        home.seo.title = seo.title;
      }

      if (seo.description !== undefined) {
        home.seo.description = seo.description;
      }

      if (seo.keywords !== undefined) {
        home.seo.keywords = seo.keywords;
      }
    }

    /* ==================================================
       UPDATED BY
    ================================================== */

    if (req.body.updatedBy !== undefined) {
      home.updatedBy = req.body.updatedBy;
    }

    await home.save();

    return res.status(200).json({
      success: true,
      message: "Home updated successfully",
      home,
    });
  } catch (error) {
    console.error("Update home error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update home",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE HERO
================================================== */

export const updateHero = async (req, res) => {
  try {
    let home = await Home.findOne();

    if (!home) {
      home = new Home();
    }

    if (req.body.title !== undefined) {
      home.hero.title = req.body.title;
    }

    if (req.body.subtitle !== undefined) {
      home.hero.subtitle = req.body.subtitle;
    }

    /* NEW RED TEXT FIELD */

    if (req.body.accent !== undefined) {
      home.hero.accent = req.body.accent;
    }

    if (req.body.description !== undefined) {
      home.hero.description = req.body.description;
    }

    if (req.body.video !== undefined) {
      home.hero.video = {
        ...(home.hero.video?.toObject?.() || {}),
        ...req.body.video,
      };
    }

    if (req.body.poster !== undefined) {
      home.hero.poster = {
        ...(home.hero.poster?.toObject?.() || {}),
        ...req.body.poster,
      };
    }

    await home.save();

    return res.status(200).json({
      success: true,
      message: "Hero updated successfully",
      hero: home.hero,
    });
  } catch (error) {
    console.error("Update hero error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update hero",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE HERO VIDEO
================================================== */

export const updateHeroVideo = async (req, res) => {
  try {
    const { url, publicId, playbackUrl } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Video URL is required",
      });
    }

    let home = await Home.findOne();

    if (!home) {
      home = new Home();
    }

    const oldPublicId = home.hero?.video?.publicId;

    if (oldPublicId && oldPublicId !== publicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId, {
          resource_type: "video",
        });
      } catch (deleteError) {
        console.error("Failed to delete old hero video:", deleteError.message);
      }
    }

    home.hero.video = {
      url,
      publicId: publicId || "",
      playbackUrl: playbackUrl || "",
    };

    await home.save();

    return res.status(200).json({
      success: true,
      message: "Hero video updated successfully",
      video: home.hero.video,
    });
  } catch (error) {
    console.error("Update hero video error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update hero video",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE HERO POSTER
================================================== */

export const updateHeroPoster = async (req, res) => {
  try {
    const { url, publicId } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Poster URL is required",
      });
    }

    let home = await Home.findOne();

    if (!home) {
      home = new Home();
    }

    const oldPublicId = home.hero?.poster?.publicId;

    if (oldPublicId && oldPublicId !== publicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId, {
          resource_type: "image",
        });
      } catch (deleteError) {
        console.error("Failed to delete old hero poster:", deleteError.message);
      }
    }

    home.hero.poster = {
      url,
      publicId: publicId || "",
    };

    await home.save();

    return res.status(200).json({
      success: true,
      message: "Hero poster updated successfully",
      poster: home.hero.poster,
    });
  } catch (error) {
    console.error("Update hero poster error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update hero poster",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE SOCIALS
================================================== */

export const updateSocials = async (req, res) => {
  try {
    let home = await Home.findOne();

    if (!home) {
      home = new Home();
    }

    if (req.body.instagram !== undefined) {
      home.socials.instagram = req.body.instagram;
    }

    if (req.body.facebook !== undefined) {
      home.socials.facebook = req.body.facebook;
    }

    if (req.body.linkedin !== undefined) {
      home.socials.linkedin = req.body.linkedin;
    }

    if (req.body.twitter !== undefined) {
      home.socials.twitter = req.body.twitter;
    }

    await home.save();

    return res.status(200).json({
      success: true,
      message: "Social links updated successfully",
      socials: home.socials,
    });
  } catch (error) {
    console.error("Update socials error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update social links",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE ABOUT
================================================== */

export const updateAbout = async (req, res) => {
  try {
    let home = await Home.findOne();

    if (!home) {
      home = new Home();
    }

    if (req.body.title !== undefined) {
      home.about.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      home.about.description = req.body.description;
    }

    if (req.body.image !== undefined) {
      home.about.image = {
        ...(home.about.image?.toObject?.() || {}),
        ...req.body.image,
      };
    }

    await home.save();

    return res.status(200).json({
      success: true,
      message: "About section updated successfully",
      about: home.about,
    });
  } catch (error) {
    console.error("Update about error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update about section",
      error: error.message,
    });
  }
};
