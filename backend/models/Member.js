import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
    },

    image: {
      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        default: "",
      },
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

const Member = mongoose.model("Member", memberSchema);

export default Member;
