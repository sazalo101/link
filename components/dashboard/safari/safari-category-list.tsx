"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, Plus, MoveUp, MoveDown, ChevronRight } from "lucide-react"
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
  imageUrl: string | null
}

interface SafariCategory {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  order: number
  packages: SafariPackage[]
}

interface SafariCategoryListProps {
  categories: SafariCategory[]
}

export function SafariCategoryList({ categories }: SafariCategoryListProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  async function deleteCategory(id: string) {
    setIsLoading(id)

    try {
      const response = await fetch(`/api/safaris/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      toast({
        title: "Category deleted",
        description: "The safari category has been removed.",
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

  async function moveCategory(id: string, direction: "up" | "down") {
    setIsLoading(id)

    try {
      const response = await fetch(`/api/safaris/categories/${id}/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder category")
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

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Safari Categories</CardTitle>
          <CardDescription>You haven&apos;t added any safari categories yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add your first safari category using the form on the left.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Safari Categories</CardTitle>
        <CardDescription>Manage your safari categories and packages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category, index) => (
          <div key={category.id} className="rounded-md border overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-muted/50">
              <div className="flex items-center gap-3">
                {category.imageUrl && (
                  <div className="relative w-12 h-12 rounded-md overflow-hidden">
                    <Image
                      src={category.imageUrl || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {category.packages.length} {category.packages.length === 1 ? "package" : "packages"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/safaris/${category.id}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Packages
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveCategory(category.id, "up")}
                  disabled={index === 0 || isLoading === category.id}
                  title="Move up"
                >
                  <MoveUp className="h-4 w-4" />
                  <span className="sr-only">Move up</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveCategory(category.id, "down")}
                  disabled={index === categories.length - 1 || isLoading === category.id}
                  title="Move down"
                >
                  <MoveDown className="h-4 w-4" />
                  <span className="sr-only">Move down</span>
                </Button>
                <Link href={`/dashboard/safaris/edit/${category.id}`}>
                  <Button variant="ghost" size="icon" title="Edit category">
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
                      disabled={isLoading === category.id}
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Safari Category</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this safari category? This will also delete all packages within
                        this category. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteCategory(category.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            {category.packages.length > 0 && (
              <div className="p-3 border-t">
                <h4 className="text-sm font-medium mb-2">Packages:</h4>
                <div className="space-y-2">
                  {category.packages.map((pkg) => (
                    <Link
                      key={pkg.id}
                      href={`/dashboard/safaris/${category.id}/packages/${pkg.id}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {pkg.imageUrl && (
                          <div className="relative w-8 h-8 rounded-md overflow-hidden">
                            <Image
                              src={pkg.imageUrl || "/placeholder.svg"}
                              alt={pkg.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span>{pkg.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
