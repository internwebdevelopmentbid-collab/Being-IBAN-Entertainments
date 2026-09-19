import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
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
  },
  {
    _id: false,
  },
);

const brochureSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
      trim: true,
    },

    publicId: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    showcaseTitle: {
      type: String,
      default: "",
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    brochure: {
      type: brochureSchema,
      default: () => ({
        url: "",
        publicId: "",
      }),
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
