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

    const { title, url, userId } = await request.json()

    // Verify that the userId matches the session user's id
    if (userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the highest order value
    const highestOrderLink = await prisma.link.findFirst({
      where: {
        userId,
      },
      orderBy: {
        order: "desc",
      },
    })

    const newOrder = highestOrderLink ? highestOrderLink.order + 1 : 0

    // Create the link
    const link = await prisma.link.create({
      data: {
        title,
        url,
        order: newOrder,
        userId,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error("Create link error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
