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

    const { name, description, imageUrl, userId } = await request.json()

    // Verify that the userId matches the session user's id
    if (userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the highest order value
    const highestOrderCategory = await prisma.safariCategory.findFirst({
      where: {
        userId,
      },
      orderBy: {
        order: "desc",
      },
    })

    const newOrder = highestOrderCategory ? highestOrderCategory.order + 1 : 0

    // Create the safari category
    const category = await prisma.safariCategory.create({
      data: {
        name,
        description,
        imageUrl,
        order: newOrder,
        userId,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Create safari category error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
