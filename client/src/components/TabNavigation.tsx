import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoList } from "./todos/TodoList";
import { TodoForm } from "./todos/TodoForm";
import { useGetTodos } from '@/hooks/todos/useGetTodos';
import { useAddTodo } from '@/hooks/todos/useAddTodo';
import { useUpdateTodo } from '@/hooks/todos/useUpdateTodo';
import { useDeleteTodo } from '@/hooks/todos/useDeleteTodo';

export function TabNavigation() {
  const [selectedTab, setSelectedTab] = useState('all');

  const { data: todos = [], isLoading } = useGetTodos();
  const { mutateAsync: addTodo, isPending: isAddingTodo } = useAddTodo();
  const { mutateAsync: updateTodo, isPending: isUpdatingTodo } = useUpdateTodo();
  const { mutateAsync: deleteTodo, isPending: isDeletingTodo } = useDeleteTodo();

  const handleAddTodo = async (task: string) => {
    try {
      await addTodo(task);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleUpdateTodo = async (id: number) => {
    try {
      await updateTodo(id);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'completed') return todo.completed;
    return !todo.completed;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p>Loading todos...</p>
      </div>
    );
  }

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All ({todos.length})</TabsTrigger>
        <TabsTrigger value="open">
          Open ({todos.filter(t => !t.completed).length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({todos.filter(t => t.completed).length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value={selectedTab} className="space-y-4">
        <TodoList
          todos={filteredTodos}
          onUpdateTodo={handleUpdateTodo}
          onDeleteTodo={handleDeleteTodo}
          isUpdatingTodo={isUpdatingTodo}
          isDeletingTodo={isDeletingTodo}
        />

        <TodoForm
          onAddTodo={handleAddTodo}
          isAddingTodo={isAddingTodo}
        />
      </TabsContent>
    </Tabs>
  );
}