import { z } from "zod";
import { INPUT_TYPES, InputField } from "~/components/ui/form-buildler";
import {
  CategoriesOptions,
  TSelectedCategory,
} from "./components/categories-options";
import { loader } from "./route";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { produce } from "immer";
import _, { remove } from "lodash";
import { X } from "lucide-react";
import { FormLabel } from "~/components/ui/form";
// z.object({
//   name: z.string().min(1, "Please enter your product name."),
// });
export const useFormFields = ({
  loaderData,
}: {
  loaderData: typeof loader;
}) => {
  const leftFields: InputField[][] = [
    [
      {
        name: "name",
        label: "Product Name",
        placeholder: "eg: pants, shirts",
        required: true,
        schema: z.string().min(1, "Please enter your product name."),
        type: INPUT_TYPES.TEXT,
      },
      {
        name: "description",
        label: "Product Description",
        placeholder: "Our new and awesome product in the house...",
        required: true,
        schema: z.string().min(1, "Please enter your product description."),
        type: INPUT_TYPES.EDITOR,
      },
      {
        name: "categories",
        label: "Categories",
        type: INPUT_TYPES.OPTIONS,
        component: ({
          selectedCategories,
          setSelectedCategories,
        }: {
          selectedCategories: { id: string; name: string }[];
          setSelectedCategories: (categories: TSelectedCategory[]) => void;
        }) => (
          <CategoriesOptions
            categories={loaderData.categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        ),
        schema: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
            })
          )
          .optional(),
      },
    ],
    [
      {
        name: "sellingPrice",
        label: "Selling Price",
        placeholder: "1000",
        required: true,
        schema: z.number().min(1, "Please enter your selling price."),
        type: INPUT_TYPES.NUMBER,
      },
      {
        name: "crossedPrice",
        label: "Crossed Price",
        placeholder: "1000",
        lineThrough: true,
        required: true,
        schema: z.number().optional(),
        type: INPUT_TYPES.NUMBER,
      },
      {
        name: "costPerItem",
        label: "Cost per Item",
        description: "Customer won't see this data",
        placeholder: "1000",
        required: true,
        schema: z.number().min(1, "Please enter your cost per item"),
        type: INPUT_TYPES.NUMBER,
      },
    ],
    [
      {
        name: "quantity",
        label: "Quantity",
        placeholder: "100",
        required: true,
        schema: z.number().min(1, "Please enter your quantity"),
        type: INPUT_TYPES.NUMBER,
      },
      {
        name: "sku",
        label: "Product Sku",
        placeholder: "eg: 100, mn_453",
        required: true,
        schema: z.number().min(1, "Please enter your quantity"),
        type: INPUT_TYPES.NUMBER,
      },
    ],
    [
      {
        name: "sellAfterOutOfStock",
        label: " Continue selling even after the product is out of stock?",
        type: INPUT_TYPES.CHECKBOX,
        schema: z.boolean().optional(),
      },
    ],
  ];
  const rightFields = [
    [
      {
        name: "images",
        label: "Product Images",
        type: INPUT_TYPES.IMAGE,
        schema: z
          .array(z.object({ name: z.string(), url: z.string() }))
          .optional(),
      },

      {
        name: "colors",
        label: "Product Colors",
        type: INPUT_TYPES.TEXT,
        placeholder: "eg: black, white",
        schema: z
          .array(z.object({ name: z.string(), url: z.string() }))
          .optional(),
        render: (
          form: UseFormReturn<FieldValues>,
          field: ControllerRenderProps,
          inputField: InputField
        ) => {
          const { placeholder, label } = inputField;

          const variants: {
            colors: string[];
            sizes: string[];
          } = form.getValues("variants");

          const removeColor = (color: string) => {
            const newVariants = produce(variants, (draft) => {
              draft.colors = _.without(draft.colors, color);
            });
            form.setValue("variants", newVariants);
          };

          const colors = variants.colors.map((color) => {
            return (
              <button
                title={color}
                type="button"
                onClick={() => removeColor(color)}
                key={color}
                className={`rounded-full flex items-center justify-center h-7 w-7 -ml-2 transition hover:scale-125 shadow-md `}
                style={{
                  backgroundColor: color,
                }}
              />
            );
          });
          const { onChange: fieldOnchange, ...restField } = field;

          const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const color = e.target.value;

            const endOfInput = color.slice(-1);
            if (endOfInput === ",") {
              const newVariants = produce(variants, (draft) => {
                const trimmedColor = color.slice(0, -1);
                draft.colors.push(trimmedColor);
              });
              form.setValue("variants", newVariants);
              fieldOnchange("");
              return;
            }

            fieldOnchange(color);
          };

          return (
            <div className="space-y-2">
              <FormLabel>{label}</FormLabel>
              <div className="relative">
                <Input
                  {...restField}
                  onChange={onChange}
                  placeholder={placeholder}
                />
                <div className="flex absolute top-1/2 -translate-y-1/2 right-2">
                  {colors}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        name: "sizes",
        label: "Product Sizes",
        type: INPUT_TYPES.TEXT,
        placeholder: "eg: xs, s, m, l, xl",
        schema: z.array(z.object({ name: z.string(), url: z.string() })),
        render: (
          form: UseFormReturn<FieldValues>,
          field: ControllerRenderProps,
          inputField: InputField
        ) => {
          const { placeholder, label } = inputField;

          const variants: {
            colors: string[];
            sizes: string[];
          } = form.getValues("variants");

          const removeSize = (size: string) => {
            const newVariants = produce(variants, (draft) => {
              draft.sizes = _.without(draft.sizes, size);
            });
            form.setValue("variants", newVariants);
          };

          const sizes = variants.sizes.map((size) => {
            return (
              <button
                type="button"
                key={size}
                className="flex items-center justify-center hover:scale-110 transition"
                onClick={() => removeSize(size)}
              >
                <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                  {size}
                </span>
              </button>
            );
          });

          const { onChange: fieldOnchange, ...restField } = field;
          const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const size = e.target.value;

            const endOfInput = size.slice(-1);
            if (endOfInput === ",") {
              const newVariants = produce(variants, (draft) => {
                const trimmedSize = size.slice(0, -1);
                draft.sizes.push(trimmedSize);
              });
              form.setValue("variants", newVariants);
              fieldOnchange("");
              return;
            }

            fieldOnchange(size);
          };

          return (
            <div className="space-y-2">
              <FormLabel>{label}</FormLabel>
              <div className="flex focus-within:outline-none rounded-md items-center gap-2 h-9 border border-input px-3 focus-within:border-input focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                {sizes}

                <Input
                  className="border-none shadow-none focus-visible:ring-0 px-0"
                  {...restField}
                  onChange={onChange}
                  placeholder={placeholder}
                />
              </div>
            </div>
          );
        },
      },
    ],
  ];

  // const schema = {
  //   ...leftFields.reduce(
  //     acc,
  //     (curr) => {
  //       return {
  //         ...acc,
  //         [curr.name]: curr.schema,
  //       };
  //     },
  //     {}
  //   ),
  // };

  return { leftFields, rightFields };
};
