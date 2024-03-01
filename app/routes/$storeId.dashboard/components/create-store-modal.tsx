import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useSubmit } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { ShadForm } from "~/components/ui/form";
import { FormBuilder, InputField } from "~/components/ui/form-buildler";
import { Modal } from "~/components/ui/modal";

const storeSchema = z.object({
  name: z.string({
    required_error: "Please enter your store name.",
  }),
});
type TStoreSchema = z.infer<typeof storeSchema>;
const storeFields: InputField[] = [
  {
    name: "name",
    placeholder: "Baka House",
    label: "Store Name",
    type: "text",
  },
];
const resolver = zodResolver(storeSchema);

export const CreateStoreModal = ({
  showStoreForm,
  setShowStoreForm,
}: {
  showStoreForm: boolean;
  setShowStoreForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const submit = useSubmit();
  const form = useForm<TStoreSchema>({
    resolver,
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: TStoreSchema) => {
    submit(
      { ...data, intent: "create_new_store" },
      {
        method: "post",
      }
    );
  };
  return (
    <Modal
      onOpenChange={setShowStoreForm}
      title="Create a new Store"
      description="Add the name and other details of your new store :)"
      isOpen={showStoreForm}
    >
      <ShadForm {...form}>
        <Form method="POST" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormBuilder form={form} inputFields={storeFields} />

          <Button
            type="submit"
            className="w-full mt-4"
            name="intent"
            value={"create_new_store"}
          >
            Create a new Store
          </Button>
        </Form>
      </ShadForm>
    </Modal>
  );
};
