import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = "uploads";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",

  "video/mp4",
  "video/webm",
  "video/quicktime",

  "application/pdf",
];

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",

  ".mp4",
  ".webm",
  ".mov",

  ".pdf",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${extension}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 100 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const validMimeType = allowedMimeTypes.includes(file.mimetype);

    const validExtension = allowedExtensions.includes(extension);

    if (validMimeType && validExtension) {
      cb(null, true);
      return;
    }

    cb(
      new Error(
        "Unsupported file type. Only JPG, JPEG, PNG, WEBP, AVIF, MP4, WEBM, MOV and PDF files are allowed.",
      ),
      false,
    );
  },
});

export default upload;
