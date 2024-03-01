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

export type InputField = {
  span?: number;
  formDescription?: string;
  label?: string;
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
        const { label, formDescription, span = 12, name, ...rest } = inputField;

        const colSpan = `col-span-${span}`.toString();
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
                  {formDescription && (
                    <FormDescription>{formDescription}</FormDescription>
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
