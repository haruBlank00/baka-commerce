import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input, InputProps } from "~/components/ui/input";
import { ImagePreviewInput } from "~/components/ui/image-preview-input";
import { Checkbox } from "./checkbox";

export type InputField = {
  span?: number;
  description?: string;
  label: string;
  name: string;
} & InputProps;

type FormBuilderProps<T extends FieldValues> = {
  inputFields: InputField[];
  form: UseFormReturn<T>;
};

export function FormBuilder<T extends FieldValues>({
  inputFields,
  form,
}: FormBuilderProps<T>) {
  return (
    <>
      {inputFields.map((inputField) => {
        const { label, description, span = 12, name, ...rest } = inputField;

        const colSpan = `col-span-${span}`.toString();

        if (inputField.type === "image") {
          return <ImagePreviewInput key={name} form={form} {...inputField} />;
        }

        if (inputField.type === "checkbox") {
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
                      <FormLabel>
                        Use different settings for my mobile devices
                      </FormLabel>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          );
        }

        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              return (
                <FormItem className={colSpan}>
                  <FormLabel>{label}</FormLabel>
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
      })}
    </>
  );
}
