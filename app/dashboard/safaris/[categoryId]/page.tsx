import { getServerSession } from "next-auth/next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { SafariPackageForm } from "@/components/dashboard/safari/safari-package-form"
import { SafariPackageList } from "@/components/dashboard/safari/safari-package-list"

interface SafariPackagesPageProps {
  params: {
    categoryId: string
  }
}

export default async function SafariPackagesPage({ params }: SafariPackagesPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const category = await prisma.safariCategory.findUnique({
    where: {
      id: params.categoryId,
      userId: session.user.id as string,
    },
    include: {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/safaris">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{category.name} Packages</h1>
          <p className="text-muted-foreground">Add and manage safari packages for this category.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SafariPackageForm categoryId={category.id} />
        <SafariPackageList packages={category.packages} categoryId={category.id} />
      </div>
    </div>
  )
}
