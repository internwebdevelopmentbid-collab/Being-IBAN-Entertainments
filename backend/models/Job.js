import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
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

    department: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
      default: "Full-time",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    applicationUrl: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Closed"],
      default: "Draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
