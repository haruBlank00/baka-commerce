import { Category } from "@prisma/client";
import { CheckCheck, Search, X } from "lucide-react";
import { useState } from "react";
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

export const CategoriesOptions = ({
  categories,
}: {
  categories: Category[];
}) => {
  const [values, setValues] = useState<{ id: string; name: string }[]>([]);
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
            {values.length > 0
              ? values.map((value) => (
                  <Badge
                    key={value.id}
                    variant={"secondary"}
                    className="capitalize"
                  >
                    {value.name}
                    <X
                      className="ml-1 w-5 h-5 hover:bg-purple-300 hover:text-white rounded-full p-1"
                      size={32}
                      onClick={() =>
                        setValues((prev) => {
                          return prev.filter((item) => item.id !== value.id);
                        })
                      }
                    />
                  </Badge>
                ))
              : "Select product categories..."}
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
                  const alreadyExist = values.find(
                    (value) => value.name === category.name
                  );
                  if (alreadyExist) {
                    setValues(
                      values.filter((value) => value.name !== category.name)
                    );
                    return;
                  }
                  setValues((prev) => {
                    return [
                      ...prev,
                      {
                        id: currentValue,
                        name: category.name,
                      },
                    ];
                  });
                }}
              >
                {category.name}
                <CheckCheck
                  className={cn(
                    "ml-auto h-4 w-4",
                    values.find((value) => value.name === category.name)
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
