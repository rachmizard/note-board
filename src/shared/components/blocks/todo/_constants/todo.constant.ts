import { ComboboxOption } from "@/shared/components/ui/combobox";
import { TodoPriorityEnum } from "@/server/database/drizzle/todo.schema";

export const priorityOptions: ComboboxOption[] = [
  { value: TodoPriorityEnum.LOW, label: "Low" },
  { value: TodoPriorityEnum.MEDIUM, label: "Medium" },
  { value: TodoPriorityEnum.HIGH, label: "High" },
  { value: TodoPriorityEnum.CRITICAL, label: "Critical" },
];
