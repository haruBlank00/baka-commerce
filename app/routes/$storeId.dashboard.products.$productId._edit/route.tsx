import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { ImagePlus, MoveLeft, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { ClientOnly } from "~/components/ui/client-only";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { TextEditor } from "~/components/ui/textEditor.client";
import { getFormValues } from "~/lib/getFormFields";
import { prisma } from "~/services/db.server";
import { CategoriesOptions } from "./components/categories-options";
import { uploadImage } from "~/services/cloudinary.server";
import { ProductStatus } from "@prisma/client";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const storeId = params.storeId;
  const categories = await prisma.category.findMany({
    where: {
      storeId,
    },
  });

  return json({ categories });
};
export default function CreateProduct() {
  const imagesFieldRef = useRef<HTMLInputElement>(null);
  const loaderData = useLoaderData<typeof loader>();
  const [images, setImages] = useState<File[]>([]);
  const [textEditorValue, setTextEditorValue] = useState("");
  const [seletedCategories, setSeletedCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [productStatus, setProductStatus] = useState<ProductStatus>(
    ProductStatus.DRAFT
  );

  const submit = useSubmit();

  const removeProductImage = (name: string) => {
    setImages((prevImages) =>
      prevImages.filter((prevImage) => prevImage.name !== name)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    formData.append("description", textEditorValue);
    formData.append("categories", JSON.stringify(seletedCategories));
    formData.append("status", productStatus);
    for (const image of images) {
      formData.append("images", image);
    }

    console.log(await getFormValues(formData));

    submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  return (
    <>
      <div className=" flex justify-between">
        <div className="flex gap-2 items-center text-purple-500">
          <MoveLeft
            className=" hover:bg-purple-500 hover:text-white p-2"
            size={32}
          />
          Add Product
        </div>
      </div>

      <Form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div>
          <Card className="rounded-sm p-3 flex flex-col gap-3 mb-4 h-72">
            <div className="flex flex-col gap-2">
              <Label className="">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input name="name" placeholder="eg: pants" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="">
                Product Description <span className="text-red-500">*</span>
              </Label>
              <ClientOnly fallback={<div>loading...</div>}>
                {() => (
                  <TextEditor
                    name={"description"}
                    theme="snow"
                    placeholder="Enter your product description"
                    value={textEditorValue}
                    onChange={setTextEditorValue}
                  />
                )}
              </ClientOnly>
            </div>
          </Card>

          <Card className="rounded-sm p-3 flex flex-col gap-3 mb-4">
            <div className="flex flex-col gap-2">
              <Label>
                Selling Price <span className="text-red-500">*</span>
              </Label>
              <Input name="sellingPrice" placeholder="1000" type="number" />
            </div>

            <div className="flex flex-col gap-2">
              <Label>
                <span className="line-through">Crossed Price</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input name="crossedPrice" placeholder="1000" type="number" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="">Cost per item</Label>
              <p className="text-stone-400 text-xs">
                Customer won&apos;t see this data
              </p>
              <Input name="costPerItem" placeholder="1000" type="number" />
            </div>
          </Card>

          <Card className="rounded-sm p-3 flex flex-col gap-3 mb-4">
            <div className="flex flex-col gap-2">
              <Label>Quantity</Label>
              <Input name="quantity" placeholder="10" type="number" />
            </div>

            <div className="flex flex-col gap-2">
              <Label>
                <span>Product Sku</span>
              </Label>
              <Input name="sku" placeholder="eg: 100" />
            </div>
          </Card>

          <div className="flex items-center space-x-2 cursor-pointer">
            <Checkbox name="sellAfterOutOfStock" id="sellAfterOutOfStock" />
            <Label htmlFor="sellAfterOutOfStock">
              Continue selling even after the product is out of stock
            </Label>
          </div>
        </div>

        <div>
          <Card className="rounded-sm p-3 flex flex-col gap-3 mb-4">
            <Label>Product Images</Label>
            <Input
              type="file"
              id="productImage"
              hidden={true}
              // name="images"
              ref={imagesFieldRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = e?.target?.files;
                if (files) {
                  setImages((prevImages) => {
                    return [...prevImages, ...files];
                  });
                }
              }}
            />
            <Card
              className={`border-2 border-dashed h-44 grid ${
                images.length > 0 ? "" : "place-items-center"
              } bg-white hover:bg-slate-100 rounded-sm shadow-none cursor-pointer p-2`}
              onClick={() => imagesFieldRef.current?.click()}
            >
              {images?.length > 0 ? (
                <figure className="grid grid-cols-4 gap-2">
                  {images.map((image) => {
                    const urlString = URL.createObjectURL(image);
                    return (
                      <div className="relative" key={image.name}>
                        <X
                          className="absolute right-1 top-1 p-1 rounded-full bg-slate-100 hover:bg-slate-200 "
                          size={18}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeProductImage(image.name);
                          }}
                        />
                        <img
                          className="block w-full h-full object rounded-sm"
                          src={urlString}
                          alt="Product showcase"
                        />
                      </div>
                    );
                  })}
                </figure>
              ) : (
                <ImagePlus size={72} />
              )}
            </Card>
          </Card>

          <Card className="rounded-sm p-3 flex flex-col gap-3 mb-4">
            <div className="flex flex-col gap-2">
              <Label>Categories</Label>
              <CategoriesOptions
                categories={loaderData.categories}
                selectedCategories={seletedCategories}
                setSelectedCategories={setSeletedCategories}
              />
            </div>

            <div className="flex flex-col gap-2"></div>
          </Card>

          <div className="flex gap-2">
            <Button
              type="submit"
              onClick={() => setProductStatus(ProductStatus.PUBLISH)}
            >
              Publish
            </Button>
            <Button onClick={() => setProductStatus(ProductStatus.DRAFT)}>
              Save as draft
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const storeId = params.storeId;

  const uploadHandler = unstable_composeUploadHandlers(
    async ({ contentType, data, name, filename }) => {
      if (name !== "images") {
        return undefined;
      }
      console.log({ name, data }, "name i shere");
      // return name;
      const uploadedImage = await uploadImage(data);
      console.log(uploadedImage.secure_url);
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
  console.log({ product });
  return null;
};
