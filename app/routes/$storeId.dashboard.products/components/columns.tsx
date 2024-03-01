import { Category, Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/formatDate";

export const categoryColumns: ColumnDef<Product>[] = [
  {
    header: "S.N",
    cell: ({ row }) => {
      const index = row.index + 1;
      return <span>{index}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.name}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return <span>{formatDate(row.original.createdAt)}</span>;
    },
  },
  {
    accessorKey: "__count",
    header: "Products",
    cell: ({ row }) => {
      return <span>{row.original.__count}</span>;
    },
  },
];
