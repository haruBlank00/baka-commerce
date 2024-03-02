import { Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/formatDate";
import { CellActions } from "./cell-actions";

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
    accessorKey: "__count",
    header: "No. of Products",
    cell: ({ row }) => {
      return (
        <p className="font-bold text-lg">{row.original?._count?.products}</p>
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
    id: "cell-actions",
    cell: ({ row }) => {
      return <CellActions data={row.original} />;
    },
  },
];
