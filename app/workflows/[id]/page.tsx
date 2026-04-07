import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Plus, Clock, Mail, CheckSquare, Sparkles, GitBranch } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const workflow = await prisma.workflow.findUnique({
    where: { id },
    include: {
      steps: { orderBy: { order: "asc" } },
      enrollments: {
        include: { contact: true },
        orderBy: { startedAt: "desc" },
        take: 20,
      },
    },
  })

  if (!workflow) notFound()

  const stepTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    email: Mail,
    task: CheckSquare,
    wait: Clock,
    ai_suggestion: Sparkles,
  }

  const stepTypeColors: Record<string, string> = {
    email: "bg-blue-100 text-blue-700 border-blue-200",
    task: "bg-green-100 text-green-700 border-green-200",
    wait: "bg-yellow-100 text-yellow-700 border-yellow-200",
    ai_suggestion: "bg-purple-100 text-purple-700 border-purple-200",
    condition: "bg-orange-100 text-orange-700 border-orange-200",
  }

  return (
    <div className="p-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/workflows">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Workflows
        </Link>
      </Button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold tracking-tight">{workflow.name}</h2>
            <Badge
              variant={
                workflow.status === "active"
                  ? "success"
                  : workflow.status === "paused"
                  ? "warning"
                  : "secondary"
              }
              className="capitalize"
            >
              {workflow.status}
            </Badge>
          </div>
          {workflow.description && (
            <p className="text-[var(--muted-foreground)]">{workflow.description}</p>
          )}
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Trigger: {workflow.triggerType.replace(/_/g, " ")} · Updated {formatDate(workflow.updatedAt)}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/workflows/${workflow.id}/edit`}>Edit Workflow</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Steps */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Steps ({workflow.steps.length})</h3>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/workflows/${workflow.id}/steps/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Link>
            </Button>
          </div>

          {workflow.steps.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-10">
                <GitBranch className="h-8 w-8 text-[var(--muted-foreground)] mb-3" />
                <p className="text-sm text-[var(--muted-foreground)] mb-3">No steps yet</p>
                <Button size="sm" asChild>
                  <Link href={`/workflows/${workflow.id}/steps/new`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Step
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {workflow.steps.map((step, index) => {
                const Icon = stepTypeIcons[step.type] || CheckSquare
                const colorClass = stepTypeColors[step.type] || "bg-gray-100 text-gray-700 border-gray-200"
                return (
                  <div key={step.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      {index < workflow.steps.length - 1 && (
                        <div className="w-px flex-1 bg-[var(--border)] mt-1" />
                      )}
                    </div>
                    <Card className="flex-1 mb-3">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded border capitalize ${colorClass}`}>
                              <Icon className="h-3 w-3" />
                              {step.type.replace(/_/g, " ")}
                            </span>
                            <span className="font-medium text-sm">{step.title}</span>
                          </div>
                          {step.delayDays != null && step.delayDays > 0 && (
                            <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              +{step.delayDays}d
                            </span>
                          )}
                        </div>
                        {step.content && (
                          <p className="text-xs text-[var(--muted-foreground)] mt-2 line-clamp-2">
                            {step.content}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Enrollments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              Enrolled Contacts ({workflow.enrollments.length})
            </h3>
          </div>

          {workflow.enrollments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-10">
                <p className="text-sm text-[var(--muted-foreground)]">No contacts enrolled yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border border-[var(--border)] overflow-hidden">
              {workflow.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)] transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] text-xs font-medium flex-shrink-0">
                    {getInitials(enrollment.contact.firstName, enrollment.contact.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/contacts/${enrollment.contactId}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {enrollment.contact.firstName} {enrollment.contact.lastName}
                    </Link>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Step {enrollment.currentStep + 1} · Started {formatDate(enrollment.startedAt)}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize text-xs">
                    {enrollment.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
