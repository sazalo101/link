"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
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
  Share2,
} from "lucide-react"
import { ShareModal } from "@/components/profile/share-modal"

interface SocialLink {
  id: string
  platform: string
  url: string
}

interface SocialLinksProps {
  socialLinks: SocialLink[]
}

export function SocialLinks({ socialLinks }: SocialLinksProps) {
  const [selectedLink, setSelectedLink] = useState<SocialLink | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  if (socialLinks.length === 0) {
    return null
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

  const getPlatformName = (platform: string): string => {
    return platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase()
  }

  const handleShareSocialLink = (e: React.MouseEvent, link: SocialLink) => {
    e.stopPropagation()
    setSelectedLink(link)
    setShareModalOpen(true)
  }

  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-bold text-center mb-4">Connect With Us</h2>

      <div className="flex flex-wrap justify-center gap-3">
        {socialLinks.map((link) => {
          const handleClick = (e: React.MouseEvent) => {
            if (link.platform.toLowerCase() === "email") {
              window.location.href = `mailto:${link.url}`
            } else if (link.platform.toLowerCase() === "phone") {
              window.location.href = `tel:${link.url}`
            } else if (link.platform.toLowerCase() === "location") {
              window.open(`https://maps.google.com?q=${encodeURIComponent(link.url)}`, "_blank")
            } else {
              window.open(link.url, "_blank")
            }
          }

          return (
            <div key={link.id} className="relative">
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={handleClick}>
                {getPlatformIcon(link.platform)}
                <span className="sr-only">{link.platform}</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={(e) => handleShareSocialLink(e, link)}
              >
                <Share2 className="h-3 w-3" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          )
        })}
      </div>

      {selectedLink && (
        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          url={selectedLink.url}
          title={`${getPlatformName(selectedLink.platform)} - Connect with us`}
          description={`Connect with us on ${getPlatformName(selectedLink.platform)}: ${selectedLink.url}`}
          image={null}
        />
      )}
    </div>
  )
}
