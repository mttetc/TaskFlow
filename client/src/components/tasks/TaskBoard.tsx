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

interface TaskBoardProps {
  tasks: Task[];
  onUpdateTask: (id: number, status: Task['status']) => void;
  onDeleteTask: (id: number) => void;
}

const COLUMNS = [
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'ON_HOLD', label: 'On Hold' },
  { id: 'COMPLETED', label: 'Completed' },
] as const;

export function TaskBoard({
  tasks,
  onUpdateTask,
  onDeleteTask,
}: TaskBoardProps) {
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

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="mb-4">
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
              onClick={() => onDeleteTask(task.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-4 gap-6">
      {COLUMNS.map((column) => (
        <div 
          key={column.id} 
          className="space-y-4 min-h-[500px] bg-muted/30 rounded-lg p-4"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(e) => {
            e.preventDefault();
            const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
            onUpdateTask(taskId, column.id);
          }}
        >
          <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2 -mx-4 px-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                {column.label}
              </h2>
              <Badge variant="secondary" className="font-mono">
                {tasks.filter(t => t.status === column.id).length}
              </Badge>
            </div>
          </div>
          <div className="space-y-4">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  className="cursor-move"
                  onDragStart={(e) => {
                    e.dataTransfer.setData('taskId', task.id.toString());
                  }}
                >
                  <TaskCard task={task} />
                </div>
              ))}
            {tasks.filter(t => t.status === column.id).length === 0 && (
              <div className="h-24 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                Drop tasks here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
