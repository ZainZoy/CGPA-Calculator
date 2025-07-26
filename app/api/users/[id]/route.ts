import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (replace with database in production)
const users = [
  {
    id: "1",
    name: "John Doe",
    major: "Computer Science",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Jane Smith",
    major: "Electrical Engineering",
    createdAt: new Date(),
  },
]

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const userIndex = users.findIndex((u) => u.id === id)

  if (userIndex === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  users.splice(userIndex, 1)
  return NextResponse.json({ message: "User deleted successfully" })
}
