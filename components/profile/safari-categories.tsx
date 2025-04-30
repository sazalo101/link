"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Share2 } from "lucide-react"
import { SafariPackages } from "@/components/profile/safari-packages"
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

interface SafariCategory {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  packages: SafariPackage[]
}

interface SafariCategoriesProps {
  categories: SafariCategory[]
}

export function SafariCategories({ categories }: SafariCategoriesProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [shareCategory, setShareCategory] = useState<SafariCategory | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
    }
  }

  const handleShareCategory = (e: React.MouseEvent, category: SafariCategory) => {
    e.stopPropagation()
    setShareCategory(category)
    setShareModalOpen(true)
  }

  return (
    <div className="w-full space-y-4 mb-6">
      <h2 className="text-xl font-bold text-center">Our Safaris</h2>

      <div className="space-y-3">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto rounded-none hover:bg-transparent"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="relative w-full h-32">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-center mt-1 line-clamp-2">{category.description}</p>
                  )}
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                  onClick={(e) => handleShareCategory(e, category)}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </Button>

            {expandedCategory === category.id && (
              <CardContent className="p-4">
                <SafariPackages packages={category.packages} categoryName={category.name} />
              </CardContent>
            )}

            <div className="p-2 flex justify-center border-t">
              <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => toggleCategory(category.id)}>
                {expandedCategory === category.id ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>Hide Packages</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>View Packages</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {shareCategory && (
        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          url={`${getBaseUrl()}/safari/category/${shareCategory.id}`}
          title={shareCategory.name}
          description={shareCategory.description || `Check out our ${shareCategory.name} safari packages`}
          image={shareCategory.imageUrl}
        />
      )}
    </div>
  )
}
