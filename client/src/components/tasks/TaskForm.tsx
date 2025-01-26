import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddTask } from "@/hooks/tasks/useAddTask";
import { useUpdateTask } from "@/hooks/tasks/useUpdateTask";
import { CreateTask, CreateTaskSchema, PriorityEnum, Task } from "@/schemas/task";
import { DialogClose } from "@/components/ui/dialog";
import { DatePicker } from "../ui/datepicker";

interface TaskFormProps {
  taskId?: number;
  initialValues?: Task;
  onClose: () => void;
}

export function TaskForm({ taskId, initialValues, onClose }: TaskFormProps) {
  const { mutateAsync: addTask } = useAddTask({ 
      onSuccess: () => {
        onClose();
      }}
  );
  const { mutateAsync: updateTask } = useUpdateTask({ 
      onSuccess: () => {
        onClose();
      }}
  );

  const form = useForm<CreateTask>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      priority: initialValues?.priority ?? "MEDIUM",
      category: initialValues?.category ?? "",
      dueDate: initialValues?.dueDate ?? null,
      status: initialValues?.status ?? "TODO",
    },
  });

  const onSubmit = async (data: CreateTask) => {
    if (taskId) {
      await updateTask({ id: taskId, data });
    } else {
      await addTask(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field: { value, ...field } }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Task description"
                  value={value || ""}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(PriorityEnum.Values).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field: { value, ...field } }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input
                  placeholder="Task category"
                  value={value || ""}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field: { value, ...field } }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <DatePicker 
                  date={value ? new Date(value) : undefined}
                  onSelect={(date) => field.onChange(date ? date.toISOString() : undefined)}
                  placeholder="Pick a date"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">{taskId ? "Save Changes" : "Create Task"}</Button>
        </div>
      </form>
    </Form>
  );
}