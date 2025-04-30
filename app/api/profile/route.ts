import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, theme, profileImageUrl } = await request.json()

    // Update the profile
    const profile = await prisma.profile.update({
      where: {
        userId: session.user.id as string,
      },
      data: {
        title,
        description,
        theme,
        profileImageUrl,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
