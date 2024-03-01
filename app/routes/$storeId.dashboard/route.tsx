import { Prisma } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { Globe, MoonStarIcon } from "lucide-react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { toast } from "~/components/ui/use-toast";
import { prisma } from "~/services/db.server";

import { ownerAuthenticator } from "~/services/auth.server";
import { CreateStoreModal } from "./components/create-store-modal";
import { MainNav } from "./components/main-nav";
import { StoreInfo } from "./components/store-info";
import { StoreListModal } from "./components/store-list-modal";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const storeId = params.storeId;
  const user = await ownerAuthenticator.isAuthenticated(request, {
    failureRedirect: "/dashboard-login",
  });
  const userId = user.id;
  if (storeId === "store") {
    try {
      const store = await prisma.store.findFirst({
        where: {
          owner: {
            id: userId,
          },
        },
      });
      if (!store) {
        return { promptCreateStore: true } as const;
      }
      const url = `/${store?.id}/dashboard`;
      return redirect(url);
    } catch (e) {
      console.log("dashboard loader storeId === store, error", e);
      return { promptCreateStore: true } as const;
    }
  }

  try {
    const stores = await prisma.store.findMany({
      where: {
        owner: {
          id: userId,
        },
      },
    });

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
    });

    if (!store) {
      return redirect("/store/dashboard");
    }
    return { promptCreateStore: false, stores, store } as const;
  } catch (error) {
    return { promptCreateStore: true } as const;
  }
};

export default function DashboardLayout() {
  const loaderData = useLoaderData<typeof loader>();
  const [showStoreList, setShowStoreList] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(
    loaderData.promptCreateStore
  );
  const actionData = useActionData<typeof action>();

  if (actionData?.success) {
    toast({
      title: actionData.title,
      description: actionData.message,
    });
  }

  if (loaderData?.promptCreateStore) {
    return (
      <CreateStoreModal
        showStoreForm={loaderData?.promptCreateStore}
        setShowStoreForm={setShowStoreForm}
      />
    );
  }

  return (
    <>
      <CreateStoreModal
        showStoreForm={showStoreForm}
        setShowStoreForm={setShowStoreForm}
      />
      <StoreListModal
        onClick={() => {
          setShowStoreForm(true);
          setShowStoreList(false);
        }}
        showStoreList={showStoreList}
        setShowStoreList={setShowStoreList}
        stores={loaderData.stores}
      />

      <div className="min-h-screen h-screen">
        <div className="h-full items-stretch flex">
          <nav className="h-full basis-48  border-r">
            <StoreInfo
              imageSrc=""
              name={loaderData?.store?.name || ""}
              onClick={() => setShowStoreList(true)}
            />

            <MainNav />
          </nav>

          <div className="flex-1">
            <header className="flex justify-between p-4 border">
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 capitalize">
                {loaderData?.store?.name}
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
    </>
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
        const user = await ownerAuthenticator.isAuthenticated(request, {
          failureRedirect: "/dashboard-login",
        });
        const userId = user.id;

        const store = await prisma.store.create({
          data: {
            name,
            ownerId: userId,
          },
        });
        const message = `New store, ${store.name} has been created successfully.`;
        const title = "Store created successfully.";
        return redirect(`/${store.id}/dashboard`);
        // return { store, success: true, message, title };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return {
            store: null,
            success: false,
            message: error.message,
            title: "Could not create new store.",
          };
        }
        return {
          store: null,
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
