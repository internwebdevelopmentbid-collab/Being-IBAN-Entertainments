import Job from "../models/Job.js";

/* ==================================================
   HELPERS
================================================== */

const normalizeSlug = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/* ==================================================
   GET ALL JOBS
   ADMIN
================================================== */

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

/* ==================================================
   GET PUBLISHED JOBS
   PUBLIC
================================================== */

export const getPublishedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: "Published",
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get published jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch published jobs",
      error: error.message,
    });
  }
};

/* ==================================================
   GET SINGLE JOB
   ADMIN
================================================== */

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

/* ==================================================
   GET JOB BY SLUG
   PUBLIC
================================================== */

export const getJobBySlug = async (req, res) => {
  try {
    const slug = normalizeSlug(req.params.slug);

    const job = await Job.findOne({
      slug,
      status: "Published",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job by slug error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

/* ==================================================
   CREATE JOB
   ADMIN
================================================== */

export const createJob = async (req, res) => {
  try {
    const {
      title,
      slug,
      department,
      location,
      employmentType,
      description,
      applicationUrl,
      status,
    } = req.body;

    /* -----------------------------------------------
       VALIDATION
    ------------------------------------------------ */

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job title is required",
      });
    }

    const normalizedSlug = normalizeSlug(slug || title);

    if (!normalizedSlug) {
      return res.status(400).json({
        success: false,
        message: "A valid job slug is required",
      });
    }

    if (!applicationUrl || !applicationUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "Application form URL is required",
      });
    }

    /* -----------------------------------------------
       CHECK DUPLICATE SLUG
    ------------------------------------------------ */

    const existingJob = await Job.findOne({
      slug: normalizedSlug,
    });

    if (existingJob) {
      return res.status(409).json({
        success: false,
        message: "A job with this slug already exists",
      });
    }

    /* -----------------------------------------------
       STATUS
    ------------------------------------------------ */

    const finalStatus = status || "Draft";

    /* -----------------------------------------------
       PUBLISHED DATE
    ------------------------------------------------ */

    const finalPublishedAt = finalStatus === "Published" ? new Date() : null;

    /* -----------------------------------------------
       CREATE JOB
    ------------------------------------------------ */

    const job = await Job.create({
      title: title.trim(),

      slug: normalizedSlug,

      department: department?.trim() || "",

      location: location?.trim() || "",

      employmentType: employmentType || "Full-time",

      description: description?.trim() || "",

      applicationUrl: applicationUrl.trim(),

      status: finalStatus,

      publishedAt: finalPublishedAt,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A job with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE JOB
   ADMIN
================================================== */

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    /* -----------------------------------------------
       TITLE
    ------------------------------------------------ */

    if (req.body.title !== undefined) {
      const title = String(req.body.title).trim();

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Job title is required",
        });
      }

      job.title = title;
    }

    /* -----------------------------------------------
       SLUG
    ------------------------------------------------ */

    if (req.body.slug !== undefined) {
      const normalizedSlug = normalizeSlug(req.body.slug);

      if (!normalizedSlug) {
        return res.status(400).json({
          success: false,
          message: "A valid job slug is required",
        });
      }

      const duplicate = await Job.findOne({
        slug: normalizedSlug,
        _id: {
          $ne: job._id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another job already uses this slug",
        });
      }

      job.slug = normalizedSlug;
    }

    /* -----------------------------------------------
       DEPARTMENT
    ------------------------------------------------ */

    if (req.body.department !== undefined) {
      job.department = String(req.body.department).trim();
    }

    /* -----------------------------------------------
       LOCATION
    ------------------------------------------------ */

    if (req.body.location !== undefined) {
      job.location = String(req.body.location).trim();
    }

    /* -----------------------------------------------
       EMPLOYMENT TYPE
    ------------------------------------------------ */

    if (req.body.employmentType !== undefined) {
      job.employmentType = req.body.employmentType;
    }

    /* -----------------------------------------------
       DESCRIPTION
    ------------------------------------------------ */

    if (req.body.description !== undefined) {
      job.description = String(req.body.description).trim();
    }

    /* -----------------------------------------------
       APPLICATION FORM URL
    ------------------------------------------------ */

    if (req.body.applicationUrl !== undefined) {
      const applicationUrl = String(req.body.applicationUrl).trim();

      if (!applicationUrl) {
        return res.status(400).json({
          success: false,
          message: "Application form URL is required",
        });
      }

      job.applicationUrl = applicationUrl;
    }

    /* -----------------------------------------------
       STATUS
    ------------------------------------------------ */

    if (req.body.status !== undefined) {
      job.status = req.body.status;

      if (req.body.status === "Published") {
        if (!job.publishedAt) {
          job.publishedAt = new Date();
        }
      }

      if (req.body.status === "Draft") {
        job.publishedAt = null;
      }
    }

    /* -----------------------------------------------
       SAVE
    ------------------------------------------------ */

    const updatedJob = await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A job with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
};

/* ==================================================
   DELETE JOB
   ADMIN
================================================== */

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};
