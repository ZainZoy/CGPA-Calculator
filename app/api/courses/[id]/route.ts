import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (replace with database in production)
const courses = [
  {
    id: "1",
    userId: "1",
    name: "Data Structures & Algorithms",
    credits: 4,
    grade: "A",
    qualityPoints: 16.0,
    createdAt: new Date(),
  },
  {
    id: "2",
    userId: "1",
    name: "Database Management Systems",
    credits: 3,
    grade: "B+",
    qualityPoints: 9.9,
    createdAt: new Date(),
  },
  {
    id: "3",
    userId: "1",
    name: "Computer Networks",
    credits: 3,
    grade: "A-",
    qualityPoints: 11.1,
    createdAt: new Date(),
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const courseIndex = courses.findIndex((c) => c.id === id)

    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    courses[courseIndex] = { ...courses[courseIndex], ...body }
    return NextResponse.json(courses[courseIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const courseIndex = courses.findIndex((c) => c.id === id)

  if (courseIndex === -1) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  courses.splice(courseIndex, 1)
  return NextResponse.json({ message: "Course deleted successfully" })
}
