"use client";

import { useRouter } from "next/navigation";
import { Download, Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import axios from "axios";

import Heading from "@/components/heading";
import { zodResolver } from "@hookform/resolvers/zod";
import { formMusicSchema } from "@/constants/formSchema";
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

const MusicPage = () => {
  const router = useRouter();
  const proModal = useProModal();

  const [music, setMusic] = useState<string>();

  const form = useForm<z.infer<typeof formMusicSchema>>({
    resolver: zodResolver(formMusicSchema),
    defaultValues: {
      prompt: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formMusicSchema>) => {
    try {
      setMusic(undefined);

      const response = await axios.post('/api/music', values);

      setMusic(response.data.audio);

      form.reset();
      console.log("OK")
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong with the music.");
      }
    } finally {
      router.refresh();
    }
  }

  return (
    <div>
      <Heading
        title="Generate Music"
        description="Generate Music Using Prompt"
        icon={Music}
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
                        placeholder="funky synth solo"
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

          {!music && !isLoading && (
            <EmptyState label="No Music Generated Yet" />
          )}

          {music && (
            <audio controls className="w-full mt-8">
              <source src={music} />
            </audio>
          )}

        </div>
      </div>
    </div>
  )
}

export default MusicPage