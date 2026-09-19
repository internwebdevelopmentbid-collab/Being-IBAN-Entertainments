import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
  {
    /* ==================================================
       HERO
    ================================================== */

    hero: {
      title: {
        type: String,
        default: "Experience",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "the magic of",
        trim: true,
      },

      accent: {
        type: String,
        default: "Storytelling.",
        trim: true,
      },

      description: {
        type: String,
        default:
          "A grand movie premiere backdrop, with lights, a red carpet, and an audience.",
      },

      video: {
        url: {
          type: String,
          default: "",
        },

        publicId: {
          type: String,
          default: "",
        },

        playbackUrl: {
          type: String,
          default: "",
        },
      },

      poster: {
        url: {
          type: String,
          default: "",
        },

        publicId: {
          type: String,
          default: "",
        },
      },
    },

    /* ==================================================
       SOCIALS
    ================================================== */

    socials: {
      instagram: {
        type: String,
        default: "",
      },

      facebook: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      twitter: {
        type: String,
        default: "",
      },
    },

    /* ==================================================
       ABOUT
    ================================================== */

    about: {
      title: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      image: {
        url: {
          type: String,
          default: "",
        },

        publicId: {
          type: String,
          default: "",
        },
      },
    },

    /* ==================================================
       SEO
    ================================================== */

    seo: {
      title: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      keywords: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    /* ==================================================
       UPDATED BY
    ================================================== */

    updatedBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Home = mongoose.model("Home", homeSchema);

export default Home;
