import { trpc } from "@/server/trpc";
import { useInvalidateTags } from "./queries";

export const useCreateTag = () => {
  const invalidateTags = useInvalidateTags();
  return trpc.tag.createTag.useMutation({
    onSuccess: () => {
      invalidateTags();
    },
  });
};
