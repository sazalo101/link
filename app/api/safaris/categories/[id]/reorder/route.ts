import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const categoryId = params.id
    const { direction } = await request.json()

    // Find the category
    const category = await prisma.safariCategory.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Verify that the category belongs to the user
    if (category.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get all categories for the user, ordered by order
    const categories = await prisma.safariCategory.findMany({
      where: {
        userId: session.user.id as string,
      },
      orderBy: {
        order: "asc",
      },
    })

    // Find the current index of the category
    const currentIndex = categories.findIndex((c) => c.id === categoryId)

    if (direction === "up" && currentIndex > 0) {
      // Swap with the previous category
      const prevCategory = categories[currentIndex - 1]

      await prisma.$transaction([
        prisma.safariCategory.update({
          where: { id: category.id },
          data: { order: prevCategory.order },
        }),
        prisma.safariCategory.update({
          where: { id: prevCategory.id },
          data: { order: category.order },
        }),
      ])
    } else if (direction === "down" && currentIndex < categories.length - 1) {
      // Swap with the next category
      const nextCategory = categories[currentIndex + 1]

      await prisma.$transaction([
        prisma.safariCategory.update({
          where: { id: category.id },
          data: { order: nextCategory.order },
        }),
        prisma.safariCategory.update({
          where: { id: nextCategory.id },
          data: { order: category.order },
        }),
      ])
    }

    return NextResponse.json({ message: "Category reordered" })
  } catch (error) {
    console.error("Reorder category error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
