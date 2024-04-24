"use client";
import React, { FC } from "react";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import axios from "axios";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";
import EmojoPicker from "@/components/ui/EmojoPicker";
import { useRouter } from "next/navigation";

interface props {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "channel" | "conversation";
}

const formSchema = z.object({
  content: z.string().min(1),
});

type formValueType = z.infer<typeof formSchema>;

const ChatInput: FC<props> = ({ apiUrl, name, query, type }) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const form = useForm<formValueType>({
    resolver: zodResolver(formSchema),
    values: { content: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values: formValueType) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values).then((res) => {
        console.log(res.data.message);
        form.reset();
        router.refresh();
      });
    } catch (error) {
      console.log(error);
    }
  });

  const onAttach = () => {
    onOpen({ type: "message-file", data: { apiUrl, query } });
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full max-w-full">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6">
                    <button
                      type="button"
                      onClick={onAttach}
                      className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full flex items-center justify-center p-1"
                    >
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                    <Input
                      {...field}
                      disabled={isLoading}
                      className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      placeholder={`Message ${
                        type === "channel" ? `#${name}` : name
                      }`}
                    />
                    <div className="absolute top-7 right-8">
                      <EmojoPicker
                        onChange={(val) =>
                          field.onChange(field.value + " " + val)
                        }
                      />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
