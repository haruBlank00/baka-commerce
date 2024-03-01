import { NavLink } from "@remix-run/react";
import { Home } from "lucide-react";
import { cn } from "~/lib/utils";

const MainLinks = [
  {
    to: "/dashboard",
    label: "Home",
    icon: <Home className="w-4 h-4" />,
  },
  {
    to: "/dashboard/categories",
    label: "Categories",
    icon: <Home className="w-4 h-4" />,
  },
  {
    to: "/dashboard/products",
    label: "Products",
    icon: <Home className="w-4 h-4" />,
  },
];

export const MainNav = () => {
  return (
    <div className="mt-2 p-3">
      <p className="font-semibold text-gray-400 mb-2 text-sm">Main Links</p>

      <ul className="flex flex-col">
        {MainLinks.map((link) => {
          const { icon, label, to } = link;
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive, isPending }) => {
                return cn(
                  "flex items-center gap-2 text-gray-600 hover:bg-purple-200 p-2 rounded-md",
                  isActive && "bg-purple-200",
                  isPending && "opacity-50"
                );
              }}
            >
              <span>{icon}</span>
              <span className="capitalize font-semibold text-xs">{label}</span>
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
};
