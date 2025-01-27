import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import {
  createCollectionSchema,
  createCollectionSchemaType,
} from "@/models/createCollectionSchema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { createCollection, updateCollection } from "@/actions/collection";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { Collection } from "@prisma/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actualData?: Collection;
}

export const CreateCollectionSheet = ({
  open,
  onOpenChange,
  actualData,
}: Props) => {

  const form = useForm<createCollectionSchemaType>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: actualData ? actualData.name : "",
      color: actualData ? actualData.color : "",
    },
  });

  const router = useRouter();

  const openChangeWrapper = (open: boolean) => {
    form.reset();
    onOpenChange(open);
  };

  const onSubmit = async (data: createCollectionSchemaType) => {
    try {
      if (actualData) {
        await updateCollection(actualData!.id, data);
      } else {
        await createCollection(data);
      }

      openChangeWrapper(false);
      router.refresh();
      toast({
        title: "Success",
        description: `Collection ${
          actualData ? "updated" : "created"
        } successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "something went wrong, please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={openChangeWrapper}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>add new collection</SheetTitle>
          <SheetDescription>
            Collections are a way to group tasks
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Home" {...field}></Input>
                  </FormControl>
                  <FormDescription>Collection name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(color) => field.onChange(color)}
                      defaultValue={actualData ? actualData.color : ""}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full h-8 text-white",
                          CollectionColors[field.value as CollectionColor]
                        )}
                      >
                        <SelectValue
                          placeholder="Color"
                          className="w-full h-8"
                        />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {Object.keys(CollectionColors).map((color) => (
                          <SelectItem
                            key={color}
                            value={color}
                            className={cn(
                              `w-full h-8 rounded-md my-1 text-white focus:text-white focus:font-bold focus:ring-2 ring-neutral-600 focus:ring-inset dark:focus:ring-white focus:px-8`,
                              CollectionColors[color as CollectionColor]
                            )}
                          >
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a color for your collection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="flex flex-col gap-3 mt-4">
          <Separator />
          <Button
            disabled={form.formState.isSubmitting}
            variant={"outline"}
            className={cn(
              form.watch("color") &&
                CollectionColors[form.getValues("color") as CollectionColor]
            )}
            onClick={form.handleSubmit(onSubmit)}
          >
            Confirm
            {form.formState.isSubmitting && (
              <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
