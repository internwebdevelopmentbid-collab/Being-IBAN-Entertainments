import Member from "../models/Member.js";

/* ==================================================
   GET ALL MEMBERS
================================================== */

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Get members error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch members",
      error: error.message,
    });
  }
};

/* ==================================================
   GET ACTIVE MEMBERS
================================================== */

export const getActiveMembers = async (req, res) => {
  try {
    const members = await Member.find({
      active: true,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Get active members error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active members",
      error: error.message,
    });
  }
};

/* ==================================================
   GET SINGLE MEMBER
================================================== */

export const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("Get member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch member",
      error: error.message,
    });
  }
};

/* ==================================================
   CREATE MEMBER
================================================== */

export const createMember = async (req, res) => {
  try {
    const { name, designation, bio, image, socialLinks, active, order } =
      req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Member name is required",
      });
    }

    if (!image?.url) {
      return res.status(400).json({
        success: false,
        message: "Member image is required",
      });
    }

    const member = await Member.create({
      name,
      designation,
      bio,
      image,
      active,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      member,
    });
  } catch (error) {
    console.error("Create member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create member",
      error: error.message,
    });
  }
};

/* ==================================================
   UPDATE MEMBER
================================================== */

export const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    Object.assign(member, req.body);

    const updatedMember = await member.save();

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Update member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update member",
      error: error.message,
    });
  }
};

/* ==================================================
   DELETE MEMBER
================================================== */

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error("Delete member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete member",
      error: error.message,
    });
  }
};
