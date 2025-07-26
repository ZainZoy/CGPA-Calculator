import { type NextRequest, NextResponse } from "next/server"
import type { User } from "@/lib/types"

// In-memory storage (replace with database in production)
const users: User[] = [
  {
    id: "1",
    name: "Student A",
    major: "Computer Science",
    existingQualityPoints: 0,
    existingCredits: 0,
    createdAt: new Date(),
  },
]

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check for duplicate user (case insensitive)
    const isDuplicate = users.some(
      (user) =>
        user.name.toLowerCase() === body.name.toLowerCase() && user.major.toLowerCase() === body.major.toLowerCase(),
    )

    if (isDuplicate) {
      return NextResponse.json({ error: "A user with this name and major already exists" }, { status: 400 })
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: body.name,
      major: body.major,
      existingQualityPoints: body.existingQualityPoints || 0,
      existingCredits: body.existingCredits || 0,
      createdAt: new Date(),
    }

    users.push(newUser)
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
