import { Category } from "@prisma/client";
import { CheckCheck, Search, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export type TSelectedCategory = {
  id: string;
  name: string;
};
const SelectedCategories = ({
  categories,
  setSelectedCategories,
}: {
  categories: TSelectedCategory[];
  setSelectedCategories: (categories: TSelectedCategory[]) => void;
}) => {
  return categories.map((selectedCategory) => (
    <Badge
      key={selectedCategory.id}
      variant={"secondary"}
      className="capitalize"
    >
      {selectedCategory.name}
      <X
        className="ml-1 w-5 h-5 hover:bg-purple-300 hover:text-white rounded-full p-1"
        size={32}
        onClick={() =>
          setSelectedCategories(
            categories.filter((item) => item.id !== selectedCategory.id)
          )
        }
      />
    </Badge>
  ));
};
export const CategoriesOptions = ({
  categories,
  selectedCategories = [],
  setSelectedCategories,
}: {
  categories: Category[];
  selectedCategories: TSelectedCategory[];
  setSelectedCategories: (categories: TSelectedCategory[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex gap-2">
            {selectedCategories.length > 0 ? (
              <SelectedCategories
                categories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            ) : (
              "Select product categories..."
            )}
          </div>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command>
          <CommandInput
            placeholder="Select product categories..."
            className="h-9"
          />
          <CommandEmpty>No categories found.</CommandEmpty>
          <CommandGroup>
            {categories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name}
                onSelect={(currentValue) => {
                  const alreadyExist = selectedCategories.find(
                    (selectedCategory) => selectedCategory.id === category.id
                  );
                  if (alreadyExist) {
                    setSelectedCategories(
                      selectedCategories.filter(
                        (selectedCategory) =>
                          selectedCategory.id !== category.id
                      )
                    );
                    return;
                  }

                  setSelectedCategories([
                    ...selectedCategories,
                    {
                      name: currentValue,
                      id: category.id,
                    },
                  ]);
                }}
              >
                {category.name}
                <CheckCheck
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedCategories.find(
                      (selectedCategory) => selectedCategory.id === category.id
                    )
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
