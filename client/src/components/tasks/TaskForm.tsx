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
import { CreateTask, CreateTaskSchema, PriorityEnum } from "@/schemas/task";
import { useToast } from "@/hooks/use-toast";
import { DialogClose } from "@/components/ui/dialog";



export function TaskForm() {
  const { toast } = useToast();
  const { mutateAsync: addTask } = useAddTask();

  const form = useForm<CreateTask>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      category: "",
      dueDate: null,
      status: "TODO",
    },
  });

  const onSubmit = async (data: CreateTask) => {
    try {
      await addTask(data);
      form.reset();
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error("Failed to create task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
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
                <Input
                  type="datetime-local"
                  value={value || ""}
                  {...field}
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
          <DialogClose asChild>
            <Button type="submit">Create Task</Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}