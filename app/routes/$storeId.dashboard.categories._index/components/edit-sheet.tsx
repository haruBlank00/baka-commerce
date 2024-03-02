import { Category } from "@prisma/client";
import { Form, useFetcher, useSearchParams } from "@remix-run/react";
import { FilePenIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import _ from "lodash";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

type EditCategorySheetProps = {
  showSheet: boolean;
  category: Category;
  // setShowSheet: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditCategorySheet = ({
  showSheet,
  category,
}: EditCategorySheetProps) => {
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const onCloseSheet = () => {
    setSearchParams();
  };

  const deboucedSubmitHandler = _.debounce(
    (e) =>
      fetcher.submit(
        { name: e.target.value, id: category.id },
        {
          method: "post",
          action: "edit",
          encType: "multipart/form-data",
        }
      ),
    500,
    { maxWait: 1000 }
  );
  return (
    <Sheet open={showSheet} onOpenChange={onCloseSheet}>
      <SheetContent className="bg-slate-100">
        <SheetHeader>
          <SheetTitle className="capitalize">
            Categeory: {category.name}
          </SheetTitle>
        </SheetHeader>

        <Form className="flex flex-col gap-4 bg-white shadow-sm p-2 ">
          <div className="flex flex-col gap-2">
            <Label>
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              defaultValue={category.name}
              name="name"
              onChange={(e) => deboucedSubmitHandler(e)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Category Image <span className="text-red-500">*</span>
            </Label>
            <figure className="h-44 w-44 relative">
              <FilePenIcon
                className="absolute bottom-0 right-0 text-purple-600 cursor-pointer bg-purple-200 p-1"
                size={28}
              />
              <img
                src={category.image}
                alt={category.name}
                className="block w-full h-full object-cover"
              />
            </figure>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
