import { TodoPriorityEnum } from "@/server/database";
import { parseAsStringEnum, useQueryState } from "nuqs";

export const usePriorityQueryState = () => {
  return useQueryState(
    "priority",
    parseAsStringEnum(Object.values(TodoPriorityEnum))
  );
};

export const useSetPriorityQueryState = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, setPriority] = usePriorityQueryState();

  return setPriority;
};
