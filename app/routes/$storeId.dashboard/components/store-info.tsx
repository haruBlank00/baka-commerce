import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card } from "~/components/ui/card";

export const StoreInfo = ({
  onClick,
  imageSrc,
  name,
}: {
  onClick: () => void;
  imageSrc: string;
  name: string;
}) => {
  const abbr = name.split(" ").map((n) => n[0]?.toUpperCase());
  return (
    <Card
      className="flex items-center gap-2 hover:bg-slate-100 cursor-pointer transition border-b p-2 py-4 shadow-none rounded-none"
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage src={imageSrc} />
        <AvatarFallback className="text-purple-500 capitalize">
          {abbr}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 justify-between">
        <p className="font-semibold text-base capitalize">{name}</p>
        <ChevronRight />
      </div>
    </Card>
  );
};
