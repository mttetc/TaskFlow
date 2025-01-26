import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTask, useGetTasks, useUpdateTask } from "@/hooks/tasks";
import { Task } from "@/schemas/task";
import { useState } from 'react';
import { TaskForm } from './TaskForm';
import { TaskCard } from './TaskCard';
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResponsive } from "@/hooks/useResponsive";

type ColumnId = typeof COLUMNS[number]['id'];

const COLUMNS = [
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'ON_HOLD', label: 'On Hold' },
  { id: 'COMPLETED', label: 'Completed' },
] as const;

export function TaskBoard() {
  const [activeTab, setActiveTab] = useState<ColumnId>(COLUMNS[0].id);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { data: tasks = [], isLoading } = useGetTasks();
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: deleteTask } = useDeleteTask();
  
  const { isDesktop } = useResponsive();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p>Loading tasks...</p>
      </div>
    );
  }

  const handleUpdateTask = async (id: number, status: Task['status']) => {
    const currentTask = tasks.find(task => task.id === id);
    if (currentTask) {
      await updateTask({ id, data: { ...currentTask, status } });
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const renderColumn = (columnId: typeof COLUMNS[number]['id']) => {
    const columnTasks = tasks.filter((task) => task.status === columnId);
    return (
      <div 
        className="space-y-4 min-h-[500px] bg-muted/80 rounded-lg p-4"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
        onDrop={(e) => {
          e.preventDefault();
          const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
          handleUpdateTask(taskId, columnId);
        }}
      >
        <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              {COLUMNS.find(col => col.id === columnId)?.label}
            </h2>
            <Badge variant="secondary" className="font-mono">
              {columnTasks.length}
            </Badge>
          </div>
        </div>
        <div className="space-y-4">
          {columnTasks.map((task) => (
            <div
              key={task.id}
              draggable={isDesktop}
              className={isDesktop ? "cursor-move" : ""}
              onDragStart={(e) => {
                if (isDesktop) {
                  e.dataTransfer.setData('taskId', task.id.toString());
                }
              }}
            >
              <TaskCard 
                task={task} 
                onEdit={setTaskToEdit} 
                onDelete={setTaskToDelete}
                onStatusChange={handleUpdateTask}
              />
            </div>
          ))}
          {columnTasks.length === 0 && (
            <div className="h-24 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
              {isDesktop ? "Drop tasks here" : "Use the + button above to add tasks"}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {!isDesktop ? (
        <Tabs defaultValue={activeTab} onValueChange={(tab) => setActiveTab(tab as ColumnId)}>
          <TabsList className="grid w-full grid-cols-4">
            {COLUMNS.map((column) => (
              <TabsTrigger 
                key={column.id} 
                value={column.id}
                className="text-xs sm:text-sm"
              >
                {column.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {COLUMNS.map((column) => (
            <TabsContent key={column.id} value={column.id}>
              {renderColumn(column.id)}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="grid grid-cols-4 gap-4 w-full">
          {COLUMNS.map((column) => (
            <div key={column.id}>
              {renderColumn(column.id)}
            </div>
          ))}
        </div>
      )}

      {taskToDelete !== null &&
        <Dialog open onOpenChange={() => setTaskToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                    handleDeleteTask(taskToDelete);
                    setTaskToDelete(null);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
      {taskToEdit !== null && 
        <Dialog open onOpenChange={() => setTaskToEdit(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Edit the details of your task
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              taskId={taskToEdit.id}
              initialValues={taskToEdit}
              onClose={() => setTaskToEdit(null)}
            />
          </DialogContent>
        </Dialog>
      }
    </div>
  );
}
