import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      interactions: { orderBy: { date: "desc" } },
      workflowEnrollments: { include: { workflow: true } },
      aiSummary: true,
    },
  })

  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(contact)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { firstName, lastName, email, phone, company, role, notes, website, linkedinUrl, twitterUrl, status } = body

  const contact = await prisma.contact.update({
    where: { id },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      email: email || null,
      phone: phone || null,
      company: company || null,
      role: role || null,
      notes: notes || null,
      website: website || null,
      linkedinUrl: linkedinUrl || null,
      twitterUrl: twitterUrl || null,
      ...(status && { status }),
    },
  })

  return NextResponse.json(contact)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.contact.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
