import { useDeleteTask } from '@/hooks/tasks/useDeleteTask';
import { useGetTasks } from '@/hooks/tasks/useGetTasks';
import { useUpdateTask } from '@/hooks/tasks/useUpdateTask';
import { Task } from '@/schemas/task';
import { TaskForm } from './TaskForm';
import { TaskBoard } from './TaskBoard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react';

export function TasksPage() {
  const { data: tasks = [], isLoading } = useGetTasks();
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: deleteTask } = useDeleteTask();

  const handleUpdateTask = async (id: number, status: Task['status']) => {
    try {
      await updateTask({ id, data: { status } });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <TaskForm />
          </DialogContent>
        </Dialog>
      </div>
      <TaskBoard
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}