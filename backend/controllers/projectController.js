import Project from "../models/Project.js";

/* ==================================================
   GET ALL PROJECTS
================================================== */

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

/* ==================================================
   GET FEATURED PROJECTS
================================================== */

export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      homepageFeatured: true,
      status: "published",
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get featured projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch featured projects",
      error: error.message,
    });
  }
};

/* ==================================================
   GET SINGLE PROJECT
================================================== */

export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

/* ==================================================
   CREATE PROJECT
================================================== */

export const createProject = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      type,
      year,
      client,
      description,
      shortDescription,
      projectLink,
      displayOrder,
      status,
      homepageFeatured,
      coverImage,
    } = req.body;

    /* ----------------------------------------------
       REQUIRED FIELDS
    ---------------------------------------------- */

    if (!title || !slug) {
      return res.status(400).json({
        success: false,
        message: "Title and slug are required",
      });
    }

    /* ----------------------------------------------
       CHECK DUPLICATE SLUG
    ---------------------------------------------- */

    const existingProject = await Project.findOne({
      slug: slug.toLowerCase(),
    });

    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: "A project with this slug already exists",
      });
    }

    /* ----------------------------------------------
       CREATE
    ---------------------------------------------- */

    const project = await Project.create({
      title,
      slug: slug.toLowerCase(),

      category,
      type,
      year,
      client,

      description,
      shortDescription,

      projectLink,

      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,

      status: status === "draft" ? "draft" : "published",

      homepageFeatured: Boolean(homepageFeatured),

      coverImage: {
        url: coverImage?.url || "",
        publicId: coverImage?.publicId || "",
      },
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE PROJECT
================================================== */

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const {
      title,
      slug,
      category,
      type,
      year,
      client,
      description,
      shortDescription,
      projectLink,
      displayOrder,
      status,
      homepageFeatured,
      coverImage,
    } = req.body;

    /* ----------------------------------------------
       CHECK SLUG DUPLICATE
    ---------------------------------------------- */

    if (slug && slug !== project.slug) {
      const existingProject = await Project.findOne({
        slug: slug.toLowerCase(),
        _id: { $ne: project._id },
      });

      if (existingProject) {
        return res.status(409).json({
          success: false,
          message: "A project with this slug already exists",
        });
      }
    }

    /* ----------------------------------------------
       UPDATE FIELDS
    ---------------------------------------------- */

    if (title !== undefined) {
      project.title = title;
    }

    if (slug !== undefined) {
      project.slug = slug.toLowerCase();
    }

    if (category !== undefined) {
      project.category = category;
    }

    if (type !== undefined) {
      project.type = type;
    }

    if (year !== undefined) {
      project.year = year;
    }

    if (client !== undefined) {
      project.client = client;
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (shortDescription !== undefined) {
      project.shortDescription = shortDescription;
    }

    if (projectLink !== undefined) {
      project.projectLink = projectLink;
    }

    if (displayOrder !== undefined) {
      project.displayOrder = Number(displayOrder);
    }

    if (status !== undefined) {
      project.status = status === "draft" ? "draft" : "published";
    }

    if (homepageFeatured !== undefined) {
      project.homepageFeatured = Boolean(homepageFeatured);
    }

    if (coverImage !== undefined) {
      project.coverImage = {
        url: coverImage?.url || "",
        publicId: coverImage?.publicId || "",
      };
    }

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

/* ==================================================
   DELETE PROJECT
================================================== */

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};
