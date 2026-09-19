import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloud:", cloudinary.config().cloud_name);

const filePath = "C:\\Users\\USER\\Desktop\\demo.mp4";

console.log("Uploading:", filePath);

cloudinary.uploader.upload(
  filePath,
  {
    resource_type: "video",
    folder: "being-iban/test",
  },
  (error, result) => {
    if (error) {
      console.error("CLOUDINARY ERROR:");
      console.error(error);
      process.exit(1);
    }

    console.log("SUCCESS!");
    console.log(result);
    process.exit(0);
  },
);
