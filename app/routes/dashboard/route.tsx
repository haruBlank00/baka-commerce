import { Outlet } from "@remix-run/react";
import { Globe, Home, MoonStarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { StoreInfo } from "./components/store-info";
import { MainNav } from "./components/main-nav";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen h-screen">
      <div className="h-full items-stretch flex">
        <nav className="h-full basis-48  border-r">
          <StoreInfo />

          <MainNav />
        </nav>

        <div className="flex-1">
          <header className="flex justify-between p-4 border">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              BakaHouse
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
  );
}
