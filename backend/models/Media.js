import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      enum: ["about", "services", "portfolio", "careers", "blog", "contact"],
      required: true,
      lowercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["cover", "gallery"],
      required: true,
      default: "cover",
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    alt: {
      type: String,
      default: "",
      trim: true,
    },

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
      trim: true,
    },

    format: {
      type: String,
      default: "",
      trim: true,
    },

    width: {
      type: Number,
      default: null,
    },

    height: {
      type: Number,
      default: null,
    },

    bytes: {
      type: Number,
      default: null,
    },

    active: {
      type: Boolean,
      default: true,
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

/*
 * Only Portfolio can have gallery media.
 *
 * This validation prevents:
 *
 * about + gallery
 * services + gallery
 * careers + gallery
 * blog + gallery
 * contact + gallery
 */
mediaSchema.pre("validate", function (next) {
  if (this.type === "gallery" && this.page !== "portfolio") {
    return next(
      new Error("Gallery media is only allowed for the portfolio page."),
    );
  }

  if (this.page !== "portfolio") {
    this.type = "cover";
  }

  next();
});

/*
 * A page can have only ONE cover image.
 *
 * Portfolio can therefore have:
 *
 * portfolio + cover     -> one
 * portfolio + gallery   -> unlimited
 */
mediaSchema.index(
  { page: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: {
      type: "cover",
    },
  },
);

mediaSchema.index({
  page: 1,
  type: 1,
  order: 1,
});

const Media = mongoose.model("Media", mediaSchema);

export default Media;
