"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Trash2,
  MoveUp,
  MoveDown,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react"
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

interface SocialLink {
  id: string
  platform: string
  url: string
  order: number
}

interface SocialLinkListProps {
  socialLinks: SocialLink[]
}

export function SocialLinkList({ socialLinks }: SocialLinkListProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  async function deleteSocialLink(id: string) {
    setIsLoading(id)

    try {
      const response = await fetch(`/api/social/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete social link")
      }

      toast({
        title: "Social link deleted",
        description: "The social link has been removed.",
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

  async function moveSocialLink(id: string, direction: "up" | "down") {
    setIsLoading(id)

    try {
      const response = await fetch(`/api/social/${id}/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder social link")
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

  const getPlatformIcon = (platform: string) => {
    const iconProps = { className: "h-5 w-5" }

    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook {...iconProps} />
      case "instagram":
        return <Instagram {...iconProps} />
      case "twitter":
      case "x":
        return <Twitter {...iconProps} />
      case "youtube":
        return <Youtube {...iconProps} />
      case "linkedin":
        return <Linkedin {...iconProps} />
      case "website":
        return <Globe {...iconProps} />
      case "email":
        return <Mail {...iconProps} />
      case "phone":
        return <Phone {...iconProps} />
      case "location":
        return <MapPin {...iconProps} />
      default:
        return <ExternalLink {...iconProps} />
    }
  }

  if (socialLinks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>You haven&apos;t added any social links yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add your first social link using the form on the left.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
        <CardDescription>Manage your social media and contact links</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialLinks.map((link, index) => (
          <div key={link.id} className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {getPlatformIcon(link.platform)}
              </div>
              <div>
                <h3 className="font-medium capitalize">{link.platform}</h3>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{link.url}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveSocialLink(link.id, "up")}
                disabled={index === 0 || isLoading === link.id}
                title="Move up"
              >
                <MoveUp className="h-4 w-4" />
                <span className="sr-only">Move up</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveSocialLink(link.id, "down")}
                disabled={index === socialLinks.length - 1 || isLoading === link.id}
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
                    title="Delete social link"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Social Link</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this social link? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteSocialLink(link.id)}
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
