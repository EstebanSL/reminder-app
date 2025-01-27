"use client";

import { Task, Collection } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { Checkbox } from "./ui/checkbox";
import { formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import { setTaskToDone } from "@/actions/task";
import { useRouter } from "next/navigation";
import { CreateTaskDialog } from "./createTaskDialog";
import { UpdateIcon } from "./icons/editIcon";
import { Button } from "./ui/button";

interface Props {
  collection: Collection;
  task: Task;
}

function getExpirationColor(expiresAt: Date): string {
  const days = Math.floor(expiresAt.getTime() - Date.now()) / 1000 / 60 / 60;
  if (days < 0) return "text-gray-500 dark:text-gray-300";
  if (days < 3 * 24) return "text-red-500 dark:text-red-400";
  if (days < 3 * 24) return "text-orange-500 dark:text-orange-400";
  return "text-green-500 dark:text-green-400";
}

export const TaskCard = ({ task, collection }: Props) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex gap-2 items-start">
      <Checkbox
        onCheckedChange={() => {
          startTransition(async () => {
            await setTaskToDone(task.id, !task.done);
            router.refresh();
          });
        }}
        className="w-5 h-5"
        checked={task.done}
        id={task.id.toString()}
      />
      <label
        htmlFor={task.id.toString()}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 decoration-1 dark:decoration-white",
          task.done && "line-through"
        )}
      >
        {task.content}
        {task.expiresAt && (
          <p
            className={cn(
              "text-sm text-neutral-500 dark:text-neutral-400",
              getExpirationColor(task.expiresAt)
            )}
          >
            {formatDate(task.expiresAt, "dd/MM/yyyy")}
          </p>
        )}
      </label>
      <Button className="ml-auto text-neutral-500" size="icon" variant="ghost" onClick={() => setShowCreateModal(true)}>
        <UpdateIcon />
      </Button>
      {showCreateModal && (
        <CreateTaskDialog
          open={showCreateModal}
          setOpen={setShowCreateModal}
          collection={collection}
          actualData={task}
        />
      )}
    </div>
  );
};
