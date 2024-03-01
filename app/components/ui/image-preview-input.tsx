import { FieldValue, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { InputField } from "~/components/ui/form-buildler";
import { useState } from "react";

type ImagePreviewInputProps = {
  form: UseFormReturn<T>;
} & InputField;
export function ImagePreviewInput<T extends FieldValues>({
  form,
  label,
  formDescription,
  name,
  span,
  ...rest
}: ImagePreviewInputProps) {
  const [files, setFiles] = useState<FileList>();
  const colSpan = `col-span-${span}`.toString();

  return (
    <>
      <FormField
        key={name}
        control={form.control}
        name={name as Path<T>}
        render={({ field }) => {
          return (
            <FormItem className={colSpan}>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  {...rest}
                  type="file"
                  onChange={(e) => {
                    const files = e.target.files;
                    files && setFiles(files);
                    console.log({ files });
                    field.onChange(e);
                  }}
                />
              </FormControl>
              {formDescription && (
                <FormDescription>{formDescription}</FormDescription>
              )}

              {field.value && (
                <figure className="w-56 h-56 mx-auto">
                  <img
                    className="block w-full h-full object-contain"
                    src={files?.[0] && URL.createObjectURL(files?.[0])}
                    alt="File preview"
                  />
                </figure>
              )}
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
}
