"use server"

import { createTaskSchemaType } from "@/models/createTaskSchema";
import { currentUser } from "@clerk/nextjs";
import prisma from '@/lib/prisma'
import { Task } from "@prisma/client";

export async function createTask(data: createTaskSchemaType) {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be signed in to create a task");
  }

  const { content, collectionId, expiresAt} = data

  return await prisma.task.create({
    data: {
      userId: user.id,
      content,
      expiresAt,
      Collection: {
        connect: {
          id: collectionId
        }
      }
    },
  });
}

export async function updateTask(id: number, data: Task) {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be signed in to update a task");
  }

  return await prisma.task.update({
    where: {
      id: id,
      userId: user.id
    },
    data: data
  });
}

export async function setTaskToDone(id: number, newValue: boolean) {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be signed in to update a task");
  }

  return await prisma.task.update({
    where: {
      id: id,
      userId: user.id
    },
    data: {
      done: newValue
    }
  });
}