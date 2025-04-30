"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Link } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, MoveUp, MoveDown, ExternalLink } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface LinkListProps {
  links: Link[]
}

export function LinkList({ links }: LinkListProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  async function deleteLink(id: string) {
    setIsLoading(id)

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete link")
      }

      toast({
        title: "Link deleted",
        description: "Your link has been removed from your profile.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  async function moveLink(id: string, direction: "up" | "down") {
    setIsLoading(id)

    try {
      const response = await fetch(`/api/links/${id}/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder link")
      }

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  if (links.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>You haven&apos;t added any links yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add your first link using the form on the left.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Links</CardTitle>
        <CardDescription>Manage and reorder your links</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {links.map((link, index) => (
          <div key={link.id} className="flex items-center justify-between rounded-md border p-3">
            <div className="space-y-1">
              <div className="font-medium">{link.title}</div>
              <div className="text-xs text-muted-foreground truncate max-w-[200px]">{link.url}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => window.open(link.url, "_blank")} title="Open link">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open link</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveLink(link.id, "up")}
                disabled={index === 0 || isLoading === link.id}
                title="Move up"
              >
                <MoveUp className="h-4 w-4" />
                <span className="sr-only">Move up</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveLink(link.id, "down")}
                disabled={index === links.length - 1 || isLoading === link.id}
                title="Move down"
              >
                <MoveDown className="h-4 w-4" />
                <span className="sr-only">Move down</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    disabled={isLoading === link.id}
                    title="Delete link"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete link</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Link</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this link? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteLink(link.id)} className="bg-red-500 hover:bg-red-600">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
