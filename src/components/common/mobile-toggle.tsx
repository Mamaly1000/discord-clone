import { Menu } from "lucide-react";
import React from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import NavigationSidebar from "@/containers/server-navigation/NavigationSidebar";
import ServerSidebar from "@/containers/server-sidebar/ServerSidebar";
import MobileNavSheet from "./MobileNavSheet";

const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <MobileNavSheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 flex gap-0">
        <div className="w-[72px] ">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </MobileNavSheet>
  );
};

export default MobileToggle;
