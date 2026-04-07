export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { getInitials, formatRelativeDate } from "@/lib/utils"

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const params = await searchParams
  const query = params.q || ""
  const statusFilter = params.status || ""

  const contacts = await prisma.contact.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { firstName: { contains: query } },
                { lastName: { contains: query } },
                { email: { contains: query } },
                { company: { contains: query } },
              ],
            }
          : {},
        statusFilter ? { status: statusFilter } : {},
      ],
    },
    include: {
      tags: { include: { tag: true } },
      interactions: { orderBy: { date: "desc" }, take: 1 },
      _count: { select: { interactions: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  const statusOptions = ["active", "inactive", "lead", "customer"]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          <p className="text-[var(--muted-foreground)]">{contacts.length} contacts</p>
        </div>
        <Button asChild>
          <Link href="/contacts/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <form className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            name="q"
            defaultValue={query}
            placeholder="Search contacts..."
            className="pl-9"
          />
        </form>
        <div className="flex gap-2">
          <Button variant={!statusFilter ? "default" : "outline"} size="sm" asChild>
            <Link href="/contacts">All</Link>
          </Button>
          {statusOptions.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/contacts?status=${s}`} className="capitalize">
                {s}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Contact List */}
      {contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-[var(--muted-foreground)] mb-4">
              {query ? `No contacts matching "${query}"` : "No contacts yet"}
            </p>
            {!query && (
              <Button asChild>
                <Link href="/contacts/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first contact
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border border-[var(--border)]">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] border-b border-[var(--border)] bg-[var(--muted)]">
            <div className="col-span-4">Name</div>
            <div className="col-span-3">Company</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Last Interaction</div>
            <div className="col-span-1">Actions</div>
          </div>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)] transition-colors"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium flex-shrink-0">
                  {getInitials(contact.firstName, contact.lastName)}
                </div>
                <div>
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {contact.firstName} {contact.lastName}
                  </Link>
                  <p className="text-xs text-[var(--muted-foreground)]">{contact.email}</p>
                </div>
              </div>
              <div className="col-span-3 text-sm text-[var(--muted-foreground)]">
                {contact.company || "—"}
              </div>
              <div className="col-span-2">
                <Badge
                  variant={
                    contact.status === "customer"
                      ? "success"
                      : contact.status === "lead"
                      ? "warning"
                      : contact.status === "inactive"
                      ? "outline"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {contact.status}
                </Badge>
              </div>
              <div className="col-span-2 text-xs text-[var(--muted-foreground)]">
                {contact.interactions[0]
                  ? formatRelativeDate(contact.interactions[0].date)
                  : "Never"}
              </div>
              <div className="col-span-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/contacts/${contact.id}`}>View</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
