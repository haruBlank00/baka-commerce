import { Category } from "@prisma/client";
import { useFetcher, useNavigate } from "@remix-run/react";
import { Eye, MoreHorizontal, Pen, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type CellActionsProps = {
  showSheet: boolean;
  setShowSheet: React.Dispatch<React.SetStateAction<boolean>>;
  data: Category;
};
export const CellActions = ({ data }: CellActionsProps) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(`?edit=true&categoryId=${data.id}`)}
          >
            <Eye className="w-4 h-4 text-blue-500" />
            <span>View</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(`?edit=true&categoryId=${data.id}`)}
          >
            <Pen className="w-4 h-4 text-green-500" />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() =>
              fetcher.submit(
                { categoryId: data.id },
                {
                  method: "DELETE",
                  action: "destroy",
                }
              )
            }
          >
            <Trash className="w-4 h-4 text-red-500" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
