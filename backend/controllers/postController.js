import mongoose from "mongoose";

import Post from "../models/Post.js";

import { schedulePost, cancelScheduledPost } from "../jobs/postScheduler.js";

/* ==================================================
   GET ADMIN POSTS
================================================== */

export const getAdminPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get admin posts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

/* ==================================================
   GET PUBLIC POSTS
================================================== */

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: "Published",
    }).sort({
      publishedAt: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get posts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

/* ==================================================
   GET PUBLISHED POSTS
================================================== */

export const getPublishedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: "Published",
    }).sort({
      publishedAt: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get published posts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch published posts",
      error: error.message,
    });
  }
};

/* ==================================================
   GET FEATURED POSTS
================================================== */

export const getFeaturedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: "Published",
      featured: true,
    }).sort({
      publishedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get featured posts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch featured posts",
      error: error.message,
    });
  }
};

/* ==================================================
   GET SINGLE PUBLIC POST
================================================== */

export const getPost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findOne({
      _id: req.params.id,
      status: "Published",
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get post error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};

/* ==================================================
   GET POST BY SLUG
================================================== */

export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      status: "Published",
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get post by slug error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};

/* ==================================================
   CREATE POST
================================================== */

export const createPost = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      category,
      tags,
      status = "Draft",
      featured = false,
      scheduledAt,
      timezone = "Asia/Kolkata",
      publishedAt,
      readTime,
      seo,
    } = req.body;

    /* ------------------------------------------
       REQUIRED FIELDS
    ------------------------------------------ */

    if (!title?.trim() || !slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and slug are required",
      });
    }

    /* ------------------------------------------
       VALIDATE STATUS
    ------------------------------------------ */

    if (!["Draft", "Scheduled", "Published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post status",
      });
    }

    /* ------------------------------------------
       CHECK SLUG
    ------------------------------------------ */

    const existingPost = await Post.findOne({
      slug: slug.trim().toLowerCase(),
    });

    if (existingPost) {
      return res.status(409).json({
        success: false,
        message: "A post with this slug already exists",
      });
    }

    /* ------------------------------------------
       DATE VARIABLES
    ------------------------------------------ */

    let finalScheduledAt = null;
    let finalPublishedAt = null;

    /* ------------------------------------------
       SCHEDULED
    ------------------------------------------ */

    if (status === "Scheduled") {
      if (!scheduledAt) {
        return res.status(400).json({
          success: false,
          message: "scheduledAt is required for scheduled posts",
        });
      }

      finalScheduledAt = new Date(scheduledAt);

      if (Number.isNaN(finalScheduledAt.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid scheduledAt date",
        });
      }

      if (finalScheduledAt <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled time must be in the future",
        });
      }
    }

    /* ------------------------------------------
       PUBLISHED
    ------------------------------------------ */

    if (status === "Published") {
      if (publishedAt) {
        finalPublishedAt = new Date(publishedAt);

        if (Number.isNaN(finalPublishedAt.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid publishedAt date",
          });
        }
      } else {
        finalPublishedAt = new Date();
      }
    }

    /* ------------------------------------------
       CREATE POST
    ------------------------------------------ */

    const post = await Post.create({
      title: title.trim(),

      slug: slug.trim().toLowerCase(),

      excerpt,
      content,

      coverImage,

      author,

      category,

      tags,

      status,

      featured,

      scheduledAt: finalScheduledAt,

      publishedAt: finalPublishedAt,

      timezone,

      readTime,

      seo,
    });

    /* ------------------------------------------
       CREATE AGENDA JOB
       
       IMPORTANT:
       Pass a STRING ID to Agenda.
       Do not pass Mongoose ObjectId.
    ------------------------------------------ */

    if (status === "Scheduled" && post.scheduledAt) {
      await schedulePost(post._id.toString(), post.scheduledAt);
    }

    res.status(201).json({
      success: true,

      message:
        status === "Scheduled"
          ? "Post scheduled successfully"
          : status === "Published"
            ? "Post published successfully"
            : "Post created successfully",

      post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE POST
================================================== */

export const updatePost = async (req, res) => {
  try {
    /* ------------------------------------------
       VALIDATE ID
    ------------------------------------------ */

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const oldStatus = post.status;

    const newStatus = req.body.status || post.status;

    /* ------------------------------------------
       VALIDATE STATUS
    ------------------------------------------ */

    if (!["Draft", "Scheduled", "Published"].includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post status",
      });
    }

    /* ------------------------------------------
       VALIDATE SCHEDULE
    ------------------------------------------ */

    let newScheduledAt = null;

    if (newStatus === "Scheduled") {
      if (!req.body.scheduledAt) {
        return res.status(400).json({
          success: false,
          message: "scheduledAt is required for scheduled posts",
        });
      }

      newScheduledAt = new Date(req.body.scheduledAt);

      if (Number.isNaN(newScheduledAt.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid scheduledAt date",
        });
      }

      if (newScheduledAt <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled time must be in the future",
        });
      }
    }

    /* ------------------------------------------
       VALIDATE SLUG
    ------------------------------------------ */

    if (req.body.slug) {
      const normalizedSlug = req.body.slug.trim().toLowerCase();

      const duplicate = await Post.findOne({
        slug: normalizedSlug,

        _id: {
          $ne: post._id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "A post with this slug already exists",
        });
      }
    }

    /* ------------------------------------------
       CANCEL OLD AGENDA JOB
       
       IMPORTANT:
       Convert Mongoose ObjectId to STRING.
    ------------------------------------------ */

    if (oldStatus === "Scheduled") {
      await cancelScheduledPost(post._id.toString());
    }

    /* ------------------------------------------
       ALLOWED FIELDS
    ------------------------------------------ */

    const allowedFields = [
      "title",
      "slug",
      "excerpt",
      "content",
      "coverImage",
      "author",
      "category",
      "tags",
      "featured",
      "readTime",
      "seo",
    ];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        post[field] = req.body[field];
      }
    }

    /* ------------------------------------------
       TIMEZONE
    ------------------------------------------ */

    if (req.body.timezone) {
      post.timezone = req.body.timezone;
    }

    /* ------------------------------------------
       DRAFT
    ------------------------------------------ */

    if (newStatus === "Draft") {
      post.status = "Draft";

      post.scheduledAt = null;

      post.publishedAt = null;
    }

    /* ------------------------------------------
       PUBLISHED
    ------------------------------------------ */

    if (newStatus === "Published") {
      post.status = "Published";

      post.scheduledAt = null;

      if (req.body.publishedAt) {
        const requestedPublishedAt = new Date(req.body.publishedAt);

        if (Number.isNaN(requestedPublishedAt.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid publishedAt date",
          });
        }

        post.publishedAt = requestedPublishedAt;
      } else if (!post.publishedAt) {
        post.publishedAt = new Date();
      }
    }

    /* ------------------------------------------
       SCHEDULED
    ------------------------------------------ */

    if (newStatus === "Scheduled") {
      post.status = "Scheduled";

      post.scheduledAt = newScheduledAt;

      post.publishedAt = null;
    }

    /* ------------------------------------------
       SAVE
    ------------------------------------------ */

    const updatedPost = await post.save();

    /* ------------------------------------------
       CREATE NEW AGENDA JOB
       
       IMPORTANT:
       Convert Mongoose ObjectId to STRING.
    ------------------------------------------ */

    if (newStatus === "Scheduled" && updatedPost.scheduledAt) {
      await schedulePost(updatedPost._id.toString(), updatedPost.scheduledAt);
    }

    /* ------------------------------------------
       RESPONSE
    ------------------------------------------ */

    let message = "Post updated successfully";

    if (newStatus === "Scheduled") {
      message = "Post scheduled successfully";
    }

    if (newStatus === "Published") {
      message = "Post published successfully";
    }

    if (newStatus === "Draft") {
      message = "Post saved as draft";
    }

    res.status(200).json({
      success: true,
      message,
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
};

/* ==================================================
   DELETE POST
================================================== */

export const deletePost = async (req, res) => {
  try {
    /* ------------------------------------------
       VALIDATE ID
    ------------------------------------------ */

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    /* ------------------------------------------
       CANCEL AGENDA JOB
       
       IMPORTANT:
       Convert Mongoose ObjectId to STRING.
    ------------------------------------------ */

    if (post.status === "Scheduled") {
      await cancelScheduledPost(post._id.toString());
    }

    /* ------------------------------------------
       DELETE
    ------------------------------------------ */

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};
