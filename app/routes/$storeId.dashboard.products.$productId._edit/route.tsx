import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { ImagePlus, MoveLeft } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { ClientOnly } from "~/components/ui/client-only";
import { InputField } from "~/components/ui/form-buildler";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { prisma } from "~/services/db.server";
import { CategoriesOptions } from "./components/categories-options";
import Quill from "~/components/ui/quill.client";
import { Button } from "~/components/ui/button";
import { getFormValues } from "~/lib/getFormFields";
const productFields: InputField[][] = [
  [
    {
      name: "name",
      label: "Product Name",
      placeholder: "eg: Pants",
      required: true,
    },
    {
      name: "description",
      label: "Product Description",
      placeholder:
        "Elevate your style with our premium leather wallet. Sleek, functional, and timeless, this wallet features multiple card slots, a secure coin pocket, and a slim profile. Crafted for everyday use, it’s the perfect accessory for modern professionals.",
      type: "editor",
    },
  ],
  [
    {
      name: "Selling Price",
      label: "Selling Price",
      placeholder: "eg: 100",
      required: true,
      type: "number",
    },
    {
      name: "Crossed Price",
      label: "Selling Price",
      placeholder: "eg: 100",
      required: true,
      type: "number",
    },
    {
      name: "Cost per item",
      description: "Customer won't see this data",
      label: "Selling Price",
      placeholder: "eg: 100",
      required: true,
      type: "number",
    },
  ],
  [
    {
      name: "sellAfterOutOfStock",
      label: "Continue selling even after product is out of stock",
      type: "checkbox",
    },
  ],
  [
    {
      name: "images",
      label: "Product images",
      required: true,
      type: "image",
    },
  ],
  [
    {
      name: "categories",
      label: "Product categories",
      required: true,
      type: "category",
    },
  ],
];

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
  const loaderData = useLoaderData<typeof loader>();
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

      <Form className="grid grid-cols-2 gap-4" method="post">
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
                {() => <Quill defaultValue="Hello <b>Remix!</b>" />}
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
            <div className="border-2 border-dashed h-40 grid place-items-center bg-white hover:bg-slate-100">
              <ImagePlus size={72} />
            </div>
          </Card>

          <Card className="rounded-sm p-3 flex flex-col gap-3 mb-4">
            <div className="flex flex-col gap-2">
              <Label>Categories</Label>
              <CategoriesOptions categories={loaderData.categories} />
            </div>

            <div className="flex flex-col gap-2"></div>
          </Card>

          <div className="flex gap-2">
            <Button type="submit">Publish</Button>
            <Button variant={"outline"}>Save as draft</Button>
          </div>
        </div>
      </Form>
    </>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const formValues = getFormValues(formData);
  console.log({ formValues });
  return null;
};
