import { Button } from "@/components/ui/button";

interface HeaderProps {
  openTasksCount: number;
  onLogout: () => void;
}

export function Header({ openTasksCount, onLogout }: HeaderProps) {
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