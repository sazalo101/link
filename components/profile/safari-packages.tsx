"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, DollarSign, ImageIcon, Share2 } from "lucide-react"
import { ShareModal } from "@/components/profile/share-modal"
import { getBaseUrl } from "@/lib/utils"

interface SafariPackage {
  id: string
  name: string
  description: string | null
  price: string | null
  duration: string | null
  imageUrl: string | null
}

interface SafariPackagesProps {
  packages: SafariPackage[]
  categoryName?: string
}

export function SafariPackages({ packages, categoryName = "" }: SafariPackagesProps) {
  const [selectedPackage, setSelectedPackage] = useState<SafariPackage | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  if (packages.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No safari packages available.</p>
      </div>
    )
  }

  const handleShare = (e: React.MouseEvent, pkg: SafariPackage) => {
    e.stopPropagation()
    setSelectedPackage(pkg)
    setShareModalOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedPackage(pkg)}
          >
            <div className="relative w-full h-32">
              {pkg.imageUrl ? (
                <Image src={pkg.imageUrl || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                onClick={(e) => handleShare(e, pkg)}
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
            <div className="p-3">
              <h4 className="font-medium">{pkg.name}</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {pkg.price && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span>{pkg.price}</span>
                  </div>
                )}
                {pkg.duration && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{pkg.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedPackage && !shareModalOpen} onOpenChange={(open) => !open && setSelectedPackage(null)}>
        <DialogContent className="max-w-md">
          {selectedPackage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPackage.name}</DialogTitle>
                {selectedPackage.description && <DialogDescription>{selectedPackage.description}</DialogDescription>}
              </DialogHeader>

              {selectedPackage.imageUrl && (
                <div className="relative w-full h-48 rounded-md overflow-hidden">
                  <Image
                    src={selectedPackage.imageUrl || "/placeholder.svg"}
                    alt={selectedPackage.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {selectedPackage.price && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedPackage.price}</span>
                  </div>
                )}
                {selectedPackage.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedPackage.duration}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedPackage(null)}>
                  Close
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => setShareModalOpen(true)}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {selectedPackage && (
        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          url={`${getBaseUrl()}/safari/${selectedPackage.id}`}
          title={`${selectedPackage.name}${categoryName ? ` - ${categoryName}` : ""}`}
          description={selectedPackage.description || `Check out this safari package: ${selectedPackage.name}`}
          image={selectedPackage.imageUrl}
        />
      )}
    </>
  )
}
