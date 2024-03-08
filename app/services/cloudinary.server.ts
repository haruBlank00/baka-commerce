import { writeAsyncIterableToWritable } from "@remix-run/node";
import cloudinary, { UploadApiResponse } from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 *
 * @param data is the image data that we want to upload. Form sends data as a form data with image binary
 * @param folder is the name of the folder where we want to upload in our cloudinary 
 * @returns 
 */
async function uploadImage(
  data: AsyncIterable<Uint8Array>,
  folder: string = "baka-commerce"
) {
  const uploadPromise = new Promise<UploadApiResponse>(
    async (resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) {
            reject(error);
          }
          result && resolve(result);
        }
      );
      await writeAsyncIterableToWritable(data, uploadStream);
    }
  );

  return uploadPromise;
}

export { uploadImage };
