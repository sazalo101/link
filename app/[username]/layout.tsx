import type React from "react"
import type { Metadata, ResolvingMetadata } from "next"
import prisma from "@/lib/db"
import { getBaseUrl } from "@/lib/utils"

interface ProfileLayoutProps {
  children: React.ReactNode
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: ProfileLayoutProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { username } = params

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      profile: true,
    },
  })

  if (!user) {
    return {
      title: "Profile Not Found",
      description: "The requested profile could not be found.",
    }
  }

  const title = user.profile?.title || `${user.name}'s Links`
  const description = user.profile?.description || `Check out ${user.name}'s links and content.`
  const profileUrl = `${getBaseUrl()}/${username}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: profileUrl,
      siteName: "LinkHub",
      images: user.profile?.profileImageUrl ? [{ url: user.profile.profileImageUrl }] : undefined,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: user.profile?.profileImageUrl ? [user.profile.profileImageUrl] : undefined,
    },
    alternates: {
      canonical: profileUrl,
    },
  }
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return <>{children}</>
}
