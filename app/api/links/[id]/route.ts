import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const linkId = params.id

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

    // Delete the link
    await prisma.link.delete({
      where: {
        id: linkId,
      },
    })

    return NextResponse.json({ message: "Link deleted" })
  } catch (error) {
    console.error("Delete link error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
