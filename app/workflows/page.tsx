export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, GitBranch, Users, Zap } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function WorkflowsPage() {
  const workflows = await prisma.workflow.findMany({
    include: {
      steps: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  const triggerTypeLabels: Record<string, string> = {
    manual: "Manual",
    tag_added: "Tag Added",
    status_changed: "Status Changed",
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workflows</h2>
          <p className="text-[var(--muted-foreground)]">
            Automate your outreach and follow-up sequences
          </p>
        </div>
        <Button asChild>
          <Link href="/workflows/new">
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Link>
        </Button>
      </div>

      {workflows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <GitBranch className="h-12 w-12 text-[var(--muted-foreground)] mb-4" />
            <p className="text-lg font-medium mb-2">No workflows yet</p>
            <p className="text-[var(--muted-foreground)] mb-6 text-center max-w-sm">
              Create workflows to automate follow-ups, onboarding sequences, and outreach pipelines.
            </p>
            <Button asChild>
              <Link href="/workflows/new">
                <Plus className="h-4 w-4 mr-2" />
                Create your first workflow
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
              <Card className="hover:border-[var(--primary)] transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                    <Badge
                      variant={
                        workflow.status === "active"
                          ? "success"
                          : workflow.status === "paused"
                          ? "warning"
                          : "secondary"
                      }
                      className="capitalize ml-2 flex-shrink-0"
                    >
                      {workflow.status}
                    </Badge>
                  </div>
                  {workflow.description && (
                    <CardDescription>{workflow.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
                    <div className="flex items-center gap-1">
                      <GitBranch className="h-3.5 w-3.5" />
                      {workflow.steps.length} steps
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {workflow._count.enrollments} enrolled
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5" />
                      {triggerTypeLabels[workflow.triggerType] || workflow.triggerType}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-3">
                    Updated {formatDate(workflow.updatedAt)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
