import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

export const StoreInfo = () => {
  return (
    <div className="flex items-center gap-2 hover:bg-slate-100 cursor-pointer transition border-b p-2 py-4">
      <Avatar>
        <AvatarFallback className="text-purple-500">BH</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 justify-between">
        <p className="font-semibold text-base">Baka House</p>
        <ChevronRight />
      </div>
    </div>
  );
};
