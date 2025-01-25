import { Task } from "@/schemas/task";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  isUpdatingTask: boolean;
  isDeletingTask: boolean;
}

export function TaskList({
  tasks,
  onUpdateTask,
  onDeleteTask,
  isUpdatingTask,
  isDeletingTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No tasks found. Add a new task to get started!</p>
      </div>
    );
  }

  const getPriorityVariant = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "secondary";
      case "LOW":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusVariant = (status: Task["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      case "ON_HOLD":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{task.title}</CardTitle>
                {task.description && (
                  <CardDescription>{task.description}</CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                <Badge variant={getPriorityVariant(task.priority)}>
                  {task.priority}
                </Badge>
                <Badge variant={getStatusVariant(task.status)}>
                  {task.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {task.category && (
                  <p className="text-sm text-muted-foreground">
                    Category: {task.category}
                  </p>
                )}
                {task.dueDate && (
                  <p className="text-sm text-muted-foreground">
                    Due: {format(new Date(task.dueDate), "PPP")}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateTask(task.id)}
                  disabled={isUpdatingTask}
                >
                  {task.status === "COMPLETED" ? "Reopen" : "Complete"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteTask(task.id)}
                  disabled={isDeletingTask}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}