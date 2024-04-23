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
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import FileUploader from "@/components/common/file-uploader";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is reqired!",
  }),
});

type formValueType = z.infer<typeof formSchema>;

const MessageFileModal = () => {
  const router = useRouter();

  const { data, isOpen, onClose, onOpen, type } = useModal();
  const isModalOpen = isOpen && type === "message-file";

  const form = useForm<formValueType>({
    resolver: zodResolver(formSchema),
    defaultValues: { fileUrl: "" },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = form.handleSubmit(async (values: formValueType) => {
    try {
      const url = qs.stringifyUrl({
        url: data?.apiUrl || "",
        query: data?.query,
      });
      await axios
        .post(url, { ...values, content: values.fileUrl })
        .then((res) => {
          form.reset();
          router.refresh();
          onClose();
        });
    } catch (error) {
      console.log(error);
    }
  });

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 capitalize">
            send a file as a message.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <FileUploader
                            endpoint="messageFile"
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
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                type="submit"
                variant={"primary"}
                className="capitalize"
                disabled={isLoading}
              >
                send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
