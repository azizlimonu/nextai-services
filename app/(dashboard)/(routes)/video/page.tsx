"use client";

import { useRouter } from "next/navigation";
import { FileAudio } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import axios from "axios";

import Heading from "@/components/heading";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema
} from "@/constants/formSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/empty";
import { Loader } from "@/components/Loader";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";

const VideoPage = () => {
  const router = useRouter();
  const proModal = useProModal();

  const [video, setVideo] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);

      const response = await axios.post('/api/music', values);

      setVideo(response.data[0]);

      form.reset();
      console.log("OK")
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong with the video.");
      }
      console.log("ERROR")
    } finally {
      router.refresh();
    }
  }

  return (
    <div>
      <Heading
        title="Generate Video"
        description="Generate Video Using Prompt"
        icon={FileAudio}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6  focus-within:shadow-sm  grid  grid-cols-12  gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Fish swimming in a coral reef"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                size="icon"
                className="col-span-12 lg:col-span-2 w-full"
              >
                Generate
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div
              className="p-8 rounded-lg w-full flex items-center justify-center bg-muted"
            >
              <Loader />
            </div>
          )}

          {!video && !isLoading && (
            <EmptyState label="No Video Generated Yet" />
          )}

          {video && (
            <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
              <source src={video} />
            </video>
          )}

        </div>
      </div>
    </div>
  )
}

export default VideoPage