"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, MoveUp, MoveDown } from "lucide-react"
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

interface Activity {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  order: number
}

interface ActivityListProps {
  activities: Activity[]
}

export function ActivityList({ activities }: ActivityListProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  async function deleteActivity(id: string) {
    setIsLoading(id)

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete activity")
      }

      toast({
        title: "Activity deleted",
        description: "The activity has been removed.",
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

  async function moveActivity(id: string, direction: "up" | "down") {
    setIsLoading(id)

    try {
      const response = await fetch(`/api/activities/${id}/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder activity")
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

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hostel Activities</CardTitle>
          <CardDescription>You haven&apos;t added any activities yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add your first activity using the form on the left.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hostel Activities</CardTitle>
        <CardDescription>Manage your hostel activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-3">
              {activity.imageUrl && (
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image
                    src={activity.imageUrl || "/placeholder.svg"}
                    alt={activity.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium">{activity.name}</h3>
                {activity.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{activity.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveActivity(activity.id, "up")}
                disabled={index === 0 || isLoading === activity.id}
                title="Move up"
              >
                <MoveUp className="h-4 w-4" />
                <span className="sr-only">Move up</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveActivity(activity.id, "down")}
                disabled={index === activities.length - 1 || isLoading === activity.id}
                title="Move down"
              >
                <MoveDown className="h-4 w-4" />
                <span className="sr-only">Move down</span>
              </Button>
              <Button variant="ghost" size="icon" title="Edit activity">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    disabled={isLoading === activity.id}
                    title="Delete activity"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this activity? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteActivity(activity.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
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
