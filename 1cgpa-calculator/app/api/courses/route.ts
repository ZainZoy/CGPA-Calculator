import { type NextRequest, NextResponse } from "next/server"
import type { Course } from "@/lib/types"

// In-memory storage (replace with database in production)
const courses: Course[] = [
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
  {
    id: "4",
    userId: "1",
    name: "Software Engineering",
    credits: 3,
    grade: "A",
    qualityPoints: 12.0,
    createdAt: new Date(),
  },
  {
    id: "5",
    userId: "1",
    name: "Operating Systems",
    credits: 4,
    grade: "B+",
    qualityPoints: 13.2,
    createdAt: new Date(),
  },
]

export async function GET() {
  return NextResponse.json(courses)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newCourse: Course = {
      id: Date.now().toString(),
      userId: body.userId,
      name: body.name,
      credits: body.credits,
      grade: body.grade,
      qualityPoints: body.qualityPoints,
      createdAt: new Date(),
    }

    courses.push(newCourse)
    return NextResponse.json(newCourse, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
