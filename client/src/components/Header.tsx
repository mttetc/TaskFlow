import { Button } from "@/components/ui/button";
import { useGetTasks } from '@/hooks/tasks/useGetTasks';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const { data: tasks = [], isLoading: isTasksLoading } = useGetTasks();
  const openTasksCount = tasks.filter(task => task.status !== 'COMPLETED').length;

  if (isTasksLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">
        You have {openTasksCount} open tasks
      </h1>
      <Button variant="outline" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
}