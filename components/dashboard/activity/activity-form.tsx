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

const activitySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
})

type ActivityFormValues = z.infer<typeof activitySchema>

interface ActivityFormProps {
  userId: string
}

export function ActivityForm({ userId }: ActivityFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  })

  async function onSubmit(data: ActivityFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          imageUrl: imageUrl || data.imageUrl,
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create activity")
      }

      form.reset()
      setImageUrl("")
      toast({
        title: "Activity created",
        description: "Your activity has been added.",
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
        <CardTitle>Add Activity</CardTitle>
        <CardDescription>Create a new hostel activity</CardDescription>
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
                    <Input placeholder="Yoga Classes" {...field} />
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
                      placeholder="Daily yoga classes on the rooftop..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={imageUrl || field.value}
                      onChange={handleImageUploaded}
                      placeholder="Upload an activity image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Activity"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
