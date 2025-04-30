import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { ProfileForm } from "@/components/dashboard/profile-form"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: session.user.id as string,
    },
  })

  if (!profile) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Customize how your profile page looks to visitors.</p>
      </div>

      <ProfileForm profile={profile} username={session.user.username as string} />
    </div>
  )
}
