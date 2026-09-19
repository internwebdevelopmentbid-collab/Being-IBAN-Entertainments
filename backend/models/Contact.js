import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "New",
        "Not Contacted",
        "Contacted",
        "In Progress",
        "Follow Up",
        "Converted",
        "Not Interested",
      ],
      default: "Not Contacted",
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
