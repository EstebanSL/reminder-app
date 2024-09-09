"use server"

import { createTaskSchemaType } from "@/models/createTaskSchema";
import { currentUser } from "@clerk/nextjs";
import prisma from '@/lib/prisma'

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

export async function setTaskToDone(id: number, newValue: boolean) {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be signed in to create a task");
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