import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TodoFormProps {
  onAddTodo: (task: string) => Promise<void>;
  isAddingTodo: boolean;
}

export function TodoForm({ onAddTodo, isAddingTodo }: TodoFormProps) {
  const [newTask, setNewTask] = useState('');
  const { toast } = useToast();

  const handleAddTodo = async () => {
    if (!newTask.trim()) return;

    try {
      await onAddTodo(newTask);
      setNewTask('');
      toast({
        title: 'Success',
        description: 'Todo added successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add todo',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Input
        placeholder="Add new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        disabled={isAddingTodo}
      />
      <Button 
        onClick={handleAddTodo}
        disabled={isAddingTodo}
      >
        Add
      </Button>
    </div>
  );
}