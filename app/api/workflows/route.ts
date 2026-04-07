import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const workflows = await prisma.workflow.findMany({
    include: {
      steps: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { updatedAt: "desc" },
  })
  return NextResponse.json(workflows)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, description, triggerType } = body

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  const workflow = await prisma.workflow.create({
    data: {
      name,
      description: description || null,
      triggerType: triggerType || "manual",
    },
  })

  return NextResponse.json(workflow, { status: 201 })
}
