import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { prisma } from "~/services/db.server";
import { categoryColumns } from "./components/columns";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const storeId = params.storeId;
  const products = await prisma.product.findMany({
    where: {
      storeId,
    },
    include: {
      _count: true,
    },
  });
  return { products };
};

export default function Product() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Store Products</h2>
          <Button
            size={"sm"}
            className="bg-purple-600 text-white"
            onClick={() => {}}
          >
            Add Product
          </Button>
        </div>

        <DataTable columns={categoryColumns} data={loaderData.products} />
      </div>
    </>
  );
}
