import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: { select: { contacts: true } },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Tags</h2>
        <p className="text-[var(--muted-foreground)]">Organize your contacts with tags</p>
      </div>

      {tags.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <p className="text-[var(--muted-foreground)]">
              No tags yet. Tags are created when you add them to contacts.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <Link key={tag.id} href={`/contacts?tag=${tag.id}`}>
              <Card className="hover:border-[var(--primary)] transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{tag._count.contacts} contacts</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
