import { trpc } from "@/server/trpc";
import { GetTagsRequest } from "@/server/tag/tag.validator";

export const useTags = (request: GetTagsRequest, enabled = true) => {
  return trpc.tag.getTags.useQuery(request, { enabled });
};

export const useInvalidateTags = () => {
  const trpcUtils = trpc.useUtils();
  return () => {
    trpcUtils.tag.getTags.invalidate();
  };
};
