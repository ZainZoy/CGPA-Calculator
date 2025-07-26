import { type NextRequest, NextResponse } from "next/server"
import type { Projection } from "@/lib/types"

// In-memory storage (replace with database in production)
const projections: Projection[] = []

export async function GET() {
  return NextResponse.json(projections.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newProjection: Projection = {
      id: Date.now().toString(),
      userId: body.userId,
      semesterCredits: body.semesterCredits,
      expectedGPA: body.expectedGPA,
      projectedCGPA: body.projectedCGPA,
      createdAt: new Date(body.createdAt),
      saved: body.saved,
    }

    projections.push(newProjection)
    return NextResponse.json(newProjection, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
