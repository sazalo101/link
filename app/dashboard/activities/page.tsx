import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { ActivityForm } from "@/components/dashboard/activity/activity-form"
import { ActivityList } from "@/components/dashboard/activity/activity-list"

export default async function ActivitiesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const activities = await prisma.activity.findMany({
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
        <h1 className="text-3xl font-bold tracking-tight">Hostel Activities</h1>
        <p className="text-muted-foreground">Add and manage activities available at your hostel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActivityForm userId={session.user.id as string} />
        <ActivityList activities={activities} />
      </div>
    </div>
  )
}
