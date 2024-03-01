import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useSubmit } from "@remix-run/react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
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
export const StoreInfo = ({
  showStoreAlert,
  setShowStoreAlert,
}: {
  showStoreAlert: boolean;
  setShowStoreAlert: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showStoreForm, setShowStoreForm] = useState(false);
  const submit = useSubmit();
  const form = useForm<TStoreSchema>({
    resolver,
    defaultValues: {
      name: "",
    },
  });

  const onCreateNewStore = () => {
    setShowStoreAlert(false);
    setShowStoreForm(true);
  };

  const handleSubmit = (data: TStoreSchema) => {
    submit(
      { ...data, intent: "create_new_store" },
      {
        method: "post",
      }
    );
  };

  return (
    <>
      <Modal
        onOpenChange={setShowStoreAlert}
        title="Store"
        isOpen={showStoreAlert}
        footer={() => {
          return (
            <Button className="w-full" onClick={onCreateNewStore}>
              Create New Store
            </Button>
          );
        }}
      >
        <StoreInfo />
      </Modal>

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
      <Card
        className="flex items-center gap-2 hover:bg-slate-100 cursor-pointer transition border-b p-2 py-4 shadow-none rounded-none"
        onClick={() => setShowStoreAlert(true)}
      >
        <Avatar>
          <AvatarFallback className="text-purple-500">BH</AvatarFallback>
        </Avatar>

        <div className="flex flex-1 justify-between">
          <p className="font-semibold text-base">Baka House</p>
          <ChevronRight />
        </div>
      </Card>
    </>
  );
};
