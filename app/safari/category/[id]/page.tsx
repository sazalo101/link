import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import prisma from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Clock, DollarSign, ImageIcon } from "lucide-react"
import { getBaseUrl } from "@/lib/utils"

interface SafariCategoryPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SafariCategoryPageProps): Promise<Metadata> {
  const category = await prisma.safariCategory.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!category) {
    return {
      title: "Safari Category Not Found",
    }
  }

  return {
    title: category.name,
    description: category.description || `Browse our ${category.name} safari packages`,
    openGraph: {
      title: category.name,
      description: category.description || `Browse our ${category.name} safari packages`,
      images: category.imageUrl ? [{ url: category.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: category.name,
      description: category.description || `Browse our ${category.name} safari packages`,
      images: category.imageUrl ? [category.imageUrl] : undefined,
    },
  }
}

export default async function SafariCategoryPage({ params }: SafariCategoryPageProps) {
  const category = await prisma.safariCategory.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: {
        select: {
          username: true,
          name: true,
        },
      },
      packages: {
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!category) {
    notFound()
  }

  const { user, packages } = category
  const profileUrl = `${getBaseUrl()}/${user.username}`

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

          <h1 className="text-3xl font-bold">{category.name}</h1>
          {category.description && <p className="text-muted-foreground mt-1">{category.description}</p>}
        </div>

        {category.imageUrl && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
            <Image
              src={category.imageUrl || "/placeholder.svg"}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Available Packages</h2>

          {packages.length === 0 ? (
            <p className="text-muted-foreground">No packages available in this category yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <Link key={pkg.id} href={`/safari/${pkg.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative w-full h-40">
                      {pkg.imageUrl ? (
                        <Image src={pkg.imageUrl || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{pkg.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pkg.price && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>{pkg.price}</span>
                          </div>
                        )}
                        {pkg.duration && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{pkg.duration}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Link href={profileUrl}>
            <Button variant="outline" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to {user.name}'s profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
