export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  Mail,
  Phone,
  Building,
  Briefcase,
  Globe,
  ExternalLink,
  MessageSquare,
  Plus,
  ArrowLeft,
  Sparkles,
} from "lucide-react"
import { getInitials, formatDate, formatRelativeDate } from "@/lib/utils"

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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

  if (!contact) notFound()

  const interactionTypeColors: Record<string, string> = {
    email: "bg-blue-100 text-blue-800",
    call: "bg-green-100 text-green-800",
    meeting: "bg-purple-100 text-purple-800",
    note: "bg-yellow-100 text-yellow-800",
    linkedin: "bg-indigo-100 text-indigo-800",
    other: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/contacts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Contact Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-2xl font-bold mb-4">
                  {getInitials(contact.firstName, contact.lastName)}
                </div>
                <h2 className="text-xl font-bold">
                  {contact.firstName} {contact.lastName}
                </h2>
                {contact.role && contact.company && (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {contact.role} at {contact.company}
                  </p>
                )}
                <Badge
                  variant={
                    contact.status === "customer"
                      ? "success"
                      : contact.status === "lead"
                      ? "warning"
                      : "secondary"
                  }
                  className="mt-2 capitalize"
                >
                  {contact.status}
                </Badge>
              </div>

              <div className="space-y-3">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm hover:text-[var(--primary)] transition-colors"
                  >
                    <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
                    {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-sm hover:text-[var(--primary)] transition-colors"
                  >
                    <Phone className="h-4 w-4 text-[var(--muted-foreground)]" />
                    {contact.phone}
                  </a>
                )}
                {contact.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-[var(--muted-foreground)]" />
                    {contact.company}
                  </div>
                )}
                {contact.role && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-[var(--muted-foreground)]" />
                    {contact.role}
                  </div>
                )}
                {contact.website && (
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-[var(--primary)] transition-colors"
                  >
                    <Globe className="h-4 w-4 text-[var(--muted-foreground)]" />
                    Website
                  </a>
                )}
                {contact.linkedinUrl && (
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-[var(--primary)] transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-[var(--muted-foreground)]" />
                    LinkedIn
                  </a>
                )}
                {contact.twitterUrl && (
                  <a
                    href={contact.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-[var(--primary)] transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-[var(--muted-foreground)]" />
                    Twitter
                  </a>
                )}
              </div>

              {contact.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map(({ tag }) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/contacts/${contact.id}/edit`}>Edit Contact</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/contacts/${contact.id}/interactions/new`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Interaction
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/ai?contactId=${contact.id}`}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Summary
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Workflows */}
          {contact.workflowEnrollments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active Workflows</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {contact.workflowEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between">
                    <Link
                      href={`/workflows/${enrollment.workflowId}`}
                      className="text-sm hover:underline"
                    >
                      {enrollment.workflow.name}
                    </Link>
                    <Badge variant="outline" className="text-xs capitalize">
                      {enrollment.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Interactions + Notes */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Summary */}
          {contact.aiSummary && (
            <Card className="border-[var(--primary)]" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 5%, transparent)" }}>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                  AI Summary
                  <span className="text-xs font-normal text-[var(--muted-foreground)]">
                    Generated {formatRelativeDate(contact.aiSummary.generatedAt)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{contact.aiSummary.summary}</p>
                {(() => {
                  try {
                    const suggestions = JSON.parse(contact.aiSummary!.suggestions) as string[]
                    return suggestions.length > 0 ? (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">
                          Suggested follow-ups:
                        </p>
                        <ul className="space-y-1">
                          {suggestions.map((s, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-[var(--primary)]">→</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null
                  } catch {
                    return null
                  }
                })()}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {contact.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Interactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm">Interaction History</CardTitle>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {contact.interactions.length} interactions logged
                </p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/contacts/${contact.id}/interactions/new`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {contact.interactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <MessageSquare className="h-8 w-8 text-[var(--muted-foreground)] mb-2" />
                  <p className="text-sm text-[var(--muted-foreground)]">No interactions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contact.interactions.map((interaction) => (
                    <div key={interaction.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-xs px-2 py-1 rounded-full capitalize ${
                            interactionTypeColors[interaction.type] || interactionTypeColors.other
                          }`}
                        >
                          {interaction.type}
                        </span>
                        <div className="w-px flex-1 bg-[var(--border)] mt-2" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">{interaction.title}</p>
                          <span className="text-xs text-[var(--muted-foreground)] ml-2 flex-shrink-0">
                            {formatDate(interaction.date)}
                          </span>
                        </div>
                        {interaction.content && (
                          <p className="text-sm text-[var(--muted-foreground)] mt-1 whitespace-pre-wrap">
                            {interaction.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
