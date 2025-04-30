import type { User } from "next-auth"
import Link from "next/link"
import { LinkIcon, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

interface DashboardHeaderProps {
  user: User & {
    username: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <LinkIcon className="h-6 w-6" />
            <span className="text-xl font-bold">LinkHub</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/${user.username}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View My Page
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
