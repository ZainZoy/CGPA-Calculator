import { type NextRequest, NextResponse } from "next/server"
import type { ActivityLog } from "@/lib/types"

// In-memory storage (replace with database in production)
const activities: ActivityLog[] = []

export async function GET() {
  return NextResponse.json(activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      userId: body.userId,
      type: body.type,
      description: body.description,
      oldValue: body.oldValue,
      newValue: body.newValue,
      timestamp: new Date(body.timestamp),
    }

    activities.push(newActivity)
    return NextResponse.json(newActivity, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
