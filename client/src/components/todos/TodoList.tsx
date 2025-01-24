import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Todo } from "@/types";

interface TodoListProps {
  todos: Todo[];
  onUpdateTodo: (id: number) => Promise<void>;
  onDeleteTodo: (id: number) => Promise<void>;
  isUpdatingTodo: boolean;
  isDeletingTodo: boolean;
}

export function TodoList({ 
  todos, 
  onUpdateTodo, 
  onDeleteTodo, 
  isUpdatingTodo, 
  isDeletingTodo 
}: TodoListProps) {
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <Card key={todo.id} className="p-4 flex justify-between items-center">
          <span className={todo.completed ? 'line-through text-gray-500' : ''}>
            {todo.task}
          </span>
          <div className="space-x-2">
            {!todo.completed && (
              <Button 
                size="sm" 
                onClick={() => onUpdateTodo(todo.id)}
                disabled={isUpdatingTodo}
              >
                Done
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDeleteTodo(todo.id)}
              disabled={isDeletingTodo}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}