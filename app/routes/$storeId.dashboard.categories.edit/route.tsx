import {
  ActionFunctionArgs,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { uploadImage } from "~/services/cloudinary.server";
import { prisma } from "~/services/db.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  console.log("edit category here");
  const storeId = params.storeId;

  const uploadHandler = unstable_composeUploadHandlers(
    async ({ contentType, data, name, filename }) => {
      if (name !== "image") {
        return undefined;
      }
      const uploadedImage = await uploadImage(data);
      return uploadedImage.secure_url;
    },
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const name = formData.get("name")?.toString();
  const image = formData.get("image")?.toString();
  const id = formData.get("id")?.toString();
  try {
    const category = await prisma.category.update({
      where: {
        id,
        storeId,
      },
      data: {
        name,
        image,
      },
    });
    return { category };
  } catch (e) {
    console.log("ERROR UPDATING CATEGORY: ", e);
    return null;
  }
};
