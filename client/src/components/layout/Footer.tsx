import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-input bg-background h-14 text-sm flex items-center justify-center gap-1",
        className
      )}
      {...props}
    >
      Made with <Heart className="h-4 w-4 text-red-500" /> by Matthias Etchegaray
    </footer>
  )
}