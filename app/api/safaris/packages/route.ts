import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, description, price, duration, imageUrl, safariCategoryId } = await request.json()

    // Find the category to verify ownership
    const category = await prisma.safariCategory.findUnique({
      where: {
        id: safariCategoryId,
      },
    })

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Verify that the category belongs to the user
    if (category.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the highest order value
    const highestOrderPackage = await prisma.safariPackage.findFirst({
      where: {
        safariCategoryId,
      },
      orderBy: {
        order: "desc",
      },
    })

    const newOrder = highestOrderPackage ? highestOrderPackage.order + 1 : 0

    // Create the safari package
    const safariPackage = await prisma.safariPackage.create({
      data: {
        name,
        description,
        price,
        duration,
        imageUrl,
        order: newOrder,
        safariCategoryId,
      },
    })

    return NextResponse.json(safariPackage, { status: 201 })
  } catch (error) {
    console.error("Create safari package error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
