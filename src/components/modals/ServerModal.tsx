"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import FileUploader from "@/components/common/file-uploader";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is reqired!",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is reqired!",
  }),
});

type formValueType = z.infer<typeof formSchema>;

const ServerModal = () => {
  const { isOpen, type, onClose } = useModal();
  const isModalOpen = isOpen && type === "create-server";

  const router = useRouter();

  const form = useForm<formValueType>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", imageUrl: "" },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = form.handleSubmit(async (values: formValueType) => {
    try {
      await axios.post("/api/servers", values).then((res) => {
        console.log(res.data.message);
        form.reset();
        router.refresh();
        handleClose();
      });
    } catch (error) {
      console.log(error);
    }
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 capitalize">
            give your server a personality with a name and an image. you can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                          server image
                        </FormLabel>
                        <FormControl>
                          <FileUploader
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        server name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          className="bg-zinc-300/50 capitalize border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                          placeholder="enter server name"
                        />
                      </FormControl>
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
                create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServerModal;
