"use client";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
import { date, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChannelType } from "@prisma/client";
import qs from "query-string";
import { channel } from "diagnostics_channel";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Channel name is reqired!",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

type formValueType = z.infer<typeof formSchema>;

const ChannelsModal = () => {
  const router = useRouter();
  const params = useParams();

  const { type, isOpen, onClose, data } = useModal();
  const { channel } = data;

  const isModalOpen =
    isOpen && (type === "manage-channels" || type === "edit-channel");
  const isCreating = isOpen && type === "manage-channels";
  const isEditing = isOpen && type === "edit-channel";
  const form = useForm<formValueType>({
    resolver: zodResolver(formSchema),
    values: {
      name: !!channel ? channel?.name || "" : "",
      type: !!channel ? channel?.type || ChannelType.TEXT : ChannelType.TEXT,
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values: formValueType) => {
    try {
      const url = qs.stringifyUrl({
        url: isCreating ? `/api/channels` : `/api/channels/${channel?.id}`,
        query: { serverId: params?.serverId },
      });
      let req;
      if (isCreating) {
        req = await axios.post(url, values).then((res) => {
          console.log(res.data.message);
          router.refresh();
          handleClose();
        });
      }
      if (isEditing) {
        req = await axios.patch(url, values).then((res) => {
          console.log(res.data.message);
          router.refresh();
          handleClose();
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            {isCreating && "create channel"}
            {isEditing && "Edit channel"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        channel name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          className="bg-zinc-300/50 capitalize border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                          placeholder="enter channel name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        channel type
                      </FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-zinc-300/50 capitalize border-0 focus:ring-0 text-black focus:ring-offset-0 ring-offset-0 outline-none">
                            <SelectValue placeholder="select a channel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ChannelType).map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                type="submit"
                variant={"primary"}
                className="capitalize"
                disabled={isLoading}
              >
                {isCreating ? "create" : "save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelsModal;
