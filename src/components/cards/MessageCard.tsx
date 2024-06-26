"use client";

import React, { FC, useEffect, useState } from "react";

import { safeMessageType } from "@/types";
import { Member } from "@prisma/client";

import CustomTooltip from "@/components/common/action-tooltip";

import UserAvatar from "@/components/common/UserAvatar";
import Image from "next/image";
import { Edit, FileIcon, Trash } from "lucide-react";
import { roleIcon } from "@/components/common/icons";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm } from "react-hook-form";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";

interface props {
  message: safeMessageType;
  index: number;
  deleted?: boolean;
  currentMember: Member;
  isUpdated?: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
  timeStamp: string;
  isInNotification?: boolean;
  IsMessageSeen?: boolean;
}

const formSchema = z.object({
  content: z.string().min(1),
});

type formValueType = z.infer<typeof formSchema>;

const MessageCard: FC<props> = ({
  message,
  currentMember,
  socketQuery,
  socketUrl,
  deleted,
  isUpdated,
  timeStamp,
  isInNotification,
  IsMessageSeen,
}) => {
  const router = useRouter();
  const params = useParams();

  const { onOpen } = useModal();

  const [isEditing, setEditing] = useState(false);

  const form = useForm<formValueType>({
    resolver: zodResolver(formSchema),
    values: { content: message.content },
  });
  const isLoading = form.formState.isSubmitting;

  const icon = roleIcon[message.member.role];

  const isOwner = currentMember.id === message.member.id;
  const canDelete = !deleted && currentMember.role !== "GUEST";
  const canEdit = !deleted && isOwner && !message.fileUrl;
  const isPDF = message.fileUrl?.split(".").pop() === "pdf";
  const isImage = !isPDF && !!message.fileUrl;

  const onMemberClick = () => {
    if (currentMember.id !== message.memberId) {
      router.push(
        `/servers/${params?.serverId}/conversation/${message.memberId}`
      );
    }
  };

  const onSubmit = form.handleSubmit(async (values: formValueType) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${message.id}`,
        query: socketQuery,
      });
      await axios.patch(url, values).then((res) => {
        setEditing(false);
      });
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    const keyDown = (ev: any) => {
      if (ev.key === "Escape" || ev.keyCode === 27) {
        setEditing(false);
      }
    };
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  }, []);

  return (
    <article
      className={cn(
        "relative group flex items-center hover:bg-black/5 p-4 transition-all w-full",
        isInNotification &&
          !IsMessageSeen &&
          "bg-indigo-400/20 dark:bg-indigo-400/20"
      )}
    >
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={message.member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="font-semibold text-sm hover:underline cursor-pointer line-clamp-1"
              >
                {message.member.profile.name}
              </p>
              <CustomTooltip
                align="center"
                label={message.member.role}
                side="top"
              >
                <div className="mx-2">{icon}</div>
              </CustomTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timeStamp}
            </span>
          </div>
          {isImage && (
            <a
              href={message.fileUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48 "
            >
              <Image
                src={message.fileUrl!}
                alt={message.content}
                fill
                className="object-contain md:object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={message.fileUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!message.fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300 ",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 capitalize text-xs mt-1"
              )}
            >
              {deleted ? "this message has been deleted" : message.content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 capitalize">
                  edited
                </span>
              )}
            </p>
          )}
          {!message.fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={onSubmit}
                className="w-full flex items-center gap-x-2 pt-2 "
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              className="p-2 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 "
                              placeholder="Edited Message"
                              {...field}
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <Button
                  disabled={isLoading}
                  className="capitalize "
                  size={"sm"}
                  variant={"primary"}
                  type="submit"
                >
                  save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDelete && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEdit && (
            <CustomTooltip label="Edit" align="center" side="top">
              <Edit
                onClick={() => setEditing(true)}
                className="w-4 h-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </CustomTooltip>
          )}
          <CustomTooltip label="Delete" align="center" side="top">
            <Trash
              onClick={() =>
                onOpen({
                  type: "delete-message",
                  data: {
                    apiUrl: `${socketUrl}/${message.id}`,
                    query: socketQuery,
                  },
                })
              }
              className="w-4 h-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </CustomTooltip>
        </div>
      )}
    </article>
  );
};

export default MessageCard;
