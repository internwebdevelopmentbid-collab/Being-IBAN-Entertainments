import Contact from "../models/Contact.js";
import sendContactEmail from "../utils/sendContactEmail.js";

/**
 * CREATE CONTACT
 * POST /api/contact
 *
 * Public contact form submission.
 *
 * 1. Validate request
 * 2. Save contact to MongoDB
 * 3. Send confirmation email to submitted email address
 */
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    /*
     * Validate required fields.
     */
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and message are required.",
      });
    }

    /*
     * Clean input.
     */
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim();
    const cleanMessage = String(message).trim();

    /*
     * Make sure values aren't empty after trimming.
     */
    if (!cleanName || !cleanEmail || !cleanPhone || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "All contact fields are required.",
      });
    }

    /*
     * Save contact to MongoDB.
     */
    const contact = await Contact.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
      status: "Not Contacted",
      tags: [],
    });

    /*
     * Send confirmation email to the email
     * provided by the visitor.
     *
     * We intentionally don't fail the contact
     * submission if the email provider fails.
     */
    try {
      await sendContactEmail(contact);

      console.log(`Contact confirmation email sent to ${contact.email}`);
    } catch (emailError) {
      console.error(
        `Failed to send contact confirmation email to ${contact.email}:`,
        emailError,
      );
    }

    /*
     * Contact was successfully saved.
     */
    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully.",
      data: contact,
    });
  } catch (error) {
    console.error("Create contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit inquiry.",
    });
  }
};

/**
 * GET ALL CONTACTS
 * GET /api/contact
 *
 * Admin only.
 */
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact inquiries.",
    });
  }
};

/**
 * GET SINGLE CONTACT
 * GET /api/contact/:id
 *
 * Admin only.
 */
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact inquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Get contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact inquiry.",
    });
  }
};

/**
 * UPDATE CONTACT
 * PATCH /api/contact/:id
 *
 * Admin only.
 *
 * Used to update:
 * - status
 * - tags
 */
export const updateContact = async (req, res) => {
  try {
    const { status, tags } = req.body;

    const updateData = {};

    /*
     * Update status.
     */
    if (status !== undefined) {
      updateData.status = status;
    }

    /*
     * Update tags.
     */
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({
          success: false,
          message: "Tags must be an array.",
        });
      }

      updateData.tags = tags.map((tag) => String(tag).trim()).filter(Boolean);
    }

    /*
     * No update data.
     */
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided.",
      });
    }

    /*
     * Update contact.
     */
    const contact = await Contact.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact inquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully.",
      data: contact,
    });
  } catch (error) {
    console.error("Update contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update contact.",
    });
  }
};

/**
 * DELETE CONTACT
 * DELETE /api/contact/:id
 *
 * Admin only.
 */
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact inquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact inquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete contact inquiry.",
    });
  }
};
