"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const socialLinkSchema = z.object({
  platform: z.string().min(1, { message: "Platform is required" }),
  url: z.string().min(1, { message: "URL is required" }),
})

type SocialLinkFormValues = z.infer<typeof socialLinkSchema>

interface SocialLinkFormProps {
  userId: string
}

const platforms = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "website", label: "Website" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "location", label: "Location" },
]

export function SocialLinkForm({ userId }: SocialLinkFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "",
      url: "",
    },
  })

  async function onSubmit(data: SocialLinkFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: data.platform,
          url: data.url,
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create social link")
      }

      form.reset()
      toast({
        title: "Social link created",
        description: "Your social link has been added.",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Social Link</CardTitle>
        <CardDescription>Add a social media or contact link</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL or Contact</FormLabel>
                  <FormControl>
                    <Input placeholder={getPlaceholder(form.watch("platform"))} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Social Link"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function getPlaceholder(platform: string): string {
  switch (platform) {
    case "facebook":
      return "https://facebook.com/yourhostel"
    case "instagram":
      return "https://instagram.com/yourhostel"
    case "twitter":
      return "https://twitter.com/yourhostel"
    case "youtube":
      return "https://youtube.com/c/yourhostel"
    case "linkedin":
      return "https://linkedin.com/company/yourhostel"
    case "website":
      return "https://yourhostel.com"
    case "email":
      return "info@yourhostel.com"
    case "phone":
      return "+1234567890"
    case "location":
      return "123 Hostel Street, City, Country"
    default:
      return "Enter URL or contact information"
  }
}
