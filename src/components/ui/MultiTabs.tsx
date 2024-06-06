import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Loader, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface props {
  tab_container: {
    defaultValue?: string;
    className?: string;
  };
  tabs_list_container: {
    className?: string;
    tabs: {
      value: string;
      label: string;
      icon: LucideIcon;
      isPending?: "error" | "success" | "pending";
    }[];
  };
  tabs_content_containers: {
    value: string;
    children: ReactNode;
    className?: string;
  }[];
}
export function MutiTabs({
  tab_container,
  tabs_content_containers,
  tabs_list_container,
}: props) {
  return (
    <Tabs
      defaultValue={tab_container.defaultValue}
      className={cn("w-full", tab_container.className)}
    >
      <TabsList
        className={cn("grid w-full grid-cols-2", tabs_list_container.className)}
      >
        {tabs_list_container.tabs.map((tab) => (
          <TabsTrigger
            value={tab.value}
            className="flex items-center justify-center gap-2"
            key={tab.value}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.isPending === "pending" && (
              <Loader className="w-4 h-4 animate-spin" />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs_content_containers.map((container) => (
        <TabsContent
          key={container.value}
          value={container.value}
          className={cn("max-w-full w-full", container.className)}
        >
          {container.children}
        </TabsContent>
      ))}
    </Tabs>
  );
}
