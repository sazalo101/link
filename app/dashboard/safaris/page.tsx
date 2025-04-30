import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { SafariCategoryForm } from "@/components/dashboard/safari/safari-category-form"
import { SafariCategoryList } from "@/components/dashboard/safari/safari-category-list"

export default async function SafarisPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const categories = await prisma.safariCategory.findMany({
    where: {
      userId: session.user.id as string,
    },
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
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Safaris</h1>
        <p className="text-muted-foreground">Add and manage safari categories and packages.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SafariCategoryForm userId={session.user.id as string} />
        <SafariCategoryList categories={categories} />
      </div>
    </div>
  )
}
