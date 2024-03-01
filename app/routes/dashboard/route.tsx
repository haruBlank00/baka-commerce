import { Prisma } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useActionData } from "@remix-run/react";
import { Globe, MoonStarIcon } from "lucide-react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { toast } from "~/components/ui/use-toast";
import { prisma } from "~/services/db.server";
import { MainNav } from "./components/main-nav";
import { StoreInfo } from "./components/store-info";

export const loader = ({ params, request }: LoaderFunctionArgs) => {
  return null;
};

export default function DashboardLayout() {
  const [showStoreAlert, setShowStoreAlert] = useState(false);
  const actionData = useActionData<typeof action>();

  if (actionData?.success) {
    toast({
      title: actionData.title,
      description: actionData.message,
    });
  }

  return (
    <div className="min-h-screen h-screen">
      <div className="h-full items-stretch flex">
        <nav className="h-full basis-48  border-r">
          <StoreInfo
            showStoreAlert={showStoreAlert}
            setShowStoreAlert={setShowStoreAlert}
          />

          <MainNav />
        </nav>

        <div className="flex-1">
          <header className="flex justify-between p-4 border">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              BakaHouse
            </h1>
            <ul className="flex items-center gap-4">
              <li className="text-purple-500">
                <MoonStarIcon className="" />
              </li>
              <li className="text-purple-500">
                <Globe />
              </li>
              <li className="text-purple-500">
                <Avatar>
                  <AvatarFallback>BH</AvatarFallback>
                </Avatar>
              </li>
            </ul>
          </header>

          <main className="p-4 bg-slate-100 h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const intent = form.get("intent")?.toString();

  switch (intent) {
    case "create_new_store": {
      const name = form.get("name")?.toString();
      invariant(name, "Name is required");
      try {
        const store = await prisma.store.create({
          data: {
            name,
          },
        });
        const message = `New store, ${store.name} has been created successfully.`;
        const title = "Store created successfully.";
        return { store, success: true, message, title };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return {
            success: false,
            message: error.message,
            title: "Could not create new store.",
          };
        }
        return {
          success: false,
          message: "Some error occured",
          title: "Some error occured",
        };
      }
    }

    default:
      return null;
  }
};
