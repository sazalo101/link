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
    const highestOrderActivity = await prisma.activity.findFirst({
      where: {
        userId,
      },
      orderBy: {
        order: "desc",
      },
    })

    const newOrder = highestOrderActivity ? highestOrderActivity.order + 1 : 0

    // Create the activity
    const activity = await prisma.activity.create({
      data: {
        name,
        description,
        imageUrl,
        order: newOrder,
        userId,
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error("Create activity error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
