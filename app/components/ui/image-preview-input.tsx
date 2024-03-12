import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { InputField } from "~/components/ui/form-buildler";
import { Input } from "~/components/ui/input";
import { Card } from "./card";
import { Label } from "./label";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
type ImagePreviewInputProps = {
  form: UseFormReturn<FieldValues>;
} & InputField;
export function ImagePreviewInput({
  form,
  label,
  description,
  name,
  span,
  ...rest
}: ImagePreviewInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const images: File[] = form.watch(name);
  const colSpan = `col-span-${span}`.toString();

  const removePreview = (imageName: string) => {
    const newImages = images.filter((image) => image.name !== imageName);
    form.setValue(name, newImages);
  };

  return (
    <>
      <FormField
        key={name}
        control={form.control}
        name={name}
        render={({ field }) => {
          const { ref, onChange, value, ...rest } = field;
          return (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  id={`form-${name}`}
                  hidden={true}
                  className="hidden"
                  multiple
                  accept="image/*"
                  value={value.fileName}
                  ref={(e) => {
                    ref(e);
                    inputRef.current = e;
                  }}
                  onChange={(e) => {
                    const files = e?.target?.files;
                    onChange([...value, files?.[0]]);
                  }}
                  {...rest}
                />
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <Card
        className={`border-2 border-dashed h-44 grid ${
          images.length > 0 ? "" : "place-items-center"
        } bg-white hover:bg-slate-100 rounded-sm shadow-none cursor-pointer p-2`}
        onClick={() => inputRef.current?.click()}
        // onClick={() => form.ge}
      >
        {images?.length > 0 ? (
          <figure className="grid grid-cols-4 gap-2">
            {images?.map((image, i) => {
              const urlString = URL.createObjectURL(image);
              return (
                <div className="relative" key={image.name}>
                  <X
                    className="absolute right-1 top-1 p-1 rounded-full bg-slate-100 hover:bg-slate-200 "
                    size={18}
                    onClick={(e) => {
                      e.stopPropagation();
                      removePreview(image.name);
                    }}
                  />
                  <img
                    className="block w-full h-full object rounded-sm"
                    src={urlString}
                    alt="Product showcase"
                  />
                </div>
              );
            })}
          </figure>
        ) : (
          <ImagePlus size={72} />
        )}
      </Card>
    </>
  );
}
