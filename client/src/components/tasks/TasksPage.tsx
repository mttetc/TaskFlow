import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { TaskBoard } from './TaskBoard';
import { TaskForm } from './TaskForm';
import { useState } from 'react';

export function TasksPage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <DialogDescription>
              Add a new task to your list
            </DialogDescription>
            <TaskForm onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <TaskBoard />
    </div>
  );
}