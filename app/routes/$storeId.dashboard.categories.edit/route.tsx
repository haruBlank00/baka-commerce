import {
  ActionFunctionArgs,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { uploadImage } from "~/services/cloudinary.server";
import { prisma } from "~/services/db.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const storeId = params.storeId;

  const uploadHandler = unstable_composeUploadHandlers(
    async ({ data, name }) => {
      if (name !== "image") {
        return undefined;
      }

      try {
        const uploadedImage = await uploadImage(data, "category");
        return uploadedImage.secure_url;
      } catch (error) {
        console.log("ERROR UPDATING IMAGE: ", error);
      }
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

  invariant(name, "Category name is missing");

  const data: { name: string; image?: string } = {
    name,
  };
  if (image) data.image = image;

  try {
    const category = await prisma.category.update({
      where: {
        id,
        storeId,
      },
      data,
    });
    return { category };
  } catch (e) {
    console.log("ERROR UPDATING CATEGORY: ", e);
    return null;
  }
};
