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

    const categoryId = params.id

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

    // Delete the category (this will cascade delete all packages and images)
    await prisma.safariCategory.delete({
      where: {
        id: categoryId,
      },
    })

    return NextResponse.json({ message: "Category deleted" })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const categoryId = params.id
    const { name, description, imageUrl } = await request.json()

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

    // Update the category
    const updatedCategory = await prisma.safariCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        description,
        imageUrl,
      },
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Update category error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
