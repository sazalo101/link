"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, MoveUp, MoveDown, ImageIcon } from "lucide-react"
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

interface SafariPackage {
  id: string
  name: string
  description: string | null
  price: string | null
  duration: string | null
  imageUrl: string | null
  order: number
}

interface SafariPackageListProps {
  packages: SafariPackage[]
  categoryId: string
}

export function SafariPackageList({ packages, categoryId }: SafariPackageListProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  async function deletePackage(id: string) {
    setIsLoading(id)

    try {
      const response = await fetch(`/api/safaris/packages/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete package")
      }

      toast({
        title: "Package deleted",
        description: "The safari package has been removed.",
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

  async function movePackage(id: string, direction: "up" | "down") {
    setIsLoading(id)

    try {
      const response = await fetch(`/api/safaris/packages/${id}/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder package")
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

  if (packages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Safari Packages</CardTitle>
          <CardDescription>You haven&apos;t added any safari packages yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add your first safari package using the form on the left.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Safari Packages</CardTitle>
        <CardDescription>Manage your safari packages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {packages.map((pkg, index) => (
          <div key={pkg.id} className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-3">
              {pkg.imageUrl ? (
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image src={pkg.imageUrl || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-medium">{pkg.name}</h3>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {pkg.price && <span>{pkg.price}</span>}
                  {pkg.duration && <span>• {pkg.duration}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/safaris/${categoryId}/packages/${pkg.id}/images`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Images
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => movePackage(pkg.id, "up")}
                disabled={index === 0 || isLoading === pkg.id}
                title="Move up"
              >
                <MoveUp className="h-4 w-4" />
                <span className="sr-only">Move up</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => movePackage(pkg.id, "down")}
                disabled={index === packages.length - 1 || isLoading === pkg.id}
                title="Move down"
              >
                <MoveDown className="h-4 w-4" />
                <span className="sr-only">Move down</span>
              </Button>
              <Link href={`/dashboard/safaris/${categoryId}/packages/${pkg.id}/edit`}>
                <Button variant="ghost" size="icon" title="Edit package">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    disabled={isLoading === pkg.id}
                    title="Delete package"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Safari Package</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this safari package? This will also delete all images associated
                      with this package. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deletePackage(pkg.id)} className="bg-red-500 hover:bg-red-600">
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
