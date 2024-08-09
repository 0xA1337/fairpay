"use client";

import { useImageUpload } from "@/app/new/_hooks/use-image-upload";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Textarea } from "@/shared/components/ui/textarea";
import { ALLOWED_IMAGE_TYPES } from "@/shared/constants";
import { cn } from "@/shared/utils/tailwind";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Address } from "viem";
import { z } from "zod";
import { SubmitButtonWrapper } from "./submit-button-wrapper";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  description: z.string().min(3, { message: "Description must be at least 3 characters long." }),
  recipient: z.string(), // TODO: Add validation
  goal: z
    .number()
    .min(10, { message: "The target amount cannot be below 10 USD." })
    .max(5_000_000, { message: "The target amount cannot exceed 5,000,000 USD." })
    .optional(),
  endDate: z.date().optional(),
  image: z.instanceof(File).optional(),
});

export function NewCampaignForm() {
  // const { address } = useAccount();

  const {
    mutate: uploadImageToIpfs,
    isPending: imageUploadIsLoading,
    isError: imageUploadIsError,
    isSuccess: imageUploadIsSuccess,
    data: imageUploadResult,
    error: imageUploadError,
  } = useImageUpload();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      goal: undefined,
      recipient: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);

    if (form.watch("image") && !imageUploadIsSuccess) {
      form.setError("image", {
        type: "manual",
        message: "Image is not confirmed.",
      });
      return;
    }
  };

  const imageField = form.watch("image");

  const formValues = form.getValues();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 w-full gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormDescription>A short, descriptive title for your campaign.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem className="col-span-1 row-span-2 flex flex-col h-full">
              <FormLabel>{"Image (optional)"}</FormLabel>
              <FormControl>
                <div className="flex flex-col flex-grow gap-x-2">
                  <Input
                    {...fieldProps}
                    placeholder="Image"
                    type="file"
                    accept={ALLOWED_IMAGE_TYPES.join(",")}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 10 * 1024 * 1024) {
                        form.setError("image", {
                          type: "manual",
                          message: "File size must be below 10MB.",
                        });
                        return;
                      }
                      onChange(file);
                      const formData = new FormData();
                      formData.append("file", file);
                      uploadImageToIpfs(formData);
                    }}
                    className="flex-grow text-center border-dashed border-2 bg-neutral-50"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" className="resize-none" rows={3} {...field} />
              </FormControl>
              <FormDescription>
                {
                  "A detailed description of your campaign. Include information about what you're raising money for and why."
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem className="flex flex-col col-span-1">
              <FormLabel>{"Goal (optional)"}</FormLabel>
              <FormControl>
                <div className="flex gap-x-2 items-center">
                  <Input placeholder="Goal" {...field} className="flex-grow" />
                  <span className="select-none">USD</span>
                </div>
              </FormControl>
              <FormDescription>The target amount (in USD) you want to raise.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col col-span-1">
              <FormLabel>{"End date (optional)"}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date <= new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem className="col-span-1 flex flex-col">
              <FormLabel>Recipient</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormDescription>A short, descriptive title for your campaign.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButtonWrapper
          title={formValues.title}
          description={formValues.description}
          bannerImage={imageUploadResult?.hash}
          recipient={formValues.recipient as Address}
          goal={formValues.goal}
          endDate={formValues.endDate}
        />
      </form>
    </Form>
  );
}
