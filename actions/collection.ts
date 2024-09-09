"use server"

import { createCollectionSchemaType } from "@/models/createCollectionSchema";
import { currentUser } from "@clerk/nextjs";
import prisma from '@/lib/prisma'

export async function createCollection(form: createCollectionSchemaType) {
  const user = await currentUser()

  if (!user) {
    throw new Error("You must be signed in to create a collection")
  }

  return await prisma.collection.create({
    data: {
      userId: user.id,
      color: form.color,
      name: form.name,
    }
  })
}

export async function deleteCollection(id: number) {
  const user = await currentUser()

  if (!user) {
    throw new Error("You must be signed in to create a collection")
  }

  return await prisma.collection.delete({
    where: {
      id: id
    }
  })
}