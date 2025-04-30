"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/dashboard/image-upload"

const safariPackageSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  price: z.string().optional(),
  duration: z.string().optional(),
  imageUrl: z.string().optional(),
})

type SafariPackageFormValues = z.infer<typeof safariPackageSchema>

interface SafariPackageFormProps {
  categoryId: string
}

export function SafariPackageForm({ categoryId }: SafariPackageFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")

  const form = useForm<SafariPackageFormValues>({
    resolver: zodResolver(safariPackageSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      duration: "",
      imageUrl: "",
    },
  })

  async function onSubmit(data: SafariPackageFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/safaris/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
          imageUrl: imageUrl || data.imageUrl,
          safariCategoryId: categoryId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create safari package")
      }

      form.reset()
      setImageUrl("")
      toast({
        title: "Safari package created",
        description: "Your safari package has been added.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    setImageUrl(url)
    form.setValue("imageUrl", url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Safari Package</CardTitle>
        <CardDescription>Create a new safari package for this category</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Nairobi National Park Safari" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Experience the wildlife just minutes from the city..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="$100 per person" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="Full day (8 hours)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={imageUrl || field.value}
                      onChange={handleImageUploaded}
                      placeholder="Upload a package image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Package"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
