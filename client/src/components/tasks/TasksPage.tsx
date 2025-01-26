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
import { useResponsive } from '@/hooks/useResponsive';

export function TasksPage() {
  const { isDesktop } = useResponsive()
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className={`${isDesktop ? "self-end" : ""}`}>
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
      <TaskBoard />
    </div>
  );
}