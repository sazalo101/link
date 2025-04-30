"use client"

import { useState } from "react"
import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { ShareModal } from "@/components/profile/share-modal"

interface ProfileHeaderProps {
  name: string
  title: string
  description: string
  profileUrl: string
  profileImageUrl?: string | null
}

export function ProfileHeader({ name, title, description, profileUrl, profileImageUrl }: ProfileHeaderProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false)

  return (
    <div className="w-full flex flex-col items-center space-y-4 mb-8">
      <div className="w-24 h-24 rounded-full overflow-hidden relative">
        {profileImageUrl ? (
          <Image src={profileImageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
            {name.charAt(0)}
          </div>
        )}
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <Card className="w-full">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QRCodeSVG
              value={profileUrl}
              size={64}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level="L"
              includeMargin={false}
            />
            <div className="text-sm">
              <p className="font-medium">Scan to visit</p>
              <p className="text-muted-foreground truncate max-w-[150px]">{profileUrl}</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={() => setShareModalOpen(true)}>
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </CardContent>
      </Card>

      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        url={profileUrl}
        title={title}
        description={description}
        image={profileImageUrl}
      />
    </div>
  )
}
