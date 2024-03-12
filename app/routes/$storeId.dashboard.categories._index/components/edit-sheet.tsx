import { Category } from "@prisma/client";
import { Form, useParams, useSearchParams, useSubmit } from "@remix-run/react";
import { FilePenIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import React, { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

type EditCategorySheetProps = {
  showSheet: boolean;
  category: Category;
};

export const EditCategorySheet = ({
  showSheet,
  category,
}: EditCategorySheetProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const submit = useSubmit();
  const onCloseSheet = () => {
    setSearchParams();
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("call me?");
    const formData = new FormData(e.currentTarget);
    console.log({ file });

    if (!file) {
      formData.delete("image");
    }

    submit(formData, {
      action: `/${params.storeId}/dashboard/categories/edit`,
      method: "post",
      encType: "multipart/form-data",
      navigate: false,
    });
  };

  const categoryId = searchParams.get("categoryId");

  return (
    <Sheet open={showSheet} onOpenChange={onCloseSheet}>
      <SheetContent className="bg-slate-100">
        <SheetHeader>
          <SheetTitle className="capitalize">
            Categeory: {category.name}
          </SheetTitle>
        </SheetHeader>

        <Form
          className="flex flex-col gap-4 bg-white shadow-sm p-2"
          onSubmit={(e) => submitHandler(e)}
          navigate={false}
        >
          <Input value={categoryId || ""} readOnly name="id" hidden />
          <div className="flex flex-col gap-2">
            <Label>
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input defaultValue={category.name} name="name" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Category Image <span className="text-red-500">*</span>
            </Label>

            <figure className="h-44 w-44 relative">
              <FilePenIcon
                className="absolute bottom-0 right-0 text-purple-600 cursor-pointer bg-purple-200 p-1"
                size={28}
                onClick={() => inputRef.current?.click()}
              />
              <input
                ref={inputRef}
                type="file"
                name="image"
                id="image"
                className="hidden"
                onChange={(e) => {
                  const file = e.target?.files?.[0];
                  if (file) setFile(file);
                }}
              />
              <img
                src={file ? URL.createObjectURL(file) : category.image}
                alt={category.name}
                className="block w-full h-full object-cover"
              />
            </figure>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Update</Button>
            <Button onClick={() => onCloseSheet()}>Close</Button>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
