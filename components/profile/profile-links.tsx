"use client"

import type React from "react"

import { useState } from "react"
import type { Link } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { ExternalLink, Share2 } from "lucide-react"
import { ShareModal } from "@/components/profile/share-modal"

interface ProfileLinksProps {
  links: Link[]
  incrementLinkClick: (linkId: string) => Promise<void>
}

export function ProfileLinks({ links, incrementLinkClick }: ProfileLinksProps) {
  const [clickedLinks, setClickedLinks] = useState<Set<string>>(new Set())
  const [selectedLink, setSelectedLink] = useState<Link | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const handleLinkClick = async (link: Link) => {
    // Open the link in a new tab
    window.open(link.url, "_blank")

    // Only increment if we haven't already clicked this link in this session
    if (!clickedLinks.has(link.id)) {
      setClickedLinks(new Set(clickedLinks).add(link.id))
      await incrementLinkClick(link.id)
    }
  }

  const handleShareLink = (e: React.MouseEvent, link: Link) => {
    e.stopPropagation()
    setSelectedLink(link)
    setShareModalOpen(true)
  }

  if (links.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-muted-foreground">No links added yet.</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-3">
      {links.map((link) => (
        <div key={link.id} className="relative">
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-6 px-4 text-base"
            onClick={() => handleLinkClick(link)}
          >
            <span>{link.title}</span>
            <ExternalLink className="h-4 w-4 opacity-70" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-12 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={(e) => handleShareLink(e, link)}
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      ))}

      {selectedLink && (
        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          url={selectedLink.url}
          title={selectedLink.title}
          description={`Check out this link: ${selectedLink.title}`}
          image={null}
        />
      )}
    </div>
  )
}
