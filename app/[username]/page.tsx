import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { ProfileLinks } from "@/components/profile/profile-links"
import { ProfileHeader } from "@/components/profile/profile-header"
import { getBaseUrl } from "@/lib/utils"
import { SafariCategories } from "@/components/profile/safari-categories"
import { HostelActivities } from "@/components/profile/hostel-activities"
import { SocialLinks } from "@/components/profile/social-links"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      profile: true,
      links: {
        orderBy: {
          order: "asc",
        },
      },
      safariCategories: {
        orderBy: {
          order: "asc",
        },
        include: {
          packages: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      activities: {
        orderBy: {
          order: "asc",
        },
      },
      socialLinks: {
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Increment click count when a link is clicked
  async function incrementLinkClick(linkId: string) {
    "use server"

    await prisma.link.update({
      where: {
        id: linkId,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    })
  }

  const profileUrl = `${getBaseUrl()}/${username}`

  return (
    <div className={`min-h-screen flex flex-col items-center ${getThemeClass(user.profile?.theme)}`}>
      <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center">
        <ProfileHeader
          name={user.name}
          title={user.profile?.title || `${user.name}'s Links`}
          description={user.profile?.description || ""}
          profileUrl={profileUrl}
          profileImageUrl={user.profile?.profileImageUrl}
        />

        {user.safariCategories.length > 0 && <SafariCategories categories={user.safariCategories} />}

        {user.activities.length > 0 && <HostelActivities activities={user.activities} />}

        <ProfileLinks links={user.links} incrementLinkClick={incrementLinkClick} />

        {user.socialLinks.length > 0 && <SocialLinks socialLinks={user.socialLinks} />}
      </div>
    </div>
  )
}

function getThemeClass(theme: string | null | undefined): string {
  switch (theme) {
    case "minimal":
      return "bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-50"
    case "gradient":
      return "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
    case "dark":
      return "bg-gray-900 text-gray-50"
    default:
      return "bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-50"
  }
}
