"use client";

import { trpc } from "@/utils/trpc";

export function TrpcExample() {
  const hello = trpc.hello.useQuery();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-2">tRPC Example</h2>
      {hello.isLoading ? (
        <p>Loading...</p>
      ) : hello.error ? (
        <p className="text-red-500">Error: {hello.error.message}</p>
      ) : (
        <p className="text-green-600">{hello.data?.message}</p>
      )}
    </div>
  );
}
