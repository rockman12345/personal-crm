import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { contactId } = body

  if (!contactId) {
    return NextResponse.json({ error: "contactId is required" }, { status: 400 })
  }

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: {
      interactions: { orderBy: { date: "desc" }, take: 20 },
      tags: { include: { tag: true } },
    },
  })

  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 })
  }

  // Check for Anthropic API key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured. Add it to your .env file." },
      { status: 503 }
    )
  }

  // Build context for the AI
  const interactionSummary = contact.interactions
    .map((i: { type: string; date: Date; title: string; content: string | null }) => `[${i.type.toUpperCase()} on ${i.date.toLocaleDateString()}] ${i.title}${i.content ? ": " + i.content : ""}`)
    .join("\n")

  const prompt = `You are a CRM assistant. Based on the following contact information and interaction history, provide:
1. A concise 2-3 sentence summary of this relationship
2. 3 specific follow-up suggestions

Contact: ${contact.firstName} ${contact.lastName}
${contact.company ? `Company: ${contact.company}` : ""}
${contact.role ? `Role: ${contact.role}` : ""}
${contact.tags.length > 0 ? `Tags: ${contact.tags.map((t: { tag: { name: string } }) => t.tag.name).join(", ")}` : ""}
${contact.notes ? `Notes: ${contact.notes}` : ""}

Interaction History:
${interactionSummary || "No interactions recorded yet."}

Respond in JSON format:
{
  "summary": "...",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || "AI API request failed")
    }

    const aiResponse = await response.json()
    const content = aiResponse.content[0].text

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Could not parse AI response")

    const parsed = JSON.parse(jsonMatch[0])

    // Save to database
    const aiSummary = await prisma.aiSummary.upsert({
      where: { contactId },
      update: {
        summary: parsed.summary,
        suggestions: JSON.stringify(parsed.suggestions || []),
        generatedAt: new Date(),
      },
      create: {
        contactId,
        summary: parsed.summary,
        suggestions: JSON.stringify(parsed.suggestions || []),
      },
    })

    return NextResponse.json(aiSummary)
  } catch (error) {
    console.error("AI summarize error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI request failed" },
      { status: 500 }
    )
  }
}
