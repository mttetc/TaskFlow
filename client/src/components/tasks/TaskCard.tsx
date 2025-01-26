import { Task } from "@/schemas/task";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, MoreVertical, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useResponsive } from "@/hooks/useResponsive";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange?: (id: number, status: Task['status']) => void;
}

const priorityColors = {
  HIGH: "border-red-500/40 bg-red-500/5",
  MEDIUM: "border-orange-500/40 bg-orange-500/5",
  LOW: "border-blue-500/40 bg-blue-500/5",
} as const;

const priorityVariants = {
  HIGH: "destructive",
  MEDIUM: "default",
  LOW: "default",
} as const;

const STATUSES = [
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'ON_HOLD', label: 'On Hold' },
  { id: 'COMPLETED', label: 'Completed' },
] as const;

interface TaskHeaderProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}

function TaskHeader({ title, onEdit, onDelete }: TaskHeaderProps) {
  return (
    <CardHeader className="pt-4 pb-2">
      <div className="flex items-center justify-between gap-2">
        <CardTitle className="text-base font-semibold leading-none tracking-tight truncate">
          {title}
        </CardTitle>
        <TaskActions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </CardHeader>
  );
}

interface TaskContentProps {
  description?: string | null;
  category?: string | null;
}

function TaskContent({ description, category }: TaskContentProps) {
  return (
    <CardContent className="pb-2">
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {category && (
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        )}
      </div>
    </CardContent>
  );
}

interface TaskActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

function TaskActions({ onEdit, onDelete }: TaskActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-initial"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-border">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const { isDesktop } = useResponsive();

  return (
    <Card className={`relative border border-border ${priorityColors[task.priority]}`}>
      <TaskHeader 
        title={task.title} 
        onEdit={() => onEdit(task)}
        onDelete={() => onDelete(task.id)}
      />
      <TaskContent
        description={task.description}
        category={task.category}
      />
      <div className="flex justify-between items-center px-6 pb-4">
        <Badge 
          variant={priorityVariants[task.priority]} 
          className="text-xs"
        >
          {task.priority}
        </Badge>
        {!isDesktop && onStatusChange && (
          <Select
            defaultValue={task.status}
            onValueChange={(value) => onStatusChange(task.id, value as Task['status'])}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {task.dueDate && (
        <div className="px-6 pb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Due {format(new Date(task.dueDate), "MMM d, yyyy")}
        </div>
      )}
    </Card>
  );
}