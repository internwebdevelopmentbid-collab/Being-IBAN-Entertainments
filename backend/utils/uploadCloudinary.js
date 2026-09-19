import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (filePath, folder, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: `being-iban/${folder}`,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );
  });
};
