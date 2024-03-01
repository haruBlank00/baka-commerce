import { Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

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
  },
];
