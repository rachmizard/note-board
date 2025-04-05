import { parseAsString } from "nuqs";
import { useQueryState } from "nuqs";

export const useFilterQueryState = () => {
  return useQueryState("status", parseAsString.withDefault("all"));
};

export const useSetFilterQueryState = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, setFilter] = useFilterQueryState();

  return setFilter;
};
