export async function uploadToCloudinary(file, resourceType = "auto") {
  if (!file) {
    throw new Error("No file selected.");
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.",
    );
  }

  const formData = new FormData();

  formData.append("file", file);

  formData.append("upload_preset", uploadPreset);

  const endpoint =
    resourceType === "video"
      ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
      : `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(error || "Cloudinary upload failed.");
  }

  const result = await response.json();

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}
