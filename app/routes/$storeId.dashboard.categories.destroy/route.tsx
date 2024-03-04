import { ActionFunctionArgs } from "@remix-run/node";
import { prisma } from "~/services/db.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const storeId = params.storeId;
  const formData = await request.formData();
  const categoryId = formData.get("categoryId")?.toString();

  try {
    const category = await prisma.category.update({
      where: {
        id: categoryId,
        storeId,
      },
      data: {
        removedAt: new Date(),
        removed: true,
      },
    });
    return {
      category,
    };
  } catch (e) {
    console.log("ERROR removeing CATEGORY: ", e);
    return null;
  }
};
