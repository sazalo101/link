"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Facebook, Twitter, Linkedin, Mail, Copy, Check, MessageCircle, Send } from "lucide-react"

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  title: string
  description: string
  image?: string | null
}

export function ShareModal({ open, onOpenChange, url, title, description, image }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    title: title,
    text: description || `Check out ${title}`,
    url: url,
  }

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSocialShare = (platform: string) => {
    let shareUrl = ""
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = encodeURIComponent(description || `Check out ${title}`)

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
        break
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
        break
      default:
        return
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this profile</DialogTitle>
          <DialogDescription>Share this profile with your friends and followers</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input readOnly value={url} className="w-full" />
          </div>
          <Button type="button" size="icon" onClick={handleCopyLink} variant="outline" className="shrink-0">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy link</span>
          </Button>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-3">Share via</h4>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={() => handleSocialShare("facebook")}
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={() => handleSocialShare("twitter")}
            >
              <Twitter className="h-5 w-5 text-sky-500" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={() => handleSocialShare("linkedin")}
            >
              <Linkedin className="h-5 w-5 text-blue-700" />
              <span className="text-xs">LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={() => handleSocialShare("email")}
            >
              <Mail className="h-5 w-5 text-gray-600" />
              <span className="text-xs">Email</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={() => handleSocialShare("whatsapp")}
            >
              <MessageCircle className="h-5 w-5 text-green-600" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={() => handleSocialShare("telegram")}
            >
              <Send className="h-5 w-5 text-blue-500" />
              <span className="text-xs">Telegram</span>
            </Button>
          </div>
        </div>

        {navigator.share && (
          <Button className="w-full mt-4" onClick={handleNativeShare}>
            Share using device
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
