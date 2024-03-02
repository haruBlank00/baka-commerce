import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useSubmit } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { ShadForm } from "~/components/ui/form";
import { FormBuilder, InputField } from "~/components/ui/form-buildler";
import { Modal } from "~/components/ui/modal";
import { useRemixForm } from "remix-hook-form";

const categorySchema = z.object({
  name: z.string().min(1, {
    message: "Please enter category name",
  }),
  image: z.string().min(1, {
    message: "Please select a category image",
  }),
});

const categoryFields: InputField[] = [
  {
    name: "name",
    placeholder: "eg: Clothing, Pants",
    label: "Category Name",
    required: true,
  },
  {
    name: "image",
    label: "Category Image",
    type: "image",
    required: true,
  },
];
type TCategorySchema = z.infer<typeof categorySchema>;
const resolver = zodResolver(categorySchema);
type CreateCategoryModalProps = {
  showCreateCategoryModal: boolean;
  setShowCreateCategoryModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateCategoryModal = ({
  setShowCreateCategoryModal,
  showCreateCategoryModal,
}: CreateCategoryModalProps) => {
  const form = useRemixForm<TCategorySchema>({
    resolver,
    defaultValues: {
      name: "",
      image: "",
    },
  });

  return (
    <Modal
      title="Add Category"
      isOpen={showCreateCategoryModal}
      onOpenChange={setShowCreateCategoryModal}
    >
      <ShadForm {...form}>
        <Form method="post" encType="multipart/form-data">
          <FormBuilder form={form} inputFields={categoryFields} />
          <Button
            type="submit"
            className="w-full mt-4"
            name="intent"
            value={"create_new_category"}
          >
            Create a new Category
          </Button>
        </Form>
      </ShadForm>
    </Modal>
  );
};
