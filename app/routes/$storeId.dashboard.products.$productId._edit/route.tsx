import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { Edit2Icon, ImagePlusIcon, MoveLeft } from "lucide-react";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useRemixForm } from "remix-hook-form";
import { ShadForm } from "~/components/ui/form";
import { FormBuilder } from "~/components/ui/form-buildler";
import { getFormValues } from "~/lib/getFormFields";
import { uploadImage } from "~/services/cloudinary.server";
import { prisma } from "~/services/db.server";
import { useFormFields } from "./useFormfields";

type Field = typeof leftFields & typeof rightFields;

type TProductVariant = {
  variants: { type: string; value: string }[]; // [{type: color, value: "red"}, {type: "size", value: "xl"}] = red*xl
  sellingPrice: number;
  crossedPrice: number;
  costPerItem: number;
  quantity: number;
  sku: number;
  sellAfterOutOfStock: boolean;
};

type TVariantField = {
  id: string;
  type: string;
  variants: TProductVariant[];
};
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const storeId = params.storeId;
  const categories = await prisma.category.findMany({
    where: {
      storeId,
      removed: true,
    },
  });

  return json({ categories });
};

// const zodSchema =
export default function CreateProduct() {
  const loaderData = useLoaderData<typeof loader>();
  const { leftFields, rightFields } = useFormFields({ loaderData });
  const form = useRemixForm({
    defaultValues: {
      name: "",
      description: "",
      sellingPrice: null,
      crossedPrice: null,
      costPerItem: null,
      sku: null,
      quantity: null,
      sellAfterOutOfStock: false,
      images: [],
      categories: [],
      colors: "",
      sizes: "",

      variants: { colors: [], sizes: [] }, // no input field, we need to use this to track all variants
    },
  });

  // const fieldArray = useFieldArray({
  //   control: form.control,
  //   name: "variants",
  // });

  const navigate = useNavigate();

  const watchedVariants = form.watch("variants");
  console.log(watchedVariants, "watched variants");

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   const formData = new FormData(e.currentTarget);
  //   formData.append("description", textEditorValue);
  //   formData.append("categories", JSON.stringify(seletedCategories));
  //   formData.append("status", productStatus);
  //   for (const image of images) {
  //     formData.append("images", image);
  //   }

  //   console.log(await getFormValues(formData));

  //   submit(formData, {
  //     method: "post",
  //     encType: "multipart/form-data",
  //   });
  // };

  return (
    <>
      <div className=" flex justify-between">
        <div className="flex gap-2 items-center text-purple-500">
          <MoveLeft
            className=" hover:bg-purple-500 hover:text-white p-2 cursor-pointer"
            size={32}
            onClick={() => navigate(-1)}
          />
          Add Product
        </div>
      </div>

      <ShadForm {...form}>
        <Form className="grid grid-cols-2 gap-4">
          <div>
            <FormBuilder form={form} inputFields={leftFields} />
          </div>
          <div>
            <FormBuilder form={form} inputFields={rightFields} />
          </div>
        </Form>
      </ShadForm>
    </>
  );
}

const VariantImage = () => {
  const [hover, setHover] = useState(false);

  return (
    <figure className="h-16 w-16  rounded-sm bg-slate-200 grid place-items-center">
      {hover ? (
        <ImagePlusIcon onMouseEnter={() => setHover(true)} />
      ) : (
        <Edit2Icon />
      )}
    </figure>
  );
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const storeId = params.storeId;

  const uploadHandler = unstable_composeUploadHandlers(
    async ({ contentType, data, name, filename }) => {
      if (name !== "images") {
        return undefined;
      }
      // return name;
      const uploadedImage = await uploadImage(data);
      return uploadedImage.secure_url;
    },
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const formValues: Record<string, string> = await getFormValues(formData);
  const images = formData.getAll("images") as string[];
  const categories = JSON.parse(formValues?.categories ?? "[]");
  const sellingPrice = Number.parseFloat(formValues.sellingPrice);
  const crossedPrice = Number.parseFloat(formValues.crossedPrice);
  const costPerItem = Number.parseFloat(formValues.costPerItem);
  const quantity = Number.parseInt(formValues.quantity);

  const product = await prisma.product.create({
    data: {
      ...formValues,
      sellAfterOutOfStock: false,
      images,
      sellingPrice,
      crossedPrice,
      costPerItem,
      quantity,
      storeId,

      categories: {
        create: categories.map((category) => ({
          category: { connect: { id: category.id } },
        })),
      },
    },
  });
  return null;
};

/*
variants = [
  {
    id: "",
    variants: [
      {
        variants: [{type: 'color', value: 'red'}, {type: "size", value: "xxl"}],
        sellingPrice: number,
        crossedPrice: number,
        costPerItem: number,
        quantity: number,
        sku: number,
        sellAfterOutOfStock: boolean
      }
    ]
  },

]
*/
