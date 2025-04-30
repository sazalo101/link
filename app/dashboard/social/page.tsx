import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { SocialLinkForm } from "@/components/dashboard/social/social-link-form"
import { SocialLinkList } from "@/components/dashboard/social/social-link-list"

export default async function SocialLinksPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const socialLinks = await prisma.socialLink.findMany({
    where: {
      userId: session.user.id as string,
    },
    orderBy: {
      order: "asc",
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Social Links</h1>
        <p className="text-muted-foreground">Add and manage your hostel's social media links.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SocialLinkForm userId={session.user.id as string} />
        <SocialLinkList socialLinks={socialLinks} />
      </div>
    </div>
  )
}
