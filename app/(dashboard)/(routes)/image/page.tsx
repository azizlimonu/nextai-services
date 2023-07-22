"use client";

import { useRouter } from "next/navigation";
import { ImageIcon, Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import axios from "axios";

import Heading from "@/components/heading";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formImageSchema,
  amountOptions,
  resolutionOptions
} from "@/constants/formSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/empty";
import { Loader } from "@/components/Loader";
import UserAvatar from "@/components/userAvatar";
import BotAvatar from "@/components/botAvatar";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";

const ImagePage = () => {
  const router = useRouter();
  const proModal = useProModal();

  const [photos, setPhotos] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formImageSchema>>({
    resolver: zodResolver(formImageSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512"
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formImageSchema>) => {
    try {
      setPhotos([]);

      const response = await axios.post('/api/image', values);

      console.log("response", response);
      // get all the image.url
      const urls = response.data.map(
        (image: { url: string }) => image.url
      );
      console.log("URL image", urls);

      setPhotos(urls);
      form.reset();
      console.log("OK")
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
      console.log("ERROR")
    } finally {
      router.refresh();
    }
  }

  return (
    <div>
      <Heading
        title="Generate Image"
        description="Generate Image Using Prompt"
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
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
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of monalisa give thumbs up"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {amountOptions.map((option, idx) => (
                          <SelectItem
                            key={idx}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {resolutionOptions.map((option, idx) => (
                          <SelectItem
                            key={idx}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button
                className="col-span-12 lg:col-span-2 w-full" type="submit"
                disabled={isLoading}
                size="icon"
              >
                Generate
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}

          {photos.length === 0 && !isLoading && (
            <EmptyState label="No Image Generated Yet" />
          )}

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8"
          >
            {photos?.map((photo, idx) => (
              <Card key={idx}>
                <div className="relative aspect-square">
                  <Image
                    fill
                    alt={`image_${idx}`}
                    src={photo}
                  />
                </div>

                <CardFooter className="p-2">
                  <Button
                    onClick={() => window.open(photo)} variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ImagePage