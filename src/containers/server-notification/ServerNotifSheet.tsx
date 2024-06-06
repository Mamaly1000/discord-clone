"use client";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNotifBar } from "@/hooks/use-notification-bar-store";
import useNotificationQuery from "@/hooks/use-notification-query";
import { DatePickerWithRange } from "@/components/ui/RangePicker";
import { DateRange } from "react-day-picker";
import { add, sub } from "date-fns";
import { Channel, Member, Profile, Server } from "@prisma/client";
import useDirectNotificationQuery from "@/hooks/use-direct-notification-query";
import { SelectScrollable } from "@/components/ui/ScrollableSelect";
import { iconMapRaw } from "@/components/common/icons";
import { Button } from "@/components/ui/button";
import { ResetIcon } from "@radix-ui/react-icons";
import CustomTooltip from "@/components/common/action-tooltip";
import { SpinnerIcon } from "@livekit/components-react";
import { Check, Hash, TriangleAlert, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MutiTabs } from "@/components/ui/MultiTabs";
import NotificationCard from "@/components/cards/NotificationCard";
import DirectNotificationCard from "@/components/cards/DirectNotificationCard";
import EmptyMessage from "@/components/common/EmptyMessage";

const ServerNotifSheet = ({
  channels = [],
  members = [],
  server,
}: {
  server: Server;
  channels?: Channel[];
  members?: (Member & { profile: Profile })[];
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: sub(new Date(), { days: 10 }),
    to: add(new Date(), { hours: 1 }),
  });
  const [selectedFilters, setSelectedFilters] = useState({
    memberId: undefined,
    channelId: undefined,
  });

  const { open, onChange } = useNotifBar();
  const {
    isLoading: notificationsLoading,
    data: notificationsData,
    status: notifications_status,
    refetch: notification_refetch,
  } = useNotificationQuery({
    channelId: selectedFilters.channelId,
    serverId: server.id,
    startDate: date?.from,
    endDate: date?.to,
  });
  const {
    isLoading: directNotificationsLoading,
    data: direct_notifications_data,
    refetch: direct_notifications_refetch,
    status: direct_notifications_status,
  } = useDirectNotificationQuery({
    memberId: selectedFilters.memberId,
    serverId: server.id,
    startDate: date?.from,
    endDate: date?.to,
  });

  useEffect(() => {
    if (open) {
      notification_refetch();
      direct_notifications_refetch();
    }
  }, [open]);

  const directNotifications =
    direct_notifications_data?.pages.map((p) => p.items).flat() || [];
  const notifications =
    notificationsData?.pages.map((p) => p.items).flat() || [];

  const isLoading = notificationsLoading || directNotificationsLoading;

  const onResetFilters = () => {
    setSelectedFilters({ channelId: undefined, memberId: undefined });
  };

  return (
    <Sheet open={open} onOpenChange={onChange}>
      <SheetContent className="space-y-5 bg-[#e3e5e8] dark:bg-[#1e1f22]">
        <SheetHeader>
          <SheetTitle>Your notifications</SheetTitle>
          <SheetDescription>
            Track all your notifications from channels and direct messages.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full max-w-full h-fit">
          <div className="flex flex-col items-start justify-start gap-5 w-full max-w-full">
            <DatePickerWithRange date={date} setDate={setDate} />
            <SelectScrollable
              placeholder="Filter Channels"
              items={channels.map((c) => ({
                id: c.id,
                label: c.name,
                value: c.id,
                icon: iconMapRaw[c.type],
              }))}
              value={selectedFilters.channelId}
              key={selectedFilters.channelId}
              onChange={(val) =>
                setSelectedFilters({ ...selectedFilters, channelId: val })
              }
            />
            <SelectScrollable
              placeholder="Filter Members"
              value={selectedFilters.memberId}
              key={selectedFilters.memberId}
              items={members.map((member) => ({
                id: member.id,
                label: member.profile.name,
                value: member.id,
                imageUrl: member.profile.imageUrl,
                role: member.role,
              }))}
              onChange={(val) =>
                setSelectedFilters({ ...selectedFilters, memberId: val })
              }
            />
            <div className="w-full flex flex-wrap items-start justify-start gap-5">
              <CustomTooltip align="center" label="Reset Filters" side="bottom">
                <Button
                  onClick={() => onResetFilters()}
                  size={"icon"}
                  variant={"destructive"}
                >
                  <ResetIcon className="w-4 h-4" />
                </Button>
              </CustomTooltip>
              <CustomTooltip
                align="center"
                side="bottom"
                label={isLoading ? "Pending..." : "Search completed!"}
              >
                <Button variant={"secondary"} size={"icon"}>
                  {isLoading ? (
                    <SpinnerIcon className="animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </Button>
              </CustomTooltip>
            </div>
          </div>
          <Separator className="my-5  h-[2px] w-full bg-zinc-300 dark:bg-zinc-700 rounded-md  mx-auto" />
          <MutiTabs
            key={{
              notifications_status,
              direct_notifications_status,
            }.toString()}
            tab_container={{ defaultValue: "channels" }}
            tabs_list_container={{
              tabs: [
                {
                  icon: Hash,
                  label: "channels",
                  value: "channels",
                  isPending: notifications_status,
                },
                {
                  icon: User,
                  label: "conversations",
                  value: "conversations",
                  isPending: direct_notifications_status,
                },
              ],
            }}
            tabs_content_containers={[
              {
                value: "channels",
                children: (
                  <ScrollArea className="h-64 w-full max-w-full rounded-md flex flex-col items-start justify-start gap-0 p-1">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <NotificationCard
                          handler={() => notification_refetch()}
                          key={n.id}
                          notif={n}
                        />
                      ))
                    ) : (
                      <EmptyMessage
                        className="py-10"
                        Icon={TriangleAlert}
                        message="there is no notification!"
                      />
                    )}
                  </ScrollArea>
                ),
              },
              {
                value: "conversations",
                children: (
                  <ScrollArea className="h-64 w-full rounded-md flex flex-col items-start justify-start gap-0">
                    {directNotifications.length > 0 ? (
                      directNotifications.map((n) => (
                        <DirectNotificationCard
                          handler={() => direct_notifications_refetch()}
                          key={n.id}
                          notif={n}
                        />
                      ))
                    ) : (
                      <EmptyMessage
                        className="py-10"
                        Icon={TriangleAlert}
                        message="there is no notification!"
                      />
                    )}
                  </ScrollArea>
                ),
              },
            ]}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ServerNotifSheet;
