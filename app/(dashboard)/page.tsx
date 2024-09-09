import { SadFace } from "@/components/icons/sadFace";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { currentUser } from "@clerk/nextjs";
import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import { CreateCollectionBtn } from "@/components/createCollectionBtn";
import { CollectionCard } from "@/components/collectionCard";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMessageFallback />}>
        <WelcomeMessage />
      </Suspense>
      <Suspense fallback={<div>Loading</div>}>
        <CollectionList />
      </Suspense>
    </>
  );
}

async function WelcomeMessage() {
  const user = await currentUser();

  if (!user) {
    return <div>error</div>;
  }

  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        Welcome, <br />
        {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}

async function WelcomeMessageFallback() {
  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold flex flex-col gap-2">
        <Skeleton className="w-[150px] h-[30px]" />
        <Skeleton className="w-[150px] h-[30px]" />
      </h1>
    </div>
  );
}

async function CollectionList() {
  const user = await currentUser();
  const collections =
    (await prisma.collection.findMany({
      include: {
        tasks: true,
      },
      where: {
        userId: user?.id,
      },
    })) || [];

  if (collections.length <= 0) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        <Alert>
          <SadFace />
          <AlertTitle>There are not collections yet!</AlertTitle>
          <AlertDescription>
            Create a collection to get started.
          </AlertDescription>
        </Alert>
        <CreateCollectionBtn />
      </div>
    );
  }

  return (
    <div>
      <CreateCollectionBtn />
      <div className="mt-6">
        <p className="font-semibold">Collections: {collections.length}</p>
        <div className="flex flex-col gap-4 mt-6">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
}
