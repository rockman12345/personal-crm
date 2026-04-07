export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, GitBranch, MessageSquare, TrendingUp } from "lucide-react"
import Link from "next/link"
import { formatRelativeDate, getInitials } from "@/lib/utils"

export default async function DashboardPage() {
  const [contactCount, workflowCount, interactionCount, recentContacts, recentInteractions] =
    await Promise.all([
      prisma.contact.count(),
      prisma.workflow.count({ where: { status: "active" } }),
      prisma.interaction.count(),
      prisma.contact.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { tags: { include: { tag: true } } },
      }),
      prisma.interaction.findMany({
        take: 5,
        orderBy: { date: "desc" },
        include: { contact: true },
      }),
    ])

  const stats = [
    { label: "Total Contacts", value: contactCount, icon: Users, href: "/contacts" },
    { label: "Active Workflows", value: workflowCount, icon: GitBranch, href: "/workflows" },
    { label: "Total Interactions", value: interactionCount, icon: MessageSquare, href: "/contacts" },
    { label: "This Month", value: "—", icon: TrendingUp, href: "/contacts" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-[var(--muted-foreground)]">Your relationship overview at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link href={stat.href} key={stat.label}>
              <Card className="hover:bg-[var(--accent)] transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <Icon className="h-4 w-4 text-[var(--muted-foreground)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
            <CardDescription>People you recently added or updated</CardDescription>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)] text-center py-4">
                No contacts yet.{" "}
                <Link href="/contacts/new" className="text-[var(--primary)] hover:underline">
                  Add your first contact
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <Link
                    key={contact.id}
                    href={`/contacts/${contact.id}`}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-[var(--accent)] transition-colors"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium flex-shrink-0">
                      {getInitials(contact.firstName, contact.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] truncate">
                        {contact.company || contact.email || "No details"}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {contact.tags.slice(0, 2).map(({ tag }) => (
                        <Badge key={tag.id} variant="secondary" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Interactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Interactions</CardTitle>
            <CardDescription>Latest logged touchpoints</CardDescription>
          </CardHeader>
          <CardContent>
            {recentInteractions.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)] text-center py-4">
                No interactions logged yet.
              </p>
            ) : (
              <div className="space-y-4">
                {recentInteractions.map((interaction) => (
                  <Link
                    key={interaction.id}
                    href={`/contacts/${interaction.contactId}`}
                    className="flex items-start gap-3 rounded-md p-2 hover:bg-[var(--accent)] transition-colors"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] text-sm font-medium flex-shrink-0">
                      {getInitials(interaction.contact.firstName, interaction.contact.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{interaction.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {interaction.contact.firstName} {interaction.contact.lastName} ·{" "}
                        {formatRelativeDate(interaction.date)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {interaction.type}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
