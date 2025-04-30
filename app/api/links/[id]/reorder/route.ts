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

    const linkId = params.id
    const { direction } = await request.json()

    // Find the link
    const link = await prisma.link.findUnique({
      where: {
        id: linkId,
      },
    })

    if (!link) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 })
    }

    // Verify that the link belongs to the user
    if (link.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get all links for the user, ordered by order
    const links = await prisma.link.findMany({
      where: {
        userId: session.user.id as string,
      },
      orderBy: {
        order: "asc",
      },
    })

    // Find the current index of the link
    const currentIndex = links.findIndex((l) => l.id === linkId)

    if (direction === "up" && currentIndex > 0) {
      // Swap with the previous link
      const prevLink = links[currentIndex - 1]

      await prisma.$transaction([
        prisma.link.update({
          where: { id: link.id },
          data: { order: prevLink.order },
        }),
        prisma.link.update({
          where: { id: prevLink.id },
          data: { order: link.order },
        }),
      ])
    } else if (direction === "down" && currentIndex < links.length - 1) {
      // Swap with the next link
      const nextLink = links[currentIndex + 1]

      await prisma.$transaction([
        prisma.link.update({
          where: { id: link.id },
          data: { order: nextLink.order },
        }),
        prisma.link.update({
          where: { id: nextLink.id },
          data: { order: link.order },
        }),
      ])
    }

    return NextResponse.json({ message: "Link reordered" })
  } catch (error) {
    console.error("Reorder link error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
