import { FieldValues, Form, Path, UseFormReturn } from "react-hook-form";
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
    <div className="grid grid-cols-12">
      {inputFields.map((inputField) => {
        const { label, formDescription, span = 12, name, ...rest } = inputField;

        const colSpan = `col-span-${span}`;
        return (
          <div key={inputField.name} className={colSpan}>
            <FormField
              control={form.control}
              name={name}
              render={({ field }) => {
                const colSpan = `col-span-${span}`;
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
          </div>
        );
      })}
    </div>
  );
}
