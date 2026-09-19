import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        default: "",
      },
    },

    website: {
      type: String,
      default: "",
      trim: true,
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

const Sponsor = mongoose.model("Sponsor", sponsorSchema);

export default Sponsor;
