import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import prisma from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Clock, DollarSign } from "lucide-react"
import { getBaseUrl } from "@/lib/utils"

interface SafariPackagePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SafariPackagePageProps): Promise<Metadata> {
  const safariPackage = await prisma.safariPackage.findUnique({
    where: {
      id: params.id,
    },
    include: {
      safariCategory: true,
    },
  })

  if (!safariPackage) {
    return {
      title: "Safari Package Not Found",
    }
  }

  return {
    title: safariPackage.name,
    description: safariPackage.description || `Details about ${safariPackage.name}`,
    openGraph: {
      title: safariPackage.name,
      description: safariPackage.description || `Details about ${safariPackage.name}`,
      images: safariPackage.imageUrl ? [{ url: safariPackage.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: safariPackage.name,
      description: safariPackage.description || `Details about ${safariPackage.name}`,
      images: safariPackage.imageUrl ? [safariPackage.imageUrl] : undefined,
    },
  }
}

export default async function SafariPackagePage({ params }: SafariPackagePageProps) {
  const safariPackage = await prisma.safariPackage.findUnique({
    where: {
      id: params.id,
    },
    include: {
      safariCategory: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      packageImages: {
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!safariPackage) {
    notFound()
  }

  const { safariCategory, packageImages } = safariPackage
  const username = safariCategory.user.username
  const profileUrl = `${getBaseUrl()}/${username}`

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={profileUrl}>
            <Button variant="outline" size="sm" className="gap-1 mb-4">
              <ChevronLeft className="h-4 w-4" />
              Back to profile
            </Button>
          </Link>

          <h1 className="text-3xl font-bold">{safariPackage.name}</h1>
          <p className="text-muted-foreground mt-1">Category: {safariCategory.name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {safariPackage.imageUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                <Image
                  src={safariPackage.imageUrl || "/placeholder.svg"}
                  alt={safariPackage.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {packageImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {packageImages.map((image) => (
                  <div key={image.id} className="relative aspect-square rounded-md overflow-hidden">
                    <Image
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={image.caption || safariPackage.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                {safariPackage.description && (
                  <div>
                    <h2 className="text-lg font-medium mb-2">Description</h2>
                    <p>{safariPackage.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  {safariPackage.price && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">{safariPackage.price}</p>
                      </div>
                    </div>
                  )}

                  {safariPackage.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{safariPackage.duration}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <Link href={profileUrl}>
                    <Button className="w-full">View All Packages</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
