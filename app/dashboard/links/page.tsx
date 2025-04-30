import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { LinkForm } from "@/components/dashboard/link-form"
import { LinkList } from "@/components/dashboard/link-list"

export default async function LinksPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const links = await prisma.link.findMany({
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
        <h1 className="text-3xl font-bold tracking-tight">Manage Links</h1>
        <p className="text-muted-foreground">Add, edit, and organize the links on your profile page.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <LinkForm userId={session.user.id as string} />
        <LinkList links={links} />
      </div>
    </div>
  )
}
