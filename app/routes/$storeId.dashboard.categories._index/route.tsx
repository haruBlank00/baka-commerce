import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { uploadImage } from "~/services/cloudinary.server";
import { prisma } from "~/services/db.server";
import { categoryColumns } from "./components/columns";
import { CreateCategoryModal } from "./components/create-category-modal";
import { EditCategorySheet } from "./components/edit-sheet";
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const storeId = params.storeId;
  try {
    const categories = await prisma.category.findMany({
      where: {
        storeId,
        removed: null,
      },
      select: {
        _count: {
          select: {
            products: true,
          },
        },
        name: true,
        image: true,
        createdAt: true,
        id: true,
      },
    });

    return json({ categories });
  } catch (e) {
    console.log("Error on storeId category laoder", e);
    return json({ categories: [] });
  }
};

export default function Category() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [searchParams] = useSearchParams();

  const showEditSheet = searchParams.get("edit") as string;
  const categoryId = searchParams.get("categoryId") as string;
  const categoryToEdit =
    categoryId &&
    loaderData.categories.find((category) => category.id === categoryId)!;
  useEffect(() => {
    if (actionData?.success) {
      setShowCreateCategoryModal(false);
    }
  }, [actionData]);
  return (
    <>
      {showEditSheet && (
        <EditCategorySheet showSheet={true} category={categoryToEdit} />
      )}
      <div className="">
        <CreateCategoryModal
          showCreateCategoryModal={showCreateCategoryModal}
          setShowCreateCategoryModal={setShowCreateCategoryModal}
        />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Store Categories</h2>
          <Button
            size={"sm"}
            className="bg-purple-600 text-white"
            onClick={() => setShowCreateCategoryModal(true)}
          >
            Add Category
          </Button>
        </div>

        <DataTable columns={categoryColumns} data={loaderData.categories} />
      </div>
    </>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const storeId = params.storeId as string;
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

  const image = formData.get("image")?.toString();
  const name = formData.get("name")?.toString();
  invariant(name, "Category name is required");
  invariant(image, "Category image is required");

  const category = await prisma.category.create({
    data: {
      image,
      name,
      storeId,
    },
  });
  return { category, success: true };
};
