/* eslint-disable @next/next/no-img-element */
"use client";

import { useImageUpload } from "@/app/new/_hooks/use-image-upload";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
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
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Address, getAddress } from "viem";
import { z } from "zod";
import { useUserByUsername } from "../_hooks/use-username-search";
import { SubmitButtonWrapper } from "./submit-button-wrapper";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  description: z.string().min(3, { message: "Description must be at least 3 characters long." }),
  recipient: z.string({
    required_error: "A recipient is required.",
  }),
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
  const [typedUsername, setTypedUsername] = useState("");

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
    mode: "onBlur",
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => console.log(values);

  const formValues = form.getValues();

  const { data: searchResults, isLoading: isSearching } = useUserByUsername(typedUsername);

  const matchingUsers = searchResults || [];

  console.log("Recipient", formValues.recipient);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 w-full gap-4"
      >
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
            <FormItem className=" row-span-2 flex flex-col h-full">
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
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem className="flex flex-col  mt-5">
              <FormLabel>{"Goal (optional)"}</FormLabel>
              <FormControl>
                <div className="flex gap-x-2 items-center">
                  <Input
                    placeholder="Goal"
                    {...fieldProps}
                    className="flex-grow"
                    inputMode="numeric"
                    autoComplete="off"
                    type="number"
                    step={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        onChange(undefined);
                      } else if (/^\d*$/g.test(value)) {
                        onChange(parseInt(value));
                      }
                    }}
                  />
                  <span className="select-none">USD</span>
                </div>
              </FormControl>
              <FormDescription>
                The target amount (in USD) you want to raise. The campaign will continue to accept
                donations even after reaching this goal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col  mt-5">
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
              <FormDescription>
                The date when the campaign will end. After this date, the campaign will no longer be
                accepting donations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem className=" flex flex-col">
              <FormLabel>Recipient</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? field.value : "Select a recipient"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search for a recipient..."
                      value={typedUsername}
                      onValueChange={setTypedUsername}
                    />
                    <CommandList>
                      <CommandEmpty>{isSearching ? "Searching..." : "No user found."}</CommandEmpty>
                      <CommandGroup>
                        {matchingUsers.map((user) => {
                          const address =
                            user.verified_addresses.eth_addresses[0] ?? user.custody_address;

                          return (
                            <CommandItem
                              value={address}
                              key={address}
                              onSelect={() => {
                                form.setValue("recipient", getAddress(address));
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  address === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <img src={user.pfp_url} alt="" className="h-8 w-8 m-1 rounded-full" />
                              <span className="leading-none">@{user.username}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>The account that will receive the funds.</FormDescription>
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
          formValid={form.formState.isValid}
        />
      </form>
    </Form>
  );
}
