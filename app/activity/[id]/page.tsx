import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import prisma from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { getBaseUrl } from "@/lib/utils"

interface ActivityPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const activity = await prisma.activity.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!activity) {
    return {
      title: "Activity Not Found",
    }
  }

  return {
    title: activity.name,
    description: activity.description || `Details about ${activity.name}`,
    openGraph: {
      title: activity.name,
      description: activity.description || `Details about ${activity.name}`,
      images: activity.imageUrl ? [{ url: activity.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: activity.name,
      description: activity.description || `Details about ${activity.name}`,
      images: activity.imageUrl ? [activity.imageUrl] : undefined,
    },
  }
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const activity = await prisma.activity.findUnique({
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
    },
  })

  if (!activity) {
    notFound()
  }

  const { user } = activity
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

          <h1 className="text-3xl font-bold">{activity.name}</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {activity.imageUrl && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={activity.imageUrl || "/placeholder.svg"}
                alt={activity.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                {activity.description && (
                  <div>
                    <h2 className="text-lg font-medium mb-2">Description</h2>
                    <p>{activity.description}</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Link href={profileUrl}>
                    <Button className="w-full">View All Activities</Button>
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
