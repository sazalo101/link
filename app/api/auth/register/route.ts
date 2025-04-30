import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import prisma from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { name, email, password, username } = await request.json()

    // Check if user already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUserByEmail) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Check if username is taken
    const existingUserByUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (existingUserByUsername) {
      return NextResponse.json({ message: "Username is already taken" }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        profile: {
          create: {
            title: `${name}'s Links`,
            description: `Welcome to ${name}'s link page`,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
