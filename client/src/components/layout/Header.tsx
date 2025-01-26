import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";
import { ClipboardList } from "lucide-react";

export function Header() {
  const { mutate: logout } = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 flex py-2 gap-4">
    <div className="flex items-center gap-2">
        <ClipboardList className="h-6 w-6" />
        <span className="font-bold text-xl">TaskFlow</span>
    </div>
    <div className="flex flex-1 items-center justify-between space-x-2">
        <nav className="flex items-center space-x-2">
        </nav>
        <Button variant="ghost" onClick={() => logout()}>
        Logout
        </Button>
    </div>
    </header>
  );
}