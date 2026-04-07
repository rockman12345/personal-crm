import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { type, title, content, date } = body

  if (!type || !title) {
    return NextResponse.json({ error: "Type and title are required" }, { status: 400 })
  }

  const interaction = await prisma.interaction.create({
    data: {
      type,
      title,
      content: content || null,
      date: date ? new Date(date) : new Date(),
      contactId: id,
    },
  })

  return NextResponse.json(interaction, { status: 201 })
}
