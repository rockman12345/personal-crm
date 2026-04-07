import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q") || ""

  const contacts = await prisma.contact.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { email: { contains: q } },
            { company: { contains: q } },
          ],
        }
      : undefined,
    include: {
      tags: { include: { tag: true } },
      _count: { select: { interactions: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(contacts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { firstName, lastName, email, phone, company, role, notes, website, linkedinUrl, twitterUrl, status } = body

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First name and last name are required" }, { status: 400 })
  }

  const contact = await prisma.contact.create({
    data: {
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      company: company || null,
      role: role || null,
      notes: notes || null,
      website: website || null,
      linkedinUrl: linkedinUrl || null,
      twitterUrl: twitterUrl || null,
      status: status || "active",
    },
  })

  return NextResponse.json(contact, { status: 201 })
}
