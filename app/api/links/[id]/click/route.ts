import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
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

    // Increment the click count
    await prisma.link.update({
      where: {
        id: linkId,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ message: "Click recorded" })
  } catch (error) {
    console.error("Record click error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
