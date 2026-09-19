import mongoose from "mongoose";

const posterPageSchema = new mongoose.Schema(
  {
    home: {
      type: Boolean,
      default: false,
    },

    about: {
      type: Boolean,
      default: false,
    },

    services: {
      type: Boolean,
      default: false,
    },

    portfolio: {
      type: Boolean,
      default: false,
    },

    careers: {
      type: Boolean,
      default: false,
    },

    blog: {
      type: Boolean,
      default: false,
    },

    contact: {
      type: Boolean,
      default: false,
    },

    terms: {
      type: Boolean,
      default: false,
    },

    privacy: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const posterSchema = new mongoose.Schema(
  {
    /*
     * This makes the poster a singleton.
     *
     * There should only ever be one document
     * with key = "main".
     */
    key: {
      type: String,
      default: "main",
      unique: true,
      immutable: true,
    },

    title: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      url: {
        type: String,
        required: true,
        trim: true,
      },

      publicId: {
        type: String,
        default: "",
        trim: true,
      },

      resourceType: {
        type: String,
        default: "image",
      },

      format: {
        type: String,
        default: "",
      },

      width: {
        type: Number,
        default: null,
      },

      height: {
        type: Number,
        default: null,
      },
    },

    link: {
      type: String,
      trim: true,
      default: "",
    },

    active: {
      type: Boolean,
      default: false,
    },

    pages: {
      type: posterPageSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

const Poster = mongoose.model("Poster", posterSchema);

export default Poster;
