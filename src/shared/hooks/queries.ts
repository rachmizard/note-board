import { trpc } from "@/server/trpc";
import { GetTagsRequest } from "@/server/tag/tag.validator";

export const useTags = (request: GetTagsRequest) => {
  return trpc.tag.getTags.useQuery(request);
};

export const useInvalidateTags = () => {
  const trpcUtils = trpc.useUtils();
  return () => {
    trpcUtils.tag.getTags.invalidate();
  };
};
