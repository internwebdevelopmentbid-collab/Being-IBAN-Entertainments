import express from "express";

import upload from "../middlewares/uploadMiddleware.js";

import {
  createMedia,
  getMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  reorderMedia,
} from "../controllers/mediaController.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==================================================
   ADMIN
   ALL MEDIA MANAGEMENT ROUTES ARE PROTECTED
================================================== */

/* ==================================================
   GET ALL MEDIA
================================================== */

/*
GET /api/media

Examples:

/api/media

/api/media?page=about

/api/media?page=portfolio

/api/media?page=portfolio&type=cover

/api/media?page=portfolio&type=gallery
*/

router.get("/", getMedia);

/* ==================================================
   REORDER PORTFOLIO GALLERY
================================================== */

/*
PATCH /api/media/reorder

Body:

{
  items: [
    {
      id: "...",
      order: 0
    }
  ]
}
*/

router.patch("/reorder", requireAdmin, reorderMedia);

/* ==================================================
   GET SINGLE MEDIA
================================================== */

/*
GET /api/media/:id
*/

router.get("/:id", getMediaById);

/* ==================================================
   CREATE MEDIA
================================================== */

/*
POST /api/media

multipart/form-data:

file
page
type       -> only relevant to portfolio
title
alt
*/

router.post("/", requireAdmin, upload.single("file"), createMedia);

/* ==================================================
   UPDATE MEDIA
================================================== */

/*
PUT /api/media/:id

multipart/form-data:

file       optional
title      optional
alt        optional
active     optional
*/

router.put("/:id", requireAdmin, upload.single("file"), updateMedia);

/* ==================================================
   DELETE MEDIA
================================================== */

/*
DELETE /api/media/:id
*/

router.delete("/:id", requireAdmin, deleteMedia);

export default router;
