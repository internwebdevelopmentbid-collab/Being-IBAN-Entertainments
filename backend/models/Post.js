import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
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

    excerpt: {
      type: String,
      default: "",
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    coverImage: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },

    author: {
      name: {
        type: String,
        default: "",
        trim: true,
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

    category: {
      type: String,
      default: "",
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    /*
     * Draft:
     *     Not publicly visible.
     *
     * Scheduled:
     *     Waiting for Agenda to publish it.
     *
     * Published:
     *     Publicly visible.
     */
    status: {
      type: String,
      enum: ["Draft", "Scheduled", "Published"],
      default: "Draft",
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    /*
     * Exact scheduled publication time.
     *
     * MongoDB stores this as a UTC Date.
     */
    scheduledAt: {
      type: Date,
      default: null,
      index: true,
    },

    /*
     * Actual publication time.
     */
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },

    /*
     * Timezone selected by the admin when scheduling.
     *
     * Example:
     * Asia/Kolkata
     * America/New_York
     * Europe/London
     */
    timezone: {
      type: String,
      default: "Asia/Kolkata",
      trim: true,
    },

    readTime: {
      type: Number,
      default: 0,
    },

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
  },
  {
    timestamps: true,
  },
);

/*
 * Useful for public blog listings.
 */
postSchema.index({
  status: 1,
  publishedAt: -1,
});

/*
 * Useful for featured posts.
 */
postSchema.index({
  status: 1,
  featured: 1,
  publishedAt: -1,
});

const Post = mongoose.model("Post", postSchema);

export default Post;
