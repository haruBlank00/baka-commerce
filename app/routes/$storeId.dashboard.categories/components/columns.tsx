import { Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/formatDate";

export const categoryColumns: ColumnDef<Category>[] = [
  {
    header: "S.N",
    cell: ({ row }) => {
      const index = row.index + 1;
      return <span>{index}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.name}</span>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <figure className="h-14 w-14">
          <img
            className="w-full h-full object-contain"
            src={row.original.image}
            alt={row.original.name}
          />
        </figure>
      );
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
