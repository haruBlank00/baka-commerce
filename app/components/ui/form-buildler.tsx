import {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ImagePreviewInput } from "~/components/ui/image-preview-input";
import { Input, InputProps } from "~/components/ui/input";
import { Checkbox } from "./checkbox";
import { Card } from "./card";
import { DevTool } from "@hookform/devtools";
import { ClientOnly } from "./client-only";
import { TextEditor } from "./textEditor.client";
export enum INPUT_TYPES {
  TEXT = "text",
  NUMBER = "number",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  IMAGE = "image",
  EDITOR = "editor",
  OPTIONS = "options",
}

export type InputField = {
  span?: number;
  description?: string;
  label: string;
  schema: Zod.Schema;
  lineThrough?: boolean;
  name: Path<string>;
  component?: (props: unknown) => JSX.Element;
  render?: (
    form: UseFormReturn<FieldValues>,
    field: ControllerRenderProps,
    inputField: InputField
  ) => JSX.Element;
} & InputProps;

type FormBuilderProps = {
  inputFields: InputField[] | InputField[][];
  form: UseFormReturn<FieldValues>;
};

/**
 *  Form builder takes [] or [][] as input fields
 * map over them to generate form fields
 * if there's sub array, use card to show them :), each sub array = own card ui :)
 * @param param0
 * @returns
 */
export function FormBuilder({ inputFields, form }: FormBuilderProps) {
  return (
    <>
      <DevTool control={form.control} placement="top-left" />
      {inputFields.map((inputField, i) => {
        const isArray = Array.isArray(inputField);

        if (isArray) {
          return (
            <Card
              key={`form-subarrray-${i}`}
              className="rounded-sm p-3 flex flex-col gap-3 mb-4"
            >
              <FormBuilder inputFields={inputField} form={form} />
            </Card>
          );
        }

        const {
          label,
          description,
          span = 12,
          name,
          lineThrough,
          ...rest
        } = inputField;

        const colSpan = `col-span-${span}`.toString();

        if (inputField.render) {
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      {inputField?.render &&
                        inputField.render(form, field, inputField)}
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          );
        }

        switch (inputField.type) {
          case INPUT_TYPES.IMAGE:
            return <ImagePreviewInput key={name} form={form} {...inputField} />;
          case INPUT_TYPES.EDITOR:
            return (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <ClientOnly fallback={<div>loading...</div>}>
                          {() => (
                            <TextEditor
                              name={"description"}
                              theme="snow"
                              placeholder={inputField.placeholder}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        </ClientOnly>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            );
          case INPUT_TYPES.CHECKBOX:
            return (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-x-2 cursor-pointer">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id={name}
                        className="mt-2"
                      />
                    </FormControl>
                    <FormLabel htmlFor={name} className="mt-0">
                      {label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            );
          case INPUT_TYPES.OPTIONS:
            return (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => {
                  const selectedCategories = form.watch(name);
                  const setSelectedCategories = (newCategories) => {
                    form.setValue(name, newCategories);
                  };

                  return (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        {inputField.component && (
                          <inputField.component
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                          />
                        )}
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            );
          default:
            return (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => {
                  return (
                    <FormItem className={colSpan}>
                      <FormLabel
                        className={`${lineThrough ? "line-through" : ""}`}
                      >
                        {label}
                        {inputField.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} {...rest} />
                      </FormControl>
                      {description && (
                        <FormDescription>{description}</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            );
        }
      })}
    </>
  );
}

const Field = ({
  name,
  label,
  form,
}: InputField & { form: UseFormReturn<FieldValues> }) => {
  return (
    <FormField
      key={name}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
          <FormControl>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FormLabel>{label}</FormLabel>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
